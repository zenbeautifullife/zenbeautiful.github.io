const suggestions={
  overwhelmed:{title:'Take three slow breaths.',text:'Let the first breath arrive without changing it. Breathe in gently, then breathe out a little more slowly. Repeat twice, letting your shoulders soften if they want to.'},
  disconnected:{title:'Step outside and notice five things.',text:'Feel the air on your skin. Find five things you can see, four sounds around you, or one small detail you’ve never noticed before.'},
  tired:{title:'Give yourself permission to pause.',text:'For two minutes, let your body be supported by the chair or floor. You don’t have to earn this rest or make it productive.'},
  restless:{title:'Try a five-minute creative activity.',text:'Choose a nearby object and draw its outline without lifting your pen. Keep going for five minutes. There’s no need for it to look like anything in particular.'},
  lonely:{title:'Send someone a small hello.',text:'Think of someone who feels safe to reach out to. Send a simple message—a photo, a memory, or just “I was thinking of you.”'}
};
const storageKey='little-moments-daily-calm-v1';
const todayKey=new Intl.DateTimeFormat('en-CA').format(new Date());
const buttons=[...document.querySelectorAll('.mood-option')];
const suggestionPanel=document.querySelector('#suggestion');
const dailyLimit=document.querySelector('#daily-limit');
function showSuggestion(mood,scroll=false){
  const activity=suggestions[mood];
  document.querySelector('#suggestion-title').textContent=activity.title;
  document.querySelector('#suggestion-text').textContent=activity.text;
  suggestionPanel.hidden=false;
  dailyLimit.hidden=false;
  buttons.forEach(button=>{button.disabled=true;button.classList.toggle('selected',button.dataset.mood===mood);button.setAttribute('aria-pressed',String(button.dataset.mood===mood))});
  if(scroll)suggestionPanel.scrollIntoView({behavior:'smooth',block:'center'});
}
let used;
try{used=JSON.parse(localStorage.getItem(storageKey)||'null')}catch{used=null}
if(used&&used.date===todayKey&&suggestions[used.mood])showSuggestion(used.mood);
buttons.forEach(button=>button.addEventListener('click',()=>{
  if(button.disabled)return;
  const mood=button.dataset.mood;
  try{localStorage.setItem(storageKey,JSON.stringify({date:todayKey,mood}))}catch{/* The suggestion still works when storage is unavailable. */}
  showSuggestion(mood,true);
}));

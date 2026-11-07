const suggestions={
  overwhelmed:{title:'Take three slow breaths.',text:'Let the first breath arrive without changing it. Breathe in gently, then breathe out a little more slowly. Repeat twice, letting your shoulders soften if they want to.',art:'../pages/arts/gallery/flower/Whispers%20in%20the%20Rain-s.jpg',alt:'Soft pink flowers in a watercolor garden'},
  disconnected:{title:'Step outside and notice five things.',text:'Feel the air on your skin. Find five things you can see, four sounds around you, or one small detail you’ve never noticed before.',art:'../pages/arts/gallery/bird/white-heron-s.jpg',alt:'A white heron in a soft watercolor landscape'},
  tired:{title:'Give yourself permission to pause.',text:'For two minutes, let your body be supported by the chair or floor. You don’t have to earn this rest or make it productive.',art:'../pages/arts/gallery/flower/Water-lily-s.jpg',alt:'A watercolor water lily resting on a pond'},
  restless:{title:'Try a five-minute creative activity.',text:'Choose a nearby object and draw its outline without lifting your pen. Keep going for five minutes. There’s no need for it to look like anything in particular.',art:'../pages/arts/gallery/flower/Rose-s.jpg',alt:'A rose painted in watercolor'},
  lonely:{title:'Send someone a small hello.',text:'Think of someone who feels safe to reach out to. Send a simple message—a photo, a memory, or just “I was thinking of you.”',art:'../pages/arts/gallery/fish/Dance-of-Two-Goldfish-s.jpg',alt:'Two goldfish painted in watercolor'}
};
const storageKey='little-moments-daily-calm-v1';
const todayKey=new Intl.DateTimeFormat('en-CA').format(new Date());
const buttons=[...document.querySelectorAll('.mood-option')];
const suggestionPanel=document.querySelector('#suggestion');
const dailyLimit=document.querySelector('#daily-limit');
function showSuggestion(mood,scroll=false){
  const activity=suggestions[mood];
  document.querySelector('#card-art').src=activity.art;
  document.querySelector('#card-art').alt=activity.alt;
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
document.querySelector('#card-email-form').addEventListener('submit',event=>{
  event.preventDefault();
  const address=document.querySelector('#card-email-address').value.trim();
  const mood=document.querySelector('.mood-option.selected')?.dataset.mood;
  if(!address||!mood)return;
  const activity=suggestions[mood];
  const subject=encodeURIComponent('A little calm for today');
  const body=encodeURIComponent(`${activity.title}\n\n${activity.text}\n\nWatercolor painting: ${new URL(activity.art,location.href).href}\n\nA little moment · Daily Calm\n${location.href}`);
  const status=document.querySelector('#email-status');
  status.textContent='Your email app should open with the card details ready to send.';
  status.hidden=false;
  location.href=`mailto:${encodeURIComponent(address)}?subject=${subject}&body=${body}`;
});

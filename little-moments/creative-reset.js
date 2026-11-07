const promptSets={
  drawing:[
    'Draw a tiny house for a very small creature. Add one window, one door, and anything else it might need.',
    'Make a portrait of the mug, glass or bottle nearest to you. Let one line run all the way around it.',
    'Draw a garden using only circles and wavy lines. Let the plants grow any way they like.',
    'Choose three objects nearby and draw them as one curious little creature.',
    'Fill a page with ten different leaves. Invent the last three.',
    'Draw the view from where you are sitting, using only five shapes.',
    'Sketch your favourite everyday object as if it were the star of a portrait.',
    'Draw a doorway to somewhere you would like to wander. What’s just beyond it?',
    'Make a pattern from the shapes of three things you can see.',
    'Draw one continuous line for five minutes. See what it becomes.'
  ],
  watercolor:[
    'Paint a row of five colour swatches. Add a little more water to each one and watch the colour soften.',
    'Make three watery circles in one colour. Drop a second colour into each while they’re still damp.',
    'Paint a loose leaf using one brushstroke. Try a few different greens—or make up your own.',
    'Wet a small patch of paper and let two colours wander into each other.',
    'Paint a tiny sky with one colour, then add a soft cloud while the paper is still a little wet.',
    'Try the same colour with lots of water, a little water and almost no water. Notice what changes.',
    'Paint five little flowers using only dots and quick brush marks.',
    'Make a row of simple lines, then turn each one into a stem, a wave or a path.',
    'Choose one colour and paint a small abstract shape without planning its edges.',
    'Paint a tiny flower using just three brush marks. Let it be wonderfully simple.'
  ],
  noticing:[
    'Choose one colour in the room. Find five things that share it, and notice how each one is different.',
    'Look closely at a leaf, petal or piece of fruit. Draw only the lines and textures you can see.',
    'Spend one minute watching a shadow move. Sketch its shape as it changes.',
    'Listen for a nearby sound. If it had a colour or shape, what might it look like?',
    'Notice the light on one ordinary object. Make a small colour note of the brightest and softest parts.',
    'Find three interesting textures around you. Make a little mark or pattern for each one.',
    'Watch the clouds, trees or light outside for a moment. Draw the movement you notice.',
    'Pick up a small object and turn it slowly. Find one detail you had never noticed before.',
    'Notice the colours in a favourite everyday view. Mix or mark just three of them.',
    'Take a quiet minute to look at something growing. What small change might happen next?'
  ]
};
const categoryNames={drawing:'Simple drawing',watercolor:'Beginner watercolor',noticing:'Mindful noticing'};
let currentCategory='drawing';
let currentIndex=0;
const tabButtons=[...document.querySelectorAll('.prompt-tab')];
const promptPanel=document.querySelector('#prompt-panel');
function renderPrompt(index){currentIndex=index;document.querySelector('#prompt-number').textContent=String(index+1).padStart(2,'0');document.querySelector('#prompt-text').textContent=promptSets[currentCategory][index];document.querySelector('#prompt-panel').setAttribute('aria-labelledby',`tab-${currentCategory}`);const list=document.querySelector('#prompt-list-items');list.replaceChildren();promptSets[currentCategory].forEach(prompt=>{const item=document.createElement('li');item.textContent=prompt;list.append(item)});document.querySelector('.prompt-list summary').textContent=`See all 10 ${categoryNames[currentCategory].toLowerCase()} prompts`}
tabButtons.forEach((button,index)=>button.addEventListener('click',()=>{currentCategory=button.dataset.category;tabButtons.forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});renderPrompt(0)}));
document.querySelector('#another-prompt').addEventListener('click',()=>{let next;do{next=Math.floor(Math.random()*promptSets[currentCategory].length)}while(next===currentIndex);renderPrompt(next)});
const timerButton=document.querySelector('#timer-toggle');let seconds=300;let interval=null;
function showTime(){const mins=String(Math.floor(seconds/60)).padStart(2,'0');const secs=String(seconds%60).padStart(2,'0');timerButton.querySelector('span').textContent=`${mins}:${secs}`}
timerButton.addEventListener('click',()=>{if(interval){clearInterval(interval);interval=null;timerButton.firstChild.textContent='Resume timer ';timerButton.setAttribute('aria-label','Resume five minute timer');return}if(seconds<=0)seconds=300;timerButton.firstChild.textContent='Pause timer ';timerButton.setAttribute('aria-label','Pause five minute timer');interval=setInterval(()=>{seconds--;showTime();if(seconds<=0){clearInterval(interval);interval=null;timerButton.firstChild.textContent='Start again ';timerButton.setAttribute('aria-label','Start five minute timer');timerButton.querySelector('span').textContent='00:00'}},1000)});
renderPrompt(0);

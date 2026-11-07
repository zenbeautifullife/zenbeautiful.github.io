const journalStorageKey='little-moments-gratitude-30-v1';
let currentDay=1;
let journalData={};
try{journalData=JSON.parse(localStorage.getItem(journalStorageKey)||'{}')||{}}catch{journalData={}}
const inputs={smile:document.querySelector('#answer-smile'),appreciate:document.querySelector('#answer-appreciate'),release:document.querySelector('#answer-release')};
const dayPicker=document.querySelector('#day-picker');
const progressTrack=document.querySelector('.progress-track');
const status=document.querySelector('#save-status');
let saveTimer;
function savedDays(){return Object.keys(journalData).map(Number).filter(day=>journalData[day]&&Object.values(journalData[day]).some(value=>String(value||'').trim())).length}
function updateProgress(){const count=savedDays();document.querySelector('#progress-count').textContent=count;document.querySelector('#progress-fill').style.width=`${count/30*100}%`;progressTrack.setAttribute('aria-valuenow',String(count));dayPicker.querySelectorAll('button').forEach(button=>button.classList.toggle('has-entry',Boolean(journalData[button.dataset.day]&&Object.values(journalData[button.dataset.day]).some(value=>String(value||'').trim()))))}
function renderDay(){document.querySelector('#day-heading').textContent=`Day ${String(currentDay).padStart(2,'0')}`;document.querySelectorAll('.day-number').forEach(button=>{const active=Number(button.dataset.day)===currentDay;button.classList.toggle('active',active);button.setAttribute('aria-current',active?'step':'false')});const entry=journalData[currentDay]||{};inputs.smile.value=entry.smile||'';inputs.appreciate.value=entry.appreciate||'';inputs.release.value=entry.release||'';document.querySelector('#previous-day').disabled=currentDay===1;document.querySelector('#next-day').disabled=currentDay===30;status.textContent='Your words save privately on this device.';updateProgress()}
for(let day=1;day<=30;day++){const button=document.createElement('button');button.type='button';button.className='day-number';button.dataset.day=String(day);button.textContent=String(day).padStart(2,'0');button.setAttribute('aria-label',`Open journal day ${day}`);button.addEventListener('click',()=>{currentDay=day;renderDay()});dayPicker.append(button)}
function saveCurrentDay(){journalData[currentDay]={smile:inputs.smile.value,appreciate:inputs.appreciate.value,release:inputs.release.value};try{localStorage.setItem(journalStorageKey,JSON.stringify(journalData));status.textContent='Saved on this device.'}catch{status.textContent='This browser could not save your entry. You can keep writing while this page stays open.'}updateProgress()}
Object.values(inputs).forEach(input=>input.addEventListener('input',()=>{status.textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(saveCurrentDay,250)}));
document.querySelector('#previous-day').addEventListener('click',()=>{if(currentDay>1){clearTimeout(saveTimer);saveCurrentDay();currentDay--;renderDay()}});
document.querySelector('#next-day').addEventListener('click',()=>{if(currentDay<30){clearTimeout(saveTimer);saveCurrentDay();currentDay++;renderDay()}});
document.querySelector('#journal-entry').addEventListener('submit',event=>event.preventDefault());
renderDay();

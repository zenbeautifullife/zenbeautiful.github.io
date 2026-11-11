let currentLittleGift=null;
let lastLittleGiftId=null;
let littleGiftIsOpen=false;
let giftOpening=false;
let automaticGiftPending=false;
let automaticGiftTimer=null;

function setGiftOpenButton(label,disabled){
  const button=document.querySelector('#open-gift');
  button.disabled=disabled;
  button.firstChild.textContent=`${label} `;
}

function chooseLittleGift(){
  const choices=window.littleGiftCollection.filter(gift=>gift.id!==lastLittleGiftId);
  const pool=choices.length?choices:window.littleGiftCollection;
  const selected=pool[Math.floor(Math.random()*pool.length)];
  currentLittleGift={...selected,image:pickLittleMomentImage(currentLittleGift?.image)};
  lastLittleGiftId=currentLittleGift.id;
}

function renderGiftOpening(){
  const opening=document.querySelector('#gift-opening');
  const card=document.querySelector('#gift-card');
  if(littleGiftIsOpen&&currentLittleGift){opening.hidden=true;renderLittleGiftCard();return}
  opening.hidden=false;card.hidden=true;
  if(automaticGiftPending)setGiftOpenButton('Opening next gift',true);
  else if(giftOpening)setGiftOpenButton('Opening your gift',true);
  else setGiftOpenButton('Open My Gift',false);
}

function openLittleGift(){
  if(giftOpening||littleGiftIsOpen)return;
  if(automaticGiftTimer){window.clearTimeout(automaticGiftTimer);automaticGiftTimer=null}
  automaticGiftPending=false;
  giftOpening=true;
  setGiftOpenButton('Opening your gift',true);
  // Every opening gets a fresh gift and an image different from the last one.
  chooseLittleGift();
  const scene=document.querySelector('#gift-scene');
  scene.classList.remove('is-opening');
  requestAnimationFrame(()=>scene.classList.add('is-opening'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(()=>{
    giftOpening=false;
    littleGiftIsOpen=true;
    document.querySelector('#gift-opening').hidden=true;
    renderLittleGiftCard();
  },reduced?0:1120);
}

function renderLittleGiftCard(){
  if(!currentLittleGift)return;
  const gift=currentLittleGift;
  const saved=(state.giftSaved||[]).includes(gift.id);
  const card=document.querySelector('#gift-card');
  card.innerHTML=`<div class="gift-card-image"><img src="${esc(gift.image)}" alt="A gentle watercolor illustration" onerror="this.hidden=true;this.parentElement.classList.add('image-unavailable')"><span aria-hidden="true">✿</span></div><div class="gift-card-copy"><span class="gift-card-index">A LITTLE GIFT · ${String(gift.id).slice(-3)}</span><p class="eyebrow">${esc(gift.category)}</p><h2>${esc(gift.title)}</h2><span class="gift-card-rule" aria-hidden="true"></span><p class="gift-message">${esc(gift.message)}</p>${gift.activity?`<div class="gift-activity"><span>A moment to keep</span><p>${esc(gift.activity)}</p></div>`:''}<p class="gift-signoff">Take this little moment with you.</p><div class="gift-actions"><button class="button button-dark" id="open-another-gift">Open Another Gift <span>↻</span></button><button class="text-button" id="save-little-gift">${saved?'♥ Saved':'♡ Save This Moment'}</button><button class="text-button" id="share-little-gift">Share This Gift <span>↗</span></button></div></div>`;
  card.hidden=false;
  card.classList.remove('gift-card-reveal');
  requestAnimationFrame(()=>card.classList.add('gift-card-reveal'));
  document.querySelector('#open-another-gift').onclick=()=>{
    littleGiftIsOpen=false;
    card.hidden=true;document.querySelector('#gift-opening').hidden=false;
    const scene=document.querySelector('#gift-scene');scene.classList.remove('is-opening');
    automaticGiftPending=true;
    setGiftOpenButton('Opening next gift',true);
    const pause=matchMedia('(prefers-reduced-motion: reduce)').matches?0:1180;
    automaticGiftTimer=window.setTimeout(()=>{automaticGiftTimer=null;openLittleGift()},pause);
  };
  document.querySelector('#save-little-gift').onclick=()=>{
    state.giftSaved??=[];
    const index=state.giftSaved.indexOf(gift.id);
    if(index>=0){state.giftSaved.splice(index,1);showToast('Removed from My Little Gifts.')}else{state.giftSaved.push(gift.id);showToast('Saved to My Little Gifts.')}
    persist();updateSavedCount();renderLittleGiftCard();
    if(document.querySelector('#saved').classList.contains('active'))renderSaved();
  };
  document.querySelector('#share-little-gift').onclick=()=>shareLittleGift(gift);
}

async function shareLittleGift(gift){
  const text=`${gift.category}\n${gift.title}\n\n${gift.message}${gift.activity?`\n\nA tiny moment: ${gift.activity}`:''}\n\nTake this little moment with you. — Little Moments by Zen Beautiful`;
  try{
    if(navigator.share){await navigator.share({title:`A Little Gift: ${gift.title}`,text});return}
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);showToast('Your little gift was copied to the clipboard.');return}
    const field=document.createElement('textarea');field.value=text;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();const copied=document.execCommand('copy');field.remove();showToast(copied?'Your little gift was copied to the clipboard.':'Sharing is not available in this browser.');
  }catch(error){if(error.name!=='AbortError')showToast('Could not share this gift right now.')}
}

function renderGiftSavedGroup(){
  const gifts=(state.giftSaved||[]).map(id=>window.littleGiftCollection.find(gift=>gift.id===id)).filter(Boolean);
  return `<section class="saved-group"><h2>My Little Gifts</h2>${gifts.length?`<div class="gift-saved-grid">${gifts.map(gift=>`<article class="gift-saved-card"><img src="${esc(pickLittleMomentImage())}" alt="" loading="lazy" onerror="this.hidden=true"><div><span class="result-meta">${esc(gift.category)}</span><h3>${esc(gift.title)}</h3><p>${esc(gift.message)}</p>${gift.activity?`<p class="reflection">${esc(gift.activity)}</p>`:''}<button data-unsave="gift:${gift.id}">Remove from saved</button></div></article>`).join('')}</div>`:'<p class="empty-state">Your little gifts will be kept here when you save one.</p>'}</section>`;
}

document.querySelector('#open-gift').addEventListener('click',openLittleGift);

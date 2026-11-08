let currentLittleGift=null;
let lastLittleGiftId=null;
let littleGiftIsOpen=false;

function chooseLittleGift(){
  const choices=window.littleGiftCollection.filter(gift=>gift.id!==lastLittleGiftId);
  const pool=choices.length?choices:window.littleGiftCollection;
  currentLittleGift=pool[Math.floor(Math.random()*pool.length)];
  lastLittleGiftId=currentLittleGift.id;
}

function renderGiftOpening(){
  const opening=document.querySelector('#gift-opening');
  const card=document.querySelector('#gift-card');
  if(littleGiftIsOpen&&currentLittleGift){opening.hidden=true;renderLittleGiftCard();return}
  opening.hidden=false;card.hidden=true;
}

function openLittleGift(){
  if(!currentLittleGift)chooseLittleGift();
  const scene=document.querySelector('#gift-scene');
  scene.classList.remove('is-opening');
  requestAnimationFrame(()=>scene.classList.add('is-opening'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(()=>{
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
  card.innerHTML=`<div class="gift-card-image"><img src="${esc(gift.image)}" alt="A gentle watercolor illustration" onerror="this.hidden=true;this.parentElement.classList.add('image-unavailable')"><span aria-hidden="true">✿</span></div><div class="gift-card-copy"><p class="eyebrow">${esc(gift.category)}</p><h2>${esc(gift.title)}</h2><p class="gift-message">“${esc(gift.message)}”</p>${gift.activity?`<div class="gift-activity"><span> A tiny moment</span><p>${esc(gift.activity)}</p></div>`:''}<p class="gift-signoff">Take this little moment with you.</p><div class="gift-actions"><button class="button button-dark" id="open-another-gift">Open Another Gift <span>↻</span></button><button class="text-button" id="save-little-gift">${saved?'♥ Saved':'♡ Save This Moment'}</button><button class="text-button" id="share-little-gift">Share This Gift <span>↗</span></button></div></div>`;
  card.hidden=false;
  card.classList.remove('gift-card-reveal');
  requestAnimationFrame(()=>card.classList.add('gift-card-reveal'));
  document.querySelector('#open-another-gift').onclick=()=>{
    chooseLittleGift();littleGiftIsOpen=false;
    card.hidden=true;document.querySelector('#gift-opening').hidden=false;
    const scene=document.querySelector('#gift-scene');scene.classList.remove('is-opening');
    const pause=matchMedia('(prefers-reduced-motion: reduce)').matches?0:1180;
    window.setTimeout(openLittleGift,pause);
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
  return `<section class="saved-group"><h2>My Little Gifts</h2>${gifts.length?`<div class="gift-saved-grid">${gifts.map(gift=>`<article class="gift-saved-card"><img src="${esc(gift.image)}" alt="" loading="lazy" onerror="this.hidden=true"><div><span class="result-meta">${esc(gift.category)}</span><h3>${esc(gift.title)}</h3><p>${esc(gift.message)}</p>${gift.activity?`<p class="reflection">${esc(gift.activity)}</p>`:''}<button data-unsave="gift:${gift.id}">Remove from saved</button></div></article>`).join('')}</div>`:'<p class="empty-state">Your little gifts will be kept here when you save one.</p>'}</section>`;
}

document.querySelector('#open-gift').addEventListener('click',openLittleGift);

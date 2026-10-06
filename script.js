const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(toggle){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)})}

const revealSection=document.querySelector('.intro');
const revealTitle=document.querySelector('.reveal-title');

if(revealSection&&revealTitle){
  const walker=document.createTreeWalker(revealTitle,NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode())textNodes.push(walker.currentNode);
  const revealChars=[];
  textNodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    [...node.textContent].forEach(character=>{
      const span=document.createElement('span');
      span.className=character.trim()?'reveal-char':'reveal-space';
      span.textContent=character;
      fragment.appendChild(span);
      if(character.trim())revealChars.push(span);
    });
    node.parentNode.replaceChild(fragment,node);
  });

  const updateReveal=()=>{
    const distance=revealSection.offsetHeight-window.innerHeight;
    const progress=Math.max(0,Math.min(1,-revealSection.getBoundingClientRect().top/Math.max(1,distance)));
    const visibleCount=progress*revealChars.length;
    revealChars.forEach((character,index)=>{
      const amount=Math.max(0,Math.min(1,visibleCount-index));
      character.style.opacity=(.16+amount*.84).toFixed(3);
    });
  };

  window.addEventListener('scroll',updateReveal,{passive:true});
  window.addEventListener('resize',updateReveal);
  updateReveal();
}

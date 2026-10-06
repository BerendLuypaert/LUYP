const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(toggle){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)})}

const loader=document.querySelector('.site-loader');
const loaderVideo=document.querySelector('.site-loader-video');
const body=document.body;
let loaderFinished=false;
const loaderSeen=sessionStorage.getItem('luyp-loader-seen')==='1';

function revealSite(){
  if(loaderFinished)return;
  loaderFinished=true;
  sessionStorage.setItem('luyp-loader-seen','1');
  body.classList.remove('loading');
  body.classList.add('is-ready');
  if(loader)loader.classList.add('is-exiting');
}

if(loaderSeen){
  revealSite();
}else if(loaderVideo){
  loaderVideo.addEventListener('ended',revealSite,{once:true});
  loaderVideo.addEventListener('error',revealSite,{once:true});
  loaderVideo.play().catch(revealSite);
  window.addEventListener('load',()=>{
    if(loaderVideo.readyState<2)setTimeout(revealSite,1200);
  },{once:true});
}else{
  revealSite();
}

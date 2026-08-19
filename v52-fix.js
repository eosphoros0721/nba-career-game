'use strict';
// V5.2.1 compatibility patch: no DecompressionStream/eval required.
window.__SK_SKIP_LIVE=false;
function bindV521Controls(){
  const skip=document.getElementById('skipLiveBtn');
  if(skip)skip.onclick=()=>{window.__SK_SKIP_LIVE=true;skip.textContent='正在跳过…'};
  document.querySelectorAll('.speed-btn').forEach(btn=>{btn.onclick=()=>{liveSpeed=+btn.dataset.speed||1;document.querySelectorAll('.speed-btn').forEach(x=>x.classList.toggle('active',x===btn))}});
}

playLiveMatch=async function(a,b,res){
  window.__SK_SKIP_LIVE=false;
  const skipBtn=document.getElementById('skipLiveBtn');if(skipBtn)skipBtn.textContent='跳过动画';
  $('storyCard').classList.add('hidden');$('resultCard').classList.add('hidden');$('liveCard').classList.remove('hidden');
  $('liveMatchTitle').textContent=`${a.name} vs ${b.name}`;$('scoreA').textContent=0;$('scoreB').textContent=0;$('liveLog').innerHTML='';
  $('dotA').querySelector('span').textContent=(a.name.split(' ').at(-1)||a.name).slice(0,3);$('dotB').querySelector('span').textContent=(b.name.split(' ').at(-1)||b.name).slice(0,3);
  setDot($('dotA'),38,78);setDot($('dotB'),55,48);
  for(const p of res.plays){
    if(window.__SK_SKIP_LIVE)break;
    const delay=liveSpeed===3?240:720;
    if(p.kind==='play'){
      const pos=courtPosFor(p.action,p.off),oe=p.off===0?$('dotA'):$('dotB'),de=p.off===0?$('dotB'):$('dotA');
      setDot(oe,pos.ox,pos.oy);setDot(de,pos.dx,pos.dy);$('ball').style.left=`${pos.ox}%`;$('ball').style.top=`${pos.oy}%`;
      await sleep(delay*.38);if(window.__SK_SKIP_LIVE)break;
      if(['three','mid','drive','post'].includes(p.action)){$('ball').style.left='50%';$('ball').style.top='10%'}
      await sleep(delay*.28);
    }else await sleep(delay*.34);
    if(window.__SK_SKIP_LIVE)break;
    if(p.score){$('scoreA').textContent=p.score[0];$('scoreB').textContent=p.score[1]}
    const line=document.createElement('div');line.className='live-line '+(p.kind==='danger'?'danger':p.kind==='event'?'event':p.made?'score':'');line.textContent=p.text;$('liveLog').appendChild(line);$('liveLog').scrollTop=$('liveLog').scrollHeight;
    await sleep(delay*.42);
  }
  if(window.__SK_SKIP_LIVE){$('scoreA').textContent=res.score[0];$('scoreB').textContent=res.score[1];await sleep(80)}else await sleep(liveSpeed===3?160:520);
  $('liveCard').classList.add('hidden');window.__SK_SKIP_LIVE=false;if(skipBtn)skipBtn.textContent='跳过动画';
};

document.addEventListener('DOMContentLoaded',()=>{bindV521Controls();document.documentElement.dataset.skReady='1'});

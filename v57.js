'use strict';
/* Street King V5.7: manual Jordan Spirit + staged strategy reveal. */
const V57_BUILD='V5.7-20260819-1135';

function v57Ensure(){
  if(!career)return;
  if(typeof v56Ensure==='function')v56Ensure();
  career.jordanSpirit=career.jordanSpirit||{unlocked:career.insight>=200,used:false,armed:false};
  if(career.insight>=200)career.jordanSpirit.unlocked=true;
  if(career.insight<200)career.jordanSpirit.armed=false;
}

v53RenderStrategy=function(opp){
  const box=$('strategyBox');
  if(!box||!career||!player||!opp)return;
  v57Ensure();
  if(career.insight<100){box.classList.add('hidden');box.innerHTML='';return}
  box.classList.remove('hidden');
  const key=`${career.edition}|${career.focus?.roundIndex}|${opp.id}`;
  if(career.strategyMatchKey!==key){
    career.strategyMatchKey=key;
    career.selectedStrategy='balanced';
    career.jordanSpirit.armed=false;
  }
  const rows=v54StrategyTable(player,opp),map=new Map(rows.map(x=>[x.s.id,x]));
  const revealed=career.insight>=200;
  box.innerHTML=`<div class="v53-strategy-title"><b>悟道 ${Math.round(career.insight)}/200% · 本场打法</b><small>${revealed?'极境已成：策略评级与胜率倾向已经完全看清。':'悟道已成：你能选择具体打法，但真正的适配等级仍未看透。'}</small></div><div class="v53-strategy-grid">${V53_STRATEGIES.map(s=>{const x=map.get(s.id);if(!revealed)return`<button class="v53-strategy ${career.selectedStrategy===s.id?'active':''}" data-strategy="${s.id}"><b>? · ${s.name}</b><span>评级 ? · 胜率影响 ?</span><small>${s.desc}</small></button>`;const grade=['','S','A','B','C','D'][x.rank],sign=x.effect>0?'+':'';return`<button class="v53-strategy ${career.selectedStrategy===s.id?'active':''}" data-strategy="${s.id}"><b>${grade} · ${s.name}${x.rank===1?' · 推荐':''}</b><span>${sign}${x.effect}% 胜率倾向</span><small>${s.desc}</small></button>`}).join('')}</div>${revealed&&career.jordanSpirit?.unlocked&&!career.jordanSpirit.used?`<div class="v57-spirit"><b>🐐 乔丹附体 · 一次性</b><small>是否在本场使用？只有你主动选择“本场使用”后，开赛时才会消耗。</small><div class="v57-spirit-actions"><button id="v57SpiritOff" class="${career.jordanSpirit.armed?'secondary':'primary'}">本场不使用</button><button id="v57SpiritOn" class="${career.jordanSpirit.armed?'primary':'secondary'}">本场使用</button></div></div>`:revealed&&career.jordanSpirit?.used?'<div class="muted">乔丹附体已经在这条时间线使用过。</div>':''}`;
  box.querySelectorAll('[data-strategy]').forEach(b=>b.onclick=()=>{career.selectedStrategy=b.dataset.strategy;saveCareer();v53RenderStrategy(opp)});
  const off=$('v57SpiritOff'),on=$('v57SpiritOn');
  if(off)off.onclick=()=>{career.jordanSpirit.armed=false;saveCareer();v53RenderStrategy(opp)};
  if(on)on.onclick=()=>{career.jordanSpirit.armed=true;saveCareer();v53RenderStrategy(opp)};
  saveCareer();
};

/* The power can only fire when the player explicitly armed it. Never auto-arm. */
const v57SimBase=simulateGame;
simulateGame=function(a,b,seed,live=false){
  v57Ensure();
  if(career?.jordanSpirit && career.jordanSpirit.armed!==true)career.jordanSpirit.armed=false;
  const res=v57SimBase(a,b,seed,live);
  if(res?.notes?.includes('乔丹附体彩蛋')){
    res.notes=res.notes.filter(x=>x!=='乔丹附体彩蛋');
    if(Array.isArray(res.plays))res.plays.forEach(p=>{if(typeof p.text==='string')p.text=p.text.replace('彩蛋触发：','')});
  }
  return res;
};

function v57NormalizeUI(){
  document.title='NBA 路人王 · Street King V5.7';
  const k=document.querySelector('.hero-kicker');if(k)k.textContent='V5.7 · 15 EDITIONS · HUPU READY';
  v57Ensure();
  if(career)saveCareer();
  document.documentElement.dataset.skReady='57-ready';
}

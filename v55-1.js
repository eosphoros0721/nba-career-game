'use strict';
/* Street King V5.5: two-stage enlightenment reveal, 15 editions, duo labels, richer career narrative. */
const V55_BUILD='V5.5-20260819-1048';
const V55_CLUB_THRESHOLD=80;

function v55Ensure(){
  if(!career)return;
  career.insight=Number.isFinite(career.insight)?career.insight:0;
  career.awakened=career.insight>=100||!!career.awakened;
  career.jordanSpirit=career.jordanSpirit||{unlocked:career.insight>=200,used:false,armed:false};
  if(career.insight>=200)career.jordanSpirit.unlocked=true;
  career.mentorLevels=career.mentorLevels||{};
  career.mentorMastery=career.mentorMastery||{};
  career.pairH2H=career.pairH2H||{};
  career.clubProgress=career.clubProgress||{};
  career.clubs=career.clubs||[];
  career.clubBonus=career.clubBonus||{};
  career.clubProcessedMatches=career.clubProcessedMatches||{};
  career.clubEditionProcessed=career.clubEditionProcessed||{};
  career.clubNews=career.clubNews||[];
  if(career.gameMode!=='3v3' && career.totalEditions!==3) career.totalEditions=15;
}
v54Ensure=function(){
  if(!career)return;
  career.insight=Number.isFinite(career.insight)?career.insight:0;
  career.awakened=career.insight>=100||!!career.awakened;
  career.jordanSpirit=career.jordanSpirit||{unlocked:career.insight>=200,used:false,armed:false};
  if(career.insight>=200)career.jordanSpirit.unlocked=true;
  career.mentorMastery=career.mentorMastery||{};
  career.pairH2H=career.pairH2H||{};
  v55Ensure();
};

const v55InitCareerBase=initCareer;
initCareer=function(mode,seed){
  v55InitCareerBase(mode,seed);
  v55Ensure();
  if(career.gameMode!=='3v3')career.totalEditions=15;
  saveCareer();
};
const v55LockBase=lockBuild;
lockBuild=function(){
  v55LockBase();
  if(career&&pendingMode==='solo'){
    career.totalEditions=15;
    v55Ensure();
    saveCareer();
  }
};
const v55LoadBase=loadSaved;
loadSaved=function(){
  const ok=v55LoadBase();
  if(ok){v55Ensure();saveCareer()}
  return ok;
};
startMulti=function(){
  if(!player){toast('先创建自己的球员');return}
  if(!friendPlayer){toast('先导入朋友角色');return}
  const shared=$('sharedSeed').value.trim();
  if(!shared){toast('需要共同赛事码');return}
  const gm=$('multiGameMode')?.value||'1v1';
  const picked=+($('multiLength')?.value||15);
  const total=gm==='3v3'?3:(picked===3?3:15);
  const canonical=shared+'|'+[currentPlayerCode(),encodeCode(playerCodePayload(friendPlayer),'SK5')].sort().join('|')+'|'+gm+'|'+total;
  v55InitCareerBase('multi',canonical);
  career.gameMode=gm;
  career.totalEditions=total;
  v55Ensure();
  saveCareer();
  renderField();
  showScreen('field');
};

v53RenderStrategy=function(opp){
  const box=$('strategyBox');
  if(!box)return;
  v55Ensure();
  if(career.insight<100){
    box.classList.add('hidden');
    box.innerHTML='';
    return;
  }
  box.classList.remove('hidden');
  const key=`${career.edition}|${career.focus?.roundIndex}|${opp.id}`;
  if(career.strategyMatchKey!==key){
    career.strategyMatchKey=key;
    career.selectedStrategy='balanced';
    if(career.jordanSpirit)career.jordanSpirit.armed=false;
  }
  const rows=v54StrategyTable(player,opp), map=new Map(rows.map(x=>[x.s.id,x]));
  const revealed=career.insight>=200;
  box.innerHTML=`<div class="v53-strategy-title"><b>悟道 ${Math.round(career.insight)}/200% · 本场策略</b><small>${revealed?'极境已成：评级与胜率倾向全部揭晓。':'第一阶段悟道：你已经理解这些打法，但还看不穿哪一种最适合当前对位。'}</small></div>
  <div class="v53-strategy-grid">${V53_STRATEGIES.map(s=>{
    const x=map.get(s.id);
    const grade=revealed?['','S','A','B','C','D'][x.rank]:'?';
    const eff=revealed?`${x.effect>0?'+':''}${x.effect}% 胜率倾向`:'? 胜率影响';
    return `<button class="v53-strategy ${career.selectedStrategy===s.id?'active':''}" data-strategy="${s.id}"><b>${grade} · ${s.name}${revealed&&x.rank===1?' · 推荐':''}</b><span>${eff}</span><small>${s.desc}</small></button>`;
  }).join('')}</div>
  ${revealed&&career.jordanSpirit?.unlocked&&!career.jordanSpirit.used?`<button id="v54JordanSpirit" class="choice-btn ${career.jordanSpirit.armed?'active':''}"><b>🐐 乔丹附体 · 一次性</b><small>200%悟道彩蛋。本场发动后进行一次强力逆转判定；若对手正好是 Michael Jordan，本人会让“附体”当场失效并触发0封彩蛋。</small></button>`:revealed&&career.jordanSpirit?.used?'<div class="muted">“乔丹附体”已经在这条时间线使用过。</div>':''}`;
  box.querySelectorAll('[data-strategy]').forEach(b=>b.onclick=()=>{
    career.selectedStrategy=b.dataset.strategy;
    saveCareer();
    v53RenderStrategy(opp);
  });
  const js=$('v54JordanSpirit');
  if(js)js.onclick=()=>{
    career.jordanSpirit.armed=!career.jordanSpirit.armed;
    saveCareer();
    v53RenderStrategy(opp);
  };
  saveCareer();
};

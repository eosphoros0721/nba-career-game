'use strict';
/* Street King V5.6: club scoring + slower AI club formation. */
const V56_BUILD='V5.6-20260819-1118';
const V56_CPU_CLUB_CAP=3;
const V56_CLUB_SHARE=1/3;

function v56Ensure(){
  if(!career)return;
  if(typeof v55Ensure==='function')v55Ensure();
  career.aiClubProgress=career.aiClubProgress||{};
  career.aiClubProcessed=career.aiClubProcessed||{};
  career.clubEditionProcessedV56=career.clubEditionProcessedV56||{};
}
function v56IsCPU(p){
  if(!p||p.id===player?.id)return false;
  return NBA_POOL.some(x=>x.id===p.id);
}
function v56AIKey(leaderId,targetId){return `${leaderId}>${targetId}`}
function v56AIProgress(leaderId,targetId){
  v56Ensure();
  const key=v56AIKey(leaderId,targetId);
  if(!career.aiClubProgress[key])career.aiClubProgress[key]={leaderId,targetId,value:0,wins:0,losses:0,bigWins:0,lastEdition:0};
  return career.aiClubProgress[key];
}
function v56PairRow(aId,bId){
  const ids=[aId,bId].sort();
  return career.pairH2H?.[ids.join('|')]||null;
}
function v56TrackAIRespect(a,b,res){
  if(!career||!res||res.status!=='final'||!res.winner||!v56IsCPU(a)||!v56IsCPU(b))return;
  v56Ensure();
  const pair=v56PairRow(a.id,b.id);
  const meet=pair?.meetings||0;
  const guardKey=`${career.edition}|${[a.id,b.id].sort().join('|')}|${meet}|${(res.score||[]).join('-')}`;
  if(career.aiClubProcessed[guardKey])return;
  career.aiClubProcessed[guardKey]=1;
  const winner=res.winner.id===a.id?a:b, loser=winner.id===a.id?b:a;
  const margin=Math.abs((res.score?.[0]||0)-(res.score?.[1]||0));
  const row=v56AIProgress(winner.id,loser.id);
  let gain=5+(margin>=7?32:margin>=5?24:margin>=3?16:8);
  const ww=pair?.wins?.[winner.id]||0, lw=pair?.wins?.[loser.id]||0;
  if(ww>=2&&ww>lw)gain+=8;
  if(res.score?.includes(0))gain+=8;
  row.value=clamp(row.value+gain,0,100);row.wins++;row.lastGain=gain;row.lastEdition=career.edition;
  if(margin>=7)row.bigWins++;
  const reverse=v56AIProgress(loser.id,winner.id);
  const drop=margin>=7?8:margin>=4?5:3;
  reverse.value=clamp(reverse.value-drop,0,100);reverse.losses++;reverse.lastGain=-drop;reverse.lastEdition=career.edition;
  saveCareer();
}
const v56StatBase=statMatch;
statMatch=function(a,b,res){
  v56StatBase(a,b,res);
  try{v56TrackAIRespect(a,b,res)}catch(e){console.error('V5.6 AI club progress',e)}
};

function v56EligibleAIClubRows(){
  v56Ensure();
  return Object.values(career.aiClubProgress).filter(r=>{
    if(r.value<V55_CLUB_THRESHOLD)return false;
    const a=careerParticipant(r.leaderId),b=careerParticipant(r.targetId);
    if(!v56IsCPU(a)||!v56IsCPU(b)||v55ClubFor(a.id)||v55ClubFor(b.id))return false;
    const pair=v56PairRow(a.id,b.id),aw=pair?.wins?.[a.id]||0,bw=pair?.wins?.[b.id]||0;
    return (pair?.meetings||0)>=2 && aw>bw;
  }).sort((x,y)=>y.value-x.value||y.bigWins-x.bigWins||y.wins-x.wins);
}
v55MaybeFormAIClubs=function(edition){
  v56Ensure();
  const existing=career.clubs.filter(c=>c.cpu).length;
  if(existing>=V56_CPU_CLUB_CAP)return[];
  const eligible=v56EligibleAIClubRows();
  if(!eligible.length)return[];
  const r=RNG(`${career.seed}|V56-AI-CLUB|${edition}`),formed=[];
  for(const row of eligible){
    if(formed.length>=1||career.clubs.filter(c=>c.cpu).length>=V56_CPU_CLUB_CAP)break;
    if(v55ClubFor(row.leaderId)||v55ClubFor(row.targetId))continue;
    const chance=clamp(.48+(row.value-80)*.012,.48,.72);
    if(r()>chance)continue;
    const c=v55FormClub(row.leaderId,row.targetId,true);
    if(c){c.respectAtFormation=Math.round(row.value);formed.push(c)}
  }
  return formed;
};

function v56MedalPoints(entry,id){
  if(!entry||!id)return 0;
  if(entry.champId===id)return 10;
  if(entry.runnerId===id)return 6;
  if(entry.thirdId===id)return 3;
  return 0;
}
v55AwardClubBonuses=function(entry){
  v56Ensure();
  if(!entry||career.clubEditionProcessedV56[entry.edition])return[];
  career.clubEditionProcessedV56[entry.edition]=1;
  const news=[];
  for(const c of career.clubs){
    if(!c||c.members?.length!==2||c.formedEdition>=entry.edition)continue;
    const [aId,bId]=c.members,aPts=v56MedalPoints(entry,aId),bPts=v56MedalPoints(entry,bId);
    if(bPts>0){
      const bonus=bPts*V56_CLUB_SHARE;
      career.clubBonus[aId]=(career.clubBonus[aId]||0)+bonus;
      news.push(`${careerParticipant(bId)?.name||bId}本届拿到${bPts}基础积分，搭档${careerParticipant(aId)?.name||aId}获得其1/3：+${bonus.toFixed(2)}厂牌分。`);
    }
    if(aPts>0){
      const bonus=aPts*V56_CLUB_SHARE;
      career.clubBonus[bId]=(career.clubBonus[bId]||0)+bonus;
      news.push(`${careerParticipant(aId)?.name||aId}本届拿到${aPts}基础积分，搭档${careerParticipant(bId)?.name||bId}获得其1/3：+${bonus.toFixed(2)}厂牌分。`);
    }
  }
  return news;
};

const v56DashboardBase=v55RenderClubDashboard;
v55RenderClubDashboard=function(){
  v56DashboardBase();
  try{
    const card=$('v55ClubDashboard');if(!card||!career)return;
    const myClub=v55ClubFor(player.id),aiCount=career.clubs.filter(c=>c.cpu).length;
    const p=card.querySelector('p.muted');
    if(p){
      if(myClub)p.innerHTML=`${myClub.name} · 你的累计厂牌分 <b>${Number(career.clubBonus[player.id]||0).toFixed(2)}</b>。厂牌积分只来自搭档：搭档冠军/亚军/季军时，你分别获得 <b>3.33 / 2.00 / 1.00</b> 分；你自己的名次积分不会再重复叠加。`;
      else p.innerHTML=`把对手“打服”到 ${V55_CLUB_THRESHOLD}/100 且历史交手占优后，可以邀请一人。厂牌成立后，搭档每届的冠军10分/亚军6分/季军3分，会按 <b>1/3</b> 转化为你的厂牌分。`;
    }
    const ai=card.querySelector('.v55-ai-clubs');
    if(ai){const b=ai.querySelector('b');if(b)b.textContent=`电脑厂牌 ${aiCount}/${V56_CPU_CLUB_CAP}`}
  }catch(e){console.error('V5.6 dashboard',e)}
};

function v56NormalizeUI(){
  document.title='NBA 路人王 · Street King V5.6';
  const k=document.querySelector('.hero-kicker');if(k)k.textContent='V5.6 · 15 EDITIONS · CLUB BALANCE';
  v56Ensure();
  if(career){saveCareer();try{v55RenderClubDashboard()}catch(e){}}
  document.documentElement.dataset.skReady='56-ready';
}

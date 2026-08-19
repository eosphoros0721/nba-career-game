/* ---------- Duo label / club system ---------- */
function v55ClubFor(id){
  v55Ensure();
  return career.clubs.find(c=>c.members.includes(id))||null;
}
function v55PartnerOf(id){
  const c=v55ClubFor(id);
  if(!c)return null;
  return c.members.find(x=>x!==id)||null;
}
function v55LastName(p){
  if(!p)return 'Unknown';
  const bits=(p.name||p.id||'').split(' ');
  return bits[bits.length-1].replace(/[’']/g,'');
}
function v55ClubName(aId,bId){
  const a=careerParticipant(aId),b=careerParticipant(bId);
  return `${v55LastName(a)} × ${v55LastName(b)} 双人厂牌`;
}
function v55RespectRow(id){
  v55Ensure();
  if(!career.clubProgress[id])career.clubProgress[id]={value:0,wins:0,losses:0,bigWins:0,lastEdition:0};
  return career.clubProgress[id];
}
function v55UserScoreInfo(res){
  const won=res?.winner?.id===player?.id;
  const margin=Math.abs((res?.score?.[0]||0)-(res?.score?.[1]||0));
  return{won,margin,shutout:won&&res?.score?.includes(0)};
}
function v55UpdateRespect(opp,res,roundName){
  if(!career||!opp||opp.id===player.id)return;
  v55Ensure();
  const key=`${career.edition}|${roundName}|${opp.id}|${(res.score||[]).join('-')}|${res.status}`;
  if(career.clubProcessedMatches[key])return;
  career.clubProcessedMatches[key]=1;
  const row=v55RespectRow(opp.id);
  const {won,margin,shutout}=v55UserScoreInfo(res);
  if(res.status==='final'){
    if(won){
      let gain=5;
      gain+=margin>=7?32:margin>=5?24:margin>=3?16:8;
      if(['半决赛','决赛','季军赛'].includes(roundName))gain+=4;
      const h=h2hFor(opp.id);
      if(h.wins>=2&&h.wins>h.losses)gain+=8;
      if(shutout)gain+=8;
      row.value=clamp(row.value+gain,0,100);
      row.wins++;
      if(margin>=7)row.bigWins++;
      row.lastGain=gain;
    }else{
      const drop=margin>=7?8:margin>=4?5:3;
      row.value=clamp(row.value-drop,0,100);
      row.losses++;
      row.lastGain=-drop;
    }
  }
  row.lastEdition=career.edition;
  saveCareer();
}
function v55CanInvite(opp){
  if(!career||!opp||v55ClubFor(player.id)||v55ClubFor(opp.id))return false;
  const row=v55RespectRow(opp.id),h=h2hFor(opp.id);
  return row.value>=V55_CLUB_THRESHOLD && h.wins>h.losses;
}
function v55FormClub(aId,bId,cpu=false){
  v55Ensure();
  if(v55ClubFor(aId)||v55ClubFor(bId)||aId===bId)return null;
  const c={id:`club-${career.edition}-${hash32(aId+'|'+bId+'|'+career.seed).toString(36)}`,name:v55ClubName(aId,bId),members:[aId,bId],formedEdition:career.edition,cpu};
  career.clubs.push(c);
  career.clubNews.push({edition:career.edition,text:`${c.name} 正式成立。`});
  saveCareer();
  return c;
}
function v55RenderClubOffer(opp){
  const host=$('matchResult');
  if(!host||!opp)return;
  let old=$('v55ClubOffer');if(old)old.remove();
  const row=v55RespectRow(opp.id),h=h2hFor(opp.id),club=v55ClubFor(opp.id);
  const div=document.createElement('div');
  div.id='v55ClubOffer';
  div.className='v55-club-offer';
  const status=club?`已加入：${club.name}`:`打服进度 ${Math.round(row.value)}/${V55_CLUB_THRESHOLD} · 对其战绩 ${h.wins}-${h.losses}`;
  div.innerHTML=`<div class="v55-club-head"><b>双人厂牌观察 · ${opp.name}</b><span>${status}</span></div><div class="v55-respect-track"><i style="width:${Math.min(100,row.value/V55_CLUB_THRESHOLD*100)}%"></i></div>`;
  if(v55CanInvite(opp)){
    div.innerHTML+=`<p>他已经认可你在这条街上的压制力。你现在可以邀请他组成双人厂牌，也可以不签，继续等另一个人。</p><div class="v55-offer-actions"><button id="v55InviteClub" class="secondary">邀请 ${opp.name}</button><button id="v55SkipClub" class="skip-btn">这次不邀请</button></div>`;
  }
  host.appendChild(div);
  const invite=$('v55InviteClub');
  if(invite)invite.onclick=()=>{
    const c=v55FormClub(player.id,opp.id,false);
    if(c){toast(`厂牌成立：${c.name}`);v55RenderClubOffer(opp);v55RenderClubDashboard()}
  };
  const skip=$('v55SkipClub');
  if(skip)skip.onclick=()=>{div.querySelector('.v55-offer-actions')?.remove();toast('你决定继续等待其他搭档')};
}
const v55ShowFocusedBase=showFocusedResult;
showFocusedResult=function(opp,res,priorH,roundName,isBronze=false){
  v55ShowFocusedBase(opp,res,priorH,roundName,isBronze);
  try{v55UpdateRespect(opp,res,roundName);v55RenderClubOffer(opp);v55RenderClubDashboard()}catch(e){console.error('club postmatch',e)}
};

function v55RenderClubDashboard(){
  if(!career||!player)return;
  v55Ensure();
  const screen=$('screen-career');if(!screen)return;
  let card=$('v55ClubDashboard');
  if(!card){
    card=document.createElement('div');
    card.id='v55ClubDashboard';
    card.className='card v55-club-card';
    const header=screen.querySelector('.career-header');
    if(header)header.insertAdjacentElement('afterend',card);else screen.prepend(card);
  }
  const myClub=v55ClubFor(player.id),partnerId=v55PartnerOf(player.id),partner=partnerId?careerParticipant(partnerId):null;
  const others=fieldPlayers().filter(p=>p.id!==player.id).map(p=>{
    const r=v55RespectRow(p.id),c=v55ClubFor(p.id);
    return{p,r,c};
  }).sort((a,b)=>b.r.value-a.r.value);
  const ai=career.clubs.filter(c=>c.cpu);
  card.innerHTML=`<div class="title-row"><div><span class="eyebrow">DUO LABEL</span><h3>双人厂牌</h3></div><span class="pill">${myClub?(partner?`搭档 ${partner.name}`:'已签约'):'尚未签约'}</span></div>
  <p class="muted">${myClub?`${myClub.name} · 厂牌微量加分 ${Number(career.clubBonus[player.id]||0).toFixed(2)}`:`把对手“打服”到 ${V55_CLUB_THRESHOLD}/100 且历史交手占优后，可以在赛后发出一次邀请。整个生涯最多签一人。`}</p>
  <details><summary>查看所有对手的打服进度</summary><div class="v55-progress-list">${others.map(x=>`<div class="v55-progress-row"><div><b>${x.p.name}</b><small>${x.c?x.c.name:`${Math.round(x.r.value)}/${V55_CLUB_THRESHOLD}`}</small></div><div class="v55-respect-track"><i style="width:${Math.min(100,x.r.value/V55_CLUB_THRESHOLD*100)}%"></i></div></div>`).join('')}</div></details>
  ${ai.length?`<div class="v55-ai-clubs"><b>电脑厂牌</b><div>${ai.map(c=>`<span>${c.name}</span>`).join('')}</div></div>`:''}`;
}
const v55HeaderBase=renderCareerHeader;
renderCareerHeader=function(){
  v55Ensure();
  v55HeaderBase();
  $('careerAgeRange').textContent=`18–32岁 · 共${career.totalEditions}届`;
  v55RenderClubDashboard();
};

function v55MaybeFormAIClubs(edition){
  v55Ensure();
  const r=RNG(`${career.seed}|AI-CLUBS|${edition}`);
  const eligible=fieldPlayers().filter(p=>p.id!==player.id&&!String(p.id).startsWith('custom-')&&!v55ClubFor(p.id));
  const formed=[];
  const maxNew=2;
  const chances=[.18,.055];
  for(let slot=0;slot<maxNew;slot++){
    if(eligible.length<2||r()>chances[slot])break;
    const shuffled=shuffle(r,eligible.filter(p=>!v55ClubFor(p.id)));
    if(shuffled.length<2)break;
    let best=null,bestScore=-Infinity;
    for(let i=0;i<Math.min(7,shuffled.length);i++)for(let j=i+1;j<Math.min(8,shuffled.length);j++){
      const a=shuffled[i],b=shuffled[j],ids=[a.id,b.id].sort(),pair=career.pairH2H?.[ids.join('|')];
      const meetings=pair?.meetings||0;
      const pa=getPersonality(a),pb=getPersonality(b);
      const affinity=(pa.friend||0)+(pb.friend||0)-Math.abs(streetOVR(a)-streetOVR(b))*.08+meetings*1.5+r()*3;
      if(affinity>bestScore){bestScore=affinity;best=[a,b]}
    }
    if(best){
      const c=v55FormClub(best[0].id,best[1].id,true);
      if(c)formed.push(c);
    }
  }
  return formed;
}
function v55AwardClubBonuses(entry){
  v55Ensure();
  if(!entry||career.clubEditionProcessed[entry.edition])return[];
  career.clubEditionProcessed[entry.edition]=1;
  const awards=[[entry.champId,.25,'冠军'],[entry.runnerId,.15,'亚军'],[entry.thirdId,.10,'季军']];
  const news=[];
  for(const [id,bonus,label] of awards){
    if(!id)continue;
    const partner=v55PartnerOf(id);
    if(!partner)continue;
    career.clubBonus[partner]=(career.clubBonus[partner]||0)+bonus;
    const a=careerParticipant(id),b=careerParticipant(partner),c=v55ClubFor(id);
    news.push(`${a?.name||id}拿到${label}，${b?.name||partner}因此获得 +${bonus.toFixed(2)} 厂牌分（${c?.name||'双人厂牌'}）。`);
  }
  return news;
}
const v55FinalizeBase=finalizeEdition;
finalizeEdition=function(){
  v55FinalizeBase();
  try{
    const entry=career.history.at(-1);
    const bonusNews=v55AwardClubBonuses(entry);
    const formed=v55MaybeFormAIClubs(entry?.edition||career.edition);
    if(bonusNews.length||formed.length){
      const host=$('matchResult');
      if(host){
        const d=document.createElement('div');d.className='v55-club-news';
        d.innerHTML=`<b>厂牌新闻</b>${bonusNews.map(x=>`<p>${x}</p>`).join('')}${formed.map(c=>`<p>🤝 ${c.name} 在本届结束后低调成立。</p>`).join('')}`;
        host.appendChild(d);
      }
    }
    saveCareer();v55RenderClubDashboard();
  }catch(e){console.error('club edition finalize',e)}
};

const v55RankingBase=rankingRows;
rankingRows=function(){
  v55Ensure();
  const rows=v55RankingBase();
  rows.forEach(x=>{x.clubBonus=career.clubBonus[x.id]||0;x.score+=x.clubBonus});
  return rows.sort((a,b)=>b.score-a.score||b.gold-a.gold||b.winPct-a.winPct||b.wins-a.wins);
};

/* ---------- More complete broadcast-style career narrative ---------- */
makeCareerNarrative=function(rank){
  v55Ensure();
  const myRank=rank.findIndex(x=>x.id===player.id)+1,me=rank.find(x=>x.id===player.id)||{};
  const total=career.totalEditions||15,hist=career.history||[],firstGold=hist.find(x=>x.place===1),lastPlayed=hist.at(-1);
  const rival=mostFacedOpponent(),big=biggestWin();
  const worstInjury=(career.injuries||[]).slice().sort((a,b)=>(b.impact||0)-(a.impact||0))[0];
  const masteries=Object.entries(career.mentorMastery||{}).map(([id,m])=>({id,...m}));
  const insight200=(career.insightHistory||[]).find(x=>x.total>=200);
  const club=v55ClubFor(player.id),partnerId=v55PartnerOf(player.id),partner=partnerId?careerParticipant(partnerId):null;
  const winPct=(me.wins+me.losses)?me.wins/(me.wins+me.losses)*100:0;
  const early=hist.slice(0,3).map(h=>`${h.age}岁${typeof h.place==='number'?(h.place===1?'夺冠':h.place===2?'亚军':h.place===3?'季军':'第4'):h.place}`).join('、');
  const peak=hist.filter(h=>h.place===1).slice(0,4).map(h=>`${h.age}岁`).join('、');
  const late=hist.slice(-3).map(h=>`${h.age}岁${typeof h.place==='number'?(h.place===1?'冠军':h.place===2?'亚军':h.place===3?'季军':'第4'):h.place}`).join('、');
  let p1=`<p><b>【开场】</b>18岁，#${player.number} ${player.name}第一次走进这条街的时候，没人知道${total}届之后他的名字会被摆在什么位置。固定的16个人意味着这里没有“打完就散”的一次性故事：赢过的人会回来，输过的人也会回来，垃圾话、伤病、导师、厂牌和旧账都会一年一年叠上去。前三届的答卷是：${early||'故事还没有完整写下前三章'}。</p>`;
  let p2=firstGold?`<p><b>【冠军拐点】</b>${firstGold.age}岁，他第一次把冠军真正拿在手里。那不是统计栏里简单多出的一个“1”，而是整条时间线的语气变化。从那以后，对手再见到他时，谈的已经不是“这个新人能走多远”，而是“谁来把这个已经赢过的人送回家”。${peak?`他的冠军年份里，${peak}${hist.filter(h=>h.place===1).length>4?'等':''}成为最亮的几个坐标。`:''}</p>`:`<p><b>【迟迟未到的王冠】</b>这段生涯没有得到一个轻松的冠军开局。一次次靠近、一次次被挡住，让他的故事更像长期修正而不是天选爽文；每一届结束后的夏天，都在逼他决定下一年要不要换一种活法。</p>`;
  let p3=rival?`<p><b>【宿敌线】</b>如果必须给这段生涯找一个反复出现的对手，那就是${rival.p.name}。双方一共碰了${rival.h.meetings}次，${player.name}${rival.h.wins}胜${rival.h.losses}负。打到后来，赛前已经不需要自我介绍——上一场谁赢、最后一球怎么处理、谁曾经把谁挡在决赛门外，都会直接带进下一次碰面。${big?`而${big.age}岁${big.round}击败${big.opp}，则是最适合被剪进生涯长片的一场胜利。`:''}</p>`:`<p><b>【对手们】</b>固定参赛池给了他很多熟脸，却没有强行制造一组宿敌。有的人只差一个签位，有的人见过一次就再没碰上，这种不完整本身也是淘汰赛的命运。</p>`;
  let p4=`<p><b>【技术成长】</b>${career.awakenedAge?`${career.awakenedAge}岁，他的悟道进度第一次越过100%，从此赛前开始能够主动选择比赛解法，但真正的策略等级仍被藏在雾里。`:'很长一段时间，他都只能靠自己的理解摸索打法。'}${insight200?`${insight200.age}岁，悟道终于走到200%，所有策略评级与胜率倾向第一次完全摊开，“乔丹附体”也在这一刻成为一次性的隐藏武器。`:''}${masteries.length?` 导师线同样改变了他：${masteries.map(m=>`${m.age}岁修成“${m.name}”`).join('，')}。这些不是一两个能力点，而是让他的比赛开始带上别人的影子，再慢慢变成自己的东西。`:''}</p>`;
  let p5=club&&partner?`<p><b>【双人厂牌】</b>单挑并没有让他永远独来独往。反复交手之后，${partner.name}被真正“打服”，两人最终成立了<b>${club.name}</b>。厂牌没有把比赛变成组队碾压——它只在其中一人站上前三时，给另一人一点微小的历史加分。但从叙事上看，这让原本只有敌人的街头，多了一条“曾经互相淘汰，后来站到同一块招牌下”的支线。${Number(career.clubBonus[player.id]||0)>0?`他最终从搭档的领奖台表现中得到 ${Number(career.clubBonus[player.id]).toFixed(2)} 厂牌分。`:''}</p>`:`<p><b>【独行线】</b>有人在这${total}届里找到了双人厂牌，有人始终保持独行。${player.name}最终没有签下固定搭档，所有奖杯和失败都仍然只记在自己名下。</p>`;
  let p6=worstInjury?`<p><b>【身体代价】</b>街球不是只涨能力的养成线。${worstInjury.age}岁对阵${worstInjury.opp}时的${worstInjury.type}，是这段履历里最重的一次身体警报。它让后面的速度、爆发和训练选择都多了一层成本。到了生涯后段，最后三届（或退役前最后三届）的结果是：${late||'未完整进行'}。</p>`:`<p><b>【身体曲线】</b>他没有遭遇一场足以重写整段生涯的大伤，因此后半程更多是自然年龄曲线与打法迁移在说话。最后阶段的结果是：${late||'未完整进行'}。</p>`;
  let p7=career.retired&&career.retiredAge<32?`<p><b>【退役决定】</b>${career.retiredAge}岁，他主动离开了赛场。重要的是，赛事没有因为主角退役而停止：剩下的届数仍由那批固定球员打完，最终榜单是在完整${total}届世界线结束后才封存。这让他的历史位置既包含他亲手打下的东西，也包含“离开之后别人追了多久”的余波。</p>`:`<p><b>【走到最后】</b>他没有在30岁后的退役窗口提前离场，而是把自己的参赛时间尽可能走完。${total}届固定世界的价值就在这里：年轻时靠爆发赢下的球，到了后面往往要靠经验、策略和已经形成的技术习惯重新赢一次。</p>`;
  let close;
  if(myRank<=3&&career.medals.gold>=3)close=`<p><b>【终场解说】</b>${me.wins||0}胜${me.losses||0}负，胜率${winPct.toFixed(1)}%，${career.medals.gold}冠、${career.medals.silver}亚、${career.medals.bronze}季，最终历史第${myRank}。这不是“某一年突然无敌”的故事，而是一根火把在${total}届比赛里被反复抢走、又被他一次次拿回来的故事。最好的那些夜晚，球场所有人都知道下一回合会找谁——而火把，就在他的手中。</p>`;
  else if(myRank<=6)close=`<p><b>【终场解说】</b>${me.wins||0}胜${me.losses||0}负，胜率${winPct.toFixed(1)}%，最终历史第${myRank}。他没有把这条街统治成个人领地，但任何真正研究过这${total}届的人，都不会只用“没排第一”来概括他。因为他改变过签表，终结过别人的冠军梦，也逼过最好的对手重新设计下一回合。</p>`;
  else close=`<p><b>【终场解说】</b>${me.wins||0}胜${me.losses||0}负，胜率${winPct.toFixed(1)}%，最终历史第${myRank}。这不是神话式结局，但它仍然是一段完整的职业生涯：有成长、有错误、有旧敌、有没兑现的夏天，也有真正赢下来的夜晚。排行榜给了他一个数字，录像和故事则留下了比数字更多的东西。</p>`;
  return p1+p2+p3+p4+p5+p6+p7+close;
};

const v55FinishBase=finishCareer;
finishCareer=function(){
  v55FinishBase();
  try{
    const rank=rankingRows();
    $('leaderboard').innerHTML=rank.map((x,i)=>`<div class="leader-row" style="${x.id===player.id?'background:#21180f':''}"><b>${i+1}</b><span><b>${x.name}</b><br><small class="muted">${x.gold}冠 ${x.silver}亚 ${x.bronze}季 · ${x.wins}胜${x.losses}负${x.clubBonus?` · 厂牌+${x.clubBonus.toFixed(2)}`:''}</small></span><button class="v54-winbtn" data-win-id="${x.id}">${x.winPct.toFixed(1)}%</button><span class="gold">${x.pts}</span></div>`).join('');
    $('leaderboard').querySelectorAll('[data-win-id]').forEach(b=>b.onclick=()=>v54ShowWinModal(b.dataset.winId));
    $('careerNarrative').innerHTML=makeCareerNarrative(rank);
  }catch(e){console.error('V5.5 final render',e)}
};

function v55NormalizeUI(){
  try{
    document.title='NBA 路人王 · Street King V5.5';
    const k=document.querySelector('.hero-kicker');if(k)k.textContent='V5.5 · 15 EDITIONS · SAFE BOOT';
    const hp=document.querySelector('#screen-menu .hero-card p');if(hp)hp.textContent='单人生涯恢复15届；30岁起每年都可以选择退役。悟道100%只解锁策略内容，200%才揭晓评级与胜率影响，并获得乔丹附体。';
    const solo=document.querySelector('#newSoloBtn small');if(solo)solo.textContent='自建球员 → 固定16人参赛池 → 15届淘汰赛 → 双栏休赛期 → 悟道与双人厂牌 → 历史榜单';
    const legacy=document.querySelector('#screen-retire .screen-title h2');if(legacy)legacy.textContent='十五届之后，街头留下了什么';
    const sel=$('multiLength');
    if(sel){
      [...sel.options].forEach(o=>{if(o.value==='10'||o.value==='15'){o.value='15';o.textContent='正常 · 15届'}});
      if(sel.value!=='3')sel.value='15';
    }
    const hint=$('multiModeHint'),gm=$('multiGameMode');
    if(hint&&(!gm||gm.value==='1v1'))hint.textContent='1V1可选择快速3届或正常15届。';
    v55Ensure();if(career)saveCareer();
  }catch(e){console.error('V5.5 normalize',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v55NormalizeUI);else v55NormalizeUI();

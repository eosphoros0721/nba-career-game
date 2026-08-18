'use strict';
const $=id=>document.getElementById(id); const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
let currentScreen='menu', player=null, friendPlayer=null, career=null, builderSelections={};
const POS_NUM={PG:1,SG:2,SF:3,PF:4,C:5};
function hash32(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function RNG(seed){let x=hash32(String(seed))||123456789;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
function rr(r,a,b){return a+r()*(b-a)} function pick(r,a){return a[Math.floor(r()*a.length)]}
function enc(obj){let s=unescape(encodeURIComponent(JSON.stringify(obj)));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(code){let s=code.replace(/^SK2-/,'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return JSON.parse(decodeURIComponent(escape(atob(s))))}
function toast(t){$('toast').textContent=t;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),1700)}
function show(screen){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$('screen-'+screen).classList.add('active');currentScreen=screen;window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const v=b.dataset.open;if(v==='single-build'){initBuilder(false);show('build')}else show('multi')});
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>show('menu'));

function populateBuilder(){
 const hs=$('pHeight'),ws=$('pWeight'),ps=$('pPersonality');
 if(!hs.options.length){for(let h=180;h<=218;h+=3)hs.add(new Option(h+'cm',h));for(let w=72;w<=135;w+=4)ws.add(new Option(w+'kg',w));Object.entries(PERSONALITIES).forEach(([k,v])=>ps.add(new Option(v.name,k)))}
 ps.onchange=renderPersonality;
 $('skillBuilder').innerHTML='';builderSelections={};
 Object.entries(SKILLS).forEach(([key,s])=>{
   const div=document.createElement('div');div.className='skill-card';div.innerHTML=`<div class="skill-top"><b>${s.label}</b><span class="tier" id="tier-${key}">1分</span></div><select id="skill-${key}"></select><small>${s.desc}</small>`;$('skillBuilder').appendChild(div);
   const sel=$('skill-'+key);for(let tier=1;tier<=5;tier++)s.tiers[tier].forEach(n=>sel.add(new Option(`${tier}分｜${n}｜${TIER_VALUE[tier]}`,`${tier}|${n}`)));
   const start=key==='dunk'?2:3;const opts=[...sel.options].filter(o=>o.value.startsWith(start+'|'));sel.value=opts[0].value;builderSelections[key]=parseSkill(sel.value);sel.onchange=()=>{builderSelections[key]=parseSkill(sel.value);updateBuilder()};
 });
 renderPersonality();updateBuilder();
}
function parseSkill(v){const [tier,name]=v.split('|');return{tier:+tier,name,value:TIER_VALUE[+tier]}}
function initBuilder(fromMulti){populateBuilder();const edit=fromMulti&&player;$('pName').value=edit?player.name:'';$('pNumber').value=edit?player.number:'';$('pPos').value=edit?player.pos:'PG';$('pHeight').value=edit?player.h:189;$('pWeight').value=edit?player.w:88;$('pPersonality').value=edit?player.personality:'kobe';renderPersonality();$('lockBuildBtn').dataset.multi=fromMulti?'1':'0';}
function renderPersonality(){const p=PERSONALITIES[$('pPersonality').value];$('personalityDesc').innerHTML=`<b>${p.name}</b><br>${p.tone}<br><span class="story-note">影响：比赛波动、关键球、伤病概率，以及更容易成为朋友还是宿敌。</span>`}
function updateBuilder(){
 let cost=0,sum=0;Object.entries(builderSelections).forEach(([k,v])=>{cost+=v.tier;sum+=v.value;$('tier-'+k).textContent=v.tier+'分'});$('budgetText').textContent=`${cost} / ${BUILD_BUDGET}`;$('budgetBar').style.width=clamp(cost/BUILD_BUDGET*100,0,100)+'%';$('budgetBar').style.background=cost>BUILD_BUDGET?'#ff6868':'';
 const ovr=Math.round(sum/Object.keys(builderSelections).length);const top=Object.entries(builderSelections).sort((a,b)=>b[1].value-a[1].value).slice(0,3).map(([k,v])=>`${TRAIT_LABELS[k]} ${v.value}（${v.name}）`).join(' · ');$('buildSummary').innerHTML=`<span class="eyebrow">BUILD PREVIEW</span><div class="summary-grid"><div class="summary-stat">综合街球值<b>${ovr||0}</b></div><div class="summary-stat">预算剩余<b>${BUILD_BUDGET-cost}</b></div><div class="summary-stat">最高档能力<b>${Math.max(...Object.values(builderSelections).map(x=>x.tier))}</b></div><div class="summary-stat">性格波动<b>${PERSONALITIES[$('pPersonality').value].variance.toFixed(2)}</b></div></div><div class="muted" style="margin-top:9px">招牌：${top}</div>`;$('lockBuildBtn').disabled=cost>BUILD_BUDGET;
}
function buildPlayer(){
 const name=$('pName').value.trim(),num=$('pNumber').value.trim();if(!name){toast('请输入球员姓名');return null}if(num===''||+num<0||+num>99){toast('请输入0-99球衣号码');return null}
 let attrs={},templates={},tiers={},cost=0;for(const [k,v] of Object.entries(builderSelections)){attrs[k]=v.value;templates[k]=v.name;tiers[k]=v.tier;cost+=v.tier}if(cost>BUILD_BUDGET){toast('天赋预算超标');return null}
 const p={type:'custom',id:'custom-'+hash32(name+Date.now()),name,number:+num,pos:$('pPos').value,h:+$('pHeight').value,w:+$('pWeight').value,personality:$('pPersonality').value,a:attrs,templates,tiers,cost};p.ovr=streetOVR(p);p.code='SK2-'+enc({v:2,name:p.name,number:p.number,pos:p.pos,h:p.h,w:p.w,personality:p.personality,a:p.a,templates:p.templates,tiers:p.tiers});return p;
}
$('lockBuildBtn').onclick=()=>{const p=buildPlayer();if(!p)return;player=p;try{localStorage.setItem('sk2_player',JSON.stringify(player))}catch(e){}if($('lockBuildBtn').dataset.multi==='1'){renderMulti();show('multi');return}startCareer('single')};
function streetOVR(p){const a=p.a;return Math.round(a.finish*.09+a.dunk*.06+a.mid*.09+a.three*.09+a.handle*.09+a.passing*.05+a.perimeter*.11+a.interior*.09+a.rebound*.07+a.strength*.08+a.speed*.09+a.clutch*.09)}

function renderPreview(p,copyable=false){if(!p)return '<div class="muted">尚未创建</div>';return `<div class="player-preview"><b>#${p.number} ${p.name}</b><br><span>${p.pos} · ${p.h}cm / ${p.w}kg · 街球值 ${streetOVR(p)} · ${PERSONALITIES[p.personality]?.name||'自定义性格'}</span>${copyable?'<div style="margin-top:7px"><button class="secondary" onclick="copyCode()">复制我的角色码</button></div>':''}</div>`}
window.copyCode=()=>{if(!player)return;navigator.clipboard?.writeText(player.code);toast('角色码已复制')}
function pKey(p){return p.type==='custom'?(p.code||`${p.name}|${p.number}|${p.pos}`):p.id}
function conditionFor(p){return career?.conditions?.[pKey(p)]??100}
function renderMulti(){$('multiSelfPreview').innerHTML=renderPreview(player,true);$('friendPreview').innerHTML=friendPlayer?renderPreview(friendPlayer,false):'';$('startMultiBtn').disabled=!(player&&friendPlayer)}
$('multiBuildBtn').onclick=()=>{initBuilder(true);show('build')};
$('loadFriendBtn').onclick=()=>{try{const d=dec($('friendCode').value.trim());friendPlayer={type:'custom',id:'friend-'+hash32(d.name+d.number),...d};friendPlayer.ovr=streetOVR(friendPlayer);friendPlayer.code=$('friendCode').value.trim();renderMulti();toast('朋友角色已载入')}catch(e){toast('角色码无法读取')}};
$('generateSeedBtn').onclick=()=>{$('sharedSeed').value='SK-'+Math.random().toString(36).slice(2,10).toUpperCase();navigator.clipboard?.writeText($('sharedSeed').value);toast('赛事码已生成并复制')};
$('startMultiBtn').onclick=()=>{if(!player||!friendPlayer)return;const seed=$('sharedSeed').value.trim();if(!seed){toast('请先填写双方共同赛事码');return}startCareer('multi',seed)};

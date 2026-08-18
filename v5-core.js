'use strict';
const ATTR_KEYS=['finish','dunk','mid','three','handle','passing','perimeter','interior','rebound','strength','speed','clutch'];
const ATTR_LABEL={finish:'终结',dunk:'扣篮',mid:'中投',three:'三分',handle:'控球',passing:'组织',perimeter:'外防',interior:'内防',rebound:'篮板',strength:'力量',speed:'速度',clutch:'关键球'};
const ROUND_NAMES=['16强','8强','半决赛','决赛'];
const SAVE_KEY='streetking_v5_career';
const BUILD_KEY='streetking_v5_player';
let career=null,player=null,friendPlayer=null,pendingMode='solo',liveSpeed=1;

const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const deepClone=o=>JSON.parse(JSON.stringify(o));
function hash32(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function RNG(seed){let x=hash32(seed)||0x12345678;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
function rint(r,a,b){return Math.floor(r()*(b-a+1))+a}
function pick(r,a){return a[Math.floor(r()*a.length)]}
function shuffle(r,a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function uid(prefix='RUN'){const a=new Uint32Array(2);crypto.getRandomValues(a);return `${prefix}-${a[0].toString(36)}${a[1].toString(36)}`.toUpperCase()}
function encodeCode(obj,prefix='SK5'){const bytes=new TextEncoder().encode(JSON.stringify(obj));let s='';for(const b of bytes)s+=String.fromCharCode(b);return prefix+'-'+btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function decodeCode(code,prefix='SK5'){let s=code.trim();if(!s.startsWith(prefix+'-'))throw new Error('角色码版本不匹配');s=s.slice(prefix.length+1).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return JSON.parse(new TextDecoder().decode(bytes))}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.add('hidden'),1800)}
function saveCareer(){if(career)localStorage.setItem(SAVE_KEY,JSON.stringify({career,player,friendPlayer}));if(player)localStorage.setItem(BUILD_KEY,JSON.stringify(player))}
function loadSaved(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s?.career){career=s.career;player=s.player;friendPlayer=s.friendPlayer||null;return true}}catch(e){}return false}
function loadLastPlayer(){try{const p=JSON.parse(localStorage.getItem(BUILD_KEY)||'null');if(p?.a)return p}catch(e){}return null}
function clearCareer(){localStorage.removeItem(SAVE_KEY);career=null;friendPlayer=null}
function showScreen(name){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$('screen-'+name).classList.add('active');$('homeBtn').classList.toggle('hidden',name==='menu');window.scrollTo(0,0)}

function streetOVR(p){const a=p.a;const w={finish:1.05,dunk:.72,mid:.92,three:1.02,handle:.83,passing:.42,perimeter:.8,interior:.58,rebound:.46,strength:.6,speed:.88,clutch:.72};let s=0,d=0;for(const k of ATTR_KEYS){s+=(a[k]||70)*w[k];d+=w[k]}return s/d}
function skillCostFromBuild(build){return Object.values(build).reduce((s,x)=>s+(+x.tier||0),0)}
function playerCodePayload(p){return{v:5,id:p.id,name:p.name,number:p.number,pos:p.pos,h:p.h,w:p.w,personality:p.personality,a:p.a,style:p.style||{},templates:p.templates||{}}}
function makePlayerFromBuild({name,number,pos,h,w,personality,build}){const a={},templates={};for(const k of ATTR_KEYS){const tier=+build[k].tier;a[k]=TIER_VALUE[tier];templates[k]=build[k].template}const seed=`${name}|${number}|${pos}|${h}|${w}|${personality}|${JSON.stringify(templates)}`;return{id:'custom-'+hash32(seed).toString(36),name,number:+number,pos,h:+h,w:+w,personality,a,baseA:deepClone(a),style:{three:0,mid:0,drive:0,post:0},templates,mentorHistory:[],createdAt:Date.now()}}
function getPersonality(p){return PERSONALITIES[p.personality||p.p]||PERSONALITIES.duncan}
function positionGroup(pos){return['PG','SG'].includes(pos)?'guard':['SF','PF'].includes(pos)?'wing':'big'}
function getVoice(p){return VOICE[p.name]||{hook:'寻找自己最舒服的进攻方式',focus:'比赛节奏',first:`${p.name}没有多说，只把球拍了两下。`,respect:'这场值得记住。'}}

function similarTemplates(p){const me=streetOVR(p),arr=NBA_POOL.map(x=>({p:x,ovr:streetOVR(x),dist:ATTR_KEYS.reduce((s,k)=>s+Math.pow((p.a[k]||70)-(x.a[k]||70),2),0)}));let ceiling=arr.filter(x=>x.ovr>=me+.5).sort((a,b)=>a.dist-b.dist)[0]||arr.sort((a,b)=>b.ovr-a.ovr)[0];let floor=arr.filter(x=>x.ovr<=me-.5).sort((a,b)=>a.dist-b.dist)[0]||arr.sort((a,b)=>a.ovr-b.ovr)[0];return{ceiling:ceiling.p,floor:floor.p}}

function selectFixedField(self,friend,seed){const r=RNG(seed+'|FIELD'),need=friend?14:15;const pool=NBA_POOL.filter(x=>x.id!==self.id&&(!friend||x.id!==friend.id));const sorted=[...pool].sort((a,b)=>streetOVR(b)-streetOVR(a));const q=Math.ceil(sorted.length/4),elite=sorted.slice(0,q),strong=sorted.slice(q,q*3),wild=sorted.slice(q*3);let chosen=[];
  chosen.push(...shuffle(r,elite).slice(0,4));chosen.push(...shuffle(r,strong).slice(0,friend?6:7));chosen.push(...shuffle(r,wild).slice(0,4));
  const specials=['zaza','griffin','draymond','rodman','metta','patbev','edwards'];if(r()<.55&&!chosen.some(x=>specials.includes(x.id))){const sp=pool.filter(x=>specials.includes(x.id));if(sp.length){chosen[chosen.length-1]=pick(r,sp)}}
  chosen=[...new Map(chosen.map(x=>[x.id,x])).values()];for(const x of shuffle(r,pool)){if(chosen.length>=need)break;if(!chosen.some(y=>y.id===x.id))chosen.push(x)}
  return [self,...(friend?[friend]:[]),...chosen.slice(0,need)];
}
function careerParticipant(id){if(!id)return null;if(player?.id===id)return player;if(friendPlayer?.id===id)return friendPlayer;return NBA_POOL.find(x=>x.id===id)||null}
function fieldPlayers(){return career.fieldIds.map(careerParticipant).filter(Boolean)}
function participantForYear(p,edition){if(p.id===player.id)return player;if(friendPlayer&&p.id===friendPlayer.id)return friendPlayer;const r=RNG(`${career.seed}|FORM|${edition}|${p.id}`),q=deepClone(p);q.a=deepClone(p.a);const form=(r()-.5)*3;for(const k of ATTR_KEYS)q.a[k]=clamp(q.a[k]+form*(k==='clutch'?1.2:.55),45,99);return q}

function initCareer(mode,seed){const field=selectFixedField(player,mode==='multi'?friendPlayer:null,seed);career={v:5,mode,seed,edition:1,age:18,totalEditions:15,fieldIds:(mode==='multi'?field.map(x=>x.id).sort():field.map(x=>x.id)),points:{},stats:{},h2h:{},history:[],matchLog:[],health:100,injuries:[],retired:false,retiredAge:null,completed:false,medals:{gold:0,silver:0,bronze:0},styleNotes:[],currentTournament:null,lastOffseason:null,relationship:{meetings:0,selfWins:0,friendWins:0,label:'尚未交手'}};for(const p of field){career.points[p.id]=0;career.stats[p.id]={gold:0,silver:0,bronze:0,wins:0,losses:0,dq:0,matches:0}}saveCareer()}
function award(id,place){if(!id)return;const pts=place===1?10:place===2?6:place===3?3:0;if(!career.points[id])career.points[id]=0;career.points[id]+=pts;const s=career.stats[id]||(career.stats[id]={gold:0,silver:0,bronze:0,wins:0,losses:0,dq:0,matches:0});if(place===1)s.gold++;if(place===2)s.silver++;if(place===3)s.bronze++;if(id===player.id){if(place===1)career.medals.gold++;if(place===2)career.medals.silver++;if(place===3)career.medals.bronze++}}
function statMatch(a,b,res){for(const p of [a,b]){if(!p)return;const s=career.stats[p.id]||(career.stats[p.id]={gold:0,silver:0,bronze:0,wins:0,losses:0,dq:0,matches:0});s.matches++}if(res.status==='dq_both'){for(const p of [a,b])if(p)career.stats[p.id].dq++;return}if(res.winner){career.stats[res.winner.id].wins++;const l=res.winner.id===a.id?b:a;if(l)career.stats[l.id].losses++}}
function h2hFor(id){return career.h2h[id]||{meetings:0,wins:0,losses:0,lastAge:null,lastRound:null,lastResult:null,streak:0}}
function recordH2H(opp,roundName,res){if(!opp||opp.id===player.id)return;const h=h2hFor(opp.id);h.meetings++;if(res.status==='dq_both'){h.lastResult='dq';h.streak=0}else if(res.winner?.id===player.id){h.wins++;h.lastResult='win';h.streak=h.streak>=0?h.streak+1:1}else{h.losses++;h.lastResult='loss';h.streak=h.streak<=0?h.streak-1:-1}h.lastAge=career.age;h.lastRound=roundName;career.h2h[opp.id]=h;if(friendPlayer&&opp.id===friendPlayer.id){career.relationship.meetings++;if(res.winner?.id===player.id)career.relationship.selfWins++;if(res.winner?.id===friendPlayer.id)career.relationship.friendWins++;career.relationship.label=relationshipLabel(career.relationship)}}
function relationshipLabel(r){if(!r.meetings)return'尚未交手';if(r.meetings===1)return'第一次交锋';const diff=Math.abs(r.selfWins-r.friendWins);if(r.meetings>=5&&diff<=1)return'宿敌';if(r.meetings>=4)return'长期竞争对手';if(r.meetings>=3&&diff<=1)return'亦敌亦友';return'熟悉的对手'}

function playerPersonaCategory(p){const key=p.personality;for(const [cat,v] of Object.entries(PERSONA_ARCH))if(v.keys.includes(key))return v;return PERSONA_ARCH.calm}
function careerStatusSentence(){const g=career.medals.gold,s=career.medals.silver,b=career.medals.bronze,last=career.history.at(-1);if(g===0&&s===0&&b===0)return'你至今还没有站上过领奖台。';if(g===0)return`你还没拿过冠军，但已经有${s}次亚军、${b}次季军。`;if(last?.place===1)return`你带着${g}冠进入这一届，而且上一届刚刚夺冠。`;return`你目前已经拿到${g}个冠军、${s}次亚军、${b}次季军。`}
function matchupSentence(a,b){const size=(b.h||195)-(a.h||195),spd=(a.a.speed||80)-(b.a.speed||80),str=(a.a.strength||80)-(b.a.strength||80),shoot=(a.a.three||80)-(b.a.perimeter||80);if(size>12&&str<-8)return`${b.name}明显更大更重，你必须把他拉出禁区，否则低位会很难受。`;if(size<-10&&spd>8)return`你的速度优势很明显，最好的办法是让${b.name}不断横移，而不是跟他比力量。`;if(shoot>8)return`你的外线正好打到他的防守薄弱处，三分会成为这一场最直接的试探。`;if((a.a.strength||80)-(b.a.strength||80)>10)return`你在力量上占优，背身和强突可以反复测试他的对抗。`;return`这不是一个一眼能看出克制关系的对位，比赛更可能被关键球和当日手感决定。`}
function pregameDialogue(opp,roundName){const h=h2hFor(opp.id),v=getVoice(opp),op=getPersonality(opp),pp=playerPersonaCategory(player),r=RNG(`${career.seed}|DIALOGUE|PRE|${career.edition}|${opp.id}|${h.meetings}`);let memory;if(!h.meetings)memory=v.first;else if(h.meetings===1)memory=h.lastResult==='win'?`上次${h.lastAge}岁那一场，你赢了我。${v.hook}——今天我会从这里重新开始。`:h.lastResult==='loss'?`上次${h.lastAge}岁在${h.lastRound}，是我送你回家的。你应该还记得最后那个比分。`:`上一次我们都没能正常打完。今天最好让篮球自己决定。`;else{const lead=h.wins-h.losses;memory=`我们已经碰过${h.meetings}次，你${h.wins}胜${h.losses}负。${lead>0?'现在是你领先，但这反而让我更想把下一场拿回来。':lead<0?'你还欠着几场账，今天又多一次机会。':'打成这样还分不出高低，那就继续。'}`}
  let record;if(career.medals.gold===0)record=r()<.5?'我知道你还没有冠军。没有冠军的人最危险，因为他们什么都敢赌。':'你还没站到最高处，所以别拿过去吓我。';else if(career.history.at(-1)?.place===1)record=`卫冕冠军来了。${career.medals.gold}冠听起来不错，但今天的比分从0:0开始。`;else record=`${career.medals.gold}个冠军会让人记住你，也会让每个人打你时更认真。`;
  const userOpen=pick(r,pp.playerOpen);const second=r()<.5?`我会${v.hook}。你最好在前几个回合就找到答案。`:`我最想看的就是你的${v.focus}能不能经得住这场。`;
  return `<p>${career.age}岁，第${career.edition}届，${roundName}。${careerStatusSentence()} ${matchupSentence(player,opp)}</p><div class="dialogue"><div class="speaker">${opp.name}</div><p>“${memory}”</p><p>“${record} ${second}”</p></div><div class="dialogue"><div class="speaker">#${player.number} ${player.name}</div><p>“${userOpen}”</p></div>${h.meetings>=3?`<p>场边已经有人把这场叫成你们这条时间线里的第${h.meetings+1}章。你们不需要重新认识彼此，真正需要确认的只是：这次谁会先改变打法。</p>`:''}`}
function postgameDialogue(opp,res,roundName,priorH){const v=getVoice(opp),pp=playerPersonaCategory(player),r=RNG(`${career.seed}|DIALOGUE|POST|${career.edition}|${opp.id}|${priorH.meetings}|${res.status}`);if(res.status==='dq_both')return `<div class="dialogue"><div class="speaker">裁判与场边工作人员</div><p>“够了。两个人都出去。这场不再继续。”</p></div><p>你们没有留下胜负，只留下了一场会被之后每次重逢反复提起的冲突。</p>`;if(res.status==='season_injury')return `<div class="dialogue"><div class="speaker">场边</div><p>“别动，先看脚踝。”</p></div><p>比分被伤病截断。对手没有庆祝太久，因为所有人都知道这一年已经换了主题。</p>`;const win=res.winner?.id===player.id;let oppLine;if(win){if(priorH.meetings>=2&&priorH.losses>priorH.wins)oppLine=`“又是你。现在对阵记录越来越难看了。下次我不会按今天的方式防。”`;else if(career.medals.gold===0)oppLine=`“你还没有冠军，但这一场看起来不像没拿过冠军的人。${v.respect}”`;else oppLine=`“今天你把冠军履历打出了样子。${v.respect}”`}else{if(priorH.meetings>=2&&priorH.wins>priorH.losses)oppLine=`“终于轮到我把一场拿回来。别装作你没记得前面那些。”`;else if(career.medals.gold>0)oppLine=`“${career.medals.gold}冠也不能替你把今天这场赢下来。下一届再带着履历来。”`;else oppLine=`“你还在找第一个冠军，今天我没打算帮你。${v.hook}，这就是答案。”`}
  const userLine=pick(r,win?pp.playerWin:pp.playerLose);return `<div class="dialogue"><div class="speaker">${opp.name}</div><p>${oppLine}</p></div><div class="dialogue"><div class="speaker">${player.name}</div><p>“${userLine}”</p></div><p>${win?'你往下一轮走。对话没有真正结束，它只是被下一次抽签暂时按下暂停。':'你的这一届到这里停下，但在固定16人的世界里，只要双方都还参赛，这个人以后仍可能再次站到你面前。'}</p>`}

function newCareerSeed(shared){return shared?.trim()||uid('STREET')}
function currentPlayerCode(){return player?encodeCode(playerCodePayload(player),'SK5'):''}
function copyText(txt){navigator.clipboard?.writeText(txt).then(()=>toast('已复制')).catch(()=>{const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('已复制')})}

'use strict';
/* Street King V5.3 rules patch. Loaded after the stable V5.2.1 scripts. */
const V53_BUILD_KEYS=ATTR_KEYS.filter(k=>k!=='passing');
const V53_BUILD_BUDGET=36;
const V53_BUILD='V5.3-20260819-0946';

function v53EnsureCareer(){
  if(!career)return;
  career.gameMode=career.gameMode||'1v1';
  career.totalEditions=career.totalEditions||15;
  career.insight=Number.isFinite(career.insight)?career.insight:0;
  career.awakened=!!career.awakened;
  career.awakenedAge=career.awakenedAge||null;
  career.mentorLevels=career.mentorLevels||{};
  career.currentMentor=career.currentMentor||null;
  career.insightHistory=career.insightHistory||[];
  career.offseasonLog=career.offseasonLog||[];
  career.specialCounts=career.specialCounts||{zazaFoot:{},draymondClash:0,events:{}};
  career.specialCounts.zazaFoot=career.specialCounts.zazaFoot||{};
  career.specialCounts.events=career.specialCounts.events||{};
  career.selectedStrategy=career.selectedStrategy||'balanced';
}

skillCostFromBuild=function(build){return V53_BUILD_KEYS.reduce((s,k)=>s+(+build[k]?.tier||0),0)};
streetOVR=function(p){const a=p.a,w={finish:1.08,dunk:.78,mid:.98,three:1.06,handle:.90,perimeter:.86,interior:.64,rebound:.50,strength:.66,speed:.94,clutch:.78};let s=0,d=0;for(const k of V53_BUILD_KEYS){s+=(a[k]||70)*w[k];d+=w[k]}return s/d};
makePlayerFromBuild=function({name,number,pos,h,w,personality,build}){const a={},templates={};for(const k of V53_BUILD_KEYS){const tier=+build[k].tier;a[k]=TIER_VALUE[tier];templates[k]=build[k].template}const autoPass={PG:88,SG:82,SF:79,PF:75,C:73}[pos]||78;a.passing=clamp(Math.round(a.handle*.38+autoPass*.62),68,92);templates.passing='自动派生';const seed=`${name}|${number}|${pos}|${h}|${w}|${personality}|${JSON.stringify(templates)}`;return{id:'custom-'+hash32(seed).toString(36),name,number:+number,pos,h:+h,w:+w,personality,a,baseA:deepClone(a),style:{three:0,mid:0,drive:0,post:0},templates,mentorHistory:[],createdAt:Date.now()}};
resetBuilder=function(blankName=true){buildSelections={};for(const k of V53_BUILD_KEYS){const names=SKILLS[k].tiers[3];buildSelections[k]={tier:3,template:names[0]}}if(blankName){$('pName').value='';$('pNumber').value=''}else if(player){$('pName').value=player.name||'';$('pNumber').value=player.number??'';$('pPos').value=player.pos||'PG';$('pHeight').value=String(player.h||195);$('pWeight').value=String(player.w||95);$('pPersonality').value=player.personality||'duncan'}renderSkillBuilder();renderPersonality();renderBuildPreview()};
renderSkillBuilder=function(){const box=$('skillBuilder');box.innerHTML='';for(const k of V53_BUILD_KEYS){const s=SKILLS[k],sel=buildSelections[k];const div=document.createElement('div');div.className='skill-card';div.innerHTML=`<div class="skill-top"><div class="skill-name"><b>${s.label}</b><small>${s.desc}</small></div><select class="template-select" data-k="${k}"></select><div class="tier-score">${sel.tier}</div></div><div class="tier-options">${[1,2,3,4,5].map(t=>`<button class="tier-btn ${t===sel.tier?'active':''}" data-k="${k}" data-tier="${t}">${t}分</button>`).join('')}</div><div class="template-names">${s.tiers[sel.tier].join(' · ')}</div>`;box.appendChild(div);const select=div.querySelector('.template-select');select.innerHTML=s.tiers[sel.tier].map(n=>`<option>${n}</option>`).join('');select.value=sel.template;select.onchange=e=>{buildSelections[k].template=e.target.value;renderBuildPreview()}}box.querySelectorAll('.tier-btn').forEach(b=>b.onclick=()=>{const k=b.dataset.k,t=+b.dataset.tier;buildSelections[k]={tier:t,template:SKILLS[k].tiers[t][0]};renderSkillBuilder();renderBuildPreview()});updateBudget()};
updateBudget=function(){const used=skillCostFromBuild(buildSelections);$('budgetText').textContent=`${used} / ${V53_BUILD_BUDGET}`;$('budgetText').style.color=used>V53_BUILD_BUDGET?'var(--red)':'var(--text)';$('budgetFill').style.width=`${Math.min(100,used/V53_BUILD_BUDGET*100)}%`;return used};
renderBuildPreview=function(){const used=updateBudget(),draft=buildDraft();if(!draft){$('buildPreview').innerHTML='<b>构建预览</b><p class="muted">先填写姓名和0–99号球衣号码。</p>';return}const comp=similarTemplates(draft);$('buildPreview').innerHTML=`<div class="title-row"><div><b>#${draft.number} ${draft.name}</b><div class="muted">${draft.pos} · ${draft.h}cm / ${draft.w}kg</div></div><b style="font-size:24px;color:var(--gold)">${streetOVR(draft).toFixed(1)}</b></div><div class="attr-grid" style="margin-top:10px">${V53_BUILD_KEYS.map(k=>`<div class="attr-chip">${ATTR_LABEL[k]}<b>${Math.round(draft.a[k])}</b></div>`).join('')}</div><div class="template-compare">当前粗略上下限模板：<b>${comp.floor.name}</b> ← 你 → <b>${comp.ceiling.name}</b><br><span class="muted">组织不再作为可选能力；3V3中的传球阅读由位置与控球自动派生。</span></div>${used>V53_BUILD_BUDGET?'<p style="color:var(--red)">预算超限，无法锁定。</p>':''}`};
lockBuild=function(){const used=updateBudget(),draft=buildDraft();if(!draft){toast('姓名和球衣号码必须填写');return}if(used>V53_BUILD_BUDGET){toast('天赋预算超限');return}player=draft;localStorage.setItem(BUILD_KEY,JSON.stringify(player));if(pendingMode==='multi'){renderMulti();showScreen('multi');return}const seed=newCareerSeed();initCareer('solo',seed);career.gameMode='1v1';career.totalEditions=15;v53EnsureCareer();saveCareer();renderField();showScreen('field')};

const v53BaseSelectFixedField=selectFixedField;
selectFixedField=function(self,friend,seed){const field=v53BaseSelectFixedField(self,friend,seed),z=NBA_POOL.find(x=>x.id==='zaza'),r=RNG(seed+'|V53-ZAZA');if(z&&!field.some(x=>x.id==='zaza')&&r()<.72){let idx=field.length-1;while(idx>0&&(field[idx].id===self.id||field[idx].id===friend?.id))idx--;field[idx]=z}return [...new Map(field.map(x=>[x.id,x])).values()].slice(0,16)};

const v53BaseInitCareer=initCareer;
initCareer=function(mode,seed){v53BaseInitCareer(mode,seed);v53EnsureCareer();career.gameMode='1v1';career.totalEditions=15;saveCareer()};
const v53BaseLoadSaved=loadSaved;
loadSaved=function(){const ok=v53BaseLoadSaved();if(ok)v53EnsureCareer();return ok};
function v53InjectMultiOptions(){if($('v53MultiOptions'))return;const start=$('startMultiBtn');if(!start)return;const card=document.createElement('div');card.id='v53MultiOptions';card.className='card';card.innerHTML=`<h3>对战赛制</h3><div class="v53-grid2"><div><label>模式</label><select id="multiGameMode"><option value="1v1">1V1 街头单挑</option><option value="3v3">3V3 随机队友</option></select></div><div><label>生涯长度</label><select id="multiLength"><option value="15">正常 · 15届</option><option value="3">快速 · 3届</option></select></div></div><p id="multiModeHint" class="muted">1V1可选择快速3届或正常15届。</p>`;start.parentNode.insertBefore(card,start);const mode=$('multiGameMode'),len=$('multiLength'),hint=$('multiModeHint');mode.onchange=()=>{if(mode.value==='3v3'){len.value='3';len.disabled=true;hint.textContent='3V3固定进行3届。每场双方都会从球员池各抽两名队友。'}else{len.disabled=false;hint.textContent='1V1可选择快速3届或正常15届。'}}}
startMulti=function(){if(!player){toast('先创建自己的球员');return}if(!friendPlayer){toast('先导入朋友角色');return}const shared=$('sharedSeed').value.trim();if(!shared){toast('需要共同赛事码');return}const gm=$('multiGameMode')?.value||'1v1',total=gm==='3v3'?3:+($('multiLength')?.value||15);const canonical=shared+'|'+[currentPlayerCode(),encodeCode(playerCodePayload(friendPlayer),'SK5')].sort().join('|')+'|'+gm+'|'+total;initCareer('multi',canonical);career.gameMode=gm;career.totalEditions=total;v53EnsureCareer();saveCareer();renderField();showScreen('field')};

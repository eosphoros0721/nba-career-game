'use strict';
(function(){
  var BUILD='20260819-1029';
  function safeBaseBoot(){
    try{
      var h=document.getElementById('pHeight');
      if(h && h.options && h.options.length===0 && typeof populateBuilder==='function') populateBuilder();
    }catch(e){console.error('builder boot',e)}
    try{if(typeof wireUI==='function') wireUI()}catch(e){console.error('wireUI boot',e)}
    try{if(typeof renderMenu==='function') renderMenu()}catch(e){console.error('menu boot',e)}
    document.documentElement.dataset.skReady='541-base';
  }
  function normalizeV54(){
    try{
      if(typeof v54Ensure==='function'){v54Ensure();if(typeof saveCareer==='function'&&typeof career!=='undefined'&&career)saveCareer()}
      var sel=document.getElementById('multiLength');
      if(sel){
        for(var i=0;i<sel.options.length;i++){
          if(sel.options[i].value==='15'){sel.options[i].value='10';sel.options[i].textContent='正常 · 10届'}
        }
        if(sel.value==='15')sel.value='10';
      }
      var hint=document.getElementById('multiModeHint');
      var gm=document.getElementById('multiGameMode');
      if(hint&&(!gm||gm.value==='1v1'))hint.textContent='1V1可选择快速3届或正常10届。';
      if(typeof wireUI==='function')wireUI();
      document.documentElement.dataset.skReady='541-v54';
    }catch(e){console.error('V5.4 normalize',e)}
  }
  function loadV54(){
    var s=document.createElement('script');
    s.src='v54.js?b='+BUILD;
    s.async=true;
    s.onload=function(){normalizeV54()};
    s.onerror=function(){
      console.error('V5.4 rules failed to load; stable base kept active');
      document.documentElement.dataset.skReady='541-fallback';
      var t=document.getElementById('toast');
      if(t){t.textContent='高级规则加载失败，但基础菜单仍可正常使用';t.classList.remove('hidden');setTimeout(function(){t.classList.add('hidden')},2600)}
    };
    document.body.appendChild(s);
  }
  function boot(){safeBaseBoot();setTimeout(loadV54,50)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

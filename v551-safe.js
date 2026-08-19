'use strict';
(function(){
  var BUILD='20260819-1048';
  function safeBaseBoot(){
    try{
      var h=document.getElementById('pHeight');
      if(h && h.options && h.options.length===0 && typeof populateBuilder==='function') populateBuilder();
    }catch(e){console.error('builder boot',e)}
    try{if(typeof wireUI==='function') wireUI()}catch(e){console.error('wireUI boot',e)}
    try{if(typeof renderMenu==='function') renderMenu()}catch(e){console.error('menu boot',e)}
    document.documentElement.dataset.skReady='55-base';
  }
  function loadStyle(){
    if(document.getElementById('v55Style'))return;
    var l=document.createElement('link');l.id='v55Style';l.rel='stylesheet';l.href='v55.css?b='+BUILD;document.head.appendChild(l);
  }
  function loadScript(src,onload){
    var s=document.createElement('script');
    s.src=src+'?b='+BUILD;
    s.async=true;
    s.onload=onload||function(){};
    s.onerror=function(){console.error('optional rules failed:',src);document.documentElement.dataset.skReady='55-fallback'};
    document.body.appendChild(s);
  }
  function load55(){
    loadStyle();
    loadScript('v55-1.js',function(){
      loadScript('v55-2.js',function(){
        loadScript('v55-3.js',function(){
          try{
            if(typeof v55NormalizeUI==='function'){v55NormalizeUI();setTimeout(v55NormalizeUI,5300)}
            if(typeof wireUI==='function')wireUI();
            if(typeof renderMenu==='function')renderMenu();
            document.documentElement.dataset.skReady='55-ready';
          }catch(e){console.error('V5.5 normalize',e);document.documentElement.dataset.skReady='55-base'}
        });
      });
    });
  }
  function bootAdvanced(){
    loadScript('v54.js',function(){document.documentElement.dataset.skReady='55-v54';load55()});
  }
  function boot(){safeBaseBoot();setTimeout(bootAdvanced,60)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

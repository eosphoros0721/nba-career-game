'use strict';
(function(){
  var BUILD='20260819-1118';
  function safeBaseBoot(){
    try{var h=document.getElementById('pHeight');if(h&&h.options&&h.options.length===0&&typeof populateBuilder==='function')populateBuilder()}catch(e){console.error('builder boot',e)}
    try{if(typeof wireUI==='function')wireUI()}catch(e){console.error('wireUI boot',e)}
    try{if(typeof renderMenu==='function')renderMenu()}catch(e){console.error('menu boot',e)}
    document.documentElement.dataset.skReady='56-base';
  }
  function loadScript(src,onload){var s=document.createElement('script');s.src=src+'?b='+BUILD;s.async=true;s.onload=onload||function(){};s.onerror=function(){console.error('optional rules failed:',src);document.documentElement.dataset.skReady='56-fallback'};document.body.appendChild(s)}
  function load55(){loadScript('v55-1.js',function(){loadScript('v55-2.js',function(){loadScript('v55-3.js',function(){loadScript('v56.js',function(){try{if(typeof v56NormalizeUI==='function')v56NormalizeUI();if(typeof wireUI==='function')wireUI();if(typeof renderMenu==='function')renderMenu();document.documentElement.dataset.skReady='56-ready'}catch(e){console.error('V5.6 normalize',e);document.documentElement.dataset.skReady='56-base'}})})})})}
  function bootAdvanced(){loadScript('v54.js',load55)}
  function boot(){safeBaseBoot();setTimeout(bootAdvanced,60)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

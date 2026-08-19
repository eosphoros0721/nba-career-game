'use strict';
/* Lightweight compatibility layer for mobile in-app WebViews such as Hupu. */
(function(){
  try{
    if(!Array.prototype.at){Object.defineProperty(Array.prototype,'at',{value:function(n){n=Math.trunc(n)||0;if(n<0)n+=this.length;if(n<0||n>=this.length)return undefined;return this[n]},configurable:true,writable:true})}
    if(!String.prototype.replaceAll){Object.defineProperty(String.prototype,'replaceAll',{value:function(a,b){return this.split(a).join(b)},configurable:true,writable:true})}
    if(!window.requestAnimationFrame)window.requestAnimationFrame=function(cb){return setTimeout(function(){cb(Date.now())},16)};
    if(!window.cancelAnimationFrame)window.cancelAnimationFrame=clearTimeout;
    document.documentElement.classList.add('mobile-webview-safe');
    var style=document.createElement('style');
    style.textContent='button,.menu-card,.choice-btn,.v53-strategy,.speed-btn,.skip-btn{touch-action:manipulation;-webkit-tap-highlight-color:transparent}input,select,textarea,button{font-size:16px}body{overscroll-behavior-y:contain}.app-shell{padding-bottom:max(12px,env(safe-area-inset-bottom))}';
    document.head.appendChild(style);
    window.addEventListener('error',function(e){document.documentElement.dataset.lastJsError=(e&&e.message)||'runtime-error'});
  }catch(e){console.error('Hupu compatibility layer',e)}
})();

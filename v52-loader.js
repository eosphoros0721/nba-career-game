'use strict';
(async()=>{
 try{
  const files=['v52-g1.txt','v52-g2.txt','v52-g3.txt'];
  const parts=await Promise.all(files.map(f=>fetch(f+'?b=20260818-2336',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(f+' '+r.status);return r.text()})));
  const b64=parts.join('').trim();
  const raw=atob(b64);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  if(typeof DecompressionStream==='undefined')throw new Error('浏览器不支持 DecompressionStream，请使用较新的 Safari/Chrome');
  const ds=new DecompressionStream('gzip');const code=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
  (0,eval)(code);
  if(document.readyState!=='loading'&&typeof initUI==='function')initUI();
 }catch(e){console.error(e);document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;left:10px;right:10px;bottom:10px;background:#411;color:#fff;padding:12px;border-radius:10px;z-index:9999">V5.2 加载失败：'+String(e.message||e)+'</div>')}
})();

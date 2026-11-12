const arena = document.querySelector('#arena');
const disc = document.querySelector('#disc');
const shadow = document.querySelector('#disc-shadow');
const basket = document.querySelector('#basket');
const dropzone = document.querySelector('#dropzone');
const input = document.querySelector('#file-input');
const auto = document.querySelector('#auto-throw');
const aim = document.querySelector('#aim-path');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let pos = {x:0,y:0}, drag = null, flying = false, count = 0, queue = [], toastTimer;
const target = () => ({x: arena.clientWidth / 2, y: 240});
const home = () => ({x:Math.max(65,arena.clientWidth*.18), y:arena.clientHeight-82});
function place(x,y,rotation=0,scale=1) {
  pos={x,y}; disc.style.transform=`translate(${x-48}px,${y-29}px) rotate(${rotation}deg) scale(${scale})`;
  shadow.style.transform=`translate(${x-40}px,${Math.min(arena.clientHeight-28,y+36)}px) scale(${scale})`;
}
function reset(){disc.style.opacity='1';disc.style.zIndex='5';shadow.style.opacity='1';place(home().x,home().y);flying=false;auto.disabled=false;disc.disabled=false;}
function toast(message){clearTimeout(toastTimer);const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),2800);}
function updateFile(){const file=queue[0];document.querySelector('#disc-label').textContent=file?(file.name.split('.').pop().slice(0,7).toUpperCase()||'FILE'):'DEMO';document.querySelector('#filename').textContent=file?`${file.name} · ${formatSize(file.size)}${queue.length>1?` · +${queue.length-1} weitere`:''}`:'Deine erste Runde? Wirf die Demo-Disc.';disc.setAttribute('aria-label',`${file?file.name:'Demo-Frisbee'} ziehen und zum Ziel werfen`);}
function formatSize(bytes){return bytes<1024?`${bytes} B`:bytes<1048576?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1048576).toFixed(1)} MB`;}
function selectFiles(files){if(!files.length)return;queue.push(...Array.from(files));updateFile();toast(`${files.length===1?'Datei bereit':'Dateien bereit'}. Zeit für deinen Wurf!`);}
dropzone.addEventListener('click',()=>input.click());input.addEventListener('change',()=>{selectFiles(input.files);input.value='';});
let depth=0;arena.addEventListener('dragenter',e=>{e.preventDefault();depth++;dropzone.classList.add('over');});arena.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});arena.addEventListener('dragleave',()=>{if(--depth<=0)dropzone.classList.remove('over');});arena.addEventListener('drop',e=>{e.preventDefault();depth=0;dropzone.classList.remove('over');selectFiles(e.dataTransfer.files);});
function local(e){const r=arena.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
disc.addEventListener('pointerdown',e=>{if(flying||e.button!==0)return;const p=local(e);drag={offsetX:p.x-pos.x,offsetY:p.y-pos.y,samples:[{...p,t:performance.now()}]};disc.setPointerCapture(e.pointerId);document.querySelector('#launch-label').style.opacity='0';});
disc.addEventListener('pointermove',e=>{if(!drag)return;const p=local(e);place(Math.max(35,Math.min(arena.clientWidth-35,p.x-drag.offsetX)),Math.max(25,Math.min(arena.clientHeight-25,p.y-drag.offsetY)),-8);drag.samples.push({...p,t:performance.now()});drag.samples=drag.samples.filter(s=>performance.now()-s.t<130);const t=target();aim.setAttribute('d',`M${pos.x} ${pos.y} Q${pos.x} ${Math.min(pos.y,t.y)-100} ${t.x} ${t.y}`);});
disc.addEventListener('pointerup',e=>{if(!drag)return;const p=local(e),last=drag.samples[0],elapsed=Math.max(16,performance.now()-last.t);let vx=(p.x-last.x)/elapsed,vy=(p.y-last.y)/elapsed;drag=null;aim.setAttribute('d','');const t=target();if(Math.hypot(pos.x-t.x,pos.y-t.y)<64){fly(t,true);return;}if(Math.hypot(vx,vy)<.13){toast('Ziehe die Disc mit Schwung in Richtung Ziel.');reset();return;}const duration=400;let end={x:pos.x+vx*duration,y:pos.y+vy*duration};const dx=t.x-pos.x,dy=t.y-pos.y,dot=dx*vx+dy*vy,cross=Math.abs(dx*vy-dy*vx)/Math.max(.001,Math.hypot(vx,vy));const hit=dot>0&&cross<85&&Math.hypot(vx,vy)>.2;if(hit)end=t;fly(end,hit);});
disc.addEventListener('pointercancel',()=>{drag=null;aim.setAttribute('d','');reset();});
disc.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!flying){e.preventDefault();fly(target(),true);}});
auto.addEventListener('click',()=>{if(!flying)fly(target(),true);});
function celebrate(){basket.classList.remove('hit');void basket.getBoundingClientRect();basket.classList.add('hit');if(reduced)return;const t=target();for(let i=0;i<22;i++){const p=document.createElement('i');p.className='particle';p.style.left=`${t.x}px`;p.style.top=`${t.y}px`;p.style.background=['#db8558','#789275','#d7b475'][i%3];document.querySelector('#particles').append(p);const a=i/22*Math.PI*2,r=40+Math.random()*65;p.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r+30}px) rotate(${i*37}deg)`,opacity:0}],{duration:650+Math.random()*300,easing:'cubic-bezier(.1,.5,.3,1)'}).onfinish=()=>p.remove();}}
function fly(end,hit){flying=true;disc.disabled=true;auto.disabled=true;document.querySelector('#launch-label').style.opacity='0';const start={...pos},begin=performance.now(),duration=reduced?120:820;const control={x:start.x+(end.x-start.x)*.48,y:Math.min(start.y,end.y)-125};function frame(now){const p=Math.min(1,(now-begin)/duration),q=1-p;const x=q*q*start.x+2*q*p*control.x+p*p*end.x,y=q*q*start.y+2*q*p*control.y+p*p*end.y;place(x,y,reduced?0:p*680,1-p*.34);shadow.style.opacity=String(1-p*.8);if(p>.88&&hit)disc.style.opacity=String((1-p)/.12);if(p<1){requestAnimationFrame(frame);return;}if(hit){celebrate();if(queue.length){const file=queue.shift();count++;document.querySelector('#count').textContent=count;toast(`${file.name} gefangen!`);updateFile();}else toast('Nice shot! Jetzt mit deiner Datei.');}else toast('Knapp daneben. Noch ein Wurf?');setTimeout(reset,reduced?80:550);}requestAnimationFrame(frame);}
new ResizeObserver(()=>{if(!flying&&!drag)reset();}).observe(arena);reset();

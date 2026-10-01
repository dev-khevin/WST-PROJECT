// Add or edit your games here. Only id, url, n and category are required.
// Optional: d (description), e (emoji), c (two gradient colors like "#ff7a59,#c2255c")
const games = [
  { id: 1, url: "https://playaby.com/", n: "Playaby", category: "Arcade" },
  { id: 2, url: "https://playfun.games/", n: "Playfun Games", category: "Puzzle" },
  { id: 3, url: "https://bitigames.com/", n: "BitiGames", category: "Arcade" },
  { id: 4, url: "https://gamejadoo.com/", n: "GameJadoo", category: "Arcade" },
  { id: 5, url: "https://www.dropplay.games/en", n: "DropPlay", category: "Arcade" },
  { id: 6, url: "https://www.freeplayable.com/", n: "Freeplayable", category: "Action" },
  { id: 7, url: "https://gaminto.com/", n: "Gaminto", category: "Mixed" },
  { id: 8, url: "https://kiwigames.io/", n: "Kiwi Games", category: "Mixed" }
];
const ICONS={Arcade:"🕹️",Puzzle:"🧩",Action:"⚡",Mixed:"🎮"};
const COLORS=["#ff7a59,#c2255c","#4dabf7,#3b5bdb","#63e6be,#2b8a3e","#ffd43b,#e67700","#da77f2,#7048e8","#74c0fc,#1864ab","#ffa8a8,#c92a2a","#99e9f2,#0b7285"];
const G=games.map((g,i)=>({...g,t:g.category||g.t||"Games",e:g.e||ICONS[g.category]||"🎮",c:g.c||COLORS[i%COLORS.length],d:g.d||`Play ${g.n} in your browser.`}));
const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let favs=store.get('favs',[]),q='';
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),1800)}
function card(g){const on=favs.includes(g.id);
 return `<article class="card" style="background:linear-gradient(160deg,${g.c})" tabindex="0" data-open="${g.id}"><div class="em" aria-hidden="true">${g.e}</div>
 <div class="cap"><h3>${g.n}</h3><span>${g.t}</span><div class="acts"><button class="mini" data-play="${g.id}" aria-label="Play ${g.n}">▶</button>
 <button class="mini" data-fav="${g.id}" aria-pressed="${on}" aria-label="${on?'Remove from':'Add to'} favorites">${on?'♥':'♡'}</button></div></div></article>`}
function row(title,list,id){return `<section class="row"><h2>${title}</h2>${list.length?`<div class="rowwrap"><button class="arrow l" data-scroll="-1" aria-label="Scroll left">‹</button><div class="track">${list.map(card).join('')}</div><button class="arrow r" data-scroll="1" aria-label="Scroll right">›</button></div>`:'<p class="empty glass">Nothing here yet. Tap the heart on a game to add it.</p>'}</section>`}
function render(){
 const m=g=>(g.n+g.t+g.d).toLowerCase().includes(q);
 const all=G.filter(m);
 let h='';
 if(q){h+=row(`Results for “${q}”`,all)}
 else{h+=row('Trending now',G.slice(0,6));[...new Set(G.map(g=>g.t))].forEach(c=>{h+=row(c,G.filter(g=>g.t===c))})}
 $('#games').innerHTML=h;
 $('#favorites').innerHTML=row('Favorite',G.filter(g=>favs.includes(g.id)));
}
const FEAT=G.slice(0,5);let hi=0;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#stage').innerHTML=FEAT.map((g,i)=>`<button class="cf" data-cf="${i}" style="background:linear-gradient(160deg,${g.c})" aria-label="${g.n}"><span aria-hidden="true">${g.e}</span></button>`).join('');
function layout(){const n=FEAT.length,step=Math.min(58,Math.max(36,$('#stage').clientWidth/4.4));document.querySelectorAll('.cf').forEach((c,i)=>{
 const off=((i-hi+n+2)%n)-2,a=Math.abs(off);
 c.style.transform=`translate(-50%,-50%) translateX(${off*step}px) scale(${a===0?1.15:a===1?.9:.72})`;
 c.style.zIndex=10-a;c.style.opacity=a===2?.45:1;c.style.filter=a===0?'none':'brightness(.7)';
 c.setAttribute('aria-current',a===0)})}
function show(i,instant){
 hi=(i+FEAT.length)%FEAT.length;const g=FEAT[hi];
 const set=()=>{$('#heroName').textContent=g.n;$('#heroDesc').textContent=g.d;$('#heroType').textContent=g.t;
  $('#sqEmoji').textContent=g.e;$('#sq').style.background=`linear-gradient(160deg,${g.c})`;
  $('#tint').style.background=`linear-gradient(160deg,${g.c})`;$('.panel').classList.remove('swap')};
 layout();
 if(instant||reduce){set();return}
 $('.panel').classList.add('swap');setTimeout(set,300);
}
$('#cfPrev').onclick=()=>show(hi-1);$('#cfNext').onclick=()=>show(hi+1);
$('#stage').addEventListener('click',e=>{const c=e.target.closest('[data-cf]');if(!c)return;const i=+c.dataset.cf;i===hi?info(FEAT[hi]):show(i)});
$('#sq').onclick=()=>info(FEAT[hi]);
show(0,true);

const hdr=document.querySelector('header');
function sizeHeader(){document.documentElement.style.setProperty('--hh',hdr.offsetHeight+'px');layout()}
if('ResizeObserver' in window)new ResizeObserver(sizeHeader).observe(hdr);
addEventListener('resize',sizeHeader);addEventListener('orientationchange',sizeHeader);
let sx=null;const stg=$('#stage');
stg.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
stg.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)show(hi+(dx<0?1:-1));sx=null});
sizeHeader();
let cur=null;
function playGame(g){
 if(!g.url){toast(g.n+' has no link yet');return}
 let u;try{u=new URL(g.url)}catch(e){toast('The link for '+g.n+' is not valid');return}
 if(u.protocol!=='https:'&&u.protocol!=='http:'){toast('The link for '+g.n+' is not valid');return}
 window.open(u.href,'_blank','noopener');
}
function info(g){cur=g;$('#iName').textContent=g.e+' '+g.n;$('#iDesc').textContent=g.t+' · '+g.d;$('#info').showModal()}
document.addEventListener('click',e=>{
 const sc=e.target.closest('[data-scroll]');if(sc){const t=sc.parentElement.querySelector('.track');t.scrollBy({left:+sc.dataset.scroll*t.clientWidth*.8,behavior:'smooth'});return}
 const f=e.target.closest('[data-fav]'),p=e.target.closest('[data-play]'),o=e.target.closest('[data-open]');
 if(f){const id=+f.dataset.fav,g=G.find(x=>x.id===id);if(favs.includes(id)){favs=favs.filter(x=>x!==id);toast('Removed '+g.n)}else{favs.push(id);toast('Added '+g.n+' to Favorite')}store.set('favs',favs);render();return}
 if(p){playGame(G.find(x=>x.id===+p.dataset.play));return}
 if(o)info(G.find(x=>x.id===+o.dataset.open));
});
$('#heroPlay').onclick=()=>playGame(FEAT[hi]);
$('#heroInfo').onclick=()=>info(FEAT[hi]);
$('#iPlay').onclick=()=>{if(cur)playGame(cur)};
$('#iClose').onclick=()=>$('#info').close();
$('#q').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();render();if(q)location.hash='#games'});
$('#openSettings').onclick=()=>$('#settings').showModal();
$('#closeSettings').onclick=()=>$('#settings').close();
const th=store.get('theme',null);
if(th){document.documentElement.setAttribute('data-theme',th);$('#theme').value=th}
$('#theme').onchange=e=>{document.documentElement.setAttribute('data-theme',e.target.value);store.set('theme',e.target.value)};
render();

const DB_URL="https://fram-and-go-default-rtdb.asia-southeast1.firebasedatabase.app";
firebase.initializeApp({databaseURL:DB_URL});
const db=firebase.database();
if(!(window.name||'').startsWith('nexa:') && !location.href.includes('index.html'))
  location.href='index.html';
const ROLE=(window.name||'').startsWith('nexa:mod:')?'mod':'admin';
function isMod(){return ROLE==='mod';}
function myId(){return (window.name||'').split(':')[2]||'';}
const QDEV=new URLSearchParams(location.search).get('c')||'';
const ONLINE_MS=90000;
let HIDDEN={};
db.ref('settings/hidden').on('value',s=>{HIDDEN=s.val()||{};});
async function hideDev(id){await db.ref('settings/hidden/'+id).set(true);}
async function unhideDev(id){await db.ref('settings/hidden/'+id).remove();}
function devQS(){return QDEV?('?c='+encodeURIComponent(QDEV)):'';}
// shared head: viewport + brand style
(function(){if(!document.querySelector('meta[name=viewport]')){const m=document.createElement('meta');m.name='viewport';m.content='width=device-width,initial-scale=1';document.head.appendChild(m);}
const f0=document.createElement('link');f0.rel='preconnect';f0.href='https://fonts.googleapis.com';
const f1=document.createElement('link');f1.rel='stylesheet';f1.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap';
document.head.append(f0,f1);
const st=document.createElement('style');st.textContent=`body{font-family:'Inter',system-ui,sans-serif;font-size:13.5px;background:#070b16!important;background-image:radial-gradient(600px 300px at 15% -5%,rgba(52,211,153,.12),transparent),radial-gradient(700px 350px at 90% 0%,rgba(99,102,241,.16),transparent),radial-gradient(500px 400px at 50% 110%,rgba(34,211,238,.08),transparent)!important;background-attachment:fixed}
h1{font-size:21px!important}
.hero{background:linear-gradient(120deg,rgba(52,211,153,.14),rgba(34,211,238,.07) 45%,rgba(167,139,250,.12));border:1px solid rgba(52,211,153,.25)}
.drow{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:10px;font-size:12.5px}
.drow:hover{background:rgba(255,255,255,.06)}
.tl-item{padding-top:6px!important;padding-bottom:6px!important;font-size:12.5px!important}
h1,h2,.font-black{font-family:'Sora','Inter',sans-serif;letter-spacing:-.02em}.num{font-family:'Space Grotesk','Sora',sans-serif;font-variant-numeric:tabular-nums}
.glass{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);box-shadow:0 12px 32px rgba(0,0,0,.3);backdrop-filter:blur(12px);border-radius:20px}
.chip{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;flex-shrink:0}
.chip svg{width:16px;height:16px}
#side{background:rgba(13,21,38,.75)!important;backdrop-filter:blur(16px);border-radius:0 24px 24px 0;margin:12px 0 12px 0;min-height:calc(100vh - 24px)!important}
.bg-\\[\\#111c33\\]{background:rgba(255,255,255,.04)!important;border:1px solid rgba(255,255,255,.08)!important;box-shadow:0 10px 28px rgba(0,0,0,.3);border-radius:20px!important;backdrop-filter:blur(12px)}
main{animation:pagein .3s ease-out}@keyframes pagein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
button,a{transition:transform .12s ease,background .15s ease,box-shadow .15s ease}button:active{transform:scale(.96)}
.stat{transition:transform .18s ease,box-shadow .18s ease}.stat:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.4)}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:#334155;border-radius:8px}.brand-badge{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#34d399,#22d3ee);display:grid;place-items:center;box-shadow:0 4px 16px rgba(52,211,153,.4)}
.bg-\\[\\#111c33\\]{border:1px solid rgba(255,255,255,.07)!important;box-shadow:0 8px 24px rgba(0,0,0,.28)}
.side-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;font-size:13.5px;color:#cbd5e1}
.side-link:hover{background:rgba(255,255,255,.06);color:#fff}
.side-link.on{background:linear-gradient(135deg,#34d399,#22d3ee);color:#06281c;font-weight:800;box-shadow:0 6px 18px rgba(52,211,153,.35)}.skel{border-radius:16px;background:linear-gradient(100deg,#16213a 40%,#22345c 50%,#16213a 60%);background-size:200% 100%;animation:shim 1.2s infinite}@keyframes shim{to{background-position:-200% 0}}@media(max-width:768px){.stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.cols3{grid-template-columns:minmax(0,1fr)!important}}`;document.head.appendChild(st);})();
function showLoader(t){let l=document.getElementById('loader');if(!l){l=document.createElement('div');l.id='loader';l.className='fixed inset-0 z-[60] p-6';l.style.backgroundColor='#0b1220';document.body.appendChild(l);}l.style.display='block';l.innerHTML=`<div class="max-w-6xl mx-auto space-y-4 pt-10"><div class="skel h-8 w-64"></div><div class="grid grid-cols-4 gap-4"><div class="skel h-28"></div><div class="skel h-28"></div><div class="skel h-28"></div><div class="skel h-28"></div></div><div class="skel h-64"></div><div class="text-center text-xs opacity-50">${t||'Loading live data...'}</div></div>`;}
function timeAgo(ts){const s=Math.floor((Date.now()-ts)/1000);if(s<10)return'just now';if(s<60)return s+'s ago';const m=Math.floor(s/60);if(m<60)return m+' min ago';const h=Math.floor(m/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago';}
function emptyBox(t){return `<div class="text-center py-8 opacity-50"><div class="lottie" data-h="90"></div><div class="text-4xl mb-2">📭</div><div class="text-sm">${t}</div></div>`;}
// browser + OS (extension exact pathay, fallback: UA parse)
function parseUAfromEvent(e){const d=(e&&e.data)||{};if(d.browser)return (d.browser+(d.os?' • '+d.os:''));return parseUA(d.ua);}
function parseUA(ua){ua=ua||'';let b='Unknown',os='Unknown';
let m=ua.match(/Edg\/([\d.]+)/);if(m)b='Edge '+m[1].split('.')[0];
else if(m=ua.match(/OPR\/([\d.]+)/))b='Opera '+m[1].split('.')[0];
else if(m=ua.match(/Chrome\/([\d.]+)/))b='Chrome '+m[1].split('.')[0];
else if(m=ua.match(/Firefox\/([\d.]+)/))b='Firefox '+m[1].split('.')[0];
else if(/Safari/.test(ua))b='Safari';
if(b==='Unknown'&&/AppleWebKit/.test(ua))b='Chrome';
if(b==='Unknown'&&/Windows NT/.test(ua))b='Browser';
if(/Windows NT 10/.test(ua))os='Windows 10/11';else if(/Windows/.test(ua))os='Windows';
else if(/Android/.test(ua))os='Android';else if(/Mac OS/.test(ua))os='macOS';else if(/Linux/.test(ua))os='Linux';
return b+' • '+os;}
// Lottie animated icons (local assets/ — active after hosting; emoji fallback on file://)
const LOTTI={analytics:'assets/analytics.json'};
function lotties(){if(!window.lottie)return;document.querySelectorAll('.lottie').forEach(el=>{if(el.dataset.done||!el.dataset.src)return;el.dataset.done=1;try{lottie.loadAnimation({container:el,renderer:'svg',loop:true,autoplay:true,path:el.dataset.src});}catch(e){}});}
setInterval(lotties,3000);
(function(){const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';s.onload=lotties;document.head.appendChild(s);const l=document.createElement('script');l.src='https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';l.onload=()=>window.lucide&&lucide.createIcons();document.head.appendChild(l);setInterval(()=>{window.lucide&&lucide.createIcons();},2500);})();
function hideLoader(){const l=document.getElementById('loader');if(l)l.style.display='none';}
function connErr(){let l=document.getElementById('loader');if(!l)return;const slow=setTimeout(()=>{if(document.getElementById('loader').style.display!=='none')l.innerHTML='<div style="font-size:14px">⚠️ Connection slow — check internet...</div>';},8000);}
function nav(active){return `
<button onclick="document.getElementById('side').classList.toggle('hidden')" class="md:hidden fixed top-3 left-3 z-50 bg-slate-800 rounded-xl px-3 py-2">☰</button>
<aside id="side" class="hidden md:flex flex-col w-60 shrink-0 bg-[#0d1526] border-r border-white/5 p-4 min-h-screen">
<div class="flex items-center gap-2.5 px-1 py-2"><span class="brand-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" fill="#06281c"/></svg></span><div><div class="font-black leading-none text-[15px]">Nexa Monitor</div><div class="text-[9px] tracking-[.2em] opacity-50 mt-0.5">COMMAND CENTER <span id="plan_badge" class="text-emerald-300"></span></div></div></div>
${QDEV?`<button onclick="devicePicker(true)" class="w-full text-left mt-3 mb-1 text-xs bg-emerald-400/10 border border-emerald-400/25 text-emerald-200 rounded-xl px-3 py-2.5 flex items-center gap-1.5 hover:bg-emerald-400/20"><i data-lucide="monitor" class="w-3.5 h-3.5"></i><span class="truncate">${QDEV}</span><span class="opacity-60 ml-auto">⇄</span></button>`:`<div class="mt-3 mb-1 text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200 rounded-xl px-3 py-2 flex items-center gap-1.5"><i data-lucide="triangle-alert" class="w-3.5 h-3.5"></i>No device</div>`}
<div class="text-[10px] tracking-[.18em] opacity-40 px-3 pt-3 pb-1">MONITOR</div>
${(isMod()
?[['dashboard.html','layout-dashboard','Dashboard'],['timeline.html','history','Timeline'],['captures.html','image','Captures']]
:[['dashboard.html','layout-dashboard','Dashboard'],['live.html','radio-tower','Live View'],['timeline.html','history','Timeline'],['captures.html','image','Captures']]).map(([h,ic,t])=>`<a href="${h+devQS()}" class="side-link ${active===h?'on':''}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i>${t}</a>`).join('')}
${isMod()?'':`<div class="text-[10px] tracking-[.18em] opacity-40 px-3 pt-3 pb-1">MANAGE</div>`}
${(isMod()?[]:[['controls.html','settings-2','Controls'],['plans.html','crown','Plans'],['settings.html','sliders-horizontal','Settings']]).map(([h,ic,t])=>`<a href="${h+devQS()}" class="side-link ${active===h?'on':''}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i>${t}</a>`).join('')}
<div class="mt-auto pt-3"><div class="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-2xl p-3"><span class="w-9 h-9 rounded-full grid place-items-center font-black text-sm text-slate-950 shrink-0" style="background:linear-gradient(135deg,#34d399,#22d3ee)">${ROLE==='mod'?'M':'A'}</span><div class="min-w-0"><div class="text-xs font-bold truncate">${ROLE==='mod'?'Moderator':'Administrator'}</div><div class="text-[11px] opacity-50 truncate">${myId()||'admin'}</div></div><button onclick="window.name='';location.href='index.html'" title="Logout" class="ml-auto opacity-60 hover:opacity-100"><i data-lucide="log-out" class="w-4 h-4"></i></button></div></div></aside>`;}
async function getEvents(n=500){const s=await db.ref('events').limitToLast(n).once('value');return Object.values(s.val()||{}).sort((a,b)=>b.ts-a.ts);}
async function tgSend(text){try{const s=await db.ref('settings/telegram').once('value');const t=s.val();if(!t?.token||!t?.chat)return;await fetch(`https://api.telegram.org/bot${t.token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:t.chat,text})});}catch(e){}}
// watch alerts -> telegram
db.ref('events').limitToLast(1).on('child_added',s=>{const e=s.val();if(e&&(e.type==='keyword_alert'||e.type==='blocked'||e.type==='violation'||e.type==='inactive_alert'))tgSend(`⚠️ ${e.type}\n${e.clientId}\n${e.data?.keyword||e.data?.title||''}\n${e.data?.url||''}`);});
// theme (admin changeable): settings/theme {name}
const THEMES={midnight:{bg:'#0b1220',card:'#111c33',side:'#0d1526'},ocean:{bg:'#062033',card:'#0b2f4a',side:'#082a41'},forest:{bg:'#07180f',card:'#0d2b1d',side:'#0a2317'},grape:{bg:'#160b29',card:'#241243',side:'#1d0f38'}};
async function applyTheme(){try{const s=await db.ref('settings/theme').once('value');const t=THEMES[s.val()?.name||'midnight']||THEMES.midnight;
let st=document.getElementById('themecss');if(!st){st=document.createElement('style');st.id='themecss';document.head.appendChild(st);}
st.textContent=`body{background:${t.bg}!important}#side{background:${t.side}!important}.bg-\\[\\#111c33\\]{background-color:${t.card}!important}`;
window._theme=t;}catch(e){}}
applyTheme();
(async()=>{try{const s=await db.ref('settings/plan').once('value');const t=(s.val()||{tier:'free'}).tier;const b=document.getElementById('plan_badge');if(b)b.innerText='• '+t.toUpperCase();}catch(e){}})();
// profile dropdown (avatar top-right) — call profileBar() inside page header
function profileBar(){
  const av=(ROLE==='mod'?'M':'A');
  return `<div class="relative ml-auto"><button onclick="document.getElementById('pmenu').classList.toggle('hidden')" class="w-10 h-10 rounded-full grid place-items-center font-black text-slate-950" style="background:linear-gradient(135deg,#34d399,#22d3ee)">${av}</button>
  <div id="pmenu" class="hidden absolute right-0 mt-2 w-64 bg-[#111c33] border border-white/10 rounded-2xl p-4 space-y-2 z-50 shadow-2xl">
  <div><b>${ROLE==='mod'?'Moderator':'Administrator'}</b><div class="text-xs opacity-60">${myId()||'admin'}</div></div>
  <div class="text-[11px] uppercase tracking-widest opacity-40">Theme</div>
  <div class="flex flex-wrap gap-1.5">${Object.keys(THEMES).map(k=>`<button onclick="setThemeQuick('${k}')" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-2.5 py-1.5">${k}</button>`).join('')}</div>
  ${ROLE==='admin'?`<a href="settings.html${devQS()}" class="block text-sm bg-slate-800 hover:bg-slate-700 rounded-xl px-3 py-2">Manage team & login</a>`:''}
  <button onclick="window.name='';location.href='index.html'" class="w-full text-left text-sm text-red-300 hover:bg-white/5 rounded-xl px-3 py-2">Logout</button></div></div>`;
}
async function setThemeQuick(n){await db.ref('settings/theme').set({name:n});location.reload();}
// device picker popup: auto on entry when no ?c=, change on click
function devicePicker(force){
  if(QDEV && !force) return;
  let ov=document.getElementById('devpick');
  if(!ov){ov=document.createElement('div');ov.id='devpick';ov.className='fixed inset-0 z-50 grid place-items-center bg-black/70';document.body.appendChild(ov);}
  const base=location.pathname.split('/').pop().split('?')[0]||'dashboard.html';
  ov.innerHTML=`<div class="bg-[#111c33] border border-white/10 rounded-3xl p-6 w-[360px] max-w-[90vw]"><h2 class="text-lg font-black mb-1 flex items-center gap-2"><i data-lucide="monitor" class="w-5 h-5"></i>Select Device</h2><p class="text-xs opacity-50 mb-3">Which device do you want to monitor?</p><div id="devpick_list" class="space-y-2 max-h-[50vh] overflow-auto"><div class="text-sm opacity-50">Loading...</div></div>${QDEV?`<button onclick="document.getElementById('devpick').remove()" class="mt-3 text-xs opacity-60">✕ Close</button>`:''}</div>`;
  db.ref('events').limitToLast(500).once('value').then(s=>{
    const a=Object.values(s.val()||{});const m={};
    a.forEach(e=>{(m[e.clientId]||={last:0,info:null});m[e.clientId].last=Math.max(m[e.clientId].last,e.ts);if(e.type==='device_online'&&e.data)m[e.clientId].info=e.data;});
    const ids=Object.keys(m).filter(id=>!HIDDEN[id]);
    document.getElementById('devpick_list').innerHTML=ids.length?ids.map(id=>{
      const online=(Date.now()-m[id].last)<ONLINE_MS;
      return `<button onclick="location.href='${base}?c=${encodeURIComponent(id)}'" class="w-full text-left px-4 py-3 rounded-2xl bg-white/5 hover:bg-emerald-400 hover:text-slate-950 flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full ${online?'bg-emerald-400':'bg-red-500'}"></span><span><b>${id}</b><span class="block text-[11px] opacity-60">${parseUAfromEvent({data:m[id].info})}</span></span><span class="text-[11px] opacity-60 ml-auto">${online?'online':new Date(m[id].last).toLocaleTimeString()}</span></button>`;}).join(''):'<div class="text-sm opacity-50">No devices yet</div>';
  });
}
// offline alert: 5min+ silent device -> telegram (1h e 1bar per device)
async function offlineWatch(){
  try{
    const s=await db.ref('events').limitToLast(500).once('value');
    const a=Object.values(s.val()||{});const m={};
    a.forEach(e=>{(m[e.clientId]||={last:0});m[e.clientId].last=Math.max(m[e.clientId].last,e.ts);});
    for(const [id,v] of Object.entries(m)){
      if(Date.now()-v.last > 5*60*1000){
        const f=await db.ref('settings/offline_'+id).once('value');
        if(!f.val() || Date.now()-f.val()>60*60*1000){
          await tgSend(`🔴 Device OFFLINE: ${id}\nLast seen: ${new Date(v.last).toLocaleString()}`);
          await db.ref('settings/offline_'+id).set(Date.now());
        }
      } else await db.ref('settings/offline_'+id).remove().catch(()=>{});
    }
  }catch(e){}
}
// weekly auto-report: Sunday te summary telegram e
async function weeklyReport(){
  try{
    const n=new Date(); if(n.getDay()!==0) return;
    const key='weekly_'+n.getFullYear()+'_'+n.getWeek?.() || ('weekly_'+n.toDateString());
    const f=await db.ref('settings/'+key).once('value'); if(f.val()) return;
    const a=await getEvents(1000);
    const t=Math.round(a.filter(e=>e.type==='time_spent').reduce((x,e)=>x+(e.data.sec||0),0)/60);
    await tgSend(`📊 Weekly Report\nDevices: ${new Set(a.map(e=>e.clientId)).size}\nTime: ${t}m\nClicks: ${a.filter(e=>e.type==='click').length}\nSearches: ${a.filter(e=>e.type==='search_log').length}\nAlerts: ${a.filter(e=>e.type==='keyword_alert').length}`);
    await db.ref('settings/'+key).set(Date.now());
  }catch(e){}
}
// one-time onboarding tour (new admin) — floating popup
const TOUR=[
['monitor','Select device','After login, a device list popup appears. Select the device to monitor — every page will show that device data.'],
['history','Watch the timeline','See which tabs were opened, what was clicked and searched — streaming on a live tracking line.'],
['image','Screenshots','Photos arrive via auto-capture or the floating camera button. Click a file for full view.'],
['shield','Block & Lockdown','Block sites or turn on exam-mode Lockdown from Controls. The client sees a network-error style page.'],
['camera','Floating capture','The camera button on any page captures the selected device in one click.']];
async function maybeTour(){
  try{
    const f=await db.ref('settings/onboarded').once('value'); if(f.val()) return;
    let i=0;
    const ov=document.createElement('div');ov.id='tour';ov.className='fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4';
    const paint=()=>{ov.innerHTML=`<div class="bg-[#111c33] border border-emerald-400/30 rounded-3xl p-6 w-[400px] max-w-[92vw]">
    <div class="flex items-center gap-3"><span class="w-11 h-11 rounded-2xl grid place-items-center bg-emerald-400/15 border border-emerald-400/30 text-emerald-300"><i data-lucide="${TOUR[i][0]}" class="w-5 h-5"></i></span><div><div class="text-[11px] opacity-50">Step ${i+1}/${TOUR.length} • New Admin Guide</div><b>${TOUR[i][1]}</b></div></div>
    <p class="text-sm opacity-70 my-4 leading-relaxed">${TOUR[i][2]}</p>
    <div class="flex gap-2"><button id="t_back" class="bg-slate-700 text-sm px-4 py-2 rounded-xl ${i===0?'invisible':''}">← Back</button><button id="t_next" class="bg-emerald-400 text-slate-950 text-sm font-bold px-4 py-2 rounded-xl ml-auto">${i===TOUR.length-1?'Start →':'Next →'}</button></div>
    <button id="t_skip" class="mt-3 text-xs opacity-50">Skip tour</button></div>`;
    if(window.lucide)lucide.createIcons();
    document.getElementById('t_back').onclick=()=>{if(i>0){i--;paint();}};
    const done=async()=>{ov.remove();await db.ref('settings/onboarded').set(Date.now());};
    document.getElementById('t_next').onclick=()=>{if(i<TOUR.length-1){i++;paint();}else done();};
    document.getElementById('t_skip').onclick=done;};
    document.body.appendChild(ov);paint();
  }catch(e){}
}
// shared header: title + PC select dropdown (only selected PC data everywhere)
function mountTopbar(title,icon){
  const host=document.getElementById('topbar');if(!host)return;
  const base=(location.pathname.split('/').pop()||'dashboard.html').split('?')[0];
  host.innerHTML=`<div class="flex flex-wrap items-center gap-2 py-3 mb-4">
  <h1 class="text-xl md:text-2xl font-black flex items-center gap-2"><i data-lucide="${icon||'layout-dashboard'}" class="w-6 h-6"></i>${title}</h1>
  <span class="flex items-center gap-1.5 text-[11px] bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>LIVE</span></div>`;
  if(window.lucide)lucide.createIcons();
}
window.addEventListener('load',()=>{devicePicker(false);fab();chatWidget();offlineWatch();weeklyReport();setInterval(offlineWatch,5*60*1000);});
// ---- support chat (floating, until master closes) ----
function chatKey(){return 'support/'+(myId()||'owner').replace(/[.#$\[\]]/g,'_');}
function chatWidget(){
  if(isMod()||!(window.name||'').startsWith('nexa:'))return;
  if(document.getElementById('chatw'))return;
  const w=document.createElement('div');w.id='chatw';w.className='fixed bottom-5 left-5 z-40';w.style.display='none';
  w.innerHTML=`<button id="chatbtn" onclick="chatToggle()" class="w-14 h-14 rounded-full grid place-items-center text-slate-950 shadow-2xl" style="background:linear-gradient(135deg,#34d399,#22d3ee)"><i data-lucide="message-circle" class="w-6 h-6"></i></button>
  <div id="chatbox" class="hidden mb-2 w-80 max-w-[85vw] bg-[#111c33] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"><div class="px-4 py-2.5 font-bold text-sm border-b border-white/5">Support Chat</div><div id="chatmsgs" class="h-64 overflow-auto p-3 space-y-2 text-sm"></div><div class="flex gap-2 p-2 border-t border-white/5"><input id="chat_in" placeholder="Type message..." class="flex-1 bg-black/30 rounded-lg px-2.5 py-2 text-sm outline-none"><button onclick="chatSend()" class="bg-emerald-400 text-slate-950 rounded-lg px-3 text-sm font-bold">Send</button></div></div>`;
  document.body.appendChild(w);
  if(window.lucide)lucide.createIcons();
  db.ref(chatKey()).on('value',s=>{
    const v=s.val();
    if(!v||!v.msgs){w.style.display='none';return;}
    if(v.closed){w.style.display='none';return;}
    w.style.display='';
    chatmsgs.innerHTML=Object.values(v.msgs).map(m=>`<div class="${m.by==='master'?'bg-white/5':'bg-emerald-400/15'} rounded-xl px-3 py-1.5"><div class="text-[10px] opacity-50">${m.by} • ${new Date(m.ts).toLocaleTimeString()}</div>${m.text}</div>`).join('');
    chatmsgs.scrollTop=chatmsgs.scrollHeight;
  });
}
function chatToggle(){document.getElementById('chatbox').classList.toggle('hidden');}
async function chatSend(){const t=document.getElementById('chat_in').value.trim();if(!t)return;document.getElementById('chat_in').value='';
await db.ref(chatKey()+'/msgs').push({by:myId()||'admin',text:t.replace(/</g,'&lt;'),ts:Date.now()});await db.ref(chatKey()+'/closed').remove();}
function openSupport(plan){db.ref(chatKey()).update({plan:plan||'',closed:null,ts:Date.now()});db.ref(chatKey()+'/msgs').push({by:myId()||'admin',text:'Hi, I want the '+(plan||'plan')+'. Please activate.',ts:Date.now()});setTimeout(()=>{const b=document.getElementById('chatbox');if(b)b.classList.remove('hidden');},600);}
// ---- anti-copy: devtools open hole black screen + no right-click ----
(function(){
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key))||(e.ctrlKey&&e.key==='U'))e.preventDefault();});
  setInterval(()=>{
    const open=Math.abs(window.outerWidth-window.innerWidth)>170||Math.abs(window.outerHeight-window.innerHeight)>170;
    let ov=document.getElementById('ncopy');
    if(open){if(!ov){ov=document.createElement('div');ov.id='ncopy';ov.style.cssText='position:fixed;inset:0;background:#000;z-index:99999';document.body.appendChild(ov);}}
    else if(ov)ov.remove();
  },1000);
})();
// floating capture button (admin only — mod view-only)
function fab(){
  if(isMod())return;
  if(document.getElementById('fab'))return;
  const d=document.createElement('div');d.id='fab';d.className='fixed bottom-5 right-5 z-40';
  d.innerHTML=`<button onclick="fabShot()" title="Capture Screen" class="w-14 h-14 rounded-full bg-emerald-400 text-slate-950 shadow-2xl grid place-items-center"><i data-lucide="camera" class="w-6 h-6"></i></button>`;
  document.body.appendChild(d);
}
function fabShot(){if(!QDEV)return alert('Select a device first');db.ref('commands/'+QDEV).push({cmd:'screenshot',ts:Date.now()});alert('Capture sent to '+QDEV);}

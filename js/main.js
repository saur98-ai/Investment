/* ═══════ AKSHAY MAHESHWARI — SHARED JS ═══════ */

// ── STARS ──
(function(){
  const stE=document.getElementById('stars');
  if(!stE)return;
  for(let i=0;i<60;i++){
    const s=document.createElement('div');
    s.className='star';
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;animation-delay:${Math.random()*3}s;width:${1+Math.random()*1.5}px;height:${1+Math.random()*1.5}px`;
    stE.appendChild(s);
  }
})();

// ── PARTICLES ──
document.querySelectorAll('.particles').forEach(p=>{
  const count=parseInt(p.dataset.particles||'6');
  for(let i=0;i<count;i++){
    const c=document.createElement('div');c.className='p-coin';
    c.style.cssText=`left:${5+Math.random()*90}%;bottom:0;--cd:${4+Math.random()*4}s;--cdelay:${Math.random()*5}s`;
    p.appendChild(c);
  }
});

// ── FORMAT ──
function fmt(n){if(n>=1e7)return'₹'+(n/1e7).toFixed(1)+' Cr';if(n>=1e5)return'₹'+(n/1e5).toFixed(1)+' L';if(n>=1e3)return'₹'+(n/1e3).toFixed(1)+'K';return'₹'+Math.round(n).toLocaleString('en-IN')}

// ── COUNTER ANIMATION ──
function animateCounter(el){
  if(el.dataset.animated)return;
  el.dataset.animated='1';
  const target=parseFloat(el.dataset.count);
  const prefix=el.dataset.prefix||'';
  const suffix=el.dataset.suffix||'';
  const dur=1200;const start=performance.now();
  function tick(now){
    const t=Math.min((now-start)/dur,1);
    const eased=1-Math.pow(1-t,3);
    const v=target*eased;
    el.textContent=prefix+(target<10?v.toFixed(0):Math.round(v))+suffix;
    if(t<1)requestAnimationFrame(tick);
    else el.textContent=prefix+target+suffix;
  }
  requestAnimationFrame(tick);
}

// ── NAV MOBILE TOGGLE ──
const ham=document.querySelector('.ham');
if(ham){
  ham.addEventListener('click',()=>{
    document.getElementById('nl').classList.toggle('open');
  });
}

// ── WEALTH COUNTER (story pages) ──
const wcV=document.getElementById('wc-v');
const wcF=document.getElementById('wc-fill');
const wcS=document.getElementById('wc-stage');
let lastWealth=0,maxWealth=0,maxStage='Start your journey';
function updateWealth(target,stageName){
  if(!wcV||target===lastWealth)return;
  const start=lastWealth;lastWealth=target;
  const dur=900;const t0=performance.now();
  function tick(now){
    const t=Math.min((now-t0)/dur,1);
    const eased=1-Math.pow(1-t,3);
    const v=start+(target-start)*eased;
    wcV.textContent=fmt(v);
    if(t<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  const pct=Math.min(target/50000000*100,100);
  if(wcF)wcF.style.width=pct+'%';
  if(wcS)wcS.textContent=stageName;
}

// ── TIMELINE RAIL CLICK ──
document.querySelectorAll('.r-dot').forEach(d=>{
  d.addEventListener('click',()=>{
    const sceneId=d.dataset.scene;
    if(sceneId){
      const el=document.getElementById(sceneId);
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// ── SCROLL HANDLER ──
const scenes=document.querySelectorAll('.scene');
const railDots=document.querySelectorAll('.r-dot');
const rail=document.getElementById('rail');
const wc=document.getElementById('wc');
const sp=document.getElementById('sp');
const mainNav=document.getElementById('mainNav');

function onScroll(){
  const st=window.scrollY,dH=document.documentElement.scrollHeight-window.innerHeight;
  if(sp)sp.style.width=(st/dH*100)+'%';
  if(mainNav)mainNav.classList.toggle('s',st>50);
  
  // Show rail/wealth counter only when past hero
  if(rail||wc){
    const showAids=st>window.innerHeight*.6;
    if(rail)rail.classList.toggle('on',showAids);
    if(wc)wc.classList.toggle('on',showAids);
  }
  
  let activeStage=0;
  scenes.forEach(s=>{
    const r=s.getBoundingClientRect();
    const inView=r.top<window.innerHeight*.75&&r.bottom>0;
    s.classList.toggle('in',inView);
    
    // Parallax
    const pBg=s.querySelector('.scene-bg[data-parallax]');
    if(pBg&&inView){
      const factor=parseFloat(pBg.dataset.parallax);
      const offset=(window.innerHeight/2-r.top-r.height/2)*factor;
      pBg.style.transform=`translateY(${-offset}px)`;
    }
    
    if(inView){
      s.querySelectorAll('[data-count]').forEach(animateCounter);
    }
    
    // Track active stage
    if(r.top<window.innerHeight*.5&&r.bottom>window.innerHeight*.5){
      const stage=parseInt(s.dataset.stage||'0');
      const wealth=parseFloat(s.dataset.wealth||'0');
      const stageName=s.dataset.stagename||'';
      if(stage>0)activeStage=stage;
      if(wealth>maxWealth){maxWealth=wealth;maxStage=stageName}
      if(maxWealth>0)updateWealth(maxWealth,maxStage);
    }
  });
  
  railDots.forEach((d,i)=>{
    const stage=i+1;
    d.classList.toggle('passed',activeStage>stage);
    d.classList.toggle('active',activeStage===stage);
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

// ── FORM SUBMIT FEEDBACK ──
document.querySelectorAll('.fbtn').forEach(btn=>{
  btn.addEventListener('click',function(e){
    e.preventDefault();
    this.textContent='✓ Sent!';
    this.style.background='#1E7A5A';
    setTimeout(()=>{this.textContent='Send Message →';this.style.background=''},3000);
  });
});

// ═══════ CALCULATORS ═══════
function syncNum(sliderId,numId){
  const s=document.getElementById(sliderId),n=document.getElementById(numId);
  if(!s||!n)return;
  n.value=s.value;
}
function syncSlider(numId,sliderId,calcFn){
  const n=document.getElementById(numId),s=document.getElementById(sliderId);
  if(!n||!s)return;
  let v=parseFloat(n.value);
  if(isNaN(v))return;
  v=Math.max(parseFloat(s.min),Math.min(parseFloat(s.max),v));
  s.value=v;n.value=v;
  calcFn();
}
function sT(id,el){
  document.querySelectorAll('.cp').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.ctb').forEach(t=>t.classList.remove('on'));
  document.getElementById('cp-'+id).classList.add('on');
  el.classList.add('on');
}
function fc(n){if(n>=1e7)return'₹'+(n/1e7).toFixed(2)+' Cr';if(n>=1e5)return'₹'+(n/1e5).toFixed(2)+' Lakhs';return'₹'+Math.round(n).toLocaleString('en-IN')}
function dn(c,a,b){
  const cv=document.getElementById(c);if(!cv)return;
  const dpr=window.devicePixelRatio||1,size=160;
  cv.width=size*dpr;cv.height=size*dpr;
  cv.style.width=size+'px';cv.style.height=size+'px';
  const x=cv.getContext('2d');
  x.scale(dpr,dpr);
  const cx=size/2,cy=size/2,r=60,lw=20;
  const t=a+b,an=(a/t)*2*Math.PI;
  x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+an);x.strokeStyle='#C9A84C';x.lineWidth=lw;x.stroke();
  x.beginPath();x.arc(cx,cy,r,-Math.PI/2+an,-Math.PI/2+2*Math.PI);x.strokeStyle='#2ECC8A';x.lineWidth=lw;x.stroke();
}
function cS(){
  if(!document.getElementById('r1'))return;
  ['r1','r2','r3'].forEach(id=>syncNum(id,'n'+id));
  const P=+document.getElementById('r1').value,r=+document.getElementById('r2').value/100/12,n=+document.getElementById('r3').value*12;
  const fv=P*(((Math.pow(1+r,n)-1)/r)*(1+r)),inv=P*n,ret=fv-inv;
  document.getElementById('v1').textContent=fc(P);
  document.getElementById('v2').textContent=document.getElementById('r2').value+'%';
  document.getElementById('v3').textContent=document.getElementById('r3').value;
  document.getElementById('i1').textContent=fc(inv);
  document.getElementById('e1').textContent=fc(ret);
  document.getElementById('t1').textContent=fc(fv);
  document.getElementById('p1').textContent=Math.round(ret/fv*100)+'%';
  dn('d1',inv,ret);
}
function cL(){
  if(!document.getElementById('l1'))return;
  ['l1','l2','l3'].forEach(id=>syncNum(id,'n'+id));
  const P=+document.getElementById('l1').value,r=+document.getElementById('l2').value/100,n=+document.getElementById('l3').value;
  const fv=P*Math.pow(1+r,n),ret=fv-P;
  document.getElementById('lv1').textContent=fc(P);
  document.getElementById('lv2').textContent=document.getElementById('l2').value+'%';
  document.getElementById('lv3').textContent=document.getElementById('l3').value;
  document.getElementById('li1').textContent=fc(P);
  document.getElementById('le1').textContent=fc(ret);
  document.getElementById('lt1').textContent=fc(fv);
  document.getElementById('p2').textContent=Math.round(ret/fv*100)+'%';
  dn('d2',P,ret);
}
function cG(){
  if(!document.getElementById('g1'))return;
  ['g1','g2','g3'].forEach(id=>syncNum(id,'n'+id));
  const T=+document.getElementById('g1').value,r=+document.getElementById('g2').value/100,n=+document.getElementById('g3').value,mr=r/12,mn=n*12;
  const sip=T/(((Math.pow(1+mr,mn)-1)/mr)*(1+mr)),ls=T/Math.pow(1+r,n);
  document.getElementById('gv1').textContent=fc(T);
  document.getElementById('gv2').textContent=document.getElementById('g2').value+'%';
  document.getElementById('gv3').textContent=document.getElementById('g3').value;
  document.getElementById('gs1').textContent=fc(sip);
  document.getElementById('gs2').textContent=fc(ls);
  document.getElementById('gs3').textContent=fc(sip*mn);
  document.getElementById('gs4').textContent=fc(T);
}
function cW(){
  if(!document.getElementById('w1'))return;
  ['w1','w2','w3','w4'].forEach(id=>syncNum(id,'n'+id));
  const C=+document.getElementById('w1').value,wd=+document.getElementById('w2').value,r=+document.getElementById('w3').value/100/12,n=+document.getElementById('w4').value*12;
  let b=C;for(let i=0;i<n;i++){b=b*(1+r)-wd;if(b<=0){b=0;break}}
  document.getElementById('wv1').textContent=fc(C);
  document.getElementById('wv2').textContent=fc(wd);
  document.getElementById('wv3').textContent=document.getElementById('w3').value+'%';
  document.getElementById('wv4').textContent=document.getElementById('w4').value;
  document.getElementById('ws1').textContent=fc(C);
  document.getElementById('ws2').textContent=fc(wd*n);
  document.getElementById('ws3').textContent=fc(b);
  const s=document.getElementById('ws4');
  if(s){
    if(b>0){s.textContent='✓ Corpus lasts the full period';s.style.color='#4ADE80'}
    else{s.textContent='⚠ May deplete early';s.style.color='#E05555'}
  }
}
// Init calculators if on calc page
if(document.getElementById('r1')){['r1','r2','r3'].forEach(id=>syncNum(id,'n'+id));cS();}
if(document.getElementById('l1')){['l1','l2','l3'].forEach(id=>syncNum(id,'n'+id));cL();}
if(document.getElementById('g1')){['g1','g2','g3'].forEach(id=>syncNum(id,'n'+id));cG();}
if(document.getElementById('w1')){['w1','w2','w3','w4'].forEach(id=>syncNum(id,'n'+id));cW();}

// ═══════ SEARCH ═══════
const SERVICES=[
  {name:'SIP & Mutual Funds',ico:'📈',url:'sip.html'},
  {name:'Stock Market',ico:'📊',url:'stock.html'},
  {name:'Insurance',ico:'🛡️',url:'insurance.html'},
  {name:'Tax Planning',ico:'💼',url:'tax.html'},
  {name:'Retirement',ico:'🌅',url:'retirement.html'},
  {name:'PMS',ico:'💎',url:'pms.html'},
  {name:'Private Equity',ico:'🚀',url:'private-equity.html'},
  {name:'Bonds',ico:'📜',url:'bonds.html'},
  {name:'Loan Against Security',ico:'🏦',url:'loan.html'},
  {name:'AIF',ico:'🏛️',url:'aif.html'},
  {name:'Unlisted Securities',ico:'📋',url:'unlisted.html'},
  {name:'Gift City',ico:'🌐',url:'gift-city.html'},
  {name:'International Equities',ico:'🌍',url:'international.html'},
  {name:'Will',ico:'📝',url:'will.html'},
  {name:'Trust',ico:'🔐',url:'trust.html'},
  {name:'Family Office',ico:'👑',url:'family-office.html'},
  {name:'Debt Financing',ico:'💰',url:'debt-financing.html'},
  {name:'Equity Financing',ico:'📐',url:'equity-financing.html'},
  {name:'Exit Planning',ico:'🚪',url:'exit-planning.html'},
  {name:'Succession Planning',ico:'🔄',url:'succession-planning.html'},
  {name:'Estate Planning',ico:'🏠',url:'estate-planning.html'},
  {name:'Elite Advisory',ico:'⭐',url:'elite.html'}
];
function openSearch(){
  const o=document.getElementById('srchOvl');if(!o)return;
  o.classList.add('open');
  const inp=document.getElementById('srchInp');if(inp){inp.value='';inp.focus();}
  doSearch('');
}
function closeSearch(){const o=document.getElementById('srchOvl');if(o)o.classList.remove('open');}
function doSearch(q){
  const res=document.getElementById('srchRes');if(!res)return;
  const term=q.trim().toLowerCase();
  const matches=term?SERVICES.filter(s=>s.name.toLowerCase().includes(term)):SERVICES;
  if(!matches.length){res.innerHTML='<div class="srch-empty">No services found</div>';return;}
  res.innerHTML=matches.map(s=>`<a class="srch-item" href="${s.url}"><span class="srch-item-ico">${s.ico}</span><span class="srch-item-name">${s.name}</span></a>`).join('');
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();});

// ═══════ DYNAMIC CONTENT (Decap CMS / JSON) ═══════

function _tc(t){
  const stars='★'.repeat(Math.max(1,Math.min(5,parseInt(t.stars)||5)));
  return`<div class="tc"><div class="tc-quote-mark">"</div><div class="tc-q">${t.quote}</div><div class="tc-a"><div class="tc-av">${t.initials}</div><div><div class="tc-n">${t.name}</div><div class="tc-r">${t.role}</div></div><div class="tc-stars">${stars}</div></div></div>`;
}

function applyContact(c){
  if(!c)return;
  // WhatsApp URL (update all wa.me links including FAB)
  const ph=(c.whatsapp||'919827599966').replace(/\D/g,'');
  const msg=encodeURIComponent(c.waMsg||'i am intereseted in your financial advice');
  const waUrl=`https://wa.me/${ph}?text=${msg}`;
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>a.href=waUrl);

  // Phone links — update href + visible text/value
  if(c.phone){
    const digits=c.phone.replace(/\D/g,'');
    const display='+91 '+c.phone;
    document.querySelectorAll('a[href^="tel:"]').forEach(a=>{
      a.href='tel:+91'+digits;
      const v=a.querySelector('[data-cv]');
      if(v)v.textContent=display;
      else if(!a.querySelector('div'))a.textContent='📱 '+display;
    });
  }

  // Email links
  if(c.email){
    document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{
      a.href='mailto:'+c.email;
      const v=a.querySelector('[data-cv]');
      if(v)v.textContent=c.email;
      else if(!a.querySelector('div'))a.textContent='📧 '+c.email;
    });
  }

  // Kotak link
  if(c.kotak)document.querySelectorAll('a[href*="kotaksecurities"]').forEach(a=>a.href=c.kotak);

  // Social links (targeted by data-social attribute)
  if(c.instagram)document.querySelectorAll('a[data-social="instagram"]').forEach(a=>a.href=c.instagram);
  if(c.linkedin)document.querySelectorAll('a[data-social="linkedin"]').forEach(a=>a.href=c.linkedin);
  if(c.facebook)document.querySelectorAll('a[data-social="facebook"]').forEach(a=>a.href=c.facebook);
}

async function loadDynamicContent(){
  // ── Contact info (runs on every page) ──
  try{
    const r=await fetch('/data/contact.json');
    if(r.ok)applyContact(await r.json());
  }catch(_){}

  // ── Testimonials (full grid on testimonials.html) ──
  const fullGrid=document.getElementById('testGrid');
  // ── Testimonials (featured on index.html) ──
  const featGrid=document.getElementById('testFeatured');

  if(fullGrid||featGrid){
    try{
      const r=await fetch('/data/testimonials.json');
      if(r.ok){
        const data=await r.json();
        const items=Array.isArray(data)?data:(data.items||[]);
        if(fullGrid){
          fullGrid.innerHTML=items.length
            ?items.map(_tc).join('')
            :'<p style="color:var(--t3);text-align:center;padding:40px 0;grid-column:1/-1">No testimonials yet.</p>';
        }
        if(featGrid){
          const featured=items.filter(t=>t.featured).slice(0,6);
          const shown=featured.length?featured:items.slice(0,3);
          featGrid.innerHTML=shown.length
            ?shown.map(_tc).join('')
            :'<p style="color:var(--t3);text-align:center;padding:40px 0;grid-column:1/-1">No testimonials yet.</p>';
        }
      }
    }catch(_){}
  }
}

loadDynamicContent();

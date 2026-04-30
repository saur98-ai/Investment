/* ═══ FEATURES.JS — akshayinvestment.netlify.app ═══ */

/* ══════════════════════════════════════════════════
   FEATURE 3 — COST OF WAITING COUNTER
══════════════════════════════════════════════════ */
(function(){
  var el=document.getElementById('cowNum');
  if(!el)return;
  // ₹13.4 Lakh difference per year → per second
  var perSec=1340000/(365.25*24*3600);
  var t0=performance.now();
  function tick(){
    var elapsed=(performance.now()-t0)/1000;
    el.textContent='₹'+(elapsed*perSec).toFixed(2);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ══════════════════════════════════════════════════
   FEATURE 2 — INFLATION THIEF CALCULATOR
══════════════════════════════════════════════════ */
(function(){
  var canvas=document.getElementById('infChart');
  if(!canvas)return;

  var infChart=null;

  function fmtInr(n){
    if(n>=1e7)return'₹'+(n/1e7).toFixed(2)+' Cr';
    if(n>=1e5)return'₹'+(n/1e5).toFixed(2)+' L';
    return'₹'+Math.round(n).toLocaleString('en-IN');
  }

  function buildData(amt,yrs,rate){
    var d=[];
    for(var y=0;y<=yrs;y++) d.push(Math.round(amt*Math.pow(1+rate/100,y)));
    return d;
  }

  function updateInf(){
    var amt=parseInt(document.getElementById('infAmt').value)||1000000;
    var yrs=parseInt(document.getElementById('infYrs').value)||20;
    document.getElementById('infAmtV').textContent=fmtInr(amt);
    document.getElementById('infYrsV').textContent=yrs+' yrs';
    var labels=Array.from({length:yrs+1},function(_,i){return i===0?'Now':'Yr '+i});
    var inv12=buildData(amt,yrs,12);
    var fd6=buildData(amt,yrs,6);
    var invFinal=inv12[yrs],fdFinal=fd6[yrs],diff=invFinal-fdFinal;
    document.getElementById('infStatFD').textContent=fmtInr(fdFinal);
    document.getElementById('infStatInv').textContent=fmtInr(invFinal);
    document.getElementById('infStatDiff').textContent=fmtInr(diff);
    if(infChart){
      infChart.data.labels=labels;
      infChart.data.datasets[0].data=inv12;
      infChart.data.datasets[1].data=fd6;
      infChart.update();
    } else {
      if(typeof Chart==='undefined')return;
      var ctx=canvas.getContext('2d');
      infChart=new Chart(ctx,{
        type:'line',
        data:{
          labels:labels,
          datasets:[{
            label:'Invested at 12% p.a.',
            data:inv12,
            borderColor:'#C9A84C',
            backgroundColor:'rgba(201,168,76,0.07)',
            borderWidth:2.5,
            fill:false,
            tension:0.35,
            pointRadius:0,
            pointHoverRadius:6,
            pointHoverBackgroundColor:'#C9A84C'
          },{
            label:'Savings / FD at 6% p.a.',
            data:fd6,
            borderColor:'#e05555',
            backgroundColor:'rgba(224,85,85,0.06)',
            borderWidth:2,
            fill:{target:0,above:'rgba(224,85,85,0.08)'},
            tension:0.35,
            pointRadius:0,
            pointHoverRadius:6,
            borderDash:[6,4],
            pointHoverBackgroundColor:'#e05555'
          }]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          animation:{duration:900,easing:'easeInOutQuart'},
          interaction:{intersect:false,mode:'index'},
          plugins:{
            legend:{labels:{color:'#7a8ba0',font:{family:'Outfit',size:12},boxWidth:24,padding:16}},
            tooltip:{
              backgroundColor:'rgba(7,13,24,0.97)',
              borderColor:'rgba(201,168,76,0.18)',
              borderWidth:1,
              titleColor:'#C9A84C',
              bodyColor:'#a0aec0',
              padding:12,
              callbacks:{label:function(c){return' '+c.dataset.label+': '+fmtInr(c.raw);}}
            }
          },
          scales:{
            x:{ticks:{color:'#5a6a7a',font:{size:11},maxTicksLimit:9},grid:{color:'rgba(255,255,255,0.04)'},border:{color:'rgba(255,255,255,0.06)'}},
            y:{ticks:{color:'#5a6a7a',font:{size:11},callback:function(v){return fmtInr(v);}},grid:{color:'rgba(255,255,255,0.04)'},border:{color:'rgba(255,255,255,0.06)'}}
          }
        }
      });
    }
  }

  // Debounce
  var dTimer;
  function dUpdate(){clearTimeout(dTimer);dTimer=setTimeout(updateInf,60);}
  ['infAmt','infYrs'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('input',function(){
      if(id==='infAmt')document.getElementById('infAmtV').textContent=fmtInr(parseInt(el.value)||1000000);
      else document.getElementById('infYrsV').textContent=(parseInt(el.value)||20)+' yrs';
      dUpdate();
    });
  });

  // Init when scrolled into view
  var sec=document.getElementById('infSec');
  if(sec&&typeof IntersectionObserver!=='undefined'){
    var obs=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){updateInf();obs.disconnect();}
    },{threshold:0.15});
    obs.observe(sec);
  } else { updateInf(); }
})();

/* ══════════════════════════════════════════════════
   FEATURE 1 — INVESTOR QUIZ
══════════════════════════════════════════════════ */
(function(){
  var sec=document.getElementById('quizSec');
  if(!sec)return;

  var QS=[
    {q:'How old are you?',opts:['Under 25 — Just getting started','26–35 — Building my career','36–45 — Peak earning years','46–55 — Thinking about legacy','55+ — Retirement is near']},
    {q:'What does your money mostly do right now?',opts:['Sits in a savings account earning almost nothing','Mostly FDs and RDs — safe but slow','Some mutual funds but nothing structured','Actively invested across equity, debt, insurance','I honestly don\'t track it closely']},
    {q:'If the stock market crashes 30% tomorrow, you would:',opts:['Panic — move everything to cash immediately','Feel worried but do nothing and wait','Stay calm — markets recover, I\'ve seen this before','Invest more — this is exactly the buying opportunity I wanted','Call my advisor and take their guidance']},
    {q:'Your biggest financial fear is:',opts:['Not having enough if I lose my job suddenly','Not being able to afford my children\'s education','A medical emergency wiping out my savings','Outliving my money in retirement','Leaving nothing behind for my family']},
    {q:'What\'s your #1 money goal in the next 5 years?',opts:['Build an emergency fund and get properly insured','Save for a home or car without a huge loan','Cross ₹1 Crore in investments','Retire early or step back from work','Set up a wealth structure for my children\'s future']},
    {q:'What percentage of your monthly income do you invest?',opts:['0% — I\'m just starting out','Less than 10%','10–20%','More than 20%','I invest lumpsum when I have surplus, not monthly']},
    {q:'How do you feel about investing in stocks directly?',opts:['Too risky — I prefer safe instruments','Open to it but don\'t know how to pick stocks','I invest in mutual funds which hold stocks — that\'s enough','I actively follow markets and invest in direct equity','I want expert advice before touching individual stocks']},
    {q:'Which statement sounds most like you?',opts:['"I just want my money to be safe and grow a little"','"I want to grow wealth but not lose sleep over it"','"I want serious returns and I\'m willing to take calculated risk"','"I want to build generational wealth — not just for me"','"I need a complete financial plan, not just investments"']}
  ];

  var PERSONAS={
    protector:{
      emoji:'🛡️',tag:'Security First, Wealth Second',
      hl:'You\'re Built for Protection',
      desc:'Your instinct to protect before you invest is exactly right. Most Indians skip this step and regret it. Before growing wealth, you need a bulletproof foundation — term insurance to protect your income, health insurance to protect your savings, and an emergency fund to protect your peace of mind. Once that\'s in place, wealth follows naturally and fast.',
      strengths:['Cautious','Steady','Thoughtful'],
      svcs:[{n:'Insurance',u:'insurance.html'},{n:'SIP Starter',u:'sip.html'},{n:'Estate Planning',u:'estate-planning.html'}],
      cta:'Build My Foundation →',ctaUrl:'insurance.html',
      share:'I\'m The Protector investor 🛡️ — security before everything. What kind of investor are you? Find out at akshayinvestment.netlify.app'
    },
    builder:{
      emoji:'💰',tag:'Systematic · Disciplined · Growing',
      hl:'You\'re a Natural Wealth Builder',
      desc:'You have the most important ingredient — discipline. You save regularly, think long-term, and understand that consistent investing beats trying to time the market. With the right SIP strategy, goal structuring, and a sound portfolio, you\'re on track to build life-changing wealth over the next decade.',
      strengths:['Disciplined','Patient','Goal-focused'],
      svcs:[{n:'SIP & Mutual Funds',u:'sip.html'},{n:'Retirement Planning',u:'retirement.html'},{n:'Calculators',u:'calculators.html'}],
      cta:'Optimise My Portfolio →',ctaUrl:'sip.html',
      share:'I\'m The Builder investor 💰 — systematic and disciplined. What kind of investor are you? Find out at akshayinvestment.netlify.app'
    },
    accelerator:{
      emoji:'📈',tag:'High Conviction · High Returns · Bold',
      hl:'You\'re Built for High-Performance Investing',
      desc:'You don\'t just tolerate risk — you understand it. You see market dips as opportunities and think in decades, not months. You\'re ready for direct equity, PMS, and sophisticated multi-asset strategies that go far beyond standard mutual funds. The question isn\'t whether you\'ll build serious wealth — it\'s how to structure it for maximum compounding.',
      strengths:['Aggressive','Analytical','Long-term thinker'],
      svcs:[{n:'Stock Market',u:'stock.html'},{n:'PMS',u:'pms.html'},{n:'AIF',u:'aif.html'}],
      cta:'Accelerate My Wealth →',ctaUrl:'stock.html',
      share:'I\'m The Accelerator investor 📈 — high conviction, bold moves. What kind of investor are you? Find out at akshayinvestment.netlify.app'
    },
    legacy:{
      emoji:'👑',tag:'Beyond Wealth — Building a Legacy',
      hl:'You Think in Generations, Not Years',
      desc:'You\'ve moved beyond wealth creation into wealth preservation and transfer. Your questions aren\'t about returns anymore — they\'re about structure, succession, and ensuring your family\'s financial future is unshakeable. Estate planning, family trusts, succession frameworks, and family office services are your next chapter.',
      strengths:['Visionary','Structured','Legacy-focused'],
      svcs:[{n:'Estate Planning',u:'estate-planning.html'},{n:'Family Office',u:'family-office.html'},{n:'Will & Trust',u:'will.html'}],
      cta:'Plan My Legacy →',ctaUrl:'retirement.html',
      share:'I\'m The Legacy Maker investor 👑 — building wealth that outlives me. What kind of investor are you? Find out at akshayinvestment.netlify.app'
    },
    explorer:{
      emoji:'🧭',tag:'Curious · Open · Ready to Learn',
      hl:'You\'re Ready — You Just Need a Guide',
      desc:'You have the desire and the income — what you need is a clear, personalised roadmap. You\'re not confused because you\'re uninformed; you\'re confused because finance is genuinely complex and no one has simplified it for your specific situation. That\'s exactly what a good advisor is for. Let\'s map out exactly where you are and where you need to go.',
      strengths:['Open-minded','Eager','Coachable'],
      svcs:[{n:'Free Consultation',u:'contact.html'},{n:'Calculators',u:'calculators.html'},{n:'SIP Starter',u:'sip.html'}],
      cta:'Get My Personal Roadmap →',ctaUrl:'contact.html',
      share:'I\'m The Explorer investor 🧭 — ready to learn and grow. What kind of investor are you? Find out at akshayinvestment.netlify.app'
    }
  };

  var state={cur:0,answers:[],sel:null};

  function getPersona(answers){
    var eCount=answers.filter(function(a){return a===5;}).length;
    if(eCount>=4)return PERSONAS.explorer;
    var score=answers.reduce(function(s,a){return s+a;},0);
    if(score<=16)return PERSONAS.protector;
    if(score<=24)return PERSONAS.builder;
    if(score<=32)return PERSONAS.accelerator;
    if(score<=38)return PERSONAS.legacy;
    return PERSONAS.explorer;
  }

  function renderQ(){
    var box=document.getElementById('quizBox');
    var wrap=document.getElementById('quizQWrap');
    var progBar=document.getElementById('quizProgBar');
    var progLbl=document.getElementById('quizProgLbl');
    var nextWrap=document.getElementById('quizNextWrap');
    if(!box||!wrap)return;
    var q=QS[state.cur];
    var pct=Math.round((state.cur/QS.length)*100);
    progBar.style.width=pct+'%';
    progLbl.textContent='Question '+(state.cur+1)+' of '+QS.length;
    if(nextWrap)nextWrap.style.display='none';
    var html='<div class="quiz-q-card" id="quizQCard">';
    html+='<div class="quiz-q-num">0'+(state.cur+1)+' / 0'+QS.length+'</div>';
    html+='<div class="quiz-q-text">'+q.q+'</div>';
    html+='<div class="quiz-opts">';
    var keys=['A','B','C','D','E'];
    q.opts.forEach(function(opt,i){
      html+='<button class="quiz-opt" data-val="'+(i+1)+'">';
      html+='<span class="quiz-opt-key">'+keys[i]+'</span>';
      html+='<span class="quiz-opt-txt">'+opt+'</span>';
      html+='<span class="quiz-opt-check">✓</span>';
      html+='</button>';
    });
    html+='</div></div>';
    wrap.innerHTML=html;
    // Trigger animation
    requestAnimationFrame(function(){
      var card=document.getElementById('quizQCard');
      if(card)requestAnimationFrame(function(){card.classList.add('in');});
    });
    state.sel=null;
  }

  function selectOpt(btn){
    document.querySelectorAll('#quizQWrap .quiz-opt').forEach(function(b){b.classList.remove('sel');});
    btn.classList.add('sel');
    state.sel=parseInt(btn.dataset.val);
    var nw=document.getElementById('quizNextWrap');
    if(nw)nw.style.display='flex';
  }

  function nextQ(){
    if(state.sel===null)return;
    state.answers.push(state.sel);
    var card=document.getElementById('quizQCard');
    if(card){
      card.classList.remove('in');
      card.classList.add('out');
    }
    setTimeout(function(){
      if(state.cur<QS.length-1){
        state.cur++;
        renderQ();
      } else {
        showResult();
      }
    },300);
  }

  function showResult(){
    var p=getPersona(state.answers);
    document.getElementById('quizBox').style.display='none';
    var rd=document.getElementById('quizResult');
    rd.style.display='block';
    rd.scrollIntoView({behavior:'smooth',block:'start'});
    // Populate download card data
    document.getElementById('dlCardEmoji').textContent=p.emoji;
    document.getElementById('dlCardName').textContent='I am '+p.hl;
    document.getElementById('dlCardTag').textContent=p.tag;

    var svcsHtml=p.svcs.map(function(s){return'<a href="'+s.u+'" class="quiz-svc-card">'+s.n+'</a>';}).join('');
    var html=
      '<div class="quiz-result-inner">'+
      '<div class="quiz-result-emoji">'+p.emoji+'</div>'+
      '<div class="quiz-result-tag">'+p.tag+'</div>'+
      '<h2 class="quiz-result-hl">'+p.hl+'</h2>'+
      '<p class="quiz-result-desc">'+p.desc+'</p>'+
      '<div class="quiz-strengths">'+p.strengths.map(function(s){return'<span class="quiz-strength">'+s+'</span>';}).join('')+'</div>'+
      '<div class="quiz-svc-cards">'+svcsHtml+'</div>'+
      '<div class="quiz-cta-wrap"><a href="'+p.ctaUrl+'" class="b-gold">'+p.cta+'</a></div>'+
      '<div class="quiz-share-section">'+
      '<div class="quiz-share-lbl">SHARE YOUR INVESTOR TYPE</div>'+
      '<div class="quiz-share-btns">'+
      '<button class="quiz-share-btn" data-share="wa" data-msg="'+encodeURIComponent(p.share)+'">📱 WhatsApp</button>'+
      '<button class="quiz-share-btn" data-share="copy">🔗 <span class="copy-lbl">Copy Link</span></button>'+
      '<button class="quiz-share-btn" data-share="tw" data-msg="'+encodeURIComponent(p.share)+'">🐦 Twitter / X</button>'+
      '</div>'+
      '<button class="quiz-dl-btn" id="quizDlBtn">⬇ Download Result Card</button>'+
      '<button class="quiz-retake">Retake Quiz</button>'+
      '</div>'+
      '</div>';
    rd.innerHTML=html;

    // Events
    rd.addEventListener('click',function(e){
      var sb=e.target.closest('.quiz-share-btn');
      if(sb){
        var type=sb.dataset.share;
        var msgParam=sb.dataset.msg;
        if(type==='wa') window.open('https://wa.me/?text='+msgParam,'_blank');
        else if(type==='tw') window.open('https://twitter.com/intent/tweet?text='+msgParam,'_blank');
        else if(type==='copy'){
          navigator.clipboard.writeText(window.location.origin+'/').then(function(){
            var lbl=sb.querySelector('.copy-lbl');if(lbl){lbl.textContent='Copied!';setTimeout(function(){lbl.textContent='Copy Link';},2000);}
          });
        }
      }
      if(e.target.closest('.quiz-retake'))resetQuiz();
      if(e.target.closest('#quizDlBtn'))downloadCard(p);
    });
  }

  function downloadCard(p){
    var card=document.getElementById('quizDownloadCard');
    if(!card)return;
    document.getElementById('dlCardEmoji').textContent=p.emoji;
    document.getElementById('dlCardName').textContent='I am '+p.hl;
    document.getElementById('dlCardTag').textContent=p.tag;
    card.style.left='0';card.style.top='0';card.style.zIndex='-1';card.style.opacity='1';
    if(typeof html2canvas==='undefined'){
      alert('Downloading... (html2canvas not loaded)');
      card.style.left='-9999px';return;
    }
    html2canvas(card,{
      scale:1,
      useCORS:true,
      backgroundColor:'#070D18',
      logging:false,
      width:1080,height:1080
    }).then(function(cvs){
      card.style.left='-9999px';card.style.opacity='0';
      var a=document.createElement('a');
      a.download='my-investor-type.png';
      a.href=cvs.toDataURL('image/png');
      a.click();
    }).catch(function(){card.style.left='-9999px';});
  }

  function resetQuiz(){
    state={cur:0,answers:[],sel:null};
    document.getElementById('quizResult').style.display='none';
    document.getElementById('quizResult').innerHTML='';
    document.getElementById('quizBox').style.display='block';
    document.getElementById('quizNextWrap').style.display='none';
    renderQ();
    document.getElementById('quizSec').scrollIntoView({behavior:'smooth',block:'start'});
  }

  // Event delegation on the quiz box
  var qBox=document.getElementById('quizBox');
  if(qBox){
    qBox.addEventListener('click',function(e){
      var opt=e.target.closest('.quiz-opt');
      if(opt)selectOpt(opt);
      if(e.target.closest('#quizNextBtn'))nextQ();
    });
  }

  // Start button
  var startBtn=document.getElementById('quizStartBtn');
  if(startBtn){
    startBtn.addEventListener('click',function(){
      document.getElementById('quizTeaser').style.display='none';
      document.getElementById('quizBox').style.display='block';
      renderQ();
    });
  }
})();

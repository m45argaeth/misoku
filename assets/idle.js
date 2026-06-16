/* Shared idle/clicker engine for Minigame Market */
(function(){
function fmt(n){
  n=Math.floor(n);
  if(n<1000)return ''+n;
  const u=['','K','M','B','T','Qa','Qi','Sx','Sp'];
  let i=0;while(n>=1000&&i<u.length-1){n/=1000;i++;}
  return (n<10?n.toFixed(2):n<100?n.toFixed(1):Math.floor(n))+u[i];
}
window.fmtNum=fmt;

window.IdleGame={
  start:function(cfg){
    const KEY='mm_'+cfg.key;
    const items=[].concat(
      (cfg.upgrades||[]).map(x=>Object.assign({kind:'up'},x)),
      (cfg.producers||[]).map(x=>Object.assign({kind:'prod'},x))
    );
    // ---- state ----
    let st={coins:0,total:0,owned:{},last:Date.now()};
    const saved=localStorage.getItem(KEY);
    if(saved){try{st=Object.assign(st,JSON.parse(saved));}catch(e){}}
    items.forEach(it=>{if(st.owned[it.id]==null)st.owned[it.id]=0;});

    // ---- theme ----
    document.documentElement.style.setProperty('--g-accent',cfg.theme.accent);
    if(cfg.theme.glow)document.documentElement.style.setProperty('--g-glow',cfg.theme.glow);
    document.title=cfg.name+' — Minigame Market';

    // ---- derived ----
    function clickPower(){let p=cfg.baseClick||1,m=1;items.forEach(it=>{const o=st.owned[it.id];if(it.clickAdd)p+=it.clickAdd*o;if(it.clickMult)m*=Math.pow(it.clickMult,o);});return p*m;}
    function cps(){let c=0;items.forEach(it=>{if(it.cps)c+=it.cps*st.owned[it.id];});return c;}
    function cost(it){return Math.ceil(it.baseCost*Math.pow(it.costMul||1.15,st.owned[it.id]));}

    // ---- offline earnings ----
    const away=(Date.now()-st.last)/1000;
    if(away>10){const g=cps()*Math.min(away,3600*8);if(g>=1){st.coins+=g;st.total+=g;setTimeout(()=>toast('💤 Selamat datang lagi! +'+fmt(g)+' '+cfg.currency.name+' selama kamu pergi'),500);}}

    // ---- build UI ----
    const root=document.getElementById('game');
    root.innerHTML=`<div class="idle-wrap">
      <div class="idle-main">
        <div class="idle-cur">
          <div class="amt" id="amt">0</div>
          <div class="cur-name">${cfg.currency.icon||''} ${cfg.currency.name}</div>
          <div class="cps" id="cps"></div>
        </div>
        <button class="click-btn" id="clickBtn">${cfg.clickIcon}</button>
        <div class="click-hint">${cfg.clickHint||'Klik untuk menghasilkan!'}</div>
      </div>
      <div class="idle-side">
        <div class="shop"><h3>✨ Upgrade Klik</h3><div id="ups"></div></div>
        <div class="shop"><h3>⚙️ Generator Otomatis</h3><div id="prods"></div></div>
      </div>
    </div>`;

    const elAmt=document.getElementById('amt'),elCps=document.getElementById('cps');
    const upBox=document.getElementById('ups'),prodBox=document.getElementById('prods');
    const nodes={};
    items.forEach(it=>{
      const b=document.createElement('button');b.className='item';
      b.innerHTML=`<div class="i-ico">${it.icon}</div><div class="i-body">
        <div class="i-name"><span>${it.name}</span><span class="i-owned" data-own></span></div>
        <div class="i-desc">${it.desc}</div></div>
        <div class="i-cost" data-cost></div>`;
      b.addEventListener('click',()=>buy(it));
      (it.kind==='up'?upBox:prodBox).appendChild(b);
      nodes[it.id]=b;
    });

    function spawnFloat(x,y,txt){const f=document.createElement('div');f.className='float';f.textContent=txt;f.style.left=x+'px';f.style.top=y+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900);}
    let toastT;function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),3200);}
    window.__idleToast=toast;

    function buy(it){const c=cost(it);if(st.coins<c)return;st.coins-=c;st.owned[it.id]++;render();save();}

    document.getElementById('clickBtn').addEventListener('click',e=>{
      const g=clickPower();st.coins+=g;st.total+=g;
      spawnFloat(e.clientX-10,e.clientY-20,'+'+fmt(g));
      render();
    });

    function render(){
      elAmt.textContent=fmt(st.coins);
      const c=cps();elCps.textContent=c>0?('⚡ '+fmt(c)+' / detik'):('👆 '+fmt(clickPower())+' / klik');
      items.forEach(it=>{const n=nodes[it.id],c2=cost(it);
        n.disabled=st.coins<c2;n.classList.toggle('afford',st.coins>=c2);
        n.querySelector('[data-cost]').textContent=cfg.currency.icon+' '+fmt(c2);
        n.querySelector('[data-own]').textContent=st.owned[it.id]>0?('x'+st.owned[it.id]):'';
      });
    }
    function save(){st.last=Date.now();localStorage.setItem(KEY,JSON.stringify(st));}

    // loops
    setInterval(()=>{const c=cps();if(c>0){st.coins+=c/10;st.total+=c/10;render();}},100);
    setInterval(save,5000);
    window.addEventListener('beforeunload',save);

    // reset button (in shared top bar)
    const rb=document.getElementById('resetBtn');
    if(rb)rb.addEventListener('click',()=>{if(confirm('Reset semua progress game ini?')){localStorage.removeItem(KEY);location.reload();}});

    render();
  }
};
})();

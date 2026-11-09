document.documentElement.classList.add('js');
// Закріплена шапка-зміст: тло після скролу, мобільне меню, підсвітка поточного блоку
const hd=document.querySelector('.hd'),nv=document.querySelector('.menu'),bg=document.querySelector('.bg'),
links=[...nv.querySelectorAll('a')];
const sync=()=>hd.classList.toggle('on',scrollY>40||nv.classList.contains('open'));
addEventListener('scroll',sync,{passive:true});sync();
bg.addEventListener('click',()=>{const o=nv.classList.toggle('open');bg.setAttribute('aria-expanded',o);sync()});
links.forEach(a=>a.addEventListener('click',()=>{nv.classList.remove('open');bg.setAttribute('aria-expanded',false);sync()}));
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)links.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>io.observe(s));
// Галерея: дублюємо кадри для безшовної стрічки, швидкість стала незалежно від ширини, відео без звуку
const gal=document.querySelector('.gal'),tr=gal.querySelector('.tr'),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
[...tr.children].forEach(n=>{const k=n.cloneNode(true);k.setAttribute('aria-hidden','true');tr.append(k)});
const vids=[...gal.querySelectorAll('video')];
vids.forEach(v=>{v.muted=true;v.defaultMuted=true});
const speed=()=>tr.style.setProperty('--dur',Math.round(tr.scrollWidth/2/60)+'s');
speed();addEventListener('resize',speed);addEventListener('load',speed);
new IntersectionObserver(es=>es.forEach(e=>vids.forEach(v=>e.isIntersecting&&!still?v.play().catch(()=>{}):v.pause()))).observe(gal);

// Мобільне меню: Escape закриває меню й повертає фокус на кнопку
addEventListener('keydown',e=>{if(e.key==='Escape'&&nv.classList.contains('open')){nv.classList.remove('open');bg.setAttribute('aria-expanded',false);sync();bg.focus()}});

// Форма заявки: перевірка полів, відправка через fetch до Web3Forms, чесні стани
(()=>{
const f=document.getElementById('lead');if(!f)return;
const st=document.getElementById('form-status'),btn=f.querySelector('button[type=submit]'),label=btn.textContent;
const WA='https://wa.me/message/A5JXJ6NVY52XF1',MAIL='supportfromcrafted@gmail.com';
const links=`<a href="${WA}" target="_blank" rel="noopener">WhatsApp</a> або на <a href="mailto:${MAIL}">${MAIL}</a>`;
const field=n=>f.elements[n],isTg=()=>f.elements.reply.value==='Telegram';
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk=v=>/^\+?[\d\s().-]{7,22}$/.test(v)&&(n=>n>=7&&n<=15)(v.replace(/\D/g,'').length);
const tgOk=v=>/^@[A-Za-z0-9_]{5,32}$/.test(v);
let sending=false;
function setErr(el,m){const e=el.closest('label').querySelector('.err');e.textContent=m;if(m){el.setAttribute('aria-invalid','true')}else{el.removeAttribute('aria-invalid')}}
function check(n){
  const el=field(n),v=el.value.trim();let m='';
  if(n==='name'&&!v)m='Вкажіть ім’я або назву компанії.';
  if(n==='message'&&!v)m='Коротко опишіть ваш проєкт.';
  if(n==='contact'){
    if(!v)m='Вкажіть email або номер телефону.';
    else if(!(emailOk(v)||phoneOk(v)||(isTg()&&tgOk(v))))m='Перевірте формат: email (name@company.com) або телефон із кодом країни (+380…)'+(isTg()?', або @username для Telegram.':'.');
  }
  setErr(el,m);return !m;
}
function show(kind,html){st.hidden=false;st.className='status '+kind;st.innerHTML=html;st.focus({preventScroll:true});st.scrollIntoView({block:'nearest',behavior:'smooth'})}
['name','contact','message'].forEach(n=>{const el=field(n);el.addEventListener('blur',()=>{if(el.value.trim()||el.hasAttribute('aria-invalid'))check(n)});el.addEventListener('input',()=>{if(el.hasAttribute('aria-invalid'))check(n)})});
f.addEventListener('submit',async e=>{
  e.preventDefault();
  if(sending)return;
  st.hidden=true;
  const bad=['name','contact','message'].filter(n=>!check(n));
  if(bad.length){field(bad[0]).focus();return}
  if(f.elements.botcheck.checked)return;
  const key=field('access_key').value.trim();
  if(!key||key==='ВАШ_КЛЮЧ'){
    console.warn('Форма: не вказано Access Key Web3Forms (index.html, поле access_key).');
    show('bad','Форму ще не підключено до пошти, тож запит не надіслано. Напишіть нам у '+links+'.');return;
  }
  sending=true;btn.disabled=true;btn.textContent='Надсилаємо…';f.setAttribute('aria-busy','true');
  const fd=new FormData(f),c=field('contact').value.trim();
  if(emailOk(c))fd.set('email',c);
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),15000);
  try{
    const r=await fetch(f.action,{method:'POST',headers:{Accept:'application/json'},body:fd,signal:ctl.signal});
    let d=null;try{d=await r.json()}catch(_){}
    if(r.ok&&d&&d.success===true){f.reset();show('ok','Дякуємо! Ми отримали ваш запит і відповімо вам обраним способом.')}
    else show('bad','Не вдалося надіслати запит. Спробуйте ще раз або напишіть нам у '+links+'.');
  }catch(_){show('bad','Немає зв’язку із сервісом. Перевірте інтернет і спробуйте ще раз або напишіть нам у '+links+'.')}
  finally{clearTimeout(t);sending=false;btn.disabled=false;btn.textContent=label;f.removeAttribute('aria-busy')}
});
})();

// Процес: кроки з'являються поетапно, коли блок потрапляє в поле зору
(()=>{const s=document.querySelector('.st5');if(!s)return;[...s.children].forEach((li,i)=>li.style.setProperty('--i',i));
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){s.classList.add('in');o.disconnect()}}),{threshold:.25}).observe(s)})();

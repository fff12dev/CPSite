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
// Телефон: плаваюча кнопка заявки, поки на екрані немає першого екрана й контактів
const fab=document.querySelector('.fab'),vis=new Set();
const fo=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target));fab.classList.toggle('show',!vis.size)});
['top','contact'].forEach(id=>fo.observe(document.getElementById(id)));

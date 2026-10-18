// Basado en la navegación ClinicSport suministrada: una sección por gesto
// cuando la pantalla y el contenido permiten una experiencia fullscreen.
const slides = [...document.querySelectorAll('.slide')];
const links = [...document.querySelectorAll('[data-section-link]')];
const controls = [...document.querySelectorAll('[data-direction]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const fullpage = matchMedia('(min-width: 901px) and (min-height: 651px) and (pointer: fine)');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const counter = document.querySelector('[data-current]');
const announcement = document.querySelector('[data-announcement]');
const header = document.querySelector('.site-header');
let active = Math.max(0, slides.findIndex(slide => '#' + slide.id === location.hash));
let wheelAmount = 0, wheelDirection = 0, lastWheel = 0, lockedUntil = 0, scrollFrame = 0;
let announceTimer;
let overflow = false;

function setMenu(open) {
  if (!menuButton || !menu) return;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}
function setActive(index) {
  if (!slides.length) return;
  active = Math.min(slides.length - 1, Math.max(0, index));
  const id = slides[active].id;
  links.forEach(link => {
    if (link.dataset.sectionLink === id) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
  controls.forEach(button => { button.disabled = Number(button.dataset.direction) < 0 ? active === 0 : active === slides.length - 1; });
  if (counter) counter.textContent = String(active + 1).padStart(2,'0');
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    const name = links.find(link => link.dataset.sectionLink === id)?.textContent?.trim() || 'Presentación';
    if (announcement) announcement.textContent = `Sección ${active + 1} de ${slides.length}: ${name}`;
  },180);
}
function measureOverflow() {
  overflow = slides.some(slide => slide.offsetHeight > innerHeight + 5);
  document.documentElement.classList.toggle('content-overflow', overflow);
}
function goTo(index, { focus = false, history = true } = {}) {
  if (index < 0 || index >= slides.length) return;
  setMenu(false);
  lockedUntil = performance.now() + (reducedMotion.matches ? 0 : 950);
  wheelAmount = 0;
  setActive(index);
  const hash = '#' + slides[index].id;
  if (history && location.hash !== hash) window.history.pushState(null,'',hash);
  slides[index].scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
  if (focus) slides[index].focus({preventScroll:true});
}
function updateFromScroll(force = false) {
  scrollFrame = 0;
  header?.classList.toggle('scrolled',scrollY > 24);
  // La sección de destino conserva el estado durante el desplazamiento animado.
  if (!force && performance.now() < lockedUntil) return;
  let closest = 0, distance = Infinity;
  const middle = innerHeight / 2;
  slides.forEach((slide,i) => {
    const r = slide.getBoundingClientRect();
    const d = r.top <= middle && r.bottom >= middle ? 0 : Math.min(Math.abs(r.top-middle),Math.abs(r.bottom-middle));
    if (d < distance) { distance=d; closest=i; }
  });
  if (closest !== active) setActive(closest);
}
document.addEventListener('click',event => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const index = slides.findIndex(slide => '#' + slide.id === anchor.getAttribute('href'));
  if (index === -1) return;
  event.preventDefault(); goTo(index,{focus:true});
});
controls.forEach(button => button.addEventListener('click',() => {
  if (button.disabled) return;
  if (performance.now() >= lockedUntil) updateFromScroll(true);
  goTo(active + Number(button.dataset.direction));
}));
menuButton?.addEventListener('click',() => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
matchMedia('(min-width: 1101px)').addEventListener('change',event => {if(event.matches)setMenu(false);});
addEventListener('scroll',() => {if(!scrollFrame)scrollFrame=requestAnimationFrame(() => updateFromScroll());},{passive:true});
addEventListener('scrollend',() => {lockedUntil=0;updateFromScroll(true);});
addEventListener('resize',() => {measureOverflow();updateFromScroll(true);});
addEventListener('load',measureOverflow);
document.addEventListener('toggle',() => {requestAnimationFrame(measureOverflow);},true);
if ('ResizeObserver' in window) {
  const resizeObserver = new ResizeObserver(measureOverflow);
  slides.forEach(slide => resizeObserver.observe(slide));
}
document.addEventListener('wheel',event => {
  if (!fullpage.matches || reducedMotion.matches || overflow || event.ctrlKey || event.metaKey || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
  if (menuButton?.getAttribute('aria-expanded')==='true') return;
  if (!(event.target instanceof Element) || event.target.closest('input,textarea,select,[contenteditable="true"],[data-native-scroll]')) return;
  const now=performance.now(), gap=now-lastWheel;lastWheel=now;
  event.preventDefault();
  if(now<lockedUntil || (gap<170 && wheelAmount===0))return;
  const direction=Math.sign(event.deltaY);if(!direction)return;
  if(gap>170 || direction!==wheelDirection)wheelAmount=0;
  wheelDirection=direction;
  wheelAmount+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  if(Math.abs(wheelAmount)>=32)goTo(active+direction);
},{passive:false});
document.addEventListener('keydown',event => {
  if(event.key==='Escape' && menuButton?.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();return;}
  if(menuButton?.getAttribute('aria-expanded')==='true' || !fullpage.matches || overflow)return;
  if(!(event.target instanceof Element) || event.target.closest('input,textarea,select,button,a,summary,[contenteditable="true"]'))return;
  const changes={ArrowDown:1,PageDown:1,ArrowUp:-1,PageUp:-1,' ':event.shiftKey?-1:1};
  if(event.key in changes){event.preventDefault();goTo(active+changes[event.key],{focus:true});}
  else if(event.key==='Home' || event.key==='End'){event.preventDefault();goTo(event.key==='Home'?0:slides.length-1,{focus:true});}
});
function syncHash(){const index=slides.findIndex(slide=>'#'+slide.id===location.hash);if(index!==-1)goTo(index,{history:false});}
addEventListener('hashchange',syncHash);addEventListener('popstate',syncHash);
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting)),{threshold:0});
  slides.forEach(slide=>observer.observe(slide));slides[active]?.classList.add('is-visible');document.documentElement.classList.add('enhanced');
}
measureOverflow();setActive(active);
if(location.hash)requestAnimationFrame(syncHash);

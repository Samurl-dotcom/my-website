// Clock (for pages that have #clock element)
function updateClock(){
  const el = document.getElementById('clock');
  if(!el) return; // only run if #clock exists
  const now = new Date();
  el.textContent = now.toLocaleString();
}
setInterval(updateClock, 1000);
updateClock();

// Welcome message (for pages that have #welcome element)
function updateWelcome(){
  const el = document.getElementById('welcome');
  if(!el) return; // only run if #welcome exists
  const now = new Date();
  el.textContent = `Today is ${now.toLocaleDateString()} at ${now.toLocaleTimeString()} — welcome to my portfolio website!`;
}
setInterval(updateWelcome, 1000);
updateWelcome();

setInterval(updateClock, 1000);
updateClock();

// Logout with confirmation
function logout() {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');
    window.location.href = "index.html"; 
    return true; // allow navigation
  }
  return false; // cancel navigation
}



// Login validation
(function(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const err = document.getElementById('loginError');
    err.textContent = '';
    if(!u || !p){ err.textContent='Please fill in all fields.'; return; }
    if(u.length < 4){ err.textContent='Username must be at least 4 characters.'; return; }
    if(p.length < 6){ err.textContent='Password must be at least 6 characters.'; return; }
    // UI-only remember me
    if(document.getElementById('remember').checked){
      localStorage.setItem('authUser', u);
    }else{
      sessionStorage.setItem('authUser', u);
    }
    window.location.href = 'home.html';
  });
})();

// Simple route guard: if not on index and no auth, still allow (assignment says JS-only), but you could enforce:
(function(){
  const isIndex = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
  if(!isIndex){
    const user = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    const nameEl = document.getElementById('studentName');
    if(nameEl && user){ nameEl.textContent = user; }
  }
})();

// Slideshow
let slideIdx = 0, slideTimer = null;
function showSlide(i){
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(slides.length===0) return;
  slideIdx = (i+slides.length)%slides.length;
  slides.forEach((s,idx)=> s.classList.toggle('active', idx===slideIdx));
  const dots = Array.from(document.querySelectorAll('.dot'));
  dots.forEach((d,idx)=> d.classList.toggle('active', idx===slideIdx));
}
function nextSlide(){ showSlide(slideIdx+1); resetTimer(); }
function prevSlide(){ showSlide(slideIdx-1); resetTimer(); }
function resetTimer(){
  if(slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(()=>showSlide(slideIdx+1), 4000);
}
(function initSlideshow(){
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('dots');
  if(slides.length && dotsWrap){
    dotsWrap.innerHTML = '';
    slides.forEach((_,i)=>{
      const b = document.createElement('button');
      b.className='dot'+(i===0?' active':'');
      b.setAttribute('aria-label', 'Go to slide '+(i+1));
      b.addEventListener('click', ()=>{ showSlide(i); resetTimer(); });
      dotsWrap.appendChild(b);
    });
    resetTimer();
  }
})();
let currentIndex = 0;
const images = document.querySelectorAll('.gallery-container img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    openLightbox(img.src);
  });
});

function openLightbox(src) {
  lightbox.style.display = 'block';
  lightboxImg.src = src;
}

function closeLightbox() {
  lightbox.style.display = 'none';
}

function changeSlide(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = images.length - 1;
  if (currentIndex >= images.length) currentIndex = 0;
  lightboxImg.src = images[currentIndex].src;
}

// Close lightbox when clicking outside image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});
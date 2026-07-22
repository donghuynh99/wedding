// ====== CONFIG: chỉnh ngày giờ cưới của bạn tại đây ======
const WEDDING_DATE = new Date('2026-08-02T17:00:00');
const WEDDING_TITLE = 'Lễ Thành Hôn Văn Đồng & Thu Uyên';
const WEDDING_LOCATION = 'Tầng 1 Nhà Hàng Tiệc Cưới Đại Hỷ, 187 Hà Huy Tập, Thanh Khê, Đà Nẵng';

// Dán URL Web App từ Google Apps Script vào đây để lưu lời chúc vào Google Sheet.
// Để trống ('') nếu chưa thiết lập — form vẫn hoạt động bình thường, chỉ lưu ở localStorage.
const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzk6ISmBLULWxBk1QBZ2ZPo_iV_oFwQFJdYC0XJUu_zZUJd4vS_YoGMCvHFwIeR4s2T0w/exec';

const SAMPLE_WISHES = [
  { name: 'Nguyễn Thị Mai', attend: 'yes', guests: 2, message: 'Chúc Đồng và Uyên trăm năm hạnh phúc, mãi yêu thương nhau như ngày đầu!' },
  { name: 'Trần Văn Long', attend: 'yes', guests: 1, message: 'Chúc mừng hai bạn! Sớm có tin vui nhé ❤️' },
  { name: 'Lê Thị Hồng Nhung', attend: 'no', guests: 0, message: 'Mình ở xa không về kịp, chúc hai bạn một đám cưới thật trọn vẹn!' },
];

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initPetals();
  initScrollReveal();
  initCountdown();
  initAddToCalendar();
  initGallery();
  initRSVP();
  initBackToTop();
  initMusicToggle();
  initScrollDownButton();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => pre.classList.add('hidden'), 400);
  });
  // fallback in case 'load' already fired
  setTimeout(() => pre.classList.add('hidden'), 2500);
}

/* ---------- Falling petals ---------- */
function initPetals() {
  const container = document.getElementById('petals');
  const symbols = ['❀', '❁', '✿', '❃'];
  const count = window.innerWidth < 700 ? 14 : 24;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[i % symbols.length];
    petal.style.left = Math.random() * 100 + 'vw';
    const fallDuration = 8 + Math.random() * 10;
    const swayDuration = 3 + Math.random() * 3;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${Math.random() * fallDuration}s, 0s`;
    petal.style.fontSize = 14 + Math.random() * 12 + 'px';
    petal.style.opacity = 0.4 + Math.random() * 0.5;
    container.appendChild(petal);
  }
}

/* ---------- Scroll reveal via IntersectionObserver ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => observer.observe(t));
}

/* ---------- Countdown timer ---------- */
function initCountdown() {
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };
  if (!els.days) return;

  function tick() {
    const now = new Date();
    let diff = WEDDING_DATE - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    els.days.textContent = String(days).padStart(2, '0');
    els.hours.textContent = String(hours).padStart(2, '0');
    els.mins.textContent = String(mins).padStart(2, '0');
    els.secs.textContent = String(secs).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- Add to calendar (Google Calendar template link) ---------- */
function initAddToCalendar() {
  const btn = document.getElementById('addToCalendar');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const start = formatGCalDate(WEDDING_DATE);
    const end = formatGCalDate(new Date(WEDDING_DATE.getTime() + 2 * 60 * 60 * 1000));
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(WEDDING_TITLE)}&dates=${start}/${end}&location=${encodeURIComponent(WEDDING_LOCATION)}`;
    window.open(url, '_blank', 'noopener');
  });
}

function formatGCalDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/* ---------- Gallery lightbox ---------- */
function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  let current = 0;

  if (!items.length) return;

  function open(index) {
    current = index;
    lightboxImg.src = items[current].src;
    lightboxImg.alt = items[current].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function show(delta) {
    current = (current + delta + items.length) % items.length;
    lightboxImg.src = items[current].src;
    lightboxImg.alt = items[current].alt;
  }

  items.forEach((img, i) => img.parentElement.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(-1));
  nextBtn.addEventListener('click', () => show(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
}

/* ---------- RSVP form + wishes (localStorage) ---------- */
function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const list = document.getElementById('wishesList');
  if (!form) return;

  const STORAGE_KEY = 'wedding_wishes_van_dong_thi_uyen';

  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_WISHES));
  }

  function renderWishes() {
    if (!list) return;
    const wishes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.innerHTML = '';
    wishes.slice().reverse().forEach(w => {
      const div = document.createElement('div');
      div.className = 'wish-item';
      const attendText = w.attend === 'yes' ? `Sẽ tham dự (${w.guests} người)` : 'Không thể tham dự';
      div.innerHTML = `<strong>${escapeHtml(w.name)}</strong><span>${attendText}${w.message ? ' — ' + escapeHtml(w.message) : ''}</span>`;
      list.appendChild(div);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const wish = {
      name: data.get('name').trim(),
      attend: data.get('attend'),
      guests: data.get('guests') || 0,
      vegetarian: data.get('vegetarian') ? 'yes' : 'no',
      message: data.get('message').trim(),
    };
    if (!wish.name) return;

    const wishes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    wishes.push(wish);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

    sendWishToSheet(wish);

    renderWishes();
    form.reset();
    showToast('Cảm ơn bạn đã gửi lời chúc! 💌');
  });

  renderWishes();
}

/* ---------- Gửi lời chúc lên Google Sheet (qua Apps Script Web App) ---------- */
function sendWishToSheet(wish) {
  if (!SHEET_WEBHOOK_URL) return;
  fetch(SHEET_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(wish),
  }).catch(() => {});
}

/* ---------- Toast ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Background music toggle ---------- */
function initMusicToggle() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  function startPlaying() {
    audio.play().then(() => {
      playing = true;
      btn.classList.add('playing');
    }).catch(() => {});
  }

  // Try autoplay as soon as the page is ready.
  startPlaying();

  // Browsers may block autoplay with sound until the user interacts —
  // fall back to starting music on the very first tap/click anywhere
  // (but let the toggle button manage playback itself, see below).
  const tryOnFirstInteraction = (e) => {
    if (btn.contains(e.target)) return;
    if (!playing) startPlaying();
    document.removeEventListener('click', tryOnFirstInteraction);
    document.removeEventListener('touchstart', tryOnFirstInteraction);
    document.removeEventListener('keydown', tryOnFirstInteraction);
  };
  document.addEventListener('click', tryOnFirstInteraction);
  document.addEventListener('touchstart', tryOnFirstInteraction);
  document.addEventListener('keydown', tryOnFirstInteraction);

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      playing = false;
    } else {
      startPlaying();
    }
  });
}

/* ---------- Scroll down button on hero ---------- */
function initScrollDownButton() {
  const btn = document.getElementById('scrollDown');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });
  });
}

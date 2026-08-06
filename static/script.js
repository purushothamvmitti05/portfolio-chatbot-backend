// ===== Scroll reveal =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('.project-card, .log-entry, .section-head');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach(el => el.classList.add('is-visible'));
} else {
  revealTargets.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => observer.observe(el));
}

// ===== Pill nav =====
const navLinks = document.querySelectorAll('.nav-link');
const navSections = ['home', 'work', 'experience', 'publications', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveLink(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

let navLock = false;
let scrollEndTimer;

if ('IntersectionObserver' in window && navSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    if (navLock) return;
    if (window.scrollY < 120) {
      setActiveLink('home');
      return;
    }
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  navSections.forEach(section => navObserver.observe(section));
  setActiveLink('home');

  window.addEventListener('scroll', () => {
    if (navLock) return;
    if (window.scrollY < 120) setActiveLink('home');
  }, { passive: true });
} else {
  setActiveLink('home');
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLock = true;
    setActiveLink(link.getAttribute('href').slice(1));
    clearTimeout(scrollEndTimer);
  });
});

window.addEventListener('scroll', () => {
  if (!navLock) return;
  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => { navLock = false; }, 180);
}, { passive: true });

window.addEventListener('scroll', () => {
  if (navLock) return;
  if (window.scrollY < 120) return;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
  if (atBottom) setActiveLink('contact');
}, { passive: true });

// ===== Chat widget =====
const BACKEND_URL = "/chat";
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== Offline FAQ fallback =====
const FAQ = {
  'skills': "Backend: Python, FastAPI, Flask · Frontend: JS, HTML, CSS · DevOps: Docker, Jenkins, GitHub Actions · AI/ML: LangChain, NLP · Plus SQL, Git, Linux, IoT ✨",
  'experience': "5 internships in 18 months — most recent at Utthunga (Python automation) and Rooman (DevOps, cut deploy time 50%) 💪",
  'projects': "8 projects — top picks are the FastAPI URL Shortener and AI Training Platform. Click any card for the full case study 📚",
  'contact': "Email: purushothamvmitti05@gmail.com · LinkedIn: linkedin.com/in/purushotham-v-mitti 👇",
  'hire': "I ship working software fast, I'm full-stack comfortable, and 5 internships mean I'm production-ready 🚀",
  'relocate': "Open to relocation within India, plus remote and hybrid roles 📍",
  'ctc': "Open to fair market offers — happy to discuss once it's a mutual fit 💬",
  'about': "Software Engineer & AI Developer from Bengaluru — CS & Design grad with 5 internships across full-stack, DevOps, and Python automation ✨"
};

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  addMessage(message, 'user');
  chatInput.value = '';
  addMessage('Typing...', 'bot');
  
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    chatMessages.removeChild(chatMessages.lastChild);
    addMessage(data.reply, 'bot');
  } catch (err) {
    chatMessages.removeChild(chatMessages.lastChild);
    
    const lower = message.toLowerCase();
    let found = false;
    for (const key in FAQ) {
      if (lower.includes(key)) {
        addMessage(FAQ[key], 'bot');
        found = true;
        break;
      }
    }
    if (!found) {
      addMessage("My backend is asleep right now 😴 — but try asking about my skills, projects, experience, or contact info!", 'bot');
    }
  }
});

// ===== Theme toggle =====
const themeToggle = document.getElementById('theme-toggle');
const rootEl = document.documentElement;

function syncThemeIcon(){
  themeToggle.textContent = rootEl.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}
syncThemeIcon();

themeToggle.addEventListener('click', () => {
  const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  rootEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeIcon();
});

// ===== Chatbot spotlight + badge =====
const chatTeaser = document.getElementById('chat-teaser');
const chatBadge = document.getElementById('chat-badge');
let unread = 0;
let attractTimer;

function setBadge(n){
  unread = n;
  chatBadge.textContent = unread > 9 ? '9+' : unread;
  chatBadge.hidden = unread === 0;
}

function attract(){
  if (chatWindow.classList.contains('hidden')) {
    chatTeaser.classList.add('show');
    setBadge(1);
  }
}

function hideAttract(){
  clearTimeout(attractTimer);
  chatTeaser.classList.remove('show');
  setBadge(0);
}

attractTimer = setTimeout(attract, 600);

chatToggle.addEventListener('click', () => {
  const isClosing = !chatWindow.classList.contains('hidden');
  chatWindow.classList.toggle('hidden');
  
  if (isClosing) {
    attractTimer = setTimeout(attract, 400);
  } else {
    hideAttract();
    if (!chatMessages.children.length) {
      addMessage("Hey 👋 I'm Purushotham's AI twin — ask me about his skills, projects or experience!", 'bot');
    }
  }
});

// ===== Typing effect on hero role =====
const typedEl = document.getElementById('typed-role');
const roles = ['Software Engineer', 'AI Developer', 'FastAPI Backend Dev', 'Automation Engineer'];

if (prefersReducedMotion) {
  typedEl.textContent = 'Software Engineer · AI Developer';
} else {
  let ri = 0, ci = roles[0].length, deleting = true;
  function tick(){
    const word = roles[ri];
    if (deleting) {
      ci--;
      typedEl.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 350); return; }
      setTimeout(tick, 45);
    } else {
      ci++;
      typedEl.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 85);
    }
  }
  setTimeout(tick, 1500);
}

// ===== Project filters =====
const filterChips = document.querySelectorAll('.filter-chip');
const projectCards = document.querySelectorAll('.project-card');
const workCount = document.getElementById('workCount');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.toggle('active', c === chip));
    const f = chip.dataset.filter;
    let visible = 0;

    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible++;
        card.classList.remove('pop');
        void card.offsetWidth;   
        card.classList.add('pop');
      }
    });

    if (workCount) workCount.textContent = String(visible).padStart(2, '0');
  });
});

// ===== Case-study modal =====
const CASE_STUDIES = {
  'fastapi url shortener': {
    problem: 'Long URLs are unshareable and untrackable — and most tutorial shorteners fall over under real traffic.',
    approach: 'Built a production-grade FastAPI REST service with rate limiting, click analytics and edge-case validation. Containerized app + PostgreSQL with Docker Compose, persistent volumes and env-based config (SQLite locally, Postgres in prod), wired to a GitHub Actions build-test-deploy pipeline.',
    result: 'Deployed with verified container teardown/rebuild cycles, and hunted down a Starlette TemplateResponse breaking change plus a UTF-16 encoding bug purely from application logs.'
  },
  'ai training platform': {
    problem: 'Learners had no structured way to take AI courses with assessments that grade instantly.',
    approach: 'Designed a full-stack Flask platform with user authentication and session management, exposing RESTful APIs that power a 5-module course structure with automated assessments on SQLite.',
    result: 'Shipped end-to-end: sign up → learn → auto-graded assessment, with per-user progress tracking.'
  },
  'professional portfolio': {
    problem: 'Recruiters spend ~30 seconds on a portfolio; a generic one says nothing memorable.',
    approach: 'Rebuilt it as a fast static site with a terminal-inspired identity, sticky profile sidebar, and an AI chatbot trained on my own résumé via the Groq API.',
    result: 'This site — dark mode, smooth scroll nav, and a bot that answers recruiter questions 24/7.'
  },
  'medico — medical guidance system': {
    problem: 'Patients in rural areas struggle to get quick preliminary guidance and locate blood banks in time.',
    approach: 'Trained a Random Forest model for disease prediction and wrapped it in a Flask app with a blood-bank assistance flow.',
    result: 'ML-powered platform giving instant preliminary guidance and connecting patients to blood banks.'
  },
  'animal rescue web app': {
    problem: 'Injured strays wait hours for help because rescuers and vet hospitals aren\'t connected.',
    approach: 'Built a photo-upload flow that notifies the nearest vet hospitals, with QR-based donations, in vanilla HTML/CSS/JS.',
    result: 'One-tap rescue pipeline with a donation system that needs no app install.'
  },
  'orizon — food delivery': {
    problem: 'Small food businesses need online ordering without expensive SaaS platforms.',
    approach: 'Implemented menu browsing, cart and order management on a normalized MSSQL backend.',
    result: 'Complete ordering flow from menu to managed orders, end to end.'
  },
  'online quiz application': {
    problem: 'Educators needed to run quizzes and track scores without paper or manual grading.',
    approach: 'Flask app with an admin panel for question management and per-user score tracking, deployed live on Vercel.',
    result: 'Live quiz platform with admin controls and per-user analytics.'
  },
  'metaspark — healthcare ui': {
    problem: 'Clinic appointment booking was confusing and flooded front desks with phone calls.',
    approach: 'Ran a user-research pass with real clinic staff, then prototyped user-centric booking flows in Figma.',
    result: 'A validated, clean appointment interface ready for dev handoff.'
  }
};

const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const modalBackdrop = document.getElementById('case-modal');

function closeModal(){
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const title = card.querySelector('h4').textContent;
    const data = CASE_STUDIES[norm(title)];
    if (!data) return;

    document.getElementById('modal-title').textContent = title;
    const img = card.querySelector('img');
    document.getElementById('modal-img').src = img.src;
    document.getElementById('modal-img').alt = img.alt;
    document.getElementById('modal-tags').innerHTML = card.querySelector('.tags').innerHTML;
    document.getElementById('modal-problem').textContent = data.problem;
    document.getElementById('modal-approach').textContent = data.approach;
    document.getElementById('modal-result').textContent = data.result;

    const linksBox = document.getElementById('modal-links');
    linksBox.innerHTML = '';
    card.querySelectorAll('.project-actions a').forEach(a => {
      if (a.getAttribute('href') === '#') return;
      const btn = document.createElement('a');
      btn.href = a.href; btn.target = '_blank'; btn.rel = 'noopener';
      const isGit = (a.getAttribute('aria-label') || '').toLowerCase().includes('github');
      btn.textContent = isGit ? 'GitHub →' : 'Live Demo →';
      if (isGit) btn.className = 'primary';
      linksBox.appendChild(btn);
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
modalBackdrop.querySelector('.modal-close').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
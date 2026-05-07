/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DIGNIDADE — Script de Interatividade
   Navegação · Animações · Controles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// ── ESTADO GLOBAL ──
const state = {
  currentPage: 'home',
  mobileMenuOpen: false,
  loaderDone: false
};

// ── ELEMENTOS DO DOM ──
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

// ═══════════════════════════════════
// SISTEMA DE NAVEGAÇÃO
// ═══════════════════════════════════

function navigateTo(pageName) {
  // Remove classe 'active' de todas as páginas
  pages.forEach(page => page.classList.remove('active'));
  
  // Ativa a página solicitada
  const targetPage = document.getElementById(`page-${pageName}`);
  if (targetPage) {
    targetPage.classList.add('active');
    state.currentPage = pageName;
    
    // Atualiza estado dos links de navegação
    updateNavLinks(pageName);
    
    // Fecha menu mobile se aberto
    if (state.mobileMenuOpen) {
      toggleMobileMenu();
    }
    
    // Scroll para o topo
    window.scrollTo(0, 0);
  }
}

function updateNavLinks(pageName) {
  navLinks.forEach(link => {
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Adiciona listeners a todos os elementos com data-page
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageName = link.getAttribute('data-page');
    navigateTo(pageName);
  });
});

// ═══════════════════════════════════
// MENU MOBILE
// ═══════════════════════════════════

function toggleMobileMenu() {
  state.mobileMenuOpen = !state.mobileMenuOpen;
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('active');
}

burger.addEventListener('click', toggleMobileMenu);

// Clica em um item do menu mobile
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    const pageName = link.getAttribute('data-page');
    navigateTo(pageName);
  });
});

// ═══════════════════════════════════
// LOADER SCREEN
// ═══════════════════════════════════

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    state.loaderDone = true;
  }, 2000);
});

// ═══════════════════════════════════
// NAVBAR - HIDE/SHOW ON SCROLL
// ═══════════════════════════════════

let lastScrollY = 0;
let isScrollingDown = false;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // Scrollando para baixo
    navbar.classList.add('hide');
    isScrollingDown = true;
  } else {
    // Scrollando para cima
    navbar.classList.remove('hide');
    isScrollingDown = false;
  }
  
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
});

// ═══════════════════════════════════
// CURSOR CUSTOMIZADO
// ═══════════════════════════════════

let mouseX = 0;
let mouseY = 0;
let trailX = 0;
let trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Cursor principal
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  
  // Trail (animado)
  setTimeout(() => {
    trailX = mouseX;
    trailY = mouseY;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
  }, 50);
});

// ═══════════════════════════════════
// ANIMAÇÃO DE STATS (CONTADOR)
// ═══════════════════════════════════

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString('pt-PT');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString('pt-PT');
    }
  }, 16);
}

// Intersection Observer para animar stats quando entram em view
const observerOptions = {
  threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const statNum = entry.target.querySelector('.stat-num');
      const target = parseInt(statNum.getAttribute('data-target'));
      animateCounter(statNum, target);
      entry.target.dataset.animated = 'true';
    }
  });
}, observerOptions);

// Observa todos os stat-cards
document.querySelectorAll('.stat-card').forEach(card => {
  statsObserver.observe(card);
});

// ═══════════════════════════════════
// TICKER INFINITO
// ═══════════════════════════════════

const tickerTrack = document.getElementById('ticker');
if (tickerTrack) {
  const tickerSpeed = 0.5; // pixels por frame
  let tickerPos = 0;
  
  function animateTicker() {
    tickerPos -= tickerSpeed;
    tickerTrack.style.transform = `translateX(${tickerPos}px)`;
    
    // Reset quando chega ao final
    if (Math.abs(tickerPos) > tickerTrack.offsetWidth / 2) {
      tickerPos = 0;
    }
    
    requestAnimationFrame(animateTicker);
  }
  
  animateTicker();
}

// ═══════════════════════════════════
// BOTÃO "LIKE" COM FEEDBACK VISUAL
// ═══════════════════════════════════

document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    let likes = parseInt(btn.getAttribute('data-likes')) || 0;
    likes++;
    btn.setAttribute('data-likes', likes);
    btn.querySelector('span').textContent = likes.toLocaleString('pt-PT');
    
    // Efeito visual
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 100);
  });
});

// ═══════════════════════════════════
// ANIMAÇÃO DE ENTRADA DE PÁGINA
// ═══════════════════════════════════

function pageTransition() {
  pages.forEach(page => {
    if (page.classList.contains('active')) {
      page.style.animation = 'none';
      setTimeout(() => {
        page.style.animation = '';
      }, 10);
    }
  });
}

// ═══════════════════════════════════
// PRELOAD DE IMAGENS
// ═══════════════════════════════════

const imageElements = [
  { id: 'hero-img-baroque', url: 'img/baroque.jpg' },
  { id: 'hero-img-modern', url: 'img/modern.jpg' },
  { id: 'denuncia-bg', url: 'img/denuncia.jpg' },
  { id: 'vozes-bg', url: 'img/vozes.jpg' },
  { id: 'acao-bg', url: 'img/acao.jpg' },
  { id: 'post-img-1', url: 'img/convento.jpg' }
];

imageElements.forEach(img => {
  const elem = document.getElementById(img.id);
  if (elem) {
    elem.style.backgroundImage = `url('${img.url}')`;
  }
});

// ═══════════════════════════════════
// TECLA ESC PARA FECHAR MENU MOBILE
// ═══════════════════════════════════

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.mobileMenuOpen) {
    toggleMobileMenu();
  }
});

// ═══════════════════════════════════
// LOG DE INICIALIZAÇÃO
// ═══════════════════════════════════

console.log('✝ DIGNIDADE script carregado');
console.log('📍 Página atual:', state.currentPage);
console.log('🎯 Navegação ativa em todas as páginas');

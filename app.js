document.addEventListener('DOMContentLoaded', () => {
  try { if (window.lucide) lucide.createIcons(); } catch(e){}
  try { renderCaseStudiesList(); } catch(e){ console.error('Case studies error:', e); }
  try { renderPricingPacks(); } catch(e){ console.error('Pricing error:', e); }
  try { renderArticles(); } catch(e){ console.error('Articles error:', e); }
  try { initRoutingFromHash(); } catch(e){ console.error('Routing error:', e); }
  try { initSidebarScrollSpy(); } catch(e){ console.error('Scrollspy error:', e); }

  window.addEventListener('hashchange', initRoutingFromHash);
  window.addEventListener('popstate', initRoutingFromHash);

  // Écouteur global pour tous les liens d'ancres (Bouton Home, Navbar, Footer...)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.length > 1 && !href.startsWith('#lbc-sec-')) {
        const cleanId = href.replace(/^#/, '').replace(/^page-/, '');
        const targetSec = document.getElementById(`page-${cleanId}`);
        if (targetSec) {
          e.preventDefault();
          navigateTo(cleanId);
        }
      }
    }
  });
});

window.addEventListener('load', initRoutingFromHash);

function scrollToLbcSection(secId, el) {
  const target = document.getElementById(secId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (el) {
    document.querySelectorAll('.lbc-v2-menu-item').forEach(item => item.classList.remove('active'));
    const parentLi = el.closest ? el.closest('.lbc-v2-menu-item') : el;
    if (parentLi) parentLi.classList.add('active');
  }
}

/* CONTROLES AUDIO PODCAST FOODLES & BAMBINETS */
function toggleFoodlesAudio(btn) {
  const audio = document.getElementById('fdAudioElement');
  const icon = document.getElementById('fdPlayIcon');
  if (!audio) return;
  if (audio.paused) {
    audio.play();
    if (icon) icon.setAttribute('data-lucide', 'pause');
  } else {
    audio.pause();
    if (icon) icon.setAttribute('data-lucide', 'play');
  }
  if (window.lucide) lucide.createIcons();
}

function updateFoodlesAudioProgress() {
  const audio = document.getElementById('fdAudioElement');
  const seek = document.getElementById('fdAudioSeek');
  const timer = document.getElementById('fdAudioTimer');
  const durText = document.getElementById('fdAudioDurationText');
  if (!audio) return;

  if (seek && audio.duration) {
    seek.value = (audio.currentTime / audio.duration) * 100;
  }
  if (timer) {
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60);
    timer.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  }
  if (durText && audio.duration && !isNaN(audio.duration)) {
    const dm = Math.floor(audio.duration / 60);
    const ds = Math.floor(audio.duration % 60);
    durText.textContent = `${dm}:${ds < 10 ? '0' : ''}${ds}`;
  }
}

function seekFoodlesAudio(slider) {
  const audio = document.getElementById('fdAudioElement');
  if (audio && audio.duration) {
    audio.currentTime = (slider.value / 100) * audio.duration;
  }
}

/* ==========================================================================
   1. SPA ROUTING NAVIGATION
   ========================================================================== */
function navigateTo(pageId) {
  if (!pageId) return;
  const cleanId = pageId.replace(/^#/, '').replace(/^page-/, '');

  const sections = document.querySelectorAll('.spa-page-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.style.display = 'none';
  });

  const targetSection = document.getElementById(`page-${cleanId}`);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
  } else {
    const homeSec = document.getElementById('page-home');
    if (homeSec) {
      homeSec.classList.add('active');
      homeSec.style.display = 'block';
    }
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${cleanId}` || href === `#page-${cleanId}`) {
      link.classList.add('active');
    }
  });

  try {
    if (window.location.hash !== `#${cleanId}`) {
      history.pushState(null, '', `#${cleanId}`);
    }
  } catch (e) {
    // Fallback silencieux si file:// restreint pushState
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) lucide.createIcons();
}

function initRoutingFromHash() {
  const hash = window.location.hash.replace(/^#/, '').replace(/^page-/, '');
  if (hash && document.getElementById(`page-${hash}`)) {
    navigateTo(hash);
  } else if (!hash) {
    navigateTo('home');
  }
}

/* ==========================================================================
   2. RENDER CASE STUDIES LIST (AVEC GESTION DES VRAIES IMAGES OU PLACEHOLDERS)
   ========================================================================== */
function renderCaseStudiesList() {
  const container = document.getElementById('caseStudiesContainer');
  if (!container || typeof CASE_STUDIES_PRESENTATION === 'undefined' || !Array.isArray(CASE_STUDIES_PRESENTATION)) return;

  container.className = 'case-studies-glance-list';
  container.innerHTML = '';

  CASE_STUDIES_PRESENTATION.forEach(cs => {
    const card = document.createElement('article');
    card.className = 'project-glance-card';
    card.style.cursor = 'pointer';
    card.setAttribute('onclick', `openProjectDrawer('${cs.id}')`);

    // 4-step process HTML
    const glanceStepsHTML = (cs.glanceSteps || []).map((step, idx) => `
      <div class="glance-step-item">
        <div class="glance-step-num">${step.num}</div>
        <div class="glance-step-icon-circle">
          <i data-lucide="${step.icon}" aria-hidden="true"></i>
        </div>
        <div class="glance-step-label">${step.name}</div>
        ${idx < (cs.glanceSteps.length - 1) ? '<div class="glance-step-arrow">→</div>' : ''}
      </div>
    `).join('');

    // Methodology items HTML
    const methodologyHTML = (cs.methodology || []).map((item, idx) => `
      <span class="glance-methodo-item">
        <i data-lucide="${item.icon}" style="width:13px; height:13px;" aria-hidden="true"></i> ${item.name}
      </span>
      ${idx < (cs.methodology.length - 1) ? '<span class="glance-methodo-sep">|</span>' : ''}
    `).join('');

    card.innerHTML = `
      <div class="glance-card-main">
        <div class="glance-media-col" onclick="openProjectDrawer('${cs.id}')">
          <img src="${cs.image}" alt="Aperçu du projet UX : ${cs.title}">
        </div>

        <div class="glance-content-col">
          <div>
            <div class="glance-card-header">
              <h2 class="glance-project-title" onclick="openProjectDrawer('${cs.id}')">${cs.title}</h2>
              <div class="glance-project-subtitle">${cs.category}</div>
              
              <h3 class="glance-headline-quote">${cs.headline}</h3>
              ${cs.subheadline ? `<div class="glance-project-subquote" style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 13px; color: #9B5620; opacity: 0.9; margin-top: -6px; margin-bottom: 28px;">${cs.subheadline}</div>` : ''}
              ${cs.description ? `<p class="glance-project-desc">${cs.description}</p>` : ''}
            </div>

            <div class="glance-steps-section">
              <div class="glance-steps-title-wrap">
                <span class="glance-steps-title">LE PROJET EN UN COUP D'ŒIL</span>
                <span class="glance-steps-line"></span>
              </div>
              <div class="glance-steps-grid">
                ${glanceStepsHTML}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glance-methodo-bar">
        <span class="glance-methodo-label">${cs.methodologyLabel || 'Approche & outils :'}</span>
        <div class="glance-methodo-list">
          ${methodologyHTML}
        </div>
      </div>

      <div class="glance-card-footer">
        <button class="glance-card-cta" onclick="event.stopPropagation(); openProjectDrawer('${cs.id}'); return false;">
          Entrer dans le projet <span class="cta-arrow-icon">→</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

/* ==========================================================================
   3. MODALE PROJET (CASE STUDY DRAWER WITH YOUTUBE & AI NOTE)
   ========================================================================== */
function openProjectDrawer(projectId) {
  const overlay = document.getElementById('projectDrawerOverlay');
  if (!overlay) return;

  const mCordons = document.getElementById('modal-cordons-bleus');
  const mBambinets = document.getElementById('modal-bambinets');
  const mFoodles = document.getElementById('modal-foodles');

  if (projectId === 'bambinets') {
    if (mCordons) mCordons.style.display = 'none';
    if (mBambinets) mBambinets.style.display = 'block';
    if (mFoodles) mFoodles.style.display = 'none';
  } else if (projectId === 'foodles') {
    if (mCordons) mCordons.style.display = 'none';
    if (mBambinets) mBambinets.style.display = 'none';
    if (mFoodles) mFoodles.style.display = 'block';
  } else {
    if (mCordons) mCordons.style.display = 'block';
    if (mBambinets) mBambinets.style.display = 'none';
    if (mFoodles) mFoodles.style.display = 'none';
  }

  overlay.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
  const activeModal = document.querySelector('.project-modal-wrapper:not([style*="display: none"])');
  if (activeModal) {
    const mainContent = activeModal.querySelector('.lbc-v2-main-content, .bambinets-main-content, .foodles-main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }

  overlay.classList.add('active');
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    initSidebarScrollSpy();
  }, 100);
}

/* HELPER SCROLL ET AUDIO POUR LA MODALE V2 */
function toggleMobileProjectMenu(btn) {
  if (!btn) return;
  const sidebar = btn.closest('.lbc-v2-sidebar') || btn.parentElement;
  if (!sidebar) return;
  const menuList = sidebar.querySelector('.lbc-v2-menu-list');
  if (!menuList) return;
  const isOpen = menuList.classList.contains('mobile-open');
  if (isOpen) {
    menuList.classList.remove('mobile-open');
    btn.classList.remove('active');
  } else {
    menuList.classList.add('mobile-open');
    btn.classList.add('active');
  }
}

function scrollToLbcSection(secId, itemEl) {
  const target = document.getElementById(secId);
  if (target) {
    const overlay = document.getElementById('projectDrawerOverlay');
    if (overlay && overlay.classList.contains('active')) {
      const topPos = target.getBoundingClientRect().top + overlay.scrollTop - overlay.getBoundingClientRect().top - 20;
      overlay.scrollTo({ top: topPos, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (itemEl) {
    const parentSidebar = itemEl.closest('aside') || itemEl.closest('ul');
    if (parentSidebar) {
      parentSidebar.querySelectorAll('.lbc-v2-menu-item, .bambinets-menu-item').forEach(el => el.classList.remove('active'));
    } else {
      document.querySelectorAll('.lbc-v2-menu-item, .bambinets-menu-item').forEach(el => el.classList.remove('active'));
    }
    itemEl.classList.add('active');

    if (window.innerWidth <= 768) {
      const sidebar = itemEl.closest('.lbc-v2-sidebar') || itemEl.closest('aside');
      if (sidebar) {
        const menuList = sidebar.querySelector('.lbc-v2-menu-list');
        const btn = sidebar.querySelector('.lbc-v2-mobile-menu-btn');
        if (menuList) menuList.classList.remove('mobile-open');
        if (btn) btn.classList.remove('active');
      }
    }
  }
}

/* SCROLLSPY AUTOMATIQUE POUR LES SIDEBARS AU SCROLL */
function initSidebarScrollSpy() {
  const updateActiveSections = () => {
    const mainContainers = document.querySelectorAll('.lbc-v2-main-content, .bambinets-main-content, .foodles-main-content, .lbc-v2-modal-layout, .bambinets-page-container');
    
    mainContainers.forEach(container => {
      if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) return;
      const parentLayout = container.closest('.lbc-v2-modal-layout, .bambinets-page-container, body') || document;
      const sidebar = parentLayout.querySelector('.lbc-v2-sidebar, .bambinets-sidebar, .foodles-sidebar, aside');
      if (!sidebar) return;

      const menuItems = Array.from(sidebar.querySelectorAll('.lbc-v2-menu-item:not(.lbc-v2-menu-back-top), .bambinets-menu-item, .foodles-menu-item, li[onclick]'));
      if (!menuItems.length) return;

      const sectionTargets = [];
      menuItems.forEach(item => {
        const onclickAttr = item.getAttribute('onclick') || '';
        const match = onclickAttr.match(/['"]([a-zA-Z0-9_-]+-sec-[\d-]+|[a-zA-Z0-9_-]+-sec-\d+|sec-[a-zA-Z0-9_-]+|fd-sec-\d+|lbc-sec-[\d-]+)['"]/);
        if (match && match[1]) {
          const secEl = document.getElementById(match[1]);
          if (secEl) {
            sectionTargets.push({ id: match[1], secEl, menuItem: item });
          }
        }
      });

      if (!sectionTargets.length) return;

      const containerRect = container.getBoundingClientRect();
      let activeItem = null;
      const targetThreshold = containerRect.top + 200;

      for (let i = sectionTargets.length - 1; i >= 0; i--) {
        const { secEl, menuItem } = sectionTargets[i];
        if (!secEl) continue;
        const rect = secEl.getBoundingClientRect();
        if (rect.top <= targetThreshold) {
          activeItem = menuItem;
          break;
        }
      }

      if (!activeItem && sectionTargets.length > 0) {
        activeItem = sectionTargets[0].menuItem;
      }

      if (activeItem) {
        menuItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
      }
    });
  };

  const scrollTargets = [
    window,
    document,
    ...document.querySelectorAll('.lbc-v2-main-content, .bambinets-main-content, .foodles-main-content, #projectDrawerOverlay, .project-modal-wrapper')
  ];

  scrollTargets.forEach(el => {
    if (!el) return;
    try {
      el.removeEventListener('scroll', updateActiveSections);
      el.addEventListener('scroll', updateActiveSections, { passive: true });
    } catch(e){}
  });

  updateActiveSections();
}

function toggleLbcAudio(btn) {
  toggleAudio('lbcAudioElement', 'lbcPlayIcon');
}

function updateLbcAudioProgress() {
  updateAudioProgress('lbcAudioElement', 'lbcAudioTimer', 'lbcAudioSeek');
}

function seekLbcAudio(slider) {
  seekAudio(slider, 'lbcAudioElement');
}

function toggleBambinetsAudio(btn) {
  toggleAudio('bbAudioElement', 'bbPlayIcon');
}

function updateBambinetsAudioProgress() {
  updateAudioProgress('bbAudioElement', 'bbAudioTimer', 'bbAudioSeek');
}

function seekBambinetsAudio(slider) {
  seekAudio(slider, 'bbAudioElement');
}

function toggleAudio(audioId, iconId) {
  const audio = document.getElementById(audioId);
  const icon = document.getElementById(iconId);
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    if (icon) {
      icon.setAttribute('data-lucide', 'pause');
      if (window.lucide) lucide.createIcons();
    }
  } else {
    audio.pause();
    if (icon) {
      icon.setAttribute('data-lucide', 'play');
      if (window.lucide) lucide.createIcons();
    }
  }
}

function updateAudioProgress(audioId, timerId, seekId) {
  const audio = document.getElementById(audioId);
  const timer = document.getElementById(timerId);
  const seek = document.getElementById(seekId);
  if (!audio) return;

  if (timer) {
    const mins = Math.floor(audio.currentTime / 60);
    const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    timer.textContent = `${mins}:${secs}`;
  }

  if (seek && audio.duration) {
    seek.value = (audio.currentTime / audio.duration) * 100;
  }
}

function seekAudio(slider, audioId) {
  const audio = document.getElementById(audioId);
  if (!audio || !audio.duration) return;
  audio.currentTime = (slider.value / 100) * audio.duration;
}

function openCanvaModal(canvaUrl, projectTitle) {
  openProjectDrawer('cordons-bleus');
}

function playLbcVideo(container, videoId) {
  if (!container || !videoId) return;
  const isLocalFile = window.location.protocol === 'file:';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  container.style.position = 'relative';
  container.style.aspectRatio = '16/9';
  container.style.height = 'auto';
  container.style.cursor = 'default';
  
  if (isLocalFile) {
    container.innerHTML = `
      <div style="width:100%; height:100%; min-height:260px; background:#2C2623; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; text-align:center; color:#FFFDFC; font-family:inherit;">
        <div style="width:48px; height:48px; border-radius:50%; background:#C76D4B; display:flex; align-items:center; justify-content:center; margin-bottom:12px; box-shadow:0 4px 14px rgba(199,109,75,0.4);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:3px; color:#FFFDFC;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <p style="font-size:14.5px; font-weight:700; margin-bottom:6px; color:#FFFDFC;">Présentation vidéo Les Cordons Bleus</p>
        <p style="font-size:12.5px; color:#D4CCC9; margin-bottom:18px; max-width:400px; line-height:1.45;">En consultation locale sur ordinateur (<code>file://</code>), YouTube nécessite l'ouverture directe.<br>En ligne sur le web (HTTPS), la vidéo se lise directement intégrée ici.</p>
        <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" style="background:#C76D4B; color:#FFFDFC; font-size:13.5px; font-weight:600; padding:11px 22px; border-radius:30px; text-decoration:none; box-shadow:0 4px 14px rgba(199,109,75,0.4); display:inline-flex; align-items:center; gap:8px; transition:transform 0.2s ease;">
          Regarder la vidéo sur YouTube ↗
        </a>
      </div>
    `;
  } else {
    container.innerHTML = `
      <iframe 
        src="${embedUrl}" 
        title="Présentation vidéo du projet Les Cordons Bleus" 
        style="width: 100%; height: 100%; min-height: 260px; border: 0; border-radius: 12px; display: block;" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen>
      </iframe>
    `;
  }
}

function closeProjectDrawer() {
  const overlay = document.getElementById('projectDrawerOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

/* ==========================================================================
   4. OTHER RENDERERS (PRICING & ARTICLES)
   ========================================================================== */
function renderPricingPacks() {
  const container = document.getElementById('pricingPacksContainer');
  if (!container || typeof PRICING_PACKS === 'undefined' || !Array.isArray(PRICING_PACKS)) return;
  container.innerHTML = PRICING_PACKS.map(p => `
    <div class="card-japandi">
      <div style="font-size: 13px; font-weight: 700; color: var(--color-primary); margin-bottom: 6px;">${p.delay}</div>
      <h3 style="font-size: 20px; margin-bottom: 8px;">${p.title}</h3>
      <div class="price-tag" style="margin-bottom: 12px;">${p.price}</div>
      <p class="body-small">${p.desc}</p>
    </div>
  `).join('');
}

function renderArticles() {
  const container = document.getElementById('blogArticlesContainer');
  if (!container || typeof ARTICLES_DATA === 'undefined' || !Array.isArray(ARTICLES_DATA)) return;
  container.innerHTML = ARTICLES_DATA.map(a => `
    <div class="card-japandi" style="margin-bottom: 16px;">
      <div style="font-size: 12px; color: var(--color-primary); font-weight: 600; margin-bottom: 4px;">${a.category} • ${a.date}</div>
      <h3 style="font-size: 22px; margin-bottom: 6px;">${a.title}</h3>
      <p class="body-small">${a.summary}</p>
    </div>
  `).join('');
}

function handleContactSubmit(e) {
  e.preventDefault();
  alert('Merci ! Ton message a été envoyé avec succès.');
}

/* ==========================================================================
   5. CUSTOM CURSOR INTERACTIF SOFT MAGNÉTIQUE
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('customCursorDot');
  if (!cursor || !dot) return;

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactiveSelector = 'a, button, .btn-primary, .btn-secondary, .nav-link, .case-study-item-card, .footer-social-btn, .footer-contact-link, input, textarea, label, .drawer-close-btn';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove('hovered');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
  initCustomCursor();
}

/* ==========================================================================
   6. LIGHTBOX ZOOM MODAL POUR LES IMAGES DE CAS D'ÉTUDES
   ========================================================================== */
function openLightbox(imgSrc, captionText) {
  let lightbox = document.getElementById('imageLightboxOverlay');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'imageLightboxOverlay';
    lightbox.className = 'image-lightbox-overlay';
    lightbox.setAttribute('onclick', 'closeLightbox()');
    lightbox.innerHTML = `
      <button class="image-lightbox-close" aria-label="Fermer le zoom" onclick="closeLightbox()">✕</button>
      <img id="imageLightboxImg" class="image-lightbox-img" src="" alt="Agrandissement plein écran">
      <div id="imageLightboxCaption" class="image-lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);
  }
  const imgEl = document.getElementById('imageLightboxImg');
  const captionEl = document.getElementById('imageLightboxCaption');
  if (imgEl) imgEl.src = imgSrc;
  if (captionEl) captionEl.textContent = captionText || 'Cliquer n\'importe où pour fermer ✕';
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightboxOverlay');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

/* ==========================================================================
   7. GESTION DU CARROUSEL ÉDITORIAL DES PERSONAS (LES CORDONS BLEUS)
   ========================================================================== */
const LBC_PERSONA_DATA = {
  camille: {
    src: 'assets/PROJTS/CORDONS_BLEUS/persona_camille.png',
    alt: 'Fiche Persona UX Les Cordons Bleus — Camille',
    caption: 'Fiche Persona UX — Camille (Passionnée d’apprentissage) — Cliquer pour fermer ✕'
  },
  marc: {
    src: 'assets/PROJTS/CORDONS_BLEUS/persona_marc.png',
    alt: 'Fiche Persona UX Les Cordons Bleus — Marc',
    caption: 'Fiche Persona UX — Marc (Débutant en quête d’autonomie) — Cliquer pour fermer ✕'
  },
  sarah: {
    src: 'assets/PROJTS/CORDONS_BLEUS/persona_sarah.png',
    alt: 'Fiche Persona UX Les Cordons Bleus — Sarah',
    caption: 'Fiche Persona UX — Sarah / Parent (Pratique avec les enfants) — Cliquer pour fermer ✕'
  }
};

let lbcCurrentPersona = 'camille';
const lbcPersonaKeys = ['camille', 'marc', 'sarah'];

function switchPersona(name) {
  if (!LBC_PERSONA_DATA[name] || lbcCurrentPersona === name) return;

  const targets = [
    document.getElementById('lbc-active-persona-img'),
    document.getElementById('lbc-active-persona-img-page')
  ].filter(Boolean);

  const tabs = document.querySelectorAll('.lbc-v2-persona-tab');

  tabs.forEach(tab => {
    const isTarget = tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(`'${name}'`);
    if (isTarget) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });

  lbcCurrentPersona = name;
  const data = LBC_PERSONA_DATA[name];

  targets.forEach(imgEl => {
    imgEl.classList.remove('active');
    imgEl.classList.add('entering');

    setTimeout(() => {
      imgEl.src = data.src;
      imgEl.alt = data.alt;

      requestAnimationFrame(() => {
        imgEl.classList.remove('entering');
        imgEl.classList.add('active');
      });
    }, 140);
  });
}

function triggerActivePersonaLightbox() {
  const data = LBC_PERSONA_DATA[lbcCurrentPersona] || LBC_PERSONA_DATA['camille'];
  openLightbox(data.src, data.caption);
}

// Touch swipe support for mobile
let lbcTouchStartX = 0;
let lbcTouchEndX = 0;

document.addEventListener('touchstart', function(e) {
  const wrapper = e.target.closest('#panel-persona, #panel-persona-page');
  if (wrapper) {
    lbcTouchStartX = e.changedTouches[0].screenX;
  }
}, { passive: true });

document.addEventListener('touchend', function(e) {
  const wrapper = e.target.closest('#panel-persona, #panel-persona-page');
  if (wrapper) {
    lbcTouchEndX = e.changedTouches[0].screenX;
    const diff = lbcTouchEndX - lbcTouchStartX;
    if (Math.abs(diff) > 40) {
      const idx = lbcPersonaKeys.indexOf(lbcCurrentPersona);
      if (diff < 0 && idx < lbcPersonaKeys.length - 1) {
        switchPersona(lbcPersonaKeys[idx + 1]);
      } else if (diff > 0 && idx > 0) {
        switchPersona(lbcPersonaKeys[idx - 1]);
      }
    }
  }
}, { passive: true });

// Keyboard Navigation for tabs
document.addEventListener('keydown', function(e) {
  const activeTab = document.activeElement;
  if (activeTab && activeTab.classList.contains('lbc-v2-persona-tab')) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const idx = lbcPersonaKeys.indexOf(lbcCurrentPersona);
      if (e.key === 'ArrowRight' && idx < lbcPersonaKeys.length - 1) {
        switchPersona(lbcPersonaKeys[idx + 1]);
        const nextTab = document.querySelectorAll('.lbc-v2-persona-tab')[idx + 1];
        if (nextTab) nextTab.focus();
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        switchPersona(lbcPersonaKeys[idx - 1]);
        const prevTab = document.querySelectorAll('.lbc-v2-persona-tab')[idx - 1];
        if (prevTab) prevTab.focus();
      }
    }
  }
});


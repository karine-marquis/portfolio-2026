document.addEventListener('DOMContentLoaded', () => {
  try { if (window.lucide) lucide.createIcons(); } catch(e){}
  try { renderCaseStudiesList(); } catch(e){ console.error('Case studies error:', e); }
  try { renderPricingPacks(); } catch(e){ console.error('Pricing error:', e); }
  try { renderArticles(); } catch(e){ console.error('Articles error:', e); }
  try { initRoutingFromHash(); } catch(e){ console.error('Routing error:', e); }

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
              <p class="glance-project-desc">${cs.description}</p>
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
        <span class="glance-methodo-label">Méthodologie :</span>
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
  overlay.classList.add('active');
  }

  if (window.lucide) lucide.createIcons();
}

/* HELPER SCROLL ET AUDIO POUR LA MODALE V2 */
function scrollToLbcSection(secId, itemEl) {
  const target = document.getElementById(secId);
  const scrollContainer = target ? (target.closest('.lbc-v2-main-scroll') || document.getElementById('lbcMainScroll')) : document.getElementById('lbcMainScroll');
  if (target && scrollContainer) {
    const topPos = target.offsetTop - scrollContainer.offsetTop - 20;
    scrollContainer.scrollTo({ top: topPos, behavior: 'smooth' });
  }

  if (itemEl) {
    const parentSidebar = itemEl.closest('aside');
    if (parentSidebar) {
      parentSidebar.querySelectorAll('.lbc-v2-menu-item').forEach(el => el.classList.remove('active'));
    } else {
      document.querySelectorAll('.lbc-v2-menu-item').forEach(el => el.classList.remove('active'));
    }
    itemEl.classList.add('active');
  }
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
  const isLocal = window.location.protocol === 'file:';
  if (isLocal) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    return;
  }
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  container.innerHTML = `
    <iframe 
      src="${videoUrl}" 
      title="Présentation vidéo du projet Les Cordons Bleus" 
      style="width: 100%; height: 100%; min-height: 280px; border: 0; border-radius: 12px;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
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

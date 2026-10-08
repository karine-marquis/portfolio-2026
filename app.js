document.addEventListener('DOMContentLoaded', () => {
  try { if (window.lucide) lucide.createIcons(); } catch(e){}
  try { renderPricingPacks(); } catch(e){ console.error('Pricing error:', e); }
  try { renderArticles(); } catch(e){ console.error('Articles error:', e); }
  try { initRoutingFromHash(); } catch(e){ console.error('Routing error:', e); }
  try { initSidebarScrollSpy(); } catch(e){ console.error('Scrollspy error:', e); }
  try { initGlobalMobileBackToTop(); } catch(e){ console.error('BackToTop error:', e); }
  try { initAboutArtLightbox(); } catch(e){ console.error('Art Lightbox error:', e); }

  window.addEventListener('hashchange', initRoutingFromHash);
  window.addEventListener('popstate', initRoutingFromHash);

  // Écouteur global pour tous les liens d'ancres (Bouton Home, Navbar, Footer...)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.length > 1 && !href.startsWith('#lbc-sec-')) {
        const cleanId = href.replace(/^#/, '').replace(/^page-/, '');
        if (typeof pageSectionsMap !== 'undefined' && pageSectionsMap.has(`page-${cleanId}`)) {
          e.preventDefault();
          navigateTo(cleanId);
        } else if (document.getElementById(`page-${cleanId}`)) {
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

/* ACCORDÉONS PRESTATIONS — GESTION D'OUVERTURE / FERMETURE & ACCESSIBILITÉ EXCLUSIVE */
function toggleOfferAccordion(headerBtn) {
  if (!headerBtn) return;
  const item = headerBtn.closest('.offer-accordion-item');
  if (!item) return;

  const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    headerBtn.setAttribute('aria-expanded', 'false');
    item.classList.remove('offer-accordion-open');
    item.classList.add('offer-accordion-closed');
  } else {
    // Refermer tous les autres accordéons de la section offres pour l'ouverture exclusive
    const allItems = document.querySelectorAll('.offer-accordion-item');
    allItems.forEach(other => {
      const otherBtn = other.querySelector('.offer-accordion-header');
      if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      other.classList.remove('offer-accordion-open');
      other.classList.add('offer-accordion-closed');
    });

    headerBtn.setAttribute('aria-expanded', 'true');
    item.classList.add('offer-accordion-open');
    item.classList.remove('offer-accordion-closed');
  }
}

/* CONTROLES AUDIO PODCAST FOODLES & BAMBINETS */
function toggleFoodlesAudio(btn) {
  toggleAudio('fdAudioElement', 'fdPlayIcon');
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
   1. SPA ROUTING & DOM ISOLATION (MODE AUDIT ACCESSIBILITÉ)
   ========================================================================== */
const pageSectionsMap = new Map();
const sectionPlaceholders = new Map();
let drawerOverlayNode = null;

function initDomSections() {
  if (pageSectionsMap.size === 0) {
    const sections = document.querySelectorAll('.spa-page-section');
    sections.forEach(sec => {
      const id = sec.id;
      pageSectionsMap.set(id, sec);
      const placeholder = document.createComment(` placeholder for ${id} `);
      if (sec.parentNode) {
        sec.parentNode.insertBefore(placeholder, sec);
      }
      sectionPlaceholders.set(id, placeholder);
    });

    const drawer = document.getElementById('projectDrawerOverlay');
    if (drawer) {
      drawerOverlayNode = drawer;
    }
  }
}

function navigateTo(pageId) {
  if (!pageId) return;
  initDomSections();

  const cleanId = pageId.replace(/^#/, '').replace(/^page-/, '');
  let targetId = `page-${cleanId}`;

  if (!pageSectionsMap.has(targetId)) {
    targetId = 'page-about';
  }

  // 1. FERMER ET RÉINITIALISER LES DRAWERS ET LEURS SCROLLTOPS
  if (typeof closeProjectDrawer === 'function') {
    closeProjectDrawer();
  }
  const drawerOverlay = drawerOverlayNode || document.getElementById('projectDrawerOverlay');
  if (drawerOverlay) {
    drawerOverlay.scrollTop = 0;
  }
  const modalScrollables = document.querySelectorAll('.lbc-v2-main-content, .bambinets-main-content, .foodles-main-content, .lbc-v2-modal-layout, .bambinets-page-container');
  modalScrollables.forEach(el => {
    if (el) el.scrollTop = 0;
  });

  // 2. GESTION DU HASH DANS L'URL
  try {
    const targetHash = `#${cleanId}`;
    if (window.location.hash !== targetHash) {
      history.pushState(null, '', targetHash);
    }
  } catch (e) {
    // Fallback silencieux si file:// restreint pushState
  }

  // 3. MONTER UNIQUEMENT LA SECTION ACTIVE DANS LE DOM (les autres sont physiquement détachées)
  pageSectionsMap.forEach((sec, id) => {
    if (id === targetId) {
      const placeholder = sectionPlaceholders.get(id);
      if (placeholder && placeholder.parentNode && !sec.parentNode) {
        placeholder.parentNode.insertBefore(sec, placeholder);
      }
      sec.classList.add('active');
      sec.style.display = 'block';
    } else {
      sec.classList.remove('active');
      sec.style.display = 'none';
      if (sec.parentNode) {
        sec.parentNode.removeChild(sec);
      }
    }
  });

  // Si on n'est pas sur la page projets, détacher également le drawer overlay du DOM
  if (drawerOverlayNode) {
    if (cleanId === 'projects') {
      if (!drawerOverlayNode.parentNode) {
        document.body.appendChild(drawerOverlayNode);
      }
    } else {
      if (drawerOverlayNode.parentNode) {
        drawerOverlayNode.parentNode.removeChild(drawerOverlayNode);
      }
    }
  }

  // Si on arrive sur la page projets, s'assurer que les cartes sont rendues
  if (cleanId === 'projects' && typeof renderCaseStudiesList === 'function') {
    try { renderCaseStudiesList(); } catch(e){}
  }

  // Si on arrive sur la page approche, hydrater ses images en chargement différé
  if (cleanId === 'approach') {
    const secApproach = pageSectionsMap.get('page-approach') || document.getElementById('page-approach');
    if (secApproach) {
      secApproach.querySelectorAll('img[data-src]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
  }

  // Actualiser les cibles après le montage et l'hydratation de la page active.
  try { initScrollRevealObserver(); } catch(e){ console.error('ScrollReveal error:', e); }

  // 4. METTRE À JOUR L'ÉTAT ACTIF DES LIENS DE NAVIGATION
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${cleanId}` || href === `#page-${cleanId}` || href === `#${targetId}`) {
      link.classList.add('active');
    }
  });

  // 5. RESET DU SCROLL APRÈS RENDU ET REFLOW SUR DOUBLE REQUESTANIMATIONFRAME
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  });

  if (window.lucide) lucide.createIcons();
}

function initRoutingFromHash() {
  initDomSections();
  const hash = window.location.hash.replace(/^#/, '').replace(/^page-/, '');
  if (hash === 'cordons-bleus' || hash === 'bambinets' || hash === 'foodles') {
    navigateTo('projects');
    if (typeof openProjectDrawer === 'function') openProjectDrawer(hash);
  } else if (hash && pageSectionsMap.has(`page-${hash}`)) {
    navigateTo(hash);
  } else {
    // Si aucun hash ou page non trouvée, on ouvre T'es qui ? (about) pour l'audit isolé
    navigateTo(hash || 'about');
  }
}

/* ==========================================================================
   2. RENDER CASE STUDIES LIST (AVEC GESTION DES VRAIES IMAGES OU PLACEHOLDERS)
   ========================================================================== */
function renderCaseStudiesList() {
  const container = document.getElementById('caseStudiesContainer');
  if (!container) return;

  const lazyImages = container.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0) {
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
    return;
  }

  if (container.children.length > 0) {
    return;
  }

  if (typeof CASE_STUDIES_PRESENTATION === 'undefined' || !Array.isArray(CASE_STUDIES_PRESENTATION)) return;

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
              ${cs.subheadline ? `<div class="glance-project-subquote" style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 13px; color: #7A3F2A; margin-top: -6px; margin-bottom: 28px;">${cs.subheadline}</div>` : ''}
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
    if (mBambinets) {
      mBambinets.querySelectorAll('img[data-src]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      mBambinets.style.display = 'block';
    }
    if (mFoodles) mFoodles.style.display = 'none';
  } else if (projectId === 'foodles') {
    if (mCordons) mCordons.style.display = 'none';
    if (mBambinets) mBambinets.style.display = 'none';
    if (mFoodles) {
      mFoodles.querySelectorAll('img[data-src]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      mFoodles.querySelectorAll('video[data-poster]').forEach(vid => {
        if (vid.dataset.poster) {
          vid.poster = vid.dataset.poster;
          vid.removeAttribute('data-poster');
        }
      });
      mFoodles.style.display = 'block';
    }
  } else {
    if (mCordons) {
      mCordons.querySelectorAll('img[data-src]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      mCordons.style.display = 'block';
    }
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
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        const currentIcon = document.getElementById(iconId);
        if (currentIcon) {
          currentIcon.setAttribute('data-lucide', 'pause');
          if (window.lucide) lucide.createIcons();
        }
      }).catch(err => {
        console.warn(`Lecture audio pour #${audioId} bloquée ou rejetée :`, err);
        const currentIcon = document.getElementById(iconId);
        if (currentIcon) {
          currentIcon.setAttribute('data-lucide', 'play');
          if (window.lucide) lucide.createIcons();
        }
      });
    } else {
      const currentIcon = document.getElementById(iconId);
      if (currentIcon) {
        currentIcon.setAttribute('data-lucide', 'pause');
        if (window.lucide) lucide.createIcons();
      }
    }
  } else {
    audio.pause();
    const currentIcon = document.getElementById(iconId);
    if (currentIcon) {
      currentIcon.setAttribute('data-lucide', 'play');
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
        <div style="width:48px; height:48px; border-radius:50%; background:var(--color-accent); display:flex; align-items:center; justify-content:center; margin-bottom:12px; box-shadow:0 4px 14px rgba(155,86,32,0.4);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:3px; color:#FFFDFC;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <p style="font-size:14.5px; font-weight:700; margin-bottom:6px; color:#FFFDFC;">Présentation vidéo Les Cordons Bleus</p>
        <p style="font-size:12.5px; color:#D4CCC9; margin-bottom:18px; max-width:400px; line-height:1.45;">En consultation locale sur ordinateur (<code>file://</code>), YouTube nécessite l'ouverture directe.<br>En ligne sur le web (HTTPS), la vidéo se lise directement intégrée ici.</p>
        <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" style="background:var(--color-accent); color:#FFFDFC; font-size:13.5px; font-weight:600; padding:11px 22px; border-radius:30px; text-decoration:none; box-shadow:0 4px 14px rgba(155,86,32,0.4); display:inline-flex; align-items:center; gap:8px; transition:transform 0.2s ease;">
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
    overlay.scrollTop = 0;
  }
  const modalScrollables = document.querySelectorAll('.lbc-v2-main-content, .bambinets-main-content, .foodles-main-content, .lbc-v2-modal-layout, .bambinets-page-container');
  modalScrollables.forEach(el => {
    if (el) el.scrollTop = 0;
  });
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

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerText : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'Envoi en cours...';
  }

  try {
    const formData = new FormData(form);
    const response = await fetch('https://formspree.io/f/xbgdgaep', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      alert('Merci ! Votre message a été envoyé avec succès.');
      form.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      if (data && data.errors && data.errors.length > 0) {
        const errorMsg = data.errors.map(err => err.message).join(', ');
        alert(`Une erreur est survenue lors de l'envoi : ${errorMsg}`);
      } else {
        alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer ou m'écrire directement à karinemarquis.ux@gmail.com.");
      }
    }
  } catch (error) {
    alert("Impossible de joindre le service d'envoi. Veuillez vérifier votre connexion ou m'écrire directement à karinemarquis.ux@gmail.com.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    }
  }
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

/* SCROLL REVEAL OBSERVER */
let scrollRevealObserver = null;

function initScrollRevealObserver() {
  // Retirer les anciennes cibles, notamment celles des pages détachées du DOM.
  if (scrollRevealObserver) scrollRevealObserver.disconnect();
  const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (!scrollRevealObserver) {
      scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.isConnected) {
            entry.target.classList.add('revealed');
            scrollRevealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    elements.forEach(el => scrollRevealObserver.observe(el));
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/* BOUTON GLOBAL RETOUR EN HAUT (MOBILE & TABLETTE) */
function initGlobalMobileBackToTop() {
  const btn = document.getElementById('globalMobileScrollToTopBtn');
  if (!btn) return;

  function updateVisibility() {
    const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const threshold = window.innerHeight || 400;
    if (scrollPos >= threshold) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  window.addEventListener('orientationchange', updateVisibility, { passive: true });
  updateVisibility();

  btn.addEventListener('click', function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}

/* LIGHTBOX DÉDIÉE SECTION ART & SENSIBILITÉ (PAGE T'ES QUI ?) */
function initAboutArtLightbox() {
  const lightbox = document.getElementById('aboutArtLightbox');
  const lightboxImg = document.getElementById('aboutArtLightboxImg');
  const closeBtn = document.getElementById('aboutArtLightboxClose');
  const artCards = document.querySelectorAll('.about-art-section .about-art-card');

  if (!lightbox || !lightboxImg || !artCards.length) return;

  let previousActiveElement = null;

  function openLightbox(imgEl) {
    if (!imgEl || !imgEl.src) return;
    previousActiveElement = document.activeElement;
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || 'Création artistique — Karine Marquis';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
    lightboxImg.alt = '';
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  artCards.forEach(card => {
    const img = card.querySelector('img.about-art-img');
    if (!img) return;

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('about-art-lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}



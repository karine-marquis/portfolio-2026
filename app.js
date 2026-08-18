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
  const drawerContainer = document.getElementById('projectDrawerContainer');

  if (!overlay || !drawerContainer) return;

  drawerContainer.innerHTML = `
    <div class="lbc-v2-modal-layout">
      
      <!-- SIDEBAR GAUCHE (NAVIGATION 8 ÉTAPES) -->
      <aside class="lbc-v2-sidebar">
        <div class="lbc-v2-sidebar-brand">
          <h2 class="lbc-v2-brand-title">Les Cordons Bleus</h2>
          <div class="lbc-v2-brand-category">UX & digital learning</div>
          <p class="lbc-v2-brand-tagline">Prolonger l'apprentissage au-delà de l'atelier.</p>
        </div>

        <div class="lbc-v2-sidebar-sep"></div>

        <ul class="lbc-v2-menu-list">
          <li class="lbc-v2-menu-item active" onclick="scrollToLbcSection('lbc-sec-1', this)">
            <span class="menu-num">1</span>
            <span class="menu-label">Le point de départ</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-2', this)">
            <span class="menu-num">2</span>
            <span class="menu-label">Ce que j'ai cherché à comprendre</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-3', this)">
            <span class="menu-num">3</span>
            <span class="menu-label">Ma démarche</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-4', this)">
            <span class="menu-num">4</span>
            <span class="menu-label">Ce que j'ai découvert</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-5', this)">
            <span class="menu-num">5</span>
            <span class="menu-label">Les solutions retenues</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-6', this)">
            <span class="menu-num">6</span>
            <span class="menu-label">Entrer dans les coulisses du projet</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-7', this)">
            <span class="menu-num">7</span>
            <span class="menu-label">Écouter le projet autrement</span>
          </li>
          <li class="lbc-v2-menu-item" onclick="scrollToLbcSection('lbc-sec-8', this)">
            <span class="menu-num">8</span>
            <span class="menu-label">Ce que la refonte devait permettre</span>
          </li>
        </ul>

        <img src="assets/lbc_sidebar_utensils.png" alt="Cuisine Ustensiles" class="lbc-v2-sidebar-bg-img">
      </aside>

      <!-- PANNEAU PRINCIPAL À DROITE (DYNAMIQUE ET STRUCTURÉ HTML/CSS) -->
      <main class="lbc-v2-main-content" id="lbcMainScroll">
        
        <!-- HERO ROW -->
        <div class="lbc-v2-hero-row" id="lbc-sec-1">
          <div class="lbc-v2-hero-text">
            <span class="lbc-v2-pill-badge">Le projet en détail</span>
            <h1 class="lbc-v2-main-title">Du constat aux solutions</h1>
            <p class="lbc-v2-intro-p">
              Entre l’apprentissage guidé et la pratique autonome, le passage n’est pas toujours <strong>si simple</strong>.
            </p>
            <p class="lbc-v2-intro-p">
              La refonte explore comment créer une <strong>continuité</strong> entre l’expérience en cuisine et l’expérience numérique.
            </p>

            <div class="lbc-v2-tags-wrap">
              <span class="lbc-v2-tag-pill">⟡ Recherche UX</span>
              <span class="lbc-v2-tag-pill">⟡ Architecture de l'information</span>
              <span class="lbc-v2-tag-pill">⟡ Tests utilisateurs</span>
              <span class="lbc-v2-tag-pill">⟡ Digital learning</span>
            </div>
          </div>

          <div class="lbc-v2-hero-img-wrap">
            <img src="assets/lbc_hero_kitchen.png" alt="Atelier Les Cordons Bleus">
          </div>
        </div>

        <!-- GRILLE DES 3 CARTES PRINCIPALES -->
        <div class="lbc-v2-cards-grid" id="lbc-sec-2">
          <!-- CARD 1 -->
          <div class="lbc-v2-card" id="lbc-sec-3">
            <div class="lbc-v2-card-icon"><i data-lucide="target"></i></div>
            <h3 class="lbc-v2-card-title">Le défi</h3>
            <p class="lbc-v2-card-body">
              Réussir une recette avec un chef, c'est une chose. <strong>La refaire seul</strong> chez soi, c'en est une autre.<br><br>
              La <strong>continuité</strong> après l'atelier est <strong>faible</strong> : peu de repères, peu de <strong>suivi</strong>, et une expérience numérique qui ne répond pas aux vrais besoins des apprenants.
            </p>
          </div>

          <!-- CARD 2 -->
          <div class="lbc-v2-card" id="lbc-sec-4">
            <div class="lbc-v2-card-icon"><i data-lucide="user"></i></div>
            <h3 class="lbc-v2-card-title">Ma mission</h3>
            <p class="lbc-v2-card-body">
              Faire en sorte que l'expérience ne <strong>retombe pas</strong> dès que le tablier est rangé.<br><br>
              J'ai repensé le parcours <strong>avant, pendant</strong> et <strong>après</strong> le cours pour créer un <strong>lien durable</strong> entre l'<strong>apprentissage</strong> en cuisine et la <strong>pratique à la maison</strong>.
            </p>
          </div>

          <!-- CARD 3 -->
          <div class="lbc-v2-card" id="lbc-sec-5">
            <div class="lbc-v2-card-icon"><i data-lucide="trending-up"></i></div>
            <h3 class="lbc-v2-card-title" style="font-size: 18px !important;">Ce que la refonte devait permettre</h3>
            <ul class="lbc-v2-card-bullets">
              <li><strong>Renforcer la mémorisation</strong> et la <strong>mise en pratique</strong> à la maison</li>
              <li><strong>Prolonger l'engagement</strong> après l'atelier</li>
              <li>Créer une <strong>expérience fluide</strong>, accessible et motivante</li>
              <li><strong>Valoriser l'expertise</strong> des chefs</li>
            </ul>
          </div>
        </div>

        <!-- SECTION COULISSES -->
        <div id="lbc-sec-6">
          <h3 class="lbc-v2-coulisses-title">Entrer dans les coulisses du projet</h3>

          <div class="lbc-v2-coulisses-grid" id="lbc-sec-7">
            
            <!-- SUBCARD PODCAST AUDIO -->
            <div class="lbc-v2-subcard">
              <div class="lbc-v2-audio-header">
                <div class="lbc-v2-card-icon" style="margin-bottom: 0;"><i data-lucide="headphones"></i></div>
                <div class="lbc-v2-audio-title-wrap">
                  <h4>Écouter le projet autrement</h4>
                  <span class="lbc-v2-audio-duration">Durée d'écoute : 08:45</span>
                </div>
              </div>

              <!-- LECTEUR AUDIO HTML5 AVEC BOUTON INTERACTIF -->
              <div class="lbc-v2-custom-player">
                <button class="lbc-v2-play-btn" onclick="toggleLbcAudio(this)" aria-label="Écouter le podcast">
                  <i data-lucide="play" id="lbcPlayIcon" style="width: 16px; height: 16px;"></i>
                </button>
                <span class="lbc-v2-player-timer" id="lbcAudioTimer">0:00</span>
                <input type="range" class="lbc-v2-player-slider" id="lbcAudioSeek" value="0" max="100" oninput="seekLbcAudio(this)">
                <span class="lbc-v2-player-timer">08:45</span>
                <i data-lucide="volume-2" style="width: 16px; height: 16px; color: var(--color-accent);"></i>
              </div>

              <audio id="lbcAudioElement" src="assets/podcasts/cordons-bleus-podcast.m4a" ontimeupdate="updateLbcAudioProgress()"></audio>

              <p class="lbc-v2-disclaimer-note">
                ✨ <strong>Podcast réalisé avec NotebookLM — version 1.</strong><br>
                Quelques imperfections de prononciation ou de fluidité peuvent subsister. Merci de votre compréhension.
              </p>
            </div>

            <!-- SUBCARD PRÉSENTATION YOUTUBE -->
            <div class="lbc-v2-subcard" id="lbc-sec-8">
              <div class="lbc-v2-pres-flex">
                <div class="lbc-v2-pres-info">
                  <h4>La présentation complète</h4>
                  <p>
                    Le projet, de la problématique aux solutions retenues, avec les principaux choix de conception et livrables.
                  </p>
                  <a href="https://www.youtube.com/watch?v=JhXAkBDHNaE" target="_blank" rel="noopener" class="lbc-v2-youtube-btn">
                    <i data-lucide="play" style="width: 14px; height: 14px;"></i> Voir la présentation sur YouTube ➔
                  </a>
                </div>
                <img src="assets/lbc_presentation_thumb.png" alt="Aperçu Présentation" class="lbc-v2-pres-thumb">
              </div>

              <p class="lbc-v2-disclaimer-note" style="margin-top: 10px;">
                ⓘ <strong>À regarder tranquillement :</strong> la présentation défile vite.<br>
                Pour une lecture confortable, je recommande une vitesse de <strong>0,5x</strong> — voire <strong>0,25x</strong> si vous souhaitez prendre le temps de lire chaque écran.
              </p>
            </div>

          </div>
        </div>

        <!-- BOTTOM CONTACT CTA CARD -->
        <div class="lbc-v2-contact-card">
          <div class="lbc-v2-contact-left">
            <div class="lbc-v2-card-icon" style="margin-bottom: 0;"><i data-lucide="mail"></i></div>
            <div class="lbc-v2-contact-info">
              <h4>Besoin d'aller plus loin ?</h4>
              <p>Certains livrables du projet peuvent être présentés sur demande.</p>
            </div>
          </div>
          <a href="mailto:karinemarquis.ux@gmail.com" class="lbc-v2-contact-btn">
            Me contacter ➔
          </a>
        </div>

      </main>

      <!-- BOUTON FLÈCHE FLOTTANTE DISCRÈTE DE SCROLL -->
      <div id="lbcScrollPill" class="lbc-scroll-pill-indicator" aria-label="Défiler vers le bas">
        <span class="scroll-arrow">↓</span>
      </div>
    </div>
  `;

  overlay.classList.add('active');

  // Gérer la flèche flottante continue en parallaxe (orientation dynamique haut/bas) et le menu
  const mainScroll = document.getElementById('lbcMainScroll');
  const scrollPill = document.getElementById('lbcScrollPill');
  let lastScrollTop = 0;

  if (mainScroll && scrollPill) {
    const arrowSpan = scrollPill.querySelector('.scroll-arrow');

    function updateParallaxArrowPosition() {
      const currentScrollTop = mainScroll.scrollTop;
      const maxScroll = mainScroll.scrollHeight - mainScroll.clientHeight;
      const scrollProgress = maxScroll > 0 ? (currentScrollTop / maxScroll) : 0;
      const availableTrack = mainScroll.clientHeight - 120;
      
      // Position parallaxe fluide le long du panneau de droite
      const targetTop = currentScrollTop + 60 + (scrollProgress * availableTrack);
      scrollPill.style.top = targetTop + 'px';
      scrollPill.style.opacity = '1';

      if (arrowSpan) {
        if (currentScrollTop > lastScrollTop + 1) {
          // Défilement vers le bas -> flèche vers le bas ↓
          arrowSpan.textContent = '↓';
        } else if (currentScrollTop < lastScrollTop - 1) {
          // Défilement vers le haut -> flèche vers le haut ↑
          arrowSpan.textContent = '↑';
        }
      }
      lastScrollTop = currentScrollTop;
    }

    // Écouteur de la molette pour une réactivité instantanée de l'orientation de la flèche
    mainScroll.addEventListener('wheel', function(e) {
      if (arrowSpan) {
        if (e.deltaY > 0) {
          arrowSpan.textContent = '↓';
        } else if (e.deltaY < 0) {
          arrowSpan.textContent = '↑';
        }
      }
    }, { passive: true });

    mainScroll.addEventListener('scroll', updateParallaxArrowPosition);
    updateParallaxArrowPosition();

      // Synchroniser automatiquement l'étape active (1 à 8) dans la sidebar
      const sections = [
        { id: 'lbc-sec-1', index: 0 },
        { id: 'lbc-sec-2', index: 1 },
        { id: 'lbc-sec-3', index: 2 },
        { id: 'lbc-sec-4', index: 3 },
        { id: 'lbc-sec-5', index: 4 },
        { id: 'lbc-sec-6', index: 5 },
        { id: 'lbc-sec-7', index: 6 },
        { id: 'lbc-sec-8', index: 7 }
      ];

      const menuItems = document.querySelectorAll('.lbc-v2-menu-item');
      let currentActiveIndex = 0;

      sections.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop - mainScroll.offsetTop - 80;
          if (mainScroll.scrollTop >= top) {
            currentActiveIndex = sec.index;
          }
        }
      });

      menuItems.forEach((item, idx) => {
        if (idx === currentActiveIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  }

  if (window.lucide) lucide.createIcons();
}

/* HELPER SCROLL ET AUDIO POUR LA MODALE V2 */
function scrollToLbcSection(secId, itemEl) {
  const target = document.getElementById(secId);
  const scrollContainer = document.getElementById('lbcMainScroll');
  if (target && scrollContainer) {
    const topPos = target.offsetTop - scrollContainer.offsetTop - 20;
    scrollContainer.scrollTo({ top: topPos, behavior: 'smooth' });
  }

  if (itemEl) {
    document.querySelectorAll('.lbc-v2-menu-item').forEach(el => el.classList.remove('active'));
    itemEl.classList.add('active');
  }
}

function toggleLbcAudio(btn) {
  const audio = document.getElementById('lbcAudioElement');
  const icon = document.getElementById('lbcPlayIcon');
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

function updateLbcAudioProgress() {
  const audio = document.getElementById('lbcAudioElement');
  const timer = document.getElementById('lbcAudioTimer');
  const seek = document.getElementById('lbcAudioSeek');
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

function seekLbcAudio(slider) {
  const audio = document.getElementById('lbcAudioElement');
  if (!audio || !audio.duration) return;
  audio.currentTime = (slider.value / 100) * audio.duration;
}

function openCanvaModal(canvaUrl, projectTitle) {
  openProjectDrawer('cordons-bleus');
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

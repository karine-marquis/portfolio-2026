document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  renderCaseStudiesList();
  renderPricingPacks();
  renderArticles();
  initRoutingFromHash();
});

/* ==========================================================================
   1. SPA ROUTING NAVIGATION
   ========================================================================== */
function navigateTo(pageId) {
  const sections = document.querySelectorAll('.spa-page-section');
  sections.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(`page-${pageId}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${pageId}`) {
      link.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) lucide.createIcons();
}

function initRoutingFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`page-${hash}`)) {
    navigateTo(hash);
  }
}

/* ==========================================================================
   2. RENDER CASE STUDIES LIST (AVEC GESTION DES VRAIES IMAGES OU PLACEHOLDERS)
   ========================================================================== */
function renderCaseStudiesList() {
  const container = document.getElementById('caseStudiesContainer');
  if (!container) return;

  container.innerHTML = '';

  CASE_STUDIES_PRESENTATION.forEach(cs => {
    const card = document.createElement('article');
    card.className = 'case-study-item-card';

    const mediaHTML = cs.image ? `
      <div class="cs-card-media">
        <img src="${cs.image}" alt="${cs.title}">
      </div>
    ` : `
      <div class="cs-card-media-placeholder">
        <div class="cs-placeholder-inner">
          <div class="cs-placeholder-icon"><i data-lucide="image"></i></div>
          <div class="cs-placeholder-text">Visuel ${cs.title.split('–')[0]}</div>
          <div class="cs-placeholder-sub">(Emplacement réservé)</div>
        </div>
      </div>
    `;

    card.innerHTML = `
      ${mediaHTML}

      <div class="cs-card-body">
        <div>
          <div class="cs-card-header-row">
            <span class="cs-card-number">${cs.number}</span>
            <span class="cs-card-tags">${cs.tags.join(' • ')}</span>
          </div>

          <h2 class="cs-card-title">${cs.title}</h2>
          <p class="cs-card-subtitle-italic">${cs.subtitle}</p>

          <div class="cs-card-details-grid">
            <div>
              <div class="cs-detail-col-title">Le problème</div>
              <div class="cs-detail-col-text">${cs.problem}</div>
            </div>
            <div>
              <div class="cs-detail-col-title">Ma démarche</div>
              <div class="cs-detail-col-text">${cs.demarche}</div>
            </div>
            <div>
              <div class="cs-detail-col-title">Livrables clés</div>
              <div class="cs-detail-col-text">${cs.livrables}</div>
            </div>
          </div>

          <div class="cs-steps-row">
            ${cs.steps.map(s => `
              <div class="cs-step-badge-item">
                <div class="cs-step-icon-circle"><i data-lucide="${s.icon}"></i></div>
                <div class="cs-step-label">${s.name}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="cs-card-ctas-row">
          <button class="cs-btn-canva-main" onclick="openCanvaModal('${cs.canvaUrl}', '${cs.title.replace(/'/g, "\\'")}')">
            Voir la présentation du projet <i data-lucide="external-link" style="width:14px; height:14px;"></i>
          </button>
          
          <a href="#contact" class="cs-btn-deliverables-link" onclick="navigateTo('contact'); return false;">
            Demander les livrables détaillés
          </a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

/* ==========================================================================
   3. MODALE CANVA (DRAWER INTERACTIF CANVA EMBED)
   ========================================================================== */
function openCanvaModal(canvaUrl, projectTitle) {
  const overlay = document.getElementById('projectDrawerOverlay');
  const drawerContainer = document.getElementById('projectDrawerContainer');

  if (!overlay || !drawerContainer) return;

  drawerContainer.innerHTML = `
    <div class="canva-modal-container">
      <div class="canva-modal-header">
        <h3 class="canva-modal-title">${projectTitle} — Présentation Canva</h3>
        <a href="${canvaUrl}" target="_blank" rel="noopener" class="btn-primary" style="font-size: 13.5px; padding: 8px 16px !important;">
          Ouvrir sur Canva.com ↗
        </a>
      </div>

      <div class="canva-iframe-wrapper">
        <iframe src="${canvaUrl}" allowfullscreen allow="fullscreen" title="${projectTitle}"></iframe>
      </div>
    </div>
  `;

  overlay.classList.add('active');
  if (window.lucide) lucide.createIcons();
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
  if (!container) return;
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
  if (!container) return;
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

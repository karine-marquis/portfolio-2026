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

  container.className = 'case-studies-glance-list';
  container.innerHTML = '';

  CASE_STUDIES_PRESENTATION.forEach(cs => {
    const card = document.createElement('article');
    card.className = 'project-glance-card';

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
        <div class="glance-media-col">
          <img src="${cs.image}" alt="Aperçu du projet UX : ${cs.title}">
        </div>

        <div class="glance-content-col">
          <div>
            <div class="glance-card-header">
              <h2 class="glance-project-title">${cs.title}</h2>
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

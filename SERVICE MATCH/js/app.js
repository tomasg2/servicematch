// State Management
let currentLang = 'cz';
let currentTab = 'craftsman'; // 'craftsman' | 'helper' | 'demands'
let activeProviders = [...mockProviders];
let activeDemands = [...mockDemands];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  registerPWA();
});

function initApp() {
  setupLanguageSwitchers();
  setupTabSwitchers();
  populateDropdowns();
  setupFilters();
  setupCalculator();
  setupModals();
  renderProviders();
  updateLanguageUI();
}

// PWA Service Worker Registration
function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('Service Worker registered:', reg.scope))
        .catch((err) => console.log('Service Worker registration failed:', err));
    });
  }
}

// Analytics Event Helper
function trackEvent(eventName, eventParams = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else {
    console.log(`[Analytics Event Tracked]: ${eventName}`, eventParams);
  }
}

// Language Switching Engine
function setupLanguageSwitchers() {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      langBtns.forEach(b => b.classList.remove('active'));
      const lang = e.currentTarget.dataset.lang;
      currentLang = lang;
      e.currentTarget.classList.add('active');
      trackEvent('change_language', { language: lang });
      updateLanguageUI();
      renderProviders();
    });
  });
}

function updateLanguageUI() {
  const dict = i18n[currentLang];
  
  // Title & Head
  document.title = dict.siteTitle;
  
  // Elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Input Placeholders
  const searchInput = document.getElementById('searchInput');
  if (searchInput && dict.searchPlaceholder) {
    searchInput.placeholder = dict.searchPlaceholder;
  }

  // Update Category Select Labels
  const categorySelects = document.querySelectorAll('.category-select');
  categorySelects.forEach(select => {
    const val = select.value;
    select.querySelectorAll('option').forEach(opt => {
      const catKey = opt.dataset.catKey;
      if (catKey && dict[catKey]) {
        opt.textContent = dict[catKey];
      } else if (opt.value === 'all') {
        opt.textContent = dict.filterAll;
      }
    });
    select.value = val;
  });
}

// Tab Switching (Craftsmen vs. Helpers vs. Demands)
function setupTabSwitchers() {
  const tabBtnCraftsmen = document.getElementById('tabCraftsmen');
  const tabBtnHelpers = document.getElementById('tabHelpers');
  const tabBtnDemands = document.getElementById('tabDemands');
  const filterLangGroup = document.getElementById('filterLangGroup');
  const filterPriceGroup = document.getElementById('filterPriceGroup');

  if (tabBtnCraftsmen && tabBtnHelpers && tabBtnDemands) {
    tabBtnCraftsmen.addEventListener('click', () => {
      currentTab = 'craftsman';
      tabBtnCraftsmen.classList.add('active');
      tabBtnHelpers.classList.remove('active');
      tabBtnDemands.classList.remove('active');
      if (filterLangGroup) filterLangGroup.style.display = 'flex';
      if (filterPriceGroup) filterPriceGroup.style.display = 'flex';
      document.getElementById('tabSubtitle').textContent = i18n[currentLang].tabCraftsmenSubtitle;
      trackEvent('switch_tab', { tab: 'craftsmen' });
      renderProviders();
    });

    tabBtnHelpers.addEventListener('click', () => {
      currentTab = 'helper';
      tabBtnHelpers.classList.add('active');
      tabBtnCraftsmen.classList.remove('active');
      tabBtnDemands.classList.remove('active');
      if (filterLangGroup) filterLangGroup.style.display = 'flex';
      if (filterPriceGroup) filterPriceGroup.style.display = 'flex';
      document.getElementById('tabSubtitle').textContent = i18n[currentLang].tabHelpersSubtitle;
      trackEvent('switch_tab', { tab: 'helpers' });
      renderProviders();
    });

    tabBtnDemands.addEventListener('click', () => {
      currentTab = 'demands';
      tabBtnDemands.classList.add('active');
      tabBtnCraftsmen.classList.remove('active');
      tabBtnHelpers.classList.remove('active');
      if (filterLangGroup) filterLangGroup.style.display = 'none';
      if (filterPriceGroup) filterPriceGroup.style.display = 'none';
      document.getElementById('tabSubtitle').textContent = i18n[currentLang].tabDemandsSubtitle;
      trackEvent('switch_tab', { tab: 'demands' });
      renderProviders();
    });
  }
}

// Dropdowns Population
function populateDropdowns() {
  const citySelects = document.querySelectorAll('.city-select');
  citySelects.forEach(select => {
    select.innerHTML = `<option value="all">${i18n[currentLang].filterAll}</option>`;
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      select.appendChild(opt);
    });
  });

  const categorySelects = document.querySelectorAll('.category-select');
  categorySelects.forEach(select => {
    select.innerHTML = `<option value="all" data-i18n="filterAll">${i18n[currentLang].filterAll}</option>`;
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.dataset.catKey = cat.key;
      opt.textContent = i18n[currentLang][cat.key] || cat.id;
      select.appendChild(opt);
    });
  });
}

// Filtering Engine
function setupFilters() {
  const filterCat = document.getElementById('filterCategory');
  const filterCity = document.getElementById('filterCity');
  const filterLang = document.getElementById('filterLang');
  const filterPrice = document.getElementById('filterPriceMax');
  const searchInput = document.getElementById('searchInput');
  const btnSearch = document.getElementById('btnSearchMain');

  const triggerFilter = () => {
    trackEvent('search_filter_applied', {
      category: filterCat?.value,
      city: filterCity?.value,
      language: filterLang?.value,
      query: searchInput?.value
    });

    renderProviders();
  };

  if (filterCat) filterCat.addEventListener('change', triggerFilter);
  if (filterCity) filterCity.addEventListener('change', triggerFilter);
  if (filterLang) filterLang.addEventListener('change', triggerFilter);
  if (filterPrice) filterPrice.addEventListener('change', triggerFilter);
  if (searchInput) searchInput.addEventListener('input', triggerFilter);
  if (btnSearch) btnSearch.addEventListener('click', triggerFilter);
}

function renderProviders() {
  const grid = document.getElementById('providersGrid');
  if (!grid) return;

  const dict = i18n[currentLang];
  const catVal = document.getElementById('filterCategory')?.value || 'all';
  const cityVal = document.getElementById('filterCity')?.value || 'all';
  const query = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';

  // Render Customer Demands Feed if 3rd tab is active
  if (currentTab === 'demands') {
    const filteredDemands = activeDemands.filter(d => {
      if (catVal !== 'all' && d.category !== catVal) return false;
      if (cityVal !== 'all' && d.city !== cityVal) return false;
      if (query) {
        const titleMatch = d.title.toLowerCase().includes(query);
        const descMatch = d.description.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });

    if (filteredDemands.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
          <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">V této kategorii nebyly nalezeny žádné zadané poptávky</h3>
          <p>Zkuste změnit filtry nebo zadat novou poptávku.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredDemands.map(d => {
      const catObj = categories.find(c => c.id === d.category);
      const catName = catObj ? (dict[catObj.key] || d.category) : d.category;

      return `
        <div class="provider-card" style="border-left: 4px solid var(--green-dark);">
          <div>
            <div class="card-header">
              <div>
                <h3 class="provider-title">${d.title}</h3>
                <div class="provider-meta">
                  📍 ${d.city} • ${catName}
                </div>
              </div>
              <span class="chip-badge chip-verified">${d.customerName}</span>
            </div>

            <p class="provider-bio" style="-webkit-line-clamp: 4;">${d.description}</p>
            
            <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              <span>🗓️ ${dict.deadlineLabel} <strong>${d.deadline}</strong></span>
            </div>
          </div>

          <div class="card-footer">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${dict.budgetLabel}</span>
              <div class="price-tag" style="color: var(--green-dark);">${d.budget.toLocaleString()} Kč</div>
            </div>
            <button class="btn-card-action" onclick="copyPhone('${d.phone}')">
              📞 ${dict.btnContactJob}
            </button>
          </div>
        </div>
      `;
    }).join('');
    return;
  }

  // Render Craftsmen / Helpers Cards
  const langVal = document.getElementById('filterLang')?.value || 'all';
  const priceVal = document.getElementById('filterPriceMax')?.value || 'all';

  const filtered = activeProviders.filter(p => {
    if (p.type !== currentTab) return false;
    if (catVal !== 'all' && p.category !== catVal) return false;
    if (cityVal !== 'all' && p.city !== cityVal) return false;
    if (langVal !== 'all' && !p.languages.includes(langVal)) return false;
    if (priceVal !== 'all' && p.pricePerHour > parseInt(priceVal)) return false;
    if (query) {
      const bioMatch = p.bio.toLowerCase().includes(query);
      const nameMatch = p.name.toLowerCase().includes(query);
      const cityMatch = p.city.toLowerCase().includes(query);
      if (!bioMatch && !nameMatch && !cityMatch) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
        <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">Žádní dodavatelé neodpovídají zvoleným filtrům</h3>
        <p>Zkuste rozšířit zadaná kritéria nebo zvolit jiné město.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const catObj = categories.find(c => c.id === p.category);
    const catName = catObj ? (dict[catObj.key] || p.category) : p.category;

    return `
      <div class="provider-card">
        <div>
          <div class="card-header">
            <div>
              <h3 class="provider-title">${p.name}</h3>
              <div class="provider-meta">
                ${p.city} • ${catName}
              </div>
            </div>
            <div class="rating-badge">
              ★ ${p.rating} (${p.reviewsCount})
            </div>
          </div>

          <div class="badges-row">
            ${p.isVerified ? `<span class="chip-badge chip-verified">${dict.badgeVerified}</span>` : ''}
            ${p.isFastReply ? `<span class="chip-badge chip-fast">${dict.badgeFast}</span>` : ''}
            <span class="chip-badge chip-lang">${dict.badgeLanguages} ${p.languages.join(', ')}</span>
          </div>

          <p class="provider-bio">${p.bio}</p>
        </div>

        <div class="card-footer">
          <div class="price-tag">
            <span>${dict.badgePriceFrom}</span> ${p.pricePerHour} <span>${dict.perHour}</span>
          </div>
          <button class="btn-card-action" onclick="openDetailModal(${p.id})">
            ${dict.btnDetail}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Price Calculator Logic
function setupCalculator() {
  const calcCategory = document.getElementById('calcCategory');
  const calcScope = document.getElementById('calcScope');
  const estDisplay = document.getElementById('estPriceDisplay');
  const calcForm = document.getElementById('calcForm');

  const updatePrice = () => {
    const cat = calcCategory?.value || 'catCleaning';
    const scope = parseFloat(calcScope?.value) || 1;
    const config = priceEstimates[cat] || { base: 200, multiplier: 10 };
    const total = Math.round(config.base + (scope * config.multiplier));
    
    if (estDisplay) {
      estDisplay.textContent = `${total.toLocaleString()} Kč`;
    }
  };

  if (calcCategory) calcCategory.addEventListener('change', updatePrice);
  if (calcScope) calcScope.addEventListener('input', updatePrice);
  
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      trackEvent('submit_lead_calculator', {
        category: calcCategory?.value,
        city: document.getElementById('calcCity')?.value
      });
      showToast(i18n[currentLang].toastLeadSuccess);
      calcForm.reset();
      updatePrice();
    });
  }

  updatePrice();
}

// Modal Handlers
function setupModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnOpenReg = document.getElementById('btnOpenReg');
  const regModal = document.getElementById('regModalOverlay');
  const btnCloseReg = document.getElementById('btnCloseReg');
  const regForm = document.getElementById('regForm');

  const btnOpenPostJob = document.getElementById('btnOpenPostJob');
  const postJobModal = document.getElementById('postJobModalOverlay');
  const btnClosePostJob = document.getElementById('btnClosePostJob');
  const postJobForm = document.getElementById('postJobForm');

  if (btnCloseModal && modalOverlay) {
    btnCloseModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (btnOpenReg && regModal) {
    btnOpenReg.addEventListener('click', () => {
      regModal.classList.add('active');
      trackEvent('open_registration_modal');
    });
  }
  if (btnCloseReg && regModal) {
    btnCloseReg.addEventListener('click', () => regModal.classList.remove('active'));
    regModal.addEventListener('click', (e) => {
      if (e.target === regModal) regModal.classList.remove('active');
    });
  }

  if (btnOpenPostJob && postJobModal) {
    btnOpenPostJob.addEventListener('click', () => {
      postJobModal.classList.add('active');
      trackEvent('open_post_job_modal');
    });
  }

  if (btnClosePostJob && postJobModal) {
    btnClosePostJob.addEventListener('click', () => postJobModal.classList.remove('active'));
    postJobModal.addEventListener('click', (e) => {
      if (e.target === postJobModal) postJobModal.classList.remove('active');
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newProvider = {
        id: Date.now(),
        type: document.getElementById('regRole').value,
        name: document.getElementById('regName').value,
        category: document.getElementById('regCategory').value,
        city: document.getElementById('regCity').value,
        rating: 5.0,
        reviewsCount: 1,
        pricePerHour: parseInt(document.getElementById('regPrice').value) || 200,
        languages: Array.from(document.querySelectorAll('.reg-lang-check:checked')).map(c => c.value),
        isVerified: false,
        isFastReply: true,
        phone: document.getElementById('regPhone').value,
        bio: document.getElementById('regBio').value,
        jobsDone: 0,
        gallery: [],
        reviews: []
      };

      activeProviders.unshift(newProvider);
      regModal.classList.remove('active');
      trackEvent('complete_registration', { role: newProvider.type, city: newProvider.city });
      regForm.reset();
      showToast(i18n[currentLang].toastRegSuccess);
      renderProviders();
    });
  }

  if (postJobForm) {
    postJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newJob = {
        id: Date.now(),
        customerName: document.getElementById('jobCustomerName').value,
        title: document.getElementById('jobTitleInput').value,
        category: document.getElementById('jobCategoryInput').value,
        city: document.getElementById('jobCityInput').value,
        budget: parseInt(document.getElementById('jobBudgetInput').value) || 2000,
        deadline: document.getElementById('jobDeadlineInput').value,
        phone: document.getElementById('jobPhoneInput').value,
        description: document.getElementById('jobDescInput').value
      };

      activeDemands.unshift(newJob);
      postJobModal.classList.remove('active');
      trackEvent('post_customer_job', { city: newJob.city, budget: newJob.budget });
      postJobForm.reset();
      showToast(i18n[currentLang].toastJobPosted);
      
      // Auto switch to Demands tab
      const tabDemands = document.getElementById('tabDemands');
      if (tabDemands) tabDemands.click();
    });
  }
}

function openDetailModal(id) {
  const p = activeProviders.find(item => item.id === id);
  if (!p) return;

  trackEvent('view_provider_detail', { provider_id: p.id, provider_name: p.name });

  const dict = i18n[currentLang];
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');

  const galleryHtml = (p.gallery && p.gallery.length > 0) ? `
    <h4 style="margin-top: 1.5rem;" data-i18n="modalGalleryTitle">${dict.modalGalleryTitle}</h4>
    <div class="gallery-grid">
      ${p.gallery.map(img => `<img src="${img}" alt="Ukázka práce" />`).join('')}
    </div>
  ` : '';

  const reviewsHtml = (p.reviews && p.reviews.length > 0) ? `
    <h4 style="margin-top: 1.5rem;" data-i18n="modalReviewsTitle">${dict.modalReviewsTitle}</h4>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
      ${p.reviews.map(r => `
        <div style="background: var(--bg-card-subtle); padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; font-weight: 600;">
            <span>${r.author}</span>
            <span style="color: var(--amber-rating);">★ ${r.rating}.0</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">${r.text}</p>
        </div>
      `).join('')}
    </div>
  ` : '';

  body.innerHTML = `
    <h2 style="font-size: 1.6rem; margin-bottom: 0.3rem; color: var(--text-main);">${p.name}</h2>
    <div style="display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
      <span>Město: ${p.city}</span>
      <span>Hodnocení: ★ ${p.rating} (${p.reviewsCount})</span>
      <span>${p.jobsDone} ${dict.jobDoneCount}</span>
    </div>

    <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
      <p style="font-size: 0.95rem; color: var(--text-main);">${p.bio}</p>
      ${p.ico ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">IČO: ${p.ico}</p>` : ''}
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-green-soft); padding: 1rem; border-radius: 8px; border: 1px solid rgba(27,67,50,0.15);">
      <div>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${dict.badgePriceFrom}</span>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--green-dark);">${p.pricePerHour} ${dict.perHour}</div>
      </div>
      <button class="btn-nav-action" onclick="copyPhone('${p.phone}')">
        ${dict.btnShowPhone}
      </button>
    </div>

    ${galleryHtml}
    ${reviewsHtml}

    <h4 style="margin-top: 1.75rem;" data-i18n="modalFormTitle">${dict.modalFormTitle}</h4>
    <form id="leadDirectForm" style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 0.6rem;">
      <input type="text" placeholder="${dict.yourName}" required style="background: #fff; border: 1px solid var(--border-color); padding: 0.65rem; border-radius: 6px; color: var(--text-main);" />
      <input type="tel" placeholder="${dict.yourPhone}" required style="background: #fff; border: 1px solid var(--border-color); padding: 0.65rem; border-radius: 6px; color: var(--text-main);" />
      <textarea rows="3" placeholder="${dict.yourNote}" required style="background: #fff; border: 1px solid var(--border-color); padding: 0.65rem; border-radius: 6px; color: var(--text-main);"></textarea>
      <button type="submit" class="btn-nav-action" style="width: 100%;">
        ${dict.btnSubmitLead}
      </button>
    </form>
  `;

  document.getElementById('leadDirectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    overlay.classList.remove('active');
    trackEvent('submit_direct_lead', { provider_id: p.id });
    showToast(dict.toastLeadSuccess);
  });

  overlay.classList.add('active');
}

function copyPhone(phone) {
  navigator.clipboard.writeText(phone);
  trackEvent('click_show_phone', { phone });
  showToast(`${i18n[currentLang].toastPhoneCopied}: ${phone}`);
}

// Toast System
function showToast(msg) {
  const container = document.getElementById('toastContainer') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<div>${msg}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function createToastContainer() {
  const cont = document.createElement('div');
  cont.id = 'toastContainer';
  cont.className = 'toast-container';
  document.body.appendChild(cont);
  return cont;
}

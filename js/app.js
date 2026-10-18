/**
 * 1991 Group of Companies - Dynamic Frontend & GitHub Pages Engine
 * Harmonized design tokens, dynamic DOM binding, interactive application modal,
 * and live search/filter system.
 */

// Embedded fallback data ensuring zero broken states even on strict file:// protocols
const FALLBACK_DATA = {
  site: {
    companyName: "1991 Group of Companies",
    brandShort: "1991 GROUP",
    tagline: "Overseas Recruitment & Global Mobility",
    meaBadge: "MEA Registered",
    mohreBadge: "UAE MOHRE Licensed",
    isoBadge: "ISO 9001:2015 Certified Agency",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLWKOVuvXdEYtj8knT3dh-jkOItQSWQ4zB-VCt7iqMPLtUSXosToOYq1ct7SmTeU_FM2QZco-9v48Mts2bfZYkAyA6NqBfMnmZPYzt3aMDp7GZkW6WfnGoOYOUynh80xHqSoAAFQgHH7V7v2Z6AjEZejfC8Xkm5RiamqRcabqz6nvPJN844La8gq2gvdDkcTMYlJEhIWxLWCO667OdHXcXi55o05tQor8YPdYgZ9m5bd-urZk-C6naOqaiaX06XGr7tw0",
    footerLogoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxO5wbCDYJhOjcBFrylFBapYN4wBcVdorfNIsyOeTUAUCzDarzrb8TC7-LyHIbLZDijk0xqui2y0w13fPlyOTDClF9E2VN2eU3tv2lZ6EUMbyi8nMxvHf5uGhaR8me-W22SgXXBBQsLFkxv1t0mepHEFam2oN1hB78weJxDERaRvUd6rDCGX6uW_AnmLchQbyYMOmqF9fjZugIkCbvBwVNHfNlKRMwUZj9RanIIE-teolSAGAgQeRCKsfF8Lzi7BQM62g"
  },
  contacts: {
    primaryWhatsApp: "+91 83413 01490",
    primaryWhatsAppRaw: "918341301490",
    defaultWhatsAppMessage: "Hello 1991 Group, I am inquiring about overseas job vacancies.",
    dubaiOffice: {
      title: "Dubai Corporate HQ (UAE)",
      badge: "MOHRE Compliant",
      address: "Al Noor 3, 3rd Floor, Al Mankhool, Bur Dubai, Dubai, United Arab Emirates",
      phone: "+971 55 569 4504",
      phoneRaw: "+971555694504",
      whatsapp: "+971 55 569 4504",
      whatsappRaw: "971555694504",
      hours: "Mon - Sat: 9:00 AM - 7:00 PM GST"
    },
    vizagOffice: {
      title: "Vizag Operations HQ (India)",
      badge: "MEA Registered",
      address: "Near Lorven Hotel, Health City, Arilova, Visakhapatnam (Vizag), Andhra Pradesh - 530040, India",
      phone: "+91 83413 01490",
      phoneRaw: "+918341301490",
      verificationCell: "+91 83413 01490",
      verificationCellRaw: "918341301490",
      hours: "Mon - Sat: 9:30 AM - 6:30 PM IST"
    },
    emails: {
      apply: "1991groups@gmail.com",
      info: "Bodeepallikishan@gmail.com"
    },
    social: {
      instagramDirector: {
        handle: "@boddepalli.kittu",
        url: "https://www.instagram.com/boddepalli.kittu?exln=NjVxc3MzMGwxMzlj&utm_source=qr"
      },
      instagramOfficial: {
        handle: "@1991group.official",
        url: "https://www.instagram.com"
      }
    }
  },
  announcement: {
    badge: "European Union & GCC Licensed Recruitment Corridors",
    text: "Europe Agriculture & Packing starting from",
    highlight: "₹1,00,000 / Month (€1,100 - €1,200)",
    linkText: "View Roles",
    linkUrl: "#open-categories"
  },
  stats: [
    { label: "Candidates Deployed", value: "12,450+", description: "Successfully placed across Europe & Gulf", icon: "public", accentColor: "emerald" },
    { label: "Visa Clearance Rate", value: "98.6%", description: "Authentic embassy & ministry stamping", icon: "verified", accentColor: "cyan" },
    { label: "Legal Work Permits", value: "100%", description: "Direct corporate employer sponsored", icon: "gavel", accentColor: "emerald" },
    { label: "Global Presence", value: "Dual HQ", description: "Corporate Dubai & Vizag Operations HQ", icon: "apartment", accentColor: "cyan" }
  ],
  corridors: [],
  jobRoles: [],
  leadership: [],
  candidateGallery: [],
  faqs: []
};

let appState = {
  data: FALLBACK_DATA,
  activeFilter: 'all',
  searchQuery: ''
};

// Safe deep-lookup helper for dot notation e.g. "contacts.dubaiOffice.phone"
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
}

// Fetch dynamic data from data/content.json with cache busting
async function loadDynamicContent() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`./data/content.json?v=${timestamp}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    appState.data = { ...FALLBACK_DATA, ...jsonData };
    console.log("Successfully loaded dynamic content from data/content.json");
  } catch (error) {
    console.warn("Could not load data/content.json, using embedded fallback data:", error);
  }
  
  initializeUI();
}

// Initialize all UI modules once data is available
function initializeUI() {
  bindStaticContent();
  renderCorridors();
  renderJobs();
  renderLeadership();
  renderCandidateGallery();
  renderFaqs();
  setupEventListeners();
}

// Bind simple text, links, and contacts using data-bind attributes
function bindStaticContent() {
  const data = appState.data;

  // Text content bindings
  document.querySelectorAll('[data-bind]').forEach(el => {
    const key = el.getAttribute('data-bind');
    if (key === 'currentYear') {
      el.textContent = new Date().getFullYear();
      return;
    }
    const val = getNestedValue(data, key);
    if (val !== undefined && val !== null) {
      el.textContent = val;
    }
  });

  // Link / Href bindings
  document.querySelectorAll('[data-bind-href]').forEach(el => {
    const key = el.getAttribute('data-bind-href');
    const prefix = el.getAttribute('data-prefix') || '';
    const val = getNestedValue(data, key);
    if (val !== undefined && val !== null) {
      el.setAttribute('href', prefix + val);
    }
  });

  // WhatsApp quick links with custom context
  document.querySelectorAll('[data-bind-wa]').forEach(el => {
    const context = el.getAttribute('data-bind-wa');
    let phone = data.contacts?.primaryWhatsAppRaw || "918341301490";
    let message = data.contacts?.defaultWhatsAppMessage || "Hello 1991 Group, I am inquiring about overseas job vacancies.";

    if (context === 'dubai') {
      phone = data.contacts?.dubaiOffice?.whatsappRaw || phone;
      message = "Hello 1991 Group Dubai HQ, I want to inquire about UAE opportunities.";
    } else if (context === 'vizag') {
      phone = data.contacts?.vizagOffice?.verificationCellRaw || phone;
      message = "Hello 1991 Group Vizag HQ, I want to verify vacancies and documentation.";
    } else if (context === 'europe') {
      message = "Hello 1991 Group, I am interested in Europe Agriculture and Packing vacancies.";
    }

    el.setAttribute('href', `https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  });

  // Announcement bar binding
  const bannerBadge = document.getElementById('banner-badge');
  const bannerText = document.getElementById('banner-text');
  const bannerHighlight = document.getElementById('banner-highlight');
  if (bannerBadge && data.announcement?.badge) bannerBadge.textContent = data.announcement.badge;
  if (bannerText && data.announcement?.text) bannerText.textContent = data.announcement.text + ' ';
  if (bannerHighlight && data.announcement?.highlight) bannerHighlight.textContent = data.announcement.highlight;

  // Update dynamic document title
  if (data.site?.companyName) {
    document.title = `${data.site.companyName} | ${data.site.tagline || 'Overseas Recruitment'}`;
  }
}

// Render Migration Corridors Grid with unified card heights and harmonious badges
function renderCorridors() {
  const container = document.getElementById('corridors-container');
  if (!container) return;

  const corridors = appState.data.corridors || [];
  if (!corridors.length) return;

  container.innerHTML = corridors.map(c => `
    <div class="relative rounded-3xl p-7 bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden h-full">
      <div>
        <!-- Top Row: Region Flag & High Demand / Status Badge -->
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
            ${c.flag || '🌍'}
          </div>
          <span class="px-3 py-1 rounded-full ${c.badgeStyle || 'bg-slate-100 text-slate-700 border border-slate-200'} text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex-shrink-0">
            ${c.badge || 'Verified'}
          </span>
        </div>

        <!-- Full-Width Title & Visa Clearance (Same remaining space for all cards) -->
        <div class="mb-4">
          <h3 class="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            ${c.title}
          </h3>
          <span class="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[15px]">verified</span> ${c.visaType || 'Work Permit'}
          </span>
        </div>

        <!-- Highlight Offer Banner -->
        <div class="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs min-h-[82px] flex flex-col justify-center">
          <div class="flex items-center justify-between font-bold text-slate-900 mb-1">
            <span class="flex items-center gap-1 text-slate-800">
              <span class="material-symbols-outlined text-[15px] text-emerald-600">trending_up</span> ${c.highlightTitle || 'Opportunity'}
            </span>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold flex-shrink-0">
              ${c.highlightSalary || ''}
            </span>
          </div>
          <p class="text-slate-600 leading-relaxed text-[11px] line-clamp-2">
            ${c.highlightSub || ''}
          </p>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-4 min-h-[50px] line-clamp-3">
          ${c.description}
        </p>
      </div>

      <div>
        <!-- Country Chips (Consistent min-height for uniform alignment) -->
        <div class="flex flex-wrap gap-1.5 pt-3.5 border-t border-slate-100 mb-4 min-h-[44px] items-center">
          ${(c.countries || []).map(country => `
            <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">${country}</span>
          `).join('')}
        </div>
        <button 
          onclick="filterJobsFromCorridor('${c.targetCategory || 'all'}')"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all">
          <span>${c.buttonText || 'Explore Vacancies'}</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Render Job Roles & Categories Grid with unified 3-color palette and standardized CTA
function renderJobs() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  const allJobs = appState.data.jobRoles || [];
  const filter = appState.activeFilter;
  const query = appState.searchQuery.toLowerCase().trim();

  const filteredJobs = allJobs.filter(job => {
    const matchesCategory = (filter === 'all') || (job.category === filter);
    const matchesSearch = !query || 
      job.title.toLowerCase().includes(query) || 
      job.corridors.toLowerCase().includes(query) ||
      (job.features && job.features.some(f => f.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  const countBadge = document.getElementById('jobs-count-badge');
  if (countBadge) {
    countBadge.textContent = `${filteredJobs.length} Positions Available`;
  }

  if (filteredJobs.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-slate-200">
        <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">search_off</span>
        <h4 class="text-base font-bold text-slate-800">No matching job roles found</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try clearing your search term or select "All Openings" to view our complete requisition list.</p>
        <button onclick="resetJobFilters()" class="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">
          Reset Filter & Search
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredJobs.map(job => {
    // Standardized token themes: Europe = emerald, Gulf = cyan, Technical = amber
    let themeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let iconBg = 'bg-emerald-100 text-emerald-700';
    let checkColor = 'text-emerald-600';
    let badgeBg = 'bg-emerald-600 text-white';

    if (job.colorTheme === 'cyan' || job.category === 'gulf') {
      themeBg = 'bg-cyan-50 text-cyan-800 border-cyan-200';
      iconBg = 'bg-cyan-100 text-cyan-700';
      checkColor = 'text-cyan-600';
      badgeBg = 'bg-cyan-700 text-white';
    } else if (job.colorTheme === 'amber' || job.category === 'technical') {
      themeBg = 'bg-amber-50 text-amber-800 border-amber-200';
      iconBg = 'bg-amber-100 text-amber-700';
      checkColor = 'text-amber-600';
      badgeBg = 'bg-amber-600 text-white';
    }

    return `
      <div class="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl">${job.icon || 'work'}</span>
            </div>
            <span class="px-2.5 py-1 rounded-full ${badgeBg} text-[11px] font-extrabold tracking-wide">
              ${job.badge || 'Verified'}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            ${job.title}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-2 font-medium">Corridors: ${job.corridors}</p>

          <div class="mb-4 px-3 py-1.5 rounded-lg ${themeBg} font-bold text-xs border">
            ${job.salaryBanner || 'Employer Sponsored Work Visa & Lodging'}
          </div>

          <ul class="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
            ${(job.features || []).map(feat => `
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined ${checkColor} text-base">check_circle</span>
                <span>${feat}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="pt-5 mt-4 border-t border-slate-200/60 flex items-center gap-2">
          <button 
            onclick="openApplyModal('${encodeURIComponent(job.title)}', '${encodeURIComponent(job.corridors)}')"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors">
            <span>Apply Now</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <button 
            onclick="quickWhatsAppJob('${encodeURIComponent(job.title)}')"
            title="Instant WhatsApp Inquiry"
            class="px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-base">chat</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Leadership Profiles with symmetrical badges and balanced CTAs
function renderLeadership() {
  const container = document.getElementById('leadership-container');
  if (!container) return;

  const leaders = appState.data.leadership || [];
  if (!leaders.length) return;

  container.innerHTML = leaders.map((leader) => {
    let actionBtn = '';
    if (leader.action?.type === 'instagram') {
      actionBtn = `
        <a class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold transition-all shadow-sm" href="${leader.action.url}" rel="noopener noreferrer" target="_blank">
          <span class="material-symbols-outlined text-[16px] text-pink-400">photo_camera</span>
          <span>${leader.action.label}</span>
        </a>
      `;
    } else if (leader.action?.type === 'whatsapp') {
      const waNumber = leader.action.number || appState.data.contacts?.primaryWhatsAppRaw || '918341301490';
      const msg = encodeURIComponent(leader.action.message || 'Hello, I would like guidance regarding overseas vacancies');
      actionBtn = `
        <a class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm" href="https://wa.me/${waNumber}?text=${msg}" rel="noopener noreferrer" target="_blank">
          <span class="material-symbols-outlined text-[16px]">chat</span>
          <span>${leader.action.label}</span>
        </a>
      `;
    }

    return `
      <div class="rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 hover:border-emerald-500 transition-all shadow-sm flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 items-center sm:items-start lg:items-center xl:items-start text-center sm:text-left lg:text-center xl:text-left group hover:shadow-xl">
        <div class="relative flex-shrink-0">
          <div class="w-32 h-40 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md group-hover:scale-105 transition-transform duration-300 bg-slate-100">
            <img alt="${leader.name}" class="w-full h-full object-cover object-top" src="${leader.photo}" loading="lazy">
          </div>
          <span class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm">
            VERIFIED
          </span>
        </div>
        <div class="flex-1 space-y-2">
          <div>
            <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">${leader.title}</span>
            <h4 class="text-xl font-bold text-slate-900 mt-0.5">${leader.name}</h4>
            <p class="text-xs text-slate-600 leading-relaxed mt-2">
              ${leader.bio}
            </p>
          </div>
          <div class="pt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start lg:justify-center xl:justify-start">
            ${(leader.tags || []).map((t, i) => `
              <span class="px-2.5 py-1 rounded-lg ${i === 0 ? 'bg-slate-100 border border-slate-200 text-slate-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'} text-[11px] font-semibold">${t}</span>
            `).join('')}
          </div>
          <div class="pt-3 flex justify-center sm:justify-start lg:justify-center xl:justify-start">
            ${actionBtn}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Candidate Gallery with standardized visa and corridor chips
function renderCandidateGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  const candidates = appState.data.candidateGallery || [];
  if (!candidates.length) return;

  container.innerHTML = candidates.map((cand) => {
    return `
      <div class="rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
        <div class="relative h-64 w-full overflow-hidden bg-slate-100">
          <img alt="${cand.name} - ${cand.role}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" src="${cand.photo}" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20"></div>
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold tracking-wide shadow-md">
              <span class="material-symbols-outlined text-[15px]">verified</span> Verified Placement
            </span>
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-semibold border border-white/40 shadow-sm">
              <span class="material-symbols-outlined text-[14px] text-emerald-600">location_on</span> ${cand.location}
            </span>
          </div>
          <div class="absolute bottom-3 left-4">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-white border border-slate-700 text-[11px] font-bold">
              ${cand.badge || 'Legal Permit'}
            </span>
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                ${cand.name} <span class="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              </h3>
              <span class="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">${cand.batch}</span>
            </div>
            <p class="text-xs font-semibold text-emerald-700">${cand.role}</p>
            <div class="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <span class="material-symbols-outlined text-slate-300 text-2xl absolute top-3 right-3">format_quote</span>
              <p class="text-xs text-slate-700 leading-relaxed italic relative z-10 pr-6">
                "${cand.quote}"
              </p>
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span class="inline-flex items-center gap-1.5 text-slate-900 font-bold">
              <span class="material-symbols-outlined text-emerald-600 text-[18px]">task_alt</span> ${cand.permitType}
            </span>
            <span class="text-emerald-700 font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">public</span> ${cand.corridor}
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render FAQs Accordion
function renderFaqs() {
  const container = document.getElementById('faqs-container');
  if (!container) return;

  const faqs = appState.data.faqs || [];
  if (!faqs.length) return;

  container.innerHTML = faqs.map((faq, index) => `
    <div class="faq-item border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all" data-faq="${index}">
      <button 
        onclick="toggleFaq(${index})"
        class="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors focus:outline-none">
        <span>${faq.question}</span>
        <span class="faq-icon material-symbols-outlined text-slate-400 text-xl transition-transform duration-300 flex-shrink-0">
          expand_more
        </span>
      </button>
      <div class="faq-answer px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
        ${faq.answer}
      </div>
    </div>
  `).join('');
}

// FAQ accordion toggler
function toggleFaq(index) {
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(item => {
    if (item.getAttribute('data-faq') == index) {
      item.classList.toggle('open');
    } else {
      item.classList.remove('open');
    }
  });
}

// Filter jobs directly from corridor card click
function filterJobsFromCorridor(targetCategory) {
  appState.activeFilter = targetCategory;
  
  // Update filter buttons UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === targetCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderJobs();

  // Smooth scroll down to jobs section
  const targetSec = document.getElementById('open-categories');
  if (targetSec) {
    targetSec.scrollIntoView({ behavior: 'smooth' });
  }
}

// Reset filters and search
function resetJobFilters() {
  appState.activeFilter = 'all';
  appState.searchQuery = '';
  
  const searchInput = document.getElementById('job-search-input');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === 'all') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderJobs();
}

// Set up UI event listeners
function setupEventListeners() {
  // Category Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.activeFilter = btn.getAttribute('data-filter') || 'all';
      renderJobs();
    });
  });

  // Search input live filtering
  const searchInput = document.getElementById('job-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      renderJobs();
    });
  }

  // Mobile navigation drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  const openMobileMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking the backdrop
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  // Close mobile menu when clicking nav links
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Modal backdrop click dismiss
  const applyModal = document.getElementById('apply-modal');
  if (applyModal) {
    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) {
        closeApplyModal();
      }
    });
  }

  // Global Escape key handler to close drawer or modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeApplyModal();
    }
  });

  // Automatically close mobile menu if resized to desktop viewport
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1280) {
      closeMobileMenu();
    }
  });

  // Scroll to top button visibility
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (backToTopBtn) backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      if (backToTopBtn) backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Application form submission to WhatsApp
  const applyForm = document.getElementById('apply-modal-form');
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitApplicationToWhatsApp();
    });
  }
}

// Application Modal Handlers
function openApplyModal(encodedRole, encodedCorridors) {
  const role = decodeURIComponent(encodedRole || 'General Overseas Requisition');
  const corridors = decodeURIComponent(encodedCorridors || 'Europe / GCC');

  const modal = document.getElementById('apply-modal');
  const modalRoleInput = document.getElementById('modal-job-title');
  const modalRoleDisplay = document.getElementById('modal-job-display');
  const modalCorridorDisplay = document.getElementById('modal-corridor-display');

  if (modalRoleInput) modalRoleInput.value = role;
  if (modalRoleDisplay) modalRoleDisplay.textContent = role;
  if (modalCorridorDisplay) modalCorridorDisplay.textContent = corridors;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// One-click WhatsApp apply for a specific job
function quickWhatsAppJob(encodedRole) {
  const role = decodeURIComponent(encodedRole);
  const waNumber = appState.data.contacts?.primaryWhatsAppRaw || '918341301490';
  const msg = `Hello 1991 Group Placement Desk,\nI am interested in applying for: *${role}*.\nPlease let me know the current quota status and documents required.`;
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Form submission that crafts WhatsApp dispatch message
function submitApplicationToWhatsApp() {
  const role = document.getElementById('modal-job-title')?.value || 'Overseas Role';
  const name = document.getElementById('applicant-name')?.value || 'Candidate';
  const phone = document.getElementById('applicant-phone')?.value || 'Not provided';
  const city = document.getElementById('applicant-city')?.value || 'India';
  const passport = document.getElementById('applicant-passport')?.value || 'Yes';
  const exp = document.getElementById('applicant-experience')?.value || 'Relevant';

  const waNumber = appState.data.contacts?.primaryWhatsAppRaw || '918341301490';

  const dispatchText = 
`*NEW CANDIDATE REGISTRATION - 1991 GROUP*
---------------------------------------
🎯 *Job Role:* ${role}
👤 *Candidate Name:* ${name}
📞 *Contact Number:* ${phone}
📍 *City / State:* ${city}
🛂 *Valid Passport:* ${passport}
💼 *Experience:* ${exp}
---------------------------------------
Please verify my profile for the next available deployment batch.`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(dispatchText)}`;
  window.open(waUrl, '_blank');
  closeApplyModal();
}

// ==========================================
// THEME MANAGEMENT SYSTEM (Default: System)
// ==========================================
const ThemeManager = {
  KEY: 'app_theme_preference', // 'system' | 'light' | 'dark'

  getStoredPreference() {
    try {
      return localStorage.getItem(this.KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  },

  getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  applyTheme(pref, save = true) {
    if (save) {
      try {
        localStorage.setItem(this.KEY, pref);
      } catch (e) {}
    }
    const resolved = (pref === 'system') ? this.getSystemPreference() : pref;
    
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.updateUI(pref, resolved);
  },

  updateUI(pref, resolved) {
    // 1. Desktop dropdown icon & label
    const iconEl = document.getElementById('theme-toggle-icon');
    const labelEl = document.getElementById('theme-toggle-label');
    if (iconEl) {
      if (pref === 'system') {
        iconEl.textContent = 'desktop_windows';
      } else if (pref === 'dark') {
        iconEl.textContent = 'dark_mode';
      } else {
        iconEl.textContent = 'light_mode';
      }
    }
    if (labelEl) {
      labelEl.textContent = pref === 'system' ? 'Auto' : (pref === 'dark' ? 'Dark' : 'Light');
    }

    // 2. Desktop dropdown checkmarks and active state
    document.querySelectorAll('.theme-menu-item').forEach(item => {
      const val = item.getAttribute('data-theme-val');
      const checkIcon = item.querySelector('.check-icon');
      if (val === pref) {
        item.classList.add('active');
        if (checkIcon) checkIcon.classList.remove('hidden');
      } else {
        item.classList.remove('active');
        if (checkIcon) checkIcon.classList.add('hidden');
      }
    });

    // 3. Mobile drawer status label & segmented buttons
    const mobileStatusEl = document.getElementById('mobile-theme-status');
    if (mobileStatusEl) {
      mobileStatusEl.textContent = pref === 'system' ? `Auto (${resolved})` : (pref === 'dark' ? 'Dark' : 'Light');
    }

    document.querySelectorAll('.theme-btn-option').forEach(btn => {
      const val = btn.getAttribute('data-theme-val');
      if (val === pref) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  toggleNextTheme() {
    const current = this.getStoredPreference();
    let next = 'dark';
    if (current === 'system') {
      const sys = this.getSystemPreference();
      next = (sys === 'dark') ? 'light' : 'dark';
    } else if (current === 'dark') {
      next = 'light';
    } else if (current === 'light') {
      next = 'system';
    }
    this.applyTheme(next, true);
    return next;
  },

  init() {
    const currentPref = this.getStoredPreference();
    this.applyTheme(currentPref, false);

    // Watch for OS theme changes in real-time
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleOsChange = () => {
        if (this.getStoredPreference() === 'system') {
          this.applyTheme('system', false);
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleOsChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleOsChange);
      }
    }

    // Attach desktop dropdown toggling
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const dropdownMenu = document.getElementById('theme-dropdown-menu');
    const chevronBtn = document.getElementById('theme-chevron-btn');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNextTheme();
      });
    }

    if (chevronBtn && dropdownMenu) {
      chevronBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
      });
    }

    if (dropdownMenu) {
      document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && (!chevronBtn || !chevronBtn.contains(e.target))) {
          dropdownMenu.classList.add('hidden');
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !dropdownMenu.classList.contains('hidden')) {
          dropdownMenu.classList.add('hidden');
        }
      });
    }

    // Attach desktop dropdown item clicks
    document.querySelectorAll('.theme-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-theme-val');
        if (val) {
          this.applyTheme(val, true);
          if (dropdownMenu) dropdownMenu.classList.add('hidden');
        }
      });
    });

    // Attach mobile drawer segmented button clicks
    document.querySelectorAll('.theme-btn-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-theme-val');
        if (val) {
          this.applyTheme(val, true);
        }
      });
    });
  }
};

// Expose globally
window.ThemeManager = ThemeManager;

// Start execution on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  loadDynamicContent();
});

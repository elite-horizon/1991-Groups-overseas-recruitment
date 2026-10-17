/**
 * 1991 Group of Companies - Dynamic Frontend & GitHub Pages Engine
 * Centralized data loading, dynamic DOM binding, interactive application modal,
 * and category filtering.
 */

// Embedded fallback data in case of strict local file:// CORS restrictions
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
    primaryWhatsApp: "+91 91000 00000",
    primaryWhatsAppRaw: "919100000000",
    defaultWhatsAppMessage: "Hello 1991 Group, I am inquiring about overseas job vacancies.",
    dubaiOffice: {
      title: "Dubai Corporate HQ (UAE)",
      badge: "MOHRE Compliant",
      address: "Al Noor 3, 3rd Floor, Al Mankhool, Bur Dubai, Dubai, United Arab Emirates",
      phone: "+971 4 000 0000",
      phoneRaw: "+9714000000",
      whatsapp: "+971 50 000 0000",
      whatsappRaw: "971500000000",
      hours: "Mon - Sat: 9:00 AM - 7:00 PM GST"
    },
    vizagOffice: {
      title: "Vizag Operations HQ (India)",
      badge: "MEA Registered",
      address: "Near Lorven Hotel, Health City, Arilova, Visakhapatnam (Vizag), Andhra Pradesh - 530040, India",
      phone: "+91 891 000 0000",
      phoneRaw: "+918910000000",
      verificationCell: "+91 90000 00000",
      verificationCellRaw: "919000000000",
      hours: "Mon - Sat: 9:30 AM - 6:30 PM IST"
    },
    emails: {
      apply: "apply@1991group.com",
      info: "info@1991group.com"
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
    // Continue with fallback data
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

  // WhatsApp quick links with custom text
  document.querySelectorAll('[data-bind-wa]').forEach(el => {
    const context = el.getAttribute('data-bind-wa');
    let phone = data.contacts?.primaryWhatsAppRaw || "919100000000";
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

  // Update dynamic document title if provided
  if (data.site?.companyName) {
    document.title = `${data.site.companyName} | ${data.site.tagline || 'Overseas Recruitment'}`;
  }
}

// Render Migration Corridors Grid
function renderCorridors() {
  const container = document.getElementById('corridors-container');
  if (!container) return;

  const corridors = appState.data.corridors || [];
  if (!corridors.length) return;

  container.innerHTML = corridors.map(c => `
    <div class="relative rounded-3xl p-7 bg-white border ${c.id === 'europe' ? 'border-2 border-emerald-500 shadow-md' : 'border-slate-200'} hover:border-emerald-500 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      ${c.id === 'europe' ? '<div class="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>' : ''}
      <div>
        <!-- Card Header with Flag & Badge -->
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
              ${c.flag || '🌍'}
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                ${c.title}
              </h3>
              <span class="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">verified</span> ${c.visaType || 'Work Permit'}
              </span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full ${c.id === 'europe' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'} text-[10px] font-extrabold uppercase tracking-wide shadow-sm flex-shrink-0">
            ${c.badge || 'Verified'}
          </span>
        </div>

        <!-- Highlight Offer Banner -->
        <div class="mb-4 p-3.5 rounded-2xl ${c.id === 'europe' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200/90'} text-xs">
          <div class="flex items-center justify-between font-bold ${c.id === 'europe' ? 'text-emerald-900' : 'text-slate-900'} mb-1">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] text-emerald-600">trending_up</span> ${c.highlightTitle || 'Opportunity'}
            </span>
            <span class="px-2 py-0.5 rounded ${c.id === 'europe' ? 'bg-emerald-200/80 text-emerald-800' : 'bg-cyan-50 text-cyan-800 border border-cyan-200'} text-[11px] font-extrabold">${c.highlightSalary || ''}</span>
          </div>
          <p class="${c.id === 'europe' ? 'text-emerald-800 font-medium' : 'text-slate-600'}">
            ${c.highlightSub || ''}
          </p>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-4">
          ${c.description}
        </p>
      </div>

      <div>
        <!-- Country Chips -->
        <div class="flex flex-wrap gap-1.5 pt-3.5 border-t border-slate-100 mb-4">
          ${(c.countries || []).map(country => `
            <span class="px-2.5 py-1 rounded-lg ${c.id === 'europe' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'} text-[11px] font-medium">${country}</span>
          `).join('')}
        </div>
        <button 
          onclick="filterJobsFromCorridor('${c.targetCategory || 'all'}')"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl ${c.id === 'europe' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-emerald-600 text-white'} font-bold text-xs shadow-sm transition-all">
          <span>${c.buttonText || 'View Openings'}</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Render Job Roles & Categories Grid with live search & filter
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
    // Icon color variants
    let iconBg = 'bg-emerald-100 text-emerald-700';
    if (job.iconColor === 'rose') iconBg = 'bg-rose-100 text-rose-700';
    if (job.iconColor === 'cyan') iconBg = 'bg-cyan-100 text-cyan-700';
    if (job.iconColor === 'amber') iconBg = 'bg-amber-100 text-amber-700';
    if (job.iconColor === 'indigo') iconBg = 'bg-indigo-100 text-indigo-700';
    if (job.iconColor === 'teal') iconBg = 'bg-teal-100 text-teal-700';
    if (job.iconColor === 'sky') iconBg = 'bg-sky-100 text-sky-700';
    if (job.iconColor === 'orange') iconBg = 'bg-orange-100 text-orange-700';
    if (job.iconColor === 'blue') iconBg = 'bg-blue-100 text-blue-700';

    return `
      <div class="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl">${job.icon || 'work'}</span>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold tracking-wide">
              ${job.badge || 'Verified'}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            ${job.title}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5 mb-2 font-medium">Corridors: ${job.corridors}</p>

          <div class="mb-4 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
            ${job.salaryBanner || 'Employer Sponsored Work Visa & Lodging'}
          </div>

          <ul class="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
            ${(job.features || []).map(feat => `
              <li class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
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
            class="px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-base">chat</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Leadership Profiles
function renderLeadership() {
  const container = document.getElementById('leadership-container');
  if (!container) return;

  const leaders = appState.data.leadership || [];
  if (!leaders.length) return;

  container.innerHTML = leaders.map((leader, idx) => {
    const isPrimary = idx === 0;
    const accentBorder = isPrimary ? 'border-emerald-500' : 'border-cyan-500';
    const badgeColor = isPrimary ? 'bg-emerald-600' : 'bg-cyan-600';
    const tagBg = isPrimary ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-cyan-100 text-cyan-800 border-cyan-300';

    let actionBtn = '';
    if (leader.instagram) {
      actionBtn = `
        <a class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white border border-pink-400 text-xs font-bold transition-all hover:shadow-md" href="${leader.instagram.url}" rel="noopener noreferrer" target="_blank">
          <span class="material-symbols-outlined text-[16px]">photo_camera</span>
          <span>${leader.instagram.handle}</span>
        </a>
      `;
    } else if (leader.whatsapp) {
      const waNumber = leader.whatsapp.number || appState.data.contacts?.primaryWhatsAppRaw || '918910000000';
      const msg = encodeURIComponent(leader.whatsapp.message || 'Hello Priyanka, I would like guidance regarding overseas vacancies');
      actionBtn = `
        <a class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all" href="https://wa.me/${waNumber}?text=${msg}" rel="noopener noreferrer" target="_blank">
          <span class="material-symbols-outlined text-[16px]">chat</span>
          <span>${leader.whatsapp.label || 'Connect via WhatsApp'}</span>
        </a>
      `;
    }

    return `
      <div class="rounded-3xl p-6 sm:p-7 bg-slate-50 border border-slate-200 hover:${accentBorder} transition-all shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:shadow-xl">
        <div class="relative flex-shrink-0">
          <div class="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border-2 ${accentBorder} shadow-md group-hover:scale-105 transition-transform duration-300 bg-slate-200">
            <img alt="${leader.name}" class="w-full h-full object-cover object-top" src="${leader.photo}" loading="lazy">
          </div>
          <span class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md ${badgeColor} text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
            ${leader.badge || 'VERIFIED'}
          </span>
        </div>
        <div class="flex-1 text-center sm:text-left space-y-2">
          <div>
            <span class="text-[11px] font-bold ${isPrimary ? 'text-cyan-700' : 'text-emerald-700'} uppercase tracking-wider block">${leader.title}</span>
            <h4 class="text-xl font-bold text-slate-900 mt-0.5">${leader.name}</h4>
            <p class="text-xs text-slate-600 leading-relaxed mt-2">
              ${leader.bio}
            </p>
          </div>
          <div class="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            ${(leader.tags || []).map((t, i) => `
              <span class="px-2.5 py-1 rounded-lg ${i === 0 ? 'bg-white border border-slate-200 text-slate-700' : tagBg} text-[11px] font-semibold">${t}</span>
            `).join('')}
          </div>
          <div class="pt-3">
            ${actionBtn}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Candidate Gallery
function renderCandidateGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  const candidates = appState.data.candidateGallery || [];
  if (!candidates.length) return;

  container.innerHTML = candidates.map((cand, idx) => {
    const isCyan = idx === 1;
    const accentClass = isCyan ? 'cyan' : 'emerald';

    return `
      <div class="rounded-3xl bg-white border border-slate-200 hover:border-${accentClass}-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
        <div class="relative h-64 w-full overflow-hidden bg-slate-100">
          <img alt="${cand.name} - ${cand.role}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" src="${cand.photo}" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20"></div>
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${accentClass}-600 text-white text-[11px] font-extrabold tracking-wide shadow-md">
              <span class="material-symbols-outlined text-[15px]">verified</span> Verified Placement
            </span>
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-semibold border border-white/40 shadow-sm">
              <span class="material-symbols-outlined text-[14px] text-${accentClass}-600">location_on</span> ${cand.location}
            </span>
          </div>
          <div class="absolute bottom-3 left-4">
            <span class="px-2.5 py-1 rounded-lg bg-${accentClass}-600/90 backdrop-blur-md text-white border border-${accentClass}-400 text-[11px] font-bold">
              ${cand.badge || 'Legal Permit'}
            </span>
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="text-xl font-extrabold text-slate-900 group-hover:text-${accentClass}-600 transition-colors flex items-center gap-1.5">
                ${cand.name} <span class="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              </h3>
              <span class="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">${cand.batch}</span>
            </div>
            <p class="text-xs font-semibold text-${accentClass}-700">${cand.role}</p>
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
            <span class="text-${accentClass}-700 font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">apartment</span> ${cand.corridor}
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

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }

  // Close mobile menu when clicking nav links
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
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
  const waNumber = appState.data.contacts?.primaryWhatsAppRaw || '919100000000';
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

  const waNumber = appState.data.contacts?.primaryWhatsAppRaw || '919100000000';

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

// Start execution on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadDynamicContent();
});

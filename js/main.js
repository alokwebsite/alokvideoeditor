// Clean URLs: Automatically hide .html extension from browser address bar
(function cleanUrlExtension() {
    try {
        if (window.location.protocol.startsWith('http')) {
            // Strip .html from the address bar immediately
            if (window.location.pathname.endsWith('.html')) {
                var cleanPath = window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
                if (!cleanPath) cleanPath = '/';
                var newUrl = cleanPath + window.location.search + window.location.hash;
                window.history.replaceState(null, '', newUrl);
            }

            // On web servers, rewrite in-page anchor links so hover previews and status bar show clean URLs
            document.addEventListener('DOMContentLoaded', function() {
                document.querySelectorAll('a[href]').forEach(function(a) {
                    var href = a.getAttribute('href');
                    if (!href) return;
                    if (href === 'index.html' || href === './index.html') {
                        a.setAttribute('href', '/');
                    } else if (href.endsWith('.html') && !href.includes('://')) {
                        a.setAttribute('href', href.replace(/\.html$/, ''));
                    }
                });
            });
        }
    } catch (e) {}
})();

// DOM Elements
const grid = document.getElementById('content-grid');
const homeGrid = document.getElementById('home-content-grid');
const downloadModal = document.getElementById('download-modal');
const socialTooltip = document.getElementById('social-tooltip');
const btnPlugins = document.getElementById('btn-plugins');
const btnMacros = document.getElementById('btn-macros');

// State
let currentTab = window.defaultTab || 'plugin'; // dynamically set based on page

// ==========================================
// Theme Management (Light / Dark)
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('alok_theme') || 'dark';
    applyTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('alok_theme', theme);
    
    // Update theme toggle button icons
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
    const isDark = theme === 'dark';
    const iconHtml = isDark 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    
    toggleBtns.forEach(btn => {
        btn.innerHTML = iconHtml;
        btn.setAttribute('aria-label', isDark ? 'Switch to Light theme' : 'Switch to Dark theme');
        btn.setAttribute('title', isDark ? 'Switch to Light theme' : 'Switch to Dark theme');
    });
}

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
};

// ==========================================
// Mobile Menu Navigation
// ==========================================
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    if (!mobileBtn || !drawer) return;

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = drawer.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    document.addEventListener('click', (e) => {
        if (drawer.classList.contains('active') && !drawer.contains(e.target) && e.target !== mobileBtn) {
            closeMobileMenu();
        }
    });

    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

window.openMobileMenu = function() {
    const drawer = document.getElementById('mobile-drawer');
    const btn = document.getElementById('mobile-menu-btn');
    if (drawer) drawer.classList.add('active');
    if (btn) btn.setAttribute('aria-expanded', 'true');
};

window.closeMobileMenu = function() {
    const drawer = document.getElementById('mobile-drawer');
    const btn = document.getElementById('mobile-menu-btn');
    if (drawer) drawer.classList.remove('active');
    if (btn) btn.setAttribute('aria-expanded', 'false');
};

// ==========================================
// Marketplace Engine (Search, Filter, Sort)
// ==========================================
let marketplaceState = {
    search: '',
    category: 'all',
    price: 'all',
    sort: 'newest'
};

function initMarketplace() {
    const gridEl = document.getElementById('products-grid');
    if (!gridEl) {
        const navSearch = document.getElementById('nav-search-input');
        if (navSearch) {
            navSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                    const isFile = window.location.protocol === 'file:';
                    const targetPage = (isFile ? 'index.html' : '/') + '?search=' + encodeURIComponent(e.target.value.trim()) + '#marketplace';
                    window.location.href = targetPage;
                }
            });
        }
        return;
    }

    // Read URL params
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) marketplaceState.category = params.get('category').toLowerCase();
    if (params.has('price')) marketplaceState.price = params.get('price').toLowerCase();
    if (params.has('search')) marketplaceState.search = params.get('search');
    if (params.has('sort')) marketplaceState.sort = params.get('sort');

    // Marketplace search input
    const searchInput = document.getElementById('marketplace-search');
    if (searchInput) {
        if (marketplaceState.search) searchInput.value = marketplaceState.search;
        searchInput.addEventListener('input', (e) => {
            marketplaceState.search = e.target.value;
            const navSearch = document.getElementById('nav-search-input');
            if (navSearch && navSearch.value !== e.target.value) navSearch.value = e.target.value;
            renderMarketplace();
        });
    }

    // Nav search input
    const navSearchInput = document.getElementById('nav-search-input');
    if (navSearchInput) {
        if (marketplaceState.search) navSearchInput.value = marketplaceState.search;
        navSearchInput.addEventListener('input', (e) => {
            marketplaceState.search = e.target.value;
            if (searchInput && searchInput.value !== e.target.value) searchInput.value = e.target.value;
            renderMarketplace();
            const mSec = document.getElementById('marketplace');
            if (mSec && e.target.value.trim().length === 1) {
                mSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
        navSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const mSec = document.getElementById('marketplace');
                if (mSec) mSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Category filter chips
    const categoryChips = document.querySelectorAll('.filter-chip[data-category]');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            marketplaceState.category = chip.getAttribute('data-category');
            updateChipUI();
            renderMarketplace();
        });
    });

    // Price filter chips
    const priceChips = document.querySelectorAll('.filter-chip[data-price]');
    priceChips.forEach(chip => {
        chip.addEventListener('click', () => {
            marketplaceState.price = chip.getAttribute('data-price');
            updateChipUI();
            renderMarketplace();
        });
    });

    // Sort select
    const sortSelect = document.getElementById('marketplace-sort');
    if (sortSelect) {
        if (marketplaceState.sort) sortSelect.value = marketplaceState.sort;
        sortSelect.addEventListener('change', (e) => {
            marketplaceState.sort = e.target.value;
            renderMarketplace();
        });
    }

    // Clear filters button
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearMarketplaceFilters);
    }

    updateChipUI();
    renderMarketplace();

    // Auto-scroll to marketplace if URL contains filter params or #marketplace
    if (params.has('category') || params.has('price') || params.has('search') || window.location.hash === '#marketplace') {
        setTimeout(() => {
            const mSec = document.getElementById('marketplace');
            if (mSec) mSec.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    }

    // Listen for hash and popstate changes
    window.addEventListener('hashchange', () => {
        const p = new URLSearchParams(window.location.search);
        if (p.has('category')) marketplaceState.category = p.get('category').toLowerCase();
        if (p.has('price')) marketplaceState.price = p.get('price').toLowerCase();
        updateChipUI();
        renderMarketplace();
    });
}

function updateChipUI() {
    document.querySelectorAll('.filter-chip[data-category]').forEach(chip => {
        if (chip.getAttribute('data-category') === marketplaceState.category) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    document.querySelectorAll('.filter-chip[data-price]').forEach(chip => {
        if (chip.getAttribute('data-price') === marketplaceState.price) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
}

window.setCategoryFilter = function(category) {
    marketplaceState.category = category;
    updateChipUI();
    renderMarketplace();
    const mSec = document.getElementById('marketplace');
    if (mSec) mSec.scrollIntoView({ behavior: 'smooth' });
};

window.setPriceFilter = function(price) {
    marketplaceState.price = price;
    updateChipUI();
    renderMarketplace();
    const mSec = document.getElementById('marketplace');
    if (mSec) mSec.scrollIntoView({ behavior: 'smooth' });
};

window.filterMarketplace = window.setPriceFilter;

window.clearMarketplaceFilters = function() {
    marketplaceState.search = '';
    marketplaceState.category = 'all';
    marketplaceState.price = 'all';
    marketplaceState.sort = 'newest';

    const searchInput = document.getElementById('marketplace-search');
    if (searchInput) searchInput.value = '';
    const navSearch = document.getElementById('nav-search-input');
    if (navSearch) navSearch.value = '';
    const sortSelect = document.getElementById('marketplace-sort');
    if (sortSelect) sortSelect.value = 'newest';

    updateChipUI();
    renderMarketplace();
};

function renderMarketplace() {
    const gridEl = document.getElementById('products-grid');
    if (!gridEl) return;

    const countEl = document.getElementById('results-count');
    const activeTagsEl = document.getElementById('active-tags-list');
    const clearBtn = document.getElementById('clear-filters-btn');

    let filtered = [...projectData];

    // Search query
    const query = (marketplaceState.search || '').trim().toLowerCase();
    if (query) {
        filtered = filtered.filter(item => {
            const nameMatch = (item.name || '').toLowerCase().includes(query);
            const descMatch = (item.description || '').toLowerCase().includes(query);
            const typeMatch = (item.type || '').toLowerCase().includes(query);
            const tagsMatch = Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(query));
            const featuresMatch = Array.isArray(item.features) && item.features.some(f => f.toLowerCase().includes(query));
            return nameMatch || descMatch || typeMatch || tagsMatch || featuresMatch;
        });
    }

    // Category
    if (marketplaceState.category !== 'all') {
        const cat = marketplaceState.category;
        filtered = filtered.filter(item => {
            const itemType = (item.type || '').toLowerCase();
            if (cat === 'plugin') return itemType === 'plugin';
            if (cat === 'macro') return itemType === 'macro';
            if (cat === 'project') return itemType === 'project';
            if (cat === 'scripting') return itemType === 'scripting';
            if (cat === 'expression') return itemType === 'expression';
            return true;
        });
    }

    // Price
    if (marketplaceState.price !== 'all') {
        if (marketplaceState.price === 'free') {
            filtered = filtered.filter(item => !item.price || item.price === 0);
        } else if (marketplaceState.price === 'paid') {
            filtered = filtered.filter(item => item.price && item.price > 0);
        }
    }

    // Sort
    filtered.sort((a, b) => {
        const priceA = a.salePrice ? Number(a.salePrice) : (a.price ? Number(a.price) : 0);
        const priceB = b.salePrice ? Number(b.salePrice) : (b.price ? Number(b.price) : 0);
        const downloadsA = a.downloads || 0;
        const downloadsB = b.downloads || 0;

        switch (marketplaceState.sort) {
            case 'popular':
                if (downloadsA !== downloadsB) return downloadsB - downloadsA;
                return (b.price ? 1 : 0) - (a.price ? 1 : 0);
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'newest':
            default:
                const isNewA = a.isNew ? 1 : 0;
                const isNewB = b.isNew ? 1 : 0;
                if (isNewA !== isNewB) return isNewB - isNewA;
                const paidA = a.price ? 1 : 0;
                const paidB = b.price ? 1 : 0;
                if (paidA !== paidB) return paidB - paidA;
                return 0;
        }
    });

    if (countEl) {
        countEl.textContent = `Showing ${filtered.length} tool${filtered.length === 1 ? '' : 's'}`;
    }

    const hasActiveFilters = query || marketplaceState.category !== 'all' || marketplaceState.price !== 'all';
    if (clearBtn) {
        clearBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
    }

    if (activeTagsEl) {
        let tagsHtml = '';
        if (query) {
            tagsHtml += `<span class="filter-chip active" style="font-size: 0.75rem;">Query: "${query}"</span>`;
        }
        if (marketplaceState.category !== 'all') {
            tagsHtml += `<span class="filter-chip active" style="font-size: 0.75rem;">Category: ${marketplaceState.category}</span>`;
        }
        if (marketplaceState.price !== 'all') {
            tagsHtml += `<span class="filter-chip active" style="font-size: 0.75rem;">Price: ${marketplaceState.price}</span>`;
        }
        activeTagsEl.innerHTML = tagsHtml;
    }

    gridEl.innerHTML = '';
    if (filtered.length === 0) {
        gridEl.innerHTML = `
            <div class="marketplace-empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3 style="color: var(--text-main); font-size: 1.3rem; margin: 0;">No tools match your filters</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 440px; margin: 0;">Try adjusting your search terms, changing the category, or clearing filters to see all available DaVinci Resolve resources.</p>
                <button class="btn-primary" onclick="clearMarketplaceFilters()" style="margin-top: 0.5rem;">Reset All Filters</button>
            </div>
        `;
        return;
    }

    filtered.forEach((item) => {
        gridEl.appendChild(createProductCard(item));
    });
    initScrollReveals();
}

function createProductCard(item) {
    const card = document.createElement('div');
    card.className = 'product-item-card scroll-reveal';

    // Component-specific motion highlights
    if (item.price && item.salePrice) {
        card.classList.add('product-card-sale');
    } else if (!item.price || item.price === 0) {
        card.classList.add('product-card-free');
    } else {
        card.classList.add('product-card-standard');
    }

    let mediaContent = '';
    if (item.image) {
        mediaContent = `<img src="${item.image}" alt="${item.name}" loading="lazy">`;
    } else if (item.youtube) {
        let vId = '';
        try {
            const u = new URL(item.youtube.trim());
            if (u.hostname.includes('youtube.com')) vId = u.searchParams.get('v');
            else if (u.hostname.includes('youtu.be')) vId = u.pathname.slice(1);
        } catch(e) {}
        if (vId) {
            mediaContent = `<img src="https://img.youtube.com/vi/${vId}/hqdefault.jpg" alt="${item.name}" loading="lazy">`;
        }
    }
    if (!mediaContent) {
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z';
        if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z';
        if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z';
        if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6';
        if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16';
        mediaContent = `<div style="width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; color: var(--primary);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${iconPath}"/></svg></div>`;
    }

    let leftBadge = '';
    if (item.comingSoon) {
        leftBadge = `<span class="product-card-badge-left" style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: #fff; font-weight: 700; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);">Coming Soon</span>`;
    } else
    if (item.price && item.salePrice) {
        leftBadge = `<span class="product-card-badge-left badge-sale">${item.discount || 'Sale'}</span>`;
    } else if (item.isNew) {
        leftBadge = `<span class="product-card-badge-left badge-new">New</span>`;
    }

    let rightBadge = '';
    if (item.downloads) {
        rightBadge = `<span class="product-card-badge-right">${item.downloads}+ Downloads</span>`;
    } else if (item.type) {
        rightBadge = `<span class="product-card-badge-right">${item.type.toUpperCase()}</span>`;
    }

    let priceHtml = '';
    if (item.comingSoon) {
        priceHtml = `<span style="color: #c4b5fd; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase;">Coming Soon</span>`;
    } else
    if (item.price) {
        if (item.salePrice) {
            priceHtml = `<span class="old-price">$${Number(item.price).toFixed(2)}</span>$${Number(item.salePrice).toFixed(2)}`;
        } else {
            priceHtml = `$${Number(item.price).toFixed(2)}`;
        }
    } else {
        priceHtml = `<span class="free-badge">Free</span>`;
    }

    const isFile = window.location.protocol === 'file:';
    const detailUrl = (isFile ? 'product.html' : 'product') + '?id=' + encodeURIComponent(item.id);

    let actionBtnHtml = '';
    if (item.comingSoon) {
        actionBtnHtml = `<a href="${detailUrl}" class="btn-card-get" style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.4); color: #c4b5fd;" onclick="event.stopPropagation();">Coming Soon</a>`;
    } else
    if (item.price) {
        const payKey = item.payhipKey || 'dFOVz';
        actionBtnHtml = `<a href="https://payhip.com/b/${payKey}" target="_blank" rel="noopener" class="btn-card-get" onclick="event.stopPropagation();">Buy Now</a>`;
    } else if (item.link) {
        actionBtnHtml = `<a href="${item.link}" target="_blank" rel="noopener" class="btn-card-get" onclick="event.stopPropagation();">Get Free</a>`;
    } else if (item.file) {
        actionBtnHtml = `<a href="${item.file}" download class="btn-card-get" onclick="event.stopPropagation();">Download</a>`;
    } else {
        actionBtnHtml = `<a href="${detailUrl}" class="btn-card-get">Get Tool</a>`;
    }

    card.innerHTML = `
        <div class="product-card-media">
            ${mediaContent}
            ${leftBadge}
            ${rightBadge}
        </div>
        <div class="product-card-content">
            <div class="product-card-meta">
                <span class="product-card-type">${item.type || 'Plugin'}</span>
                <div class="product-card-price">${priceHtml}</div>
            </div>
            <h3 class="product-card-title">${item.name}</h3>
            <p class="product-card-desc">${item.description || ''}</p>
            <div class="product-card-actions">
                <a href="${detailUrl}" class="btn-card-details">View Details</a>
                ${actionBtnHtml}
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        window.location.href = detailUrl;
    });

    return card;
}

function renderPopularDownloads() {
    const popGrid = document.getElementById('popular-downloads-grid');
    if (!popGrid) return;
    popGrid.innerHTML = '';

    const popularIds = ['Rectangle_V3', 'AutoFileOrganizer', 'AutoFileOrganizerPro', 'CamAlign'];
    const popularItems = projectData.filter(i => popularIds.includes(i.id));

    popularItems.forEach((item) => {
        popGrid.appendChild(createProductCard(item));
    });
    initScrollReveals();
}

function renderRelatedProducts(currentItem) {
    const relatedGrid = document.getElementById('related-products-grid');
    if (!relatedGrid || !currentItem) return;
    relatedGrid.innerHTML = '';

    let related = projectData.filter(i => i.id !== currentItem.id && i.type === currentItem.type);
    if (related.length < 3) {
        const others = projectData.filter(i => i.id !== currentItem.id && !related.some(r => r.id === i.id));
        related = related.concat(others);
    }
    related = related.slice(0, 3);

    related.forEach(item => {
        relatedGrid.appendChild(createProductCard(item));
    });
    initScrollReveals();
}

/**
 * Sticky Navbar Scroll State
 * Adds .navbar-scrolled on scroll to enhance backdrop blur and shadow
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.marketplace-navbar');
    if (!navbar) return;

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 20) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/**
 * Scroll Reveal Animation Engine
 * Smooth Blur-to-Original Focus System:
 * - Triggers smoothly as elements enter viewport so the blur-to-sharp transition is clearly visible
 * - Micro-stagger capped at max 120ms so there is NEVER a 2-second delay
 * - Respects prefers-reduced-motion
 */
let scrollRevealObserver = null;

// Reveal elements currently inside the visible viewport (used on page load and anchor jumps)
function revealCurrentViewportElements() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const elements = document.querySelectorAll('.scroll-reveal:not(.is-revealed)');
    if (!elements.length) return;

    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = el.getBoundingClientRect();
        // If element is inside the current viewport
        if (rect.top < vh && rect.bottom > 0) {
            el.style.transitionDelay = '0ms';
            el.classList.add('is-revealed');
            if (scrollRevealObserver) {
                scrollRevealObserver.unobserve(el);
            }
        }
    }
}

// Reveal target sections immediately when clicking anchor links (e.g., #about or #marketplace)
window.addEventListener('hashchange', () => {
    setTimeout(revealCurrentViewportElements, 10);
    setTimeout(revealCurrentViewportElements, 100);
});
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        setTimeout(revealCurrentViewportElements, 20);
        setTimeout(revealCurrentViewportElements, 150);
    }
});

// Global hard reload detector: Ctrl+Shift+R, Cmd+Shift+R, Ctrl+F5, Shift+F5
(function setupHardReloadDetection() {
    function onKeyDown(e) {
        const isCtrlOrMeta = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;
        const isR = e.key === 'r' || e.key === 'R' || e.keyCode === 82;
        const isF5 = e.key === 'F5' || e.keyCode === 116;

        if ((isCtrlOrMeta && isShift && isR) || (isCtrlOrMeta && isF5) || (isShift && isF5)) {
            try {
                sessionStorage.setItem('ave_hard_reload', 'true');
                sessionStorage.removeItem('ave_anim_shown');
                localStorage.removeItem('ave_anim_shown');
            } catch (err) {}
        }
    }

    window.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keydown', onKeyDown, true);
})();

function initScrollReveals() {
    const isNoAnim = document.documentElement.classList.contains('ave-no-anim');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.scroll-reveal:not(.is-revealed)');
    if (!revealElements.length) return;

    if (isNoAnim || prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => {
            el.style.transitionDelay = '0ms';
            el.classList.add('is-revealed');
        });
        return;
    }

    // Reveal whatever is currently on-screen on initial page load
    revealCurrentViewportElements();

    if (!scrollRevealObserver) {
        scrollRevealObserver = new IntersectionObserver((entries, obs) => {
            const intersecting = entries.filter(e => e.isIntersecting && !e.target.classList.contains('is-revealed'));
            if (!intersecting.length) return;

            intersecting.forEach((entry, idx) => {
                const el = entry.target;
                
                // Micro-stagger between sibling cards in the same batch (max 120ms total)
                const delay = (idx % 3) * 60;

                el.style.transitionDelay = `${delay}ms`;
                el.classList.add('is-revealed');
                obs.unobserve(el);

                setTimeout(() => {
                    el.style.transitionDelay = '';
                }, delay + 500);
            });
        }, {
            root: null,
            // Trigger right as the element enters the viewport so user visibly sees the blur-to-sharp animation!
            rootMargin: '0px 0px -15px 0px',
            threshold: 0.05
        });
    }

    revealElements.forEach(el => {
        if (!el.classList.contains('is-revealed')) {
            scrollRevealObserver.observe(el);
        }
    });
}

/**
 * Smooth Animated Counter for Hero & Overview Statistics
 * Smoothly animates numbers from 0 to the target value with ease-out cubic/expo easing
 */
function initStatCounters() {
    const statElements = document.querySelectorAll('.hero-stat-number[data-target], [data-counter-target]');
    if (!statElements.length) return;

    const isNoAnim = document.documentElement.classList.contains('ave-no-anim');
    if (isNoAnim) {
        statElements.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target') || el.getAttribute('data-counter-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            if (!isNaN(target)) {
                el.textContent = `${prefix}${target.toLocaleString('en-US')}${suffix}`;
            }
        });
        return;
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (el) => {
        if (el._hasAnimated) return;
        el._hasAnimated = true;

        const target = parseFloat(el.getAttribute('data-target') || el.getAttribute('data-counter-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1800; // 1.8 seconds for smooth ease
        const startTime = performance.now();

        if (prefersReducedMotion || isNaN(target)) {
            el.textContent = `${prefix}${target.toLocaleString('en-US')}${suffix}`;
            return;
        }

        // Start display from 0
        el.textContent = `${prefix}0${suffix}`;

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutExpo: smooth rapid acceleration then gentle deceleration into target
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.floor(ease * target);

            el.textContent = `${prefix}${currentVal.toLocaleString('en-US')}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = `${prefix}${target.toLocaleString('en-US')}${suffix}`;
            }
        }

        requestAnimationFrame(step);
    };

    // Run slightly after loader dismisses so the user sees the numbers smoothly counting up from 0
    setTimeout(() => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            statElements.forEach(el => observer.observe(el));
        } else {
            statElements.forEach(el => animate(el));
        }
    }, 200);
}

/**
 * Initialize the App
 */
function init() {
    initLoader(); // Initialize Loading Screen

    // Handle Selection Modal Logic
    const selectionModal = document.getElementById('selection-modal');
    if (selectionModal) {
        const hash = window.location.hash.replace('#', '');
        // Only hide if the hash points to a specific item, not just a tab
        if (hash && hash !== 'plugin' && hash !== 'macro') {
            selectionModal.classList.remove('active');
            selectionModal.style.display = 'none';
        }
    }

    // Set initial toggle state
    const controls = document.getElementById('toggle-controls');
    if (controls) controls.setAttribute('data-active', currentTab);

    // Ensure flash sale status is up-to-date before rendering
    if (typeof applyFlashSaleAutoReset === 'function') applyFlashSaleAutoReset();

    initTheme();
    initMobileMenu();
    initNavbarScroll();
    initMarketplace();
    renderPopularDownloads();
    initScrollReveals();
    initStatCounters();

    if (grid) renderGrid();
    if (homeGrid) renderHomeOverview();

    setupSocialHover();
    createNotificationNav();
    setupPageTransitions();
    
    // If on product page, render the product details
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.endsWith('product.html') || currentPath.endsWith('/product') || currentPath.endsWith('/product/')) {
        renderProductPage();
    } else {
        // Hash change for URL modal routing (legacy, leaving for safety if any other hash logic exists)
        window.addEventListener('hashchange', handleHashChange);
        createInfoModal();
        handleHashChange(); // initial check
    }
}

/**
 * Initialize Loading Screen
 */
function initLoader() {
    const isNoAnim = document.documentElement.classList.contains('ave-no-anim');
    const loader = document.getElementById('loader-wrapper');
    if (isNoAnim && loader) {
        loader.style.display = 'none';
        window.isInitialLoad = false;
        return;
    }

    const ring = document.getElementById('particle-ring');
    const particleCount = 24;


    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        const isNavigating = sessionStorage.getItem('isNavigating') === 'true';
        
        if (isNavigating) {
            // User navigated via a link: animate mosaic out
            if (loader) loader.style.display = 'none'; // Hide default loader
            
            const overlay = createMosaicOverlay();
            overlay.classList.add('visible');
            const tiles = overlay.querySelectorAll('.mosaic-tile');
            
            // Set all tiles to active instantly
            tiles.forEach(t => {
                t.style.transitionDuration = '0s';
                t.classList.add('active');
            });
            
            // Force reflow
            void overlay.offsetWidth;
            
            // Animate tiles shrinking back to 0
            tiles.forEach(t => {
                t.style.transitionDuration = '0.2s';
                t.classList.remove('active');
            });
            
            sessionStorage.removeItem('isNavigating');
            
            setTimeout(() => {
                overlay.classList.remove('visible');
                window.isInitialLoad = false;
            }, 400);
        } else {
            // Normal refresh/direct open
            setTimeout(() => {
                if(loader) loader.classList.add('fade-out');
                setTimeout(() => {
                    if(loader) loader.style.display = 'none';
                    window.isInitialLoad = false;
                }, 400);
            }, 100);
        }
    });
}

/**
 * Setup Smooth Page Transitions
 */
function setupPageTransitions() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Only target internal navigation links (excluding hash anchors, external links, downloads)
        if (link.hostname === window.location.hostname && 
            link.target !== '_blank' &&
            !link.hasAttribute('download') &&
            href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.href;
                const overlay = createMosaicOverlay();
                overlay.classList.add('visible');
                
                // Force reflow
                void overlay.offsetWidth;
                
                const tiles = overlay.querySelectorAll('.mosaic-tile');
                // Ensure duration is reset
                tiles.forEach(t => t.style.transitionDuration = '0.2s');
                
                // Trigger the mosaic wipe (scale to 1)
                tiles.forEach(t => t.classList.add('active'));
                
                sessionStorage.setItem('isNavigating', 'true');
                
                // Wait for all tiles to finish expanding
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            });
        }
    });
}

/**
 * Create Mosaic Overlay
 */
function createMosaicOverlay() {
    let overlay = document.getElementById('mosaic-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mosaic-overlay';
        
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                const tile = document.createElement('div');
                tile.className = 'mosaic-tile';
                const dist = Math.sqrt(Math.pow(r - 4.5, 2) + Math.pow(c - 4.5, 2));
                tile.style.transitionDelay = `${dist * 0.02}s`;
                overlay.appendChild(tile);
            }
        }
        document.body.appendChild(overlay);
    }
    return overlay;
}

/**
 * Handle initial selection from the modal
 */
window.handleInitialSelection = function(tab) {
    const selectionModal = document.getElementById('selection-modal');
    if (selectionModal) {
        selectionModal.classList.remove('active');
        setTimeout(() => {
            selectionModal.style.display = 'none';
        }, 500);
    }
    // Ensure currentTab is different so switchTab runs its full logic
    currentTab = '';
    window.switchTab(tab);
}

/**
 * Switch between Plugin and Macro tabs
 */
window.switchTab = function (tab) {
    if (currentTab === tab) return;

    // Determine Animation Direction
    // If going to 'macro' (Right Tab), content moves left
    // If going to 'plugin' (Left Tab), content moves right
    const animationClass = (tab === 'macro') ? 'anim-slide-left' : 'anim-slide-right';

    currentTab = tab;

    // Update State Attribute for CSS Animation
    const controls = document.getElementById('toggle-controls');
    if (controls) controls.setAttribute('data-active', tab);

    // Update Button Styles (Optional fallback, but CSS handles it now via data-active)
    if (btnPlugins && btnMacros) {
        if (tab === 'plugin') {
            btnPlugins.classList.add('active');
            btnMacros.classList.remove('active');
        } else {
            btnMacros.classList.add('active');
            btnPlugins.classList.remove('active');
        }
    }

    // Add animation back!
    if (grid) {
        grid.className = 'content-grid ' + animationClass;
        
        // Force reflow to restart animation if we click back and forth
        void grid.offsetWidth;

        renderGrid();
    }

    // Update URL hash without jumping
    if (!document.getElementById('info-modal')?.classList.contains('active')) {
        history.replaceState('', document.title, window.location.pathname + window.location.search + '#' + tab);
    }
}

/**
 * Render Cards based on current tab
 */
function renderGrid() {
    if (!grid) return;
    grid.innerHTML = '';

    let filteredData = projectData.filter(item => item.type === currentTab);

    // Sort: Paid items first. If same, 'New' items appear before older ones.
    filteredData.sort((a, b) => {
        const aIsPaid = a.price ? 1 : 0;
        const bIsPaid = b.price ? 1 : 0;
        
        if (aIsPaid !== bIsPaid) {
            return bIsPaid - aIsPaid; // Paid on top
        }
        
        // If both are paid or both are free, put NEW ones first
        const aIsNew = a.isNew ? 1 : 0;
        const bIsNew = b.isNew ? 1 : 0;
        return bIsNew - aIsNew;
    });

    if (filteredData.length === 0) {
        grid.innerHTML = `<p style="text-align:center; color:#aaa; grid-column: 1 / -1;">No ${currentTab}s found.</p>`;
        return;
    }

    filteredData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card premium-card'; 
        // Stagger the slide-in animation fast
        card.style.animationDelay = `${index * 0.05}s`;

        // Set different icons based on type for visual variety
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; // default plugin
        if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'; // generic doc icon
        if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'; // folder
        if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6'; // code
        if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16'; // specific icon for expression

        let badgesHTML = '';
        if (item.price && item.salePrice) {
            const badgeText = item.discount || 'On Sale';
            badgesHTML += `<div class="card-badge sale-badge">${badgeText}</div>`;
        } else if (item.isNew) {
            badgesHTML += `<div class="card-badge">New</div>`;
        }

        let saleEndHTML = '';
        if (item.saleEnd) {
            saleEndHTML = `<div class="card-badge-top-right">Ends ${item.saleEnd}</div>`;
        }

        let priceBadgeHTML = '';
        if (item.price) {
            if (item.salePrice) {
                priceBadgeHTML = `<div class="card-price"><span class="old-price">$${Number(item.price).toFixed(2)}</span>$${Number(item.salePrice).toFixed(2)}</div>`;
            } else {
                priceBadgeHTML = `<div class="card-price">$${Number(item.price).toFixed(2)}</div>`;
            }
        } else {
            priceBadgeHTML = `<div class="card-price">Free</div>`;
        }

        let iconOrImageHTML = '';
        if (item.image) {
            iconOrImageHTML = `<img src="${item.image}" alt="${item.name}">`;
        } else if (item.youtube) {
            let vId = '';
            try {
                const u = new URL(item.youtube.trim());
                if (u.hostname.includes('youtube.com')) vId = u.searchParams.get('v');
                else if (u.hostname.includes('youtu.be')) vId = u.pathname.slice(1);
            } catch(e) {}
            if (vId) {
                iconOrImageHTML = `<img src="https://img.youtube.com/vi/${vId}/maxresdefault.jpg" onerror="this.src='https://img.youtube.com/vi/${vId}/hqdefault.jpg'" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
            }
        }
        
        if (!iconOrImageHTML) {
            iconOrImageHTML = `
                <div style="width: 90px; height: 90px; border-radius: 24px; border: 2px solid var(--primary); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${iconPath}" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-image-block">
                ${iconOrImageHTML}
                ${badgesHTML}
                ${saleEndHTML}
            </div>
            <h3 class="card-title">${item.name}</h3>
            ${priceBadgeHTML}
        `;

        card.onclick = () => {
            const productUrl = window.location.protocol === 'file:' ? 'product.html?id=' : 'product?id=';
            window.location.href = productUrl + item.id;
        };

        grid.appendChild(card);
    });
}

/**
 * Render Overview Cards for the Home Page
 */
function renderHomeOverview() {
    if (!homeGrid) return;
    homeGrid.innerHTML = '';

    // Display specific featured items on the home page
    const featuredIds = ['Rectangle_V3'];
    const displayData = projectData.filter(item => featuredIds.includes(item.id));

    displayData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card premium-card'; 

        // Set different icons based on type for visual variety
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; // default plugin
        if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'; // generic doc icon
        if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'; // folder
        if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6'; // code
        if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16'; // specific icon for expression

        let downloadCountHTML = '';
        if (item.id === 'Rectangle_V3') {
            downloadCountHTML = `<div style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: #000; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; z-index: 10; text-transform: uppercase;">3000+ Downloads</div>`;
        } else if (item.saleEnd) {
            downloadCountHTML = `<div class="card-badge-top-right">Ends ${item.saleEnd}</div>`;
        } else if (item.id === 'AutoFileOrganizer') {
            downloadCountHTML = `<div style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: #000; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; z-index: 10; text-transform: uppercase;">500+ Downloads</div>`;
        }

        let badgesHTML = '';
        if (item.price && item.salePrice) {
            const badgeText = item.discount || 'On Sale';
            badgesHTML += `<div class="card-badge sale-badge">${badgeText}</div>`;
        } else if (item.isNew) {
            badgesHTML += `<div class="card-badge">New</div>`;
        }

        let priceBadgeHTML = '';
        if (item.price) {
            if (item.salePrice) {
                priceBadgeHTML = `<div class="card-price"><span class="old-price">$${Number(item.price).toFixed(2)}</span>$${Number(item.salePrice).toFixed(2)}</div>`;
            } else {
                priceBadgeHTML = `<div class="card-price">$${Number(item.price).toFixed(2)}</div>`;
            }
        } else {
            priceBadgeHTML = `<div class="card-price">Free</div>`;
        }

        let iconOrImageHTML = '';
        if (item.image) {
            iconOrImageHTML = `<img src="${item.image}" alt="${item.name}">`;
        } else if (item.youtube) {
            let vId = '';
            try {
                const u = new URL(item.youtube.trim());
                if (u.hostname.includes('youtube.com')) vId = u.searchParams.get('v');
                else if (u.hostname.includes('youtu.be')) vId = u.pathname.slice(1);
            } catch(e) {}
            if (vId) {
                iconOrImageHTML = `<img src="https://img.youtube.com/vi/${vId}/maxresdefault.jpg" onerror="this.src='https://img.youtube.com/vi/${vId}/hqdefault.jpg'" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
            }
        }
        
        if (!iconOrImageHTML) {
            iconOrImageHTML = `
                <div style="width: 90px; height: 90px; border-radius: 24px; border: 2px solid var(--primary); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${iconPath}" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-image-block">
                ${iconOrImageHTML}
                ${badgesHTML}
                ${downloadCountHTML}
            </div>
            <h3 class="card-title">${item.name}</h3>
            ${priceBadgeHTML}
        `;

        card.onclick = () => {
            // When clicked on home page, open the item in the dedicated product page
            const productUrl = window.location.protocol === 'file:' ? 'product.html?id=' : 'product?id=';
            window.location.href = productUrl + item.id;
        };

        homeGrid.appendChild(card);
    });
}


/**
 * Notification Navigation Bar
 * Desktop: Pill at top (slides in like notification)
 * Tablet/Mobile: Bottom tab bar like a native app
 */
function createNotificationNav() {
    // Legacy floating DaVinci Resolve pill nav removed per user request.
    // The modern marketplace navbar handles all navigation.
    return;
}

// Audio logic removed

// Handle Download Flow logic is now integrated into startDownload below.

/**
 * Social Media Hover Text
 */
/**
 * Social Media Hover Text - REMOVED
 */
function setupSocialHover() {
    // Logic removed per user request
}

// Info Modal Logic
function createInfoModal() {
    if (document.getElementById('info-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'info-modal';
    modal.className = 'info-modal';
    modal.innerHTML = `
        <div class="info-content" id="info-content-box">
            <!-- Details View -->
            <div id="info-details-view">
                <button class="info-close" onclick="closeInfoModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div class="card-icon-placeholder" style="margin: 0 auto 1.5rem auto; width: 80px; height: 80px; background: rgba(52, 87, 170, 0.15); border-radius: 24px; border: 1px solid rgba(52, 87, 170, 0.35);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path id="info-icon-path" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h2 id="info-title" class="info-title"></h2>
                <div id="info-type" class="card-type" style="margin-bottom: 0.5rem;"></div>
                <div id="info-price-display" style="color: var(--primary); font-weight: 800; font-size: 1.2rem; margin-bottom: 1.5rem; display: none;"></div>
                <p id="info-desc" class="info-desc"></p>
                <div style="display: flex; gap: 1rem; margin-top: 2rem; width: 100%;">
                    <button id="info-get-btn" class="btn-download" style="flex: 1; justify-content: center; padding: 1.2rem;">
                        <span id="info-get-btn-text">Download</span>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </button>
                    <a id="info-youtube-btn" href="#" target="_blank" class="btn-download" style="flex: 1; justify-content: center; padding: 1.2rem; background: rgba(255, 0, 0, 0.1); border-color: rgba(255, 0, 0, 0.3); color: #ff3333; text-decoration: none; display: none;">
                        <span>Tutorial</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                </div>
            </div>
            
            <!-- Downloading View -->
            <div id="info-downloading-view" style="display: none; flex-direction: column; align-items: center; justify-content: center; min-height: 350px;">
                <div class="download-icon-container">
                    <svg class="download-pulse-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </div>
                <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.3rem; font-weight: 800; letter-spacing: -0.5px;">Downloading</h3>
                <p id="downloading-item-name" style="color: var(--text-muted); font-size: 1rem; margin-bottom: 2.5rem;"></p>
                
                <div class="progress-bar-container">
                    <div class="progress-bar-fill"></div>
                </div>
                <p style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Please Wait...</p>
            </div>
        </div>
    `;
    
    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeInfoModal();
    });
    
    document.body.appendChild(modal);
}

function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'plugin' || hash === 'macro') {
        switchTab(hash);
        closeInfoModal();
    } else if (hash) {
        const item = projectData.find(i => i.id === hash);
        if (item) {
            if (currentTab !== item.type) {
                switchTab(item.type);
            }
            openInfoModal(item);
        } else {
            closeInfoModal();
        }
    } else {
        closeInfoModal();
    }
}

window.closeInfoModal = function() {
    // We use pushState to remove item hash and restore tab hash without jumping the page to top
    history.pushState('', document.title, window.location.pathname + window.location.search + '#' + currentTab);
    const modal = document.getElementById('info-modal');
    if (modal) modal.classList.remove('active');
}

function openInfoModal(item) {
    const modal = document.getElementById('info-modal');
    
    // Reset views
    document.getElementById('info-details-view').style.display = 'block';
    document.getElementById('info-downloading-view').style.display = 'none';
    
    // Set Dynamic Icon
    let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; // default plugin
    if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'; // generic doc icon
    if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'; // folder
    if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6'; // code
    if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16'; // specific icon for expression
    
    const pathElement = document.getElementById('info-icon-path');
    if (pathElement) {
        pathElement.setAttribute('d', iconPath);
    }
    
    document.getElementById('info-title').textContent = item.name;
    document.getElementById('info-type').textContent = item.type;
    document.getElementById('info-desc').textContent = item.description;
    
    const priceDisplay = document.getElementById('info-price-display');
    const getBtnText = document.getElementById('info-get-btn-text');
    
    if (item.price) {
        priceDisplay.style.display = 'block';
        if (item.salePrice) {
            priceDisplay.innerHTML = `<span style="text-decoration: line-through; color: #888; font-size: 1rem; margin-right: 8px;">$${Number(item.price).toFixed(2)}</span>$${Number(item.salePrice).toFixed(2)} <span style="font-size: 0.8rem; color: #ff3366; margin-left: 8px; padding: 2px 6px; border: 1px solid #ff3366; border-radius: 4px; font-weight: 700;">${item.discount || 'SALE'}</span>`;
            getBtnText.textContent = `Buy Now - $${Number(item.salePrice).toFixed(2)}`;
        } else {
            priceDisplay.innerHTML = `$${Number(item.price).toFixed(2)}`;
            getBtnText.textContent = `Buy Now - $${Number(item.price).toFixed(2)}`;
        }
    } else {
        priceDisplay.style.display = 'none';
        getBtnText.textContent = 'Download';
    }

    const btn = document.getElementById('info-get-btn');
    
    if (item.comingSoon) {
        getBtnText.textContent = 'Coming Soon';
        priceDisplay.style.display = 'block';
        priceDisplay.innerHTML = '<span style="color: #a855f7; font-weight: 700; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em;">Coming Soon</span>';
        btn.onclick = () => {
            alert('This item is coming soon!');
        };
    } else {
        btn.onclick = () => {
            if (item.price || item.payhipKey) {
                const key = item.payhipKey || 'xD79B';
                const trigger = document.getElementById('payhip-hidden-trigger');
                
                if (trigger) {
                    trigger.href = `https://payhip.com/b/${key}`;
                    trigger.setAttribute('data-product', key);
                    trigger.click();
                } else {
                    window.open(`https://payhip.com/b/${key}`, '_blank');
                }
            } else if (item.link) {
                window.open(item.link, '_blank');
            } else {
                startDownload(item.file, item.name);
            }
        };
    }
    
    const ytBtn = document.getElementById('info-youtube-btn');
    ytBtn.style.display = 'flex'; // Always show to maintain layout
    
    if (item.youtube && item.youtube.trim() !== '') {
        ytBtn.href = item.youtube;
        ytBtn.style.opacity = '1';
        ytBtn.style.cursor = 'pointer';
        ytBtn.onclick = null;
    } else {
        ytBtn.href = '#';
        ytBtn.style.opacity = '0.4';
        ytBtn.style.cursor = 'not-allowed';
        ytBtn.onclick = (e) => { e.preventDefault(); };
    }
    
    modal.classList.add('active');
}

window.startDownload = function (filename, itemName) {
    // Record Download Event in Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'download', {
            'event_category': 'Software Download',
            'event_label': itemName,
            'file_name': filename.split('/').pop()
        });
    }

    // Trigger Download immediately
    const link = document.createElement('a');
    link.href = filename;
    link.download = filename.split('/').pop();
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Hide Modal immediately
    closeInfoModal();
}


// =========================================
// PREMIUM FEATURE 1: Custom Glow Cursor
// =========================================
function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = document.createElement('div'); dot.id  = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow with lerp
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });
}

// =========================================
// PREMIUM FEATURE 2: Ambient Floating Orbs - REMOVED
// =========================================
function initAmbientOrbs() {
    // Orbs removed per user request
}

// =========================================
// PREMIUM FEATURE 3: Smooth Page Transitions - MOVED TO MOSAIC
// =========================================
function initPageTransitions() {
    // Handled by setupPageTransitions() mosaic wipe now
}

// =========================================
// PREMIUM FEATURE 4: Scroll-to-Top Button
// =========================================
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>`;
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Mutual exclusion for FAQ Accordion:
 * When any question is opened, automatically closes all other opened questions.
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item && other.open) {
                        other.open = false;
                    }
                });
            }
        });
    });
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    init();
    initAmbientOrbs();
    initPageTransitions();
    initScrollToTop();
    initFAQAccordion();
});

/**
 * Dynamically inject high-power SEO metadata and Schema.org for Google Search
 */
function updateProductSEO(item) {
    if (!item) return;

    const fullTitle = `${item.name} for DaVinci Resolve | Alok Video Editor`;
    const fullDesc = `Download ${item.name} for DaVinci Resolve by Alok Video Editor. ${item.description}`;
    const productUrl = `https://mahatoalok.com.np/product.html?id=${item.id}`;
    const productKeywords = [
        item.name,
        `Alok ${item.name}`,
        `${item.name} for DaVinci Resolve`,
        `${item.name} DaVinci Resolve`,
        `${item.name} DaVinci`,
        `${item.name} Resolve`,
        `${item.name} download`,
        `${item.name} free`,
        `${item.name} ${item.type || 'tool'}`,
        'Alok Video Editor',
        'Alok Mahato',
        ...(item.tags || [])
    ].join(', ');

    // 1. Title
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    function setMeta(selector, attr, val) {
        let el = document.querySelector(selector);
        if (!el) {
            el = document.createElement('meta');
            const clean = selector.replace(/[\[\]']/g, '');
            const parts = clean.split('=');
            if (parts.length === 2) {
                el.setAttribute(parts[0], parts[1]);
            }
            document.head.appendChild(el);
        }
        el.setAttribute(attr, val);
    }

    setMeta('meta[name="description"]', 'content', fullDesc);
    setMeta('meta[name="keywords"]', 'content', productKeywords);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', fullDesc);
    setMeta('meta[property="og:url"]', 'content', productUrl);
    setMeta('meta[property="twitter:title"]', 'content', fullTitle);
    setMeta('meta[property="twitter:description"]', 'content', fullDesc);

    const imgSrc = item.heroImage || item.controlsImage || item.image;
    if (imgSrc) {
        const fullImg = imgSrc.startsWith('http') ? imgSrc : `https://mahatoalok.com.np/${imgSrc.replace(/^\//, '')}`;
        setMeta('meta[property="og:image"]', 'content', fullImg);
        setMeta('meta[property="twitter:image"]', 'content', fullImg);
    }

    // 3. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', productUrl);

    // 4. Structured Data (JSON-LD) for Google Search Rich Results
    let schemaScript = document.getElementById('product-jsonld');
    if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'product-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${item.name} for DaVinci Resolve`,
        "alternateName": [
            `Alok ${item.name}`,
            item.name,
            `${item.name} DaVinci Resolve`,
            `${item.name} Macro`,
            `${item.name} Plugin`,
            `Alok Video Editor ${item.name}`
        ],
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Windows, macOS, Linux",
        "url": productUrl,
        "description": fullDesc,
        "creator": {
            "@type": "Person",
            "name": "Alok Video Editor",
            "alternateName": "Alok Mahato",
            "email": "alokvideoeditornp@gmail.com",
            "url": "https://mahatoalok.com.np/",
            "sameAs": [
                "https://www.youtube.com/@alokvideoeditornp",
                "https://www.tiktok.com/@alokvideoeditornp",
                "https://www.instagram.com/alokvideoeditornp"
            ]
        },
        "offers": {
            "@type": "Offer",
            "price": item.price ? item.price.toFixed(2) : "0.00",
            "priceCurrency": "USD",
            "url": productUrl,
            "availability": "https://schema.org/InStock"
        }
    };
    schemaScript.textContent = JSON.stringify(schemaData, null, 2);
}

/**
 * Render Product Page dynamically based on URL parameter
 */
function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    
    // Backward compatibility for old links
    if (productId === 'CamPlugin' || productId === 'CamStyle') {
        productId = 'CamAlign';
    }

    if (!productId) {
        document.getElementById('product-title').innerText = "Product Not Found";
        document.getElementById('product-desc').innerText = "We couldn't find the requested plugin.";
        document.querySelector('.product-right').style.display = 'none';
        document.getElementById('product-type').style.display = 'none';
        return;
    }

    const item = projectData.find(i => i.id === productId);
    if (!item) {
        document.getElementById('product-title').innerText = "Product Not Found";
        document.getElementById('product-desc').innerText = "We couldn't find the requested plugin.";
        document.querySelector('.product-right').style.display = 'none';
        document.getElementById('product-type').style.display = 'none';
        return;
    }

    // Dynamic Full SEO Optimization for Google Search
    updateProductSEO(item);

    // Populate Hero Details
    document.getElementById('product-title').innerText = item.name;
    document.getElementById('product-desc').innerText = item.description;

    // Type styling
    const typeEl = document.getElementById('product-type');
    typeEl.innerText = item.type;
    typeEl.style.background = 'rgba(0, 119, 125, 0.15)';
    typeEl.style.color = '#00777D';
    typeEl.style.padding = '0.4rem 1.2rem';

    // Features List
    const list = document.getElementById('features-list');
    if (item.features && item.features.length > 0) {
        list.innerHTML = item.features.map(f => `<li>${f}</li>`).join('');
    } else {
        list.style.display = 'none';
    }

    // Main Hero / Controls Image & Background Blur
    const heroContainer = document.getElementById('product-hero-container');
    const heroImage = document.getElementById('product-hero-image');
    const bgBlur = document.getElementById('bg-glass-blur');
    const imgSrc = item.heroImage || item.controlsImage || item.image;
    
    if (imgSrc) {
        heroImage.src = imgSrc;
        heroContainer.style.display = 'block';
        if (bgBlur) {
            bgBlur.style.backgroundImage = `url('${imgSrc}')`;
        }
    }

    // Gallery Section
    if (item.previewImages && item.previewImages.length > 0) {
        document.getElementById('product-gallery-section').style.display = 'block';
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = item.previewImages.map(imgSrc => 
            `<img src="${imgSrc}" class="gallery-img" alt="${item.name} Screenshot">`
        ).join('');
    }

    // Tutorial Section (Embedded YouTube)
    if (item.youtube) {
        document.getElementById('product-tutorial-section').style.display = 'block';
        
        let videoId = '';
        try {
            const url = new URL(item.youtube.trim());
            if (url.hostname.includes('youtube.com')) {
                videoId = url.searchParams.get('v');
            } else if (url.hostname.includes('youtu.be')) {
                videoId = url.pathname.slice(1);
            }
        } catch(e) {
            console.error("Invalid YouTube URL");
        }
        
        if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            document.getElementById('tutorial-container').innerHTML = `
                <a href="${item.youtube}" target="_blank" rel="noopener noreferrer" style="display: block; position: relative; width: 100%; height: 100%; text-decoration: none;">
                    <img src="${thumbnailUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Watch Tutorial on YouTube" onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(0,0,0,0.2)'" onmouseout="this.style.background='rgba(0,0,0,0.4)'">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--primary)"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </a>
            `;
        }
    }

    // Live Preview Section for Fusion Expression Editor
    const livePreviewSection = document.getElementById('product-live-preview-section');
    if (livePreviewSection) {
        if (item.id === 'FusionExpressionEditor') {
            livePreviewSection.style.display = 'block';
            
            // Initialize interactivity
            const codeInput = document.getElementById('fp-code-textarea');
            const slider = document.querySelector('.fp-slider-thumb');
            const sliderTrack = document.querySelector('.fp-slider-track');
            const fontSizeLabel = document.querySelector('.fp-input-small');
            
            if (slider && sliderTrack && codeInput && fontSizeLabel) {
                let isDragging = false;
                
                slider.addEventListener('mousedown', () => isDragging = true);
                window.addEventListener('mouseup', () => isDragging = false);
                
                window.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const rect = sliderTrack.getBoundingClientRect();
                    let percentage = (e.clientX - rect.left) / rect.width;
                    percentage = Math.max(0, Math.min(1, percentage));
                    
                    slider.style.left = `calc(${percentage * 100}% - 5px)`;
                    
                    // Map percentage to font size (e.g. 10px to 24px)
                    const minSize = 10;
                    const maxSize = 24;
                    const newSize = Math.round(minSize + (maxSize - minSize) * percentage);
                    
                    fontSizeLabel.textContent = newSize;
                    codeInput.style.setProperty('font-size', `${newSize}px`, 'important');
                    const highlightEl = document.getElementById('fp-code-highlight');
                    if (highlightEl) highlightEl.style.setProperty('font-size', `${newSize}px`, 'important');
                });
                
                const resetFontBtn = document.getElementById('fp-reset-font');
                if (resetFontBtn) {
                    resetFontBtn.addEventListener('click', () => {
                        const defaultSize = 14;
                        fontSizeLabel.textContent = defaultSize;
                        codeInput.style.setProperty('font-size', `${defaultSize}px`, 'important');
                        const highlightEl = document.getElementById('fp-code-highlight');
                        if (highlightEl) highlightEl.style.setProperty('font-size', `${defaultSize}px`, 'important');
                        
                        // Reset slider thumb position
                        const minSize = 10;
                        const maxSize = 24;
                        let percentage = (defaultSize - minSize) / (maxSize - minSize);
                        slider.style.left = `calc(${percentage * 100}% - 5px)`;
                    });
                }
                
                // Syntax Highlighting
                const highlightEl = document.getElementById('fp-code-highlight');
                const updateHighlight = () => {
                    if (!highlightEl) return;
                    let text = codeInput.value;
                    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    
                    text = text.replace(/(\b[a-zA-Z_]\w*\b)|(\b\d+(?:\.\d+)?\b)|([\*\/\+\-\=])/g, function(match, p1, p2, p3) {
                        if (p1) return '<span class="fp-hl-keyword">' + p1 + '</span>';
                        if (p2) return '<span class="fp-hl-number">' + p2 + '</span>';
                        if (p3) return '<span class="fp-hl-operator">' + p3 + '</span>';
                        return match;
                    });
                    
                    if (text.endsWith('\n')) {
                        text += ' ';
                    }
                    highlightEl.innerHTML = text;
                };
                
                codeInput.addEventListener('input', updateHighlight);
                codeInput.addEventListener('scroll', () => {
                    if (highlightEl) {
                        highlightEl.scrollTop = codeInput.scrollTop;
                        highlightEl.scrollLeft = codeInput.scrollLeft;
                    }
                });
                updateHighlight();
                
                // Auto-close brackets and handle Enter key for smart indentation
                codeInput.addEventListener('keydown', function(e) {
                    const pairs = {
                        '(': ')',
                        '{': '}',
                        '[': ']',
                        '"': '"',
                        "'": "'"
                    };
                    
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    const value = this.value;

                    const closeBrackets = [')', '}', ']', '"', "'"];

                    // If typing a closing bracket and the next character is that same bracket, just step over it
                    if (closeBrackets.includes(e.key) && start < value.length && value.charAt(start) === e.key) {
                        e.preventDefault();
                        this.selectionStart = this.selectionEnd = start + 1;
                    } else if (pairs[e.key]) {
                        e.preventDefault();
                        
                        // Insert the pair
                        this.value = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
                        
                        // Move cursor outside the brackets as requested by user
                        this.selectionStart = this.selectionEnd = start + 2;
                        
                        // Trigger input event to update highlights and live sync
                        this.dispatchEvent(new Event('input'));
                    } else if (e.key === 'Enter') {
                        // Check if cursor is between opening and closing brackets
                        if (start > 0 && start < value.length) {
                            const prevChar = value.charAt(start - 1);
                            const nextChar = value.charAt(start);
                            
                            if ((prevChar === '{' && nextChar === '}') ||
                                (prevChar === '[' && nextChar === ']') ||
                                (prevChar === '(' && nextChar === ')')) {
                                
                                e.preventDefault();
                                
                                // Find current indentation of the line
                                let currentLineStart = start - 1;
                                while (currentLineStart >= 0 && value.charAt(currentLineStart) !== '\n') {
                                    currentLineStart--;
                                }
                                const currentLine = value.substring(currentLineStart + 1, start);
                                const match = currentLine.match(/^\s*/);
                                const currentIndent = match ? match[0] : '';
                                
                                const indent = "    "; // 4 spaces for new indentation level
                                
                                // Insert newline, indented line, newline, and closing indent
                                this.value = value.substring(0, start) + '\n' + currentIndent + indent + '\n' + currentIndent + value.substring(end);
                                
                                // Move cursor to the new indented empty line
                                this.selectionStart = this.selectionEnd = start + 1 + currentIndent.length + indent.length;
                                
                                // Trigger input event to update highlights and live sync
                                this.dispatchEvent(new Event('input'));
                            }
                        }
                    }
                });

                // Sync text area with inspector mock UI based on Live checkbox
                const inspectorExpression = document.getElementById('fp-height-expr-text');
                const liveCheckbox = document.getElementById('fp-live-checkbox');
                const applyBtn = document.getElementById('fp-apply-btn');
                
                if (inspectorExpression) {
                    codeInput.addEventListener('input', function() {
                        if (liveCheckbox && liveCheckbox.checked) {
                            inspectorExpression.textContent = this.value || "Expression";
                        }
                    });
                    
                    if (applyBtn) {
                        applyBtn.addEventListener('click', () => {
                            inspectorExpression.textContent = codeInput.value || "Expression";
                        });
                    }
                }

                // Make Inspector sliders interactive (except Height)
                const inspectorPanel = document.querySelector('.fp-inspector-panel');
                if (inspectorPanel) {
                    const propRows = inspectorPanel.querySelectorAll('.fp-prop-row');
                    
                    propRows.forEach(row => {
                        const labelEl = row.querySelector('.fp-prop-label');
                        if (!labelEl) return;
                        
                        const labelText = labelEl.textContent.trim();
                        // Ignore Height as per user request
                        if (labelText === 'Height') return;
                        
                        const sliderTrack = row.querySelector('.fp-prop-slider-track');
                        const sliderThumb = row.querySelector('.fp-prop-slider-thumb');
                        const inputEl = row.querySelector('.fp-prop-input');
                        
                        if (sliderTrack && sliderThumb && inputEl) {
                            let isDraggingProp = false;
                            
                            sliderThumb.style.cursor = 'grab';
                            sliderTrack.style.cursor = 'pointer';
                            
                            const updateSlider = (e) => {
                                const rect = sliderTrack.getBoundingClientRect();
                                let percentage = (e.clientX - rect.left) / rect.width;
                                percentage = Math.max(0, Math.min(1, percentage));
                                
                                sliderThumb.style.left = `calc(${percentage * 100}% - 4px)`;
                                
                                // Map to a value based on label type
                                let val = 0;
                                if (labelText === 'Angle') {
                                    val = (percentage * 360).toFixed(1);
                                } else {
                                    val = percentage.toFixed(2);
                                }
                                
                                inputEl.textContent = val;
                            };
                            
                            sliderTrack.addEventListener('mousedown', (e) => {
                                isDraggingProp = true;
                                sliderThumb.style.cursor = 'grabbing';
                                updateSlider(e);
                            });
                            
                            window.addEventListener('mouseup', () => {
                                isDraggingProp = false;
                                sliderThumb.style.cursor = 'grab';
                            });
                            
                            window.addEventListener('mousemove', (e) => {
                                if (!isDraggingProp) return;
                                updateSlider(e);
                            });
                        }
                    });
                }

            }
            
            // Hide AlignAndPivot if we are in FusionExpressionEditor
            const apPreviewSection = document.getElementById('align-pivot-preview-section');
            if (apPreviewSection) apPreviewSection.style.display = 'none';

        } else if (item.id === 'AlignAndPivot') {
            livePreviewSection.style.display = 'none'; // Hide Fusion one
            const apPreviewSection = document.getElementById('align-pivot-preview-section');
            if (apPreviewSection) {
                apPreviewSection.style.display = 'block';
                const apBox = document.getElementById('ap-box');
                const apPivotContainer = document.getElementById('ap-pivot-container');
                const apPivotSvg = document.getElementById('ap-pivot-svg');
                
                // The red widget ALWAYS stays in the exact center of the white rectangle
                if (apPivotSvg) {
                    apPivotSvg.style.top = '50%';
                    apPivotSvg.style.left = '50%';
                    apPivotSvg.style.transform = 'translate(-50%, -50%)';
                }

                let currentBoxTop = '50%';
                let currentBoxLeft = '50%';
                let currentBoxTx = '-50%';
                let currentBoxTy = '-50%';

                let currentPivotTop = '50%';
                let currentPivotLeft = '50%';

                function updateBoxPosition(iconClass, isAlign, isCanvasOn) {
                    const apBox = document.getElementById('ap-box');
                    const apPivotContainer = document.getElementById('ap-pivot-container');
                    const apPivotElements = document.getElementById('ap-pivot-elements');
                    const apCanvas = document.querySelector('.ap-canvas');

                    if (!apBox || !apPivotContainer || !apPivotElements || !apCanvas) return;

                    if (iconClass) {
                        if (isAlign) {
                            // Reset box to center
                            currentBoxTop = '50%'; currentBoxLeft = '50%';
                            currentBoxTx = '-50%'; currentBoxTy = '-50%';

                            if (isCanvasOn) {
                                // Canvas ON: Center of box touches canvas edge (half off-screen)
                                if (iconClass.includes('top'))    { currentBoxTop = '0%';   currentBoxTy = '-50%'; }
                                if (iconClass.includes('bottom')) { currentBoxTop = '100%';  currentBoxTy = '-50%'; }
                                if (iconClass.includes('left'))   { currentBoxLeft = '0%';  currentBoxTx = '-50%'; }
                                if (iconClass.includes('right'))  { currentBoxLeft = '100%'; currentBoxTx = '-50%'; }
                            } else {
                                // Canvas OFF: Edge of box touches canvas edge (fully inside)
                                if (iconClass.includes('top'))    { currentBoxTop = '0%';   currentBoxTy = '0'; }
                                if (iconClass.includes('bottom')) { currentBoxTop = '100%';  currentBoxTy = '-100%'; }
                                if (iconClass.includes('left'))   { currentBoxLeft = '0%';  currentBoxTx = '0'; }
                                if (iconClass.includes('right'))  { currentBoxLeft = '100%'; currentBoxTx = '-100%'; }
                            }

                            // Pivot container always tracks the box
                            apPivotContainer.style.top = currentBoxTop;
                            apPivotContainer.style.left = currentBoxLeft;
                            apPivotContainer.style.transform = `translate(${currentBoxTx}, ${currentBoxTy})`;

                        } else {
                            // ── PIVOT MODE ──
                            // The pivot container is always positioned at the box center
                            // The green X moves WITHIN the canvas coordinate space
                            
                            const canvasRect = apCanvas.getBoundingClientRect();
                            const boxRect = apBox.getBoundingClientRect();

                            // Default: pivot at center of box
                            let pivotAbsX = boxRect.left + boxRect.width / 2;
                            let pivotAbsY = boxRect.top  + boxRect.height / 2;

                            if (isCanvasOn) {
                                // Canvas ON: Pivot jumps to canvas edges
                                const isTop    = iconClass.includes('top');
                                const isBottom = iconClass.includes('bottom');
                                const isLeft   = iconClass.includes('left');
                                const isRight  = iconClass.includes('right');
                                const isCenterV = !isTop && !isBottom;
                                const isCenterH = !isLeft && !isRight;

                                pivotAbsX = isCenterH ? (canvasRect.left + canvasRect.width / 2)
                                           : isLeft   ? canvasRect.left
                                                      : canvasRect.right;
                                pivotAbsY = isCenterV ? (canvasRect.top + canvasRect.height / 2)
                                           : isTop    ? canvasRect.top
                                                      : canvasRect.bottom;
                            } else {
                                // Canvas OFF: Pivot jumps to box corners/edges
                                const isTop    = iconClass.includes('top');
                                const isBottom = iconClass.includes('bottom');
                                const isLeft   = iconClass.includes('left');
                                const isRight  = iconClass.includes('right');
                                const isCenterV = !isTop && !isBottom;
                                const isCenterH = !isLeft && !isRight;

                                pivotAbsX = isCenterH ? (boxRect.left + boxRect.width / 2)
                                           : isLeft   ? boxRect.left
                                                      : boxRect.right;
                                pivotAbsY = isCenterV ? (boxRect.top + boxRect.height / 2)
                                           : isTop    ? boxRect.top
                                                      : boxRect.bottom;
                            }

                            // Convert absolute screen coords → % within canvas
                            const pivotPctX = ((pivotAbsX - canvasRect.left) / canvasRect.width)  * 100;
                            const pivotPctY = ((pivotAbsY - canvasRect.top)  / canvasRect.height) * 100;

                            currentPivotTop  = pivotPctY + '%';
                            currentPivotLeft = pivotPctX + '%';
                        }
                    }

                    // Apply Box position
                    apBox.style.top       = currentBoxTop;
                    apBox.style.left      = currentBoxLeft;
                    apBox.style.transform = `translate(${currentBoxTx}, ${currentBoxTy})`;

                    // Apply Pivot Container (tracks box)
                    apPivotContainer.style.top       = currentBoxTop;
                    apPivotContainer.style.left      = currentBoxLeft;
                    apPivotContainer.style.transform = `translate(${currentBoxTx}, ${currentBoxTy})`;

                    // Apply Pivot Elements — positioned ABSOLUTELY within the canvas
                    // Remove from pivot container, place on canvas with absolute coords
                    if (!document.getElementById('ap-pivot-elements')) return;

                    // Always keep apPivotElements as direct child of canvas for consistent positioning
                    if (apPivotElements.parentElement !== apCanvas) {
                        apCanvas.appendChild(apPivotElements);
                    }
                    apPivotElements.style.top       = currentPivotTop;
                    apPivotElements.style.left      = currentPivotLeft;
                    apPivotElements.style.width     = '20%';
                    apPivotElements.style.aspectRatio = '16 / 9';
                    apPivotElements.style.height    = 'auto';
                    apPivotElements.style.transform = 'translate(-50%, -50%)';
                    apPivotElements.style.position  = 'absolute';
                }

                // Add basic interactivity for grid buttons
                const alignBtns = apPreviewSection.querySelectorAll('#ap-align-grid .ap-grid-btn');
                const alignCanvasCheck = document.getElementById('ap-align-canvas-check');
                const pivotCanvasCheck = document.getElementById('ap-pivot-canvas-check');

                alignBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        btn.classList.add('active');
                        const icon = btn.querySelector('.ap-icon');
                        if (icon) {
                            updateBoxPosition(icon.className, true, alignCanvasCheck && alignCanvasCheck.checked);
                        }
                        setTimeout(() => { btn.classList.remove('active'); }, 150);
                    });
                });

                const pivotBtns = apPreviewSection.querySelectorAll('#ap-pivot-grid .ap-grid-btn');
                pivotBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        btn.classList.add('active');
                        const icon = btn.querySelector('.ap-icon');
                        if (icon) {
                            updateBoxPosition(icon.className, false, pivotCanvasCheck && pivotCanvasCheck.checked);
                        }
                        setTimeout(() => { btn.classList.remove('active'); }, 150);
                    });
                });

            }
        } else {
            livePreviewSection.style.display = 'none';
            const apPreviewSection = document.getElementById('align-pivot-preview-section');
            if (apPreviewSection) apPreviewSection.style.display = 'none';
        }
    }

    // Buy Box Icon - Always render clean vector category icon (Image 2)
    const iconBox = document.getElementById('product-icon-box');
    if (iconBox) {
        iconBox.style.background = '';
        iconBox.style.border = '';
        
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; // default (plugin - lightning)
        if (item.type === 'macro') {
            iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6';
        } else if (item.type === 'project') {
            iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z';
        } else if (item.type === 'scripting') {
            iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6'; // clean <> code icon
        } else if (item.type === 'expression') {
            iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16';
        }
        
        iconBox.innerHTML = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPath}"/></svg>`;
    }

    // Price
    const priceEl = document.getElementById('product-price');
    if (item.comingSoon) {
        priceEl.innerHTML = `<span style="color: #c4b5fd; font-weight: 800; font-size: 1.15rem; letter-spacing: 0.5px; text-transform: uppercase;">Coming Soon</span>`;
    } else
    if (item.price) {
        if (item.salePrice) {
            priceEl.innerHTML = `<span class="old-price">$${Number(item.price).toFixed(2)}</span>$${Number(item.salePrice).toFixed(2)}`;
        } else {
            priceEl.innerHTML = `$${Number(item.price).toFixed(2)}`;
        }
    } else {
        priceEl.innerHTML = `Free`;
    }

    // Download / Buy Button
    const getBtn = document.getElementById('product-get-btn');
    const getBtnText = document.getElementById('product-get-btn-text');
    const giftBanner = document.querySelector('.gift-banner');

    if (item.comingSoon) {
        getBtnText.innerText = `Coming Soon`;
        getBtn.style.opacity = '0.85';
        getBtn.style.cursor = 'not-allowed';
        getBtn.style.background = 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)';
    } else

    if (item.price) {
        getBtnText.innerText = `Buy Now`;
    } else {
        getBtnText.innerText = `Download for Free`;
    }

    if (giftBanner) {
        giftBanner.style.display = 'none';
        giftBanner.classList.remove('flash-sale-banner');
        
        // Remove existing badge if present (to avoid duplicates if called multiple times)
        const existingBadge = document.querySelector('.os-support-badge');
        if (existingBadge) existingBadge.remove();

        if (item.id !== 'CurrencyNumberFormatter' && item.id !== '4SmoothAnimation') {
            // Determine the guide type from item.type
            let guideType = (item.type || 'plugin').split(/[\s-]/)[0].toLowerCase();
            const validGuides = ['macro', 'workflow', 'fuse', 'plugin', 'scripting'];
            if (!validGuides.includes(guideType)) {
                guideType = 'plugin';
            }

            const isWindowsOnly = (item.id === 'AutoFileOrganizerPro');

            const osBadgeHTML = `
                <div class="os-support-badge" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 1.5rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,0.05); gap: 0.8rem; color: var(--text-muted); font-size: 0.9rem;">
                    <span style="font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 0.75rem;">Supported On</span>
                    <div style="display: flex; gap: 1.5rem; color: #fff; font-size: 0.9rem; font-weight: 500;">
                        <a href="how-to-install-${guideType}.html?os=windows" style="display: flex; align-items: center; gap: 0.4rem; opacity: 0.9; color: #fff; text-decoration: none; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.color='#00a4ef'; this.style.opacity='1'" onmouseout="this.style.color='#fff'; this.style.opacity='0.9'">
                            <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor"><path d="M0 93.6l183.6-25.3v177.4H0V93.6zm227.2-32.1L448 29.3v216.4H227.2V61.5zm0 252.1H448v216.4l-220.8-32.2V313.6zm-227.2 0h183.6v177.4L0 465.7V313.6z"/></svg>
                            <span>Win</span>
                        </a>
                        ${isWindowsOnly ? '' : `
                        <a href="how-to-install-${guideType}.html?os=mac" style="display: flex; align-items: center; gap: 0.4rem; opacity: 0.9; color: #fff; text-decoration: none; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.color='#00777D'; this.style.opacity='1'" onmouseout="this.style.color='#fff'; this.style.opacity='0.9'">
                            <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                            <span>Mac</span>
                        </a>
                        <a href="how-to-install-${guideType}.html?os=linux" style="display: flex; align-items: center; gap: 0.4rem; opacity: 0.9; color: #fff; text-decoration: none; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.color='#f5a900'; this.style.opacity='1'" onmouseout="this.style.color='#fff'; this.style.opacity='0.9'">
                            <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor"><path d="M220.8 123.3c1.1 0 2.2 0 3.3 .1 27.6 .7 57.5 7.1 76.1 21.6 4.7 3.7 8.2 8.7 10.3 14.6 2.3 6.6 2.5 13.9 1 20.6-2.5 11.2-12.7 18.7-24 18.7h-5.2c-15.1 0-25.9-13.8-21.7-28.4 2-7.1 11.1-10.7 18.3-7.5 .5 .2 1 .5 1.5 .8 1.4 1 3.5 .2 3.8-1.4 .1-.9-.3-1.8-1.2-2.3-12.8-7.9-37.1-13-58.9-13.5-3.5-.1-7.1-.1-10.7 .1-22.1 1-46.6 6.8-59.5 15.3-.8 .5-1.1 1.4-1.2 2.3 .2 1.6 2.4 2.4 3.8 1.4 .5-.3 1-.6 1.5-.8 7.3-3.2 16.3 .4 18.3 7.5 4.3 14.5-6.6 28.4-21.7 28.4h-5.2c-11.3 0-21.5-7.5-24-18.7-1.4-6.7-1.2-14 1-20.6 2.1-5.9 5.6-10.9 10.3-14.6 18.8-14.6 49.3-21.1 77.3-21.6 1.1-.1 2.2-.1 3.3-.1zM286.2 38.6c17.6 17.6 28.7 40.5 32 65.4-18.7-10.3-43.2-17.2-70.1-18.6-26.9 1.4-51.4 8.3-70.1 18.6 3.2-24.9 14.4-47.8 32-65.4C226.7 21.8 249.7 21.8 266.4 38.6zM224 0C100.3 0 0 100.3 0 224s100.3 224 224 224 224-100.3 224-224S347.7 0 224 0zM128 224c0-35.3 14.3-67.3 37.5-90.5 14.5-14.5 32.2-25.2 51.5-31.5 2.3-7.8 8.1-14.3 15.6-18.2 9.5-4.9 21.1-4.9 30.7 0 7.5 3.9 13.3 10.4 15.6 18.2 19.3 6.3 37 17 51.5 31.5C353.7 156.7 368 188.7 368 224c0 79.5-64.5 144-144 144S80 303.5 80 224z"/></svg>
                            <span>Linux</span>
                        </a>
                        `}
                    </div>
                </div>
            `;
            giftBanner.insertAdjacentHTML('afterend', osBadgeHTML);
        }
    }

    getBtn.onclick = () => {
        if (item.comingSoon) {
            alert("This plugin is currently in final development and coming soon! Stay tuned to @alokvideoeditornp on YouTube or TikTok for the release announcement.");
            return;
        }
        if (item.price) {
            window.open(`https://payhip.com/b/${item.payhipKey}`, '_blank');
        } else if (item.link) {
            window.open(item.link, '_blank');
        } else {
            // Free download flow - Show inline downloading state
            const originalText = getBtnText.innerText;
            getBtnText.innerText = "Downloading...";
            getBtn.style.opacity = "0.7";
            getBtn.style.pointerEvents = "none";
            
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = item.file;
                link.download = item.file.split('/').pop();
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => {
                    getBtnText.innerText = originalText;
                    getBtn.style.opacity = "1";
                    getBtn.style.pointerEvents = "auto";
                }, 1500);
            }, 600);
        }
    };

    renderRelatedProducts(item);
}

// Escape key to dismiss active modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const infoModal = document.getElementById('info-modal');
        if (infoModal && infoModal.classList.contains('active')) {
            closeInfoModal();
        }
        ['home-category-modal', 'install-category-modal', 'selection-modal', 'download-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el && (el.classList.contains('active') || !el.classList.contains('hidden'))) {
                el.classList.remove('active');
                setTimeout(() => { el.style.display = 'none'; }, 300);
            }
        });
        const heightMenu = document.getElementById('fp-height-dropdown-menu');
        if (heightMenu) heightMenu.style.display = 'none';
    }
});

// Height Dropdown Menu Logic
const heightDropdownBtn = document.getElementById('fp-height-dropdown-btn');
const heightDropdownMenu = document.getElementById('fp-height-dropdown-menu');

if (heightDropdownBtn && heightDropdownMenu) {
    heightDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        heightDropdownMenu.style.display = heightDropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', () => {
        heightDropdownMenu.style.display = 'none';
    });
}

// ========================================================
// Inspector & Developer Tools Blocker
// ========================================================
(function initInspectorBlocker() {
    // Emergency bypass for site owner: append ?allow_inspect=1 to URL or set sessionStorage ave_allow_inspect = '1'
    try {
        if (window.location.search.includes('allow_inspect=1') || sessionStorage.getItem('ave_allow_inspect') === '1') {
            return;
        }
    } catch (e) {}

    let toastEl = null;
    let toastTimer = null;
    let lastToastTime = 0;

    function showBlockToast(message) {
        const now = Date.now();
        if (now - lastToastTime < 1800) return; // Prevent spamming
        lastToastTime = now;

        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'ave-inspect-toast';
            toastEl.id = 'ave-inspect-toast';
            toastEl.setAttribute('role', 'alert');
            toastEl.innerHTML = `
                <span class="ave-inspect-toast-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </span>
                <span class="ave-inspect-toast-text">${message || 'Developer inspection is disabled'}</span>
            `;
            document.body.appendChild(toastEl);
        } else {
            const textEl = toastEl.querySelector('.ave-inspect-toast-text');
            if (textEl) textEl.textContent = message || 'Developer inspection is disabled';
        }

        // Force reflow
        void toastEl.offsetWidth;
        toastEl.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            if (toastEl) toastEl.classList.remove('show');
        }, 2200);
    }

    function blockEvent(e, message) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        showBlockToast(message);
        return false;
    }

    // 1. Block Context Menu (Right Click) across the page
    document.addEventListener('contextmenu', function(e) {
        blockEvent(e, 'Right-click and inspection are disabled');
    }, true);

    // 2. Block Keyboard Shortcuts in Capture Phase
    function handleKeyDown(e) {
        const isCtrlOrMeta = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;
        const isAlt = e.altKey;
        const key = (e.key || '').toLowerCase();
        const code = e.keyCode;

        // F12 (DevTools)
        if (key === 'f12' || code === 123) {
            return blockEvent(e, 'Developer tools are disabled');
        }

        // Shift + F10 (Context Menu shortcut)
        if (isShift && (key === 'f10' || code === 121)) {
            return blockEvent(e, 'Action disabled');
        }

        // Ctrl+Shift+I / Cmd+Alt+I (Inspect)
        // Ctrl+Shift+J / Cmd+Alt+J (Console)
        // Ctrl+Shift+C / Cmd+Alt+C (Element Picker)
        // Ctrl+Shift+K (Firefox Web Console)
        const isInspectShortcut = 
            (isCtrlOrMeta && isShift && (key === 'i' || key === 'j' || key === 'c' || key === 'k' || code === 73 || code === 74 || code === 67 || code === 75)) ||
            (e.metaKey && isAlt && (key === 'i' || key === 'j' || key === 'c' || code === 73 || code === 74 || code === 67));

        if (isInspectShortcut) {
            return blockEvent(e, 'Developer tools are disabled');
        }

        // Ctrl+U / Cmd+Alt+U (View Page Source)
        const isViewSourceShortcut = 
            (isCtrlOrMeta && !isShift && !isAlt && (key === 'u' || code === 85)) ||
            (e.metaKey && isAlt && (key === 'u' || code === 85));

        if (isViewSourceShortcut) {
            return blockEvent(e, 'Viewing page source is disabled');
        }

        // Ctrl+S / Cmd+S (Save Page)
        const isSaveShortcut = isCtrlOrMeta && !isShift && !isAlt && (key === 's' || code === 83);
        if (isSaveShortcut) {
            return blockEvent(e, 'Saving page is disabled');
        }
    }

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);

    // 3. Anti-Debugging Probe
    // If DevTools is opened via browser menus, debugger statement halts execution.
    // When DevTools is closed, this is a non-blocking no-op with zero performance impact.
    let debugInterval = null;
    function antiDebugCheck() {
        try {
            (function() {
                return false;
            }['constructor']('debugger')['call']());
        } catch (err) {}
    }

    try {
        debugInterval = setInterval(antiDebugCheck, 500);
    } catch (e) {}

    // Clean up if page is unloaded
    window.addEventListener('beforeunload', function() {
        if (debugInterval) clearInterval(debugInterval);
    });
})();



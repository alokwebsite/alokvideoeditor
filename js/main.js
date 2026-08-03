// DOM Elements
const grid = document.getElementById('content-grid');
const homeGrid = document.getElementById('home-content-grid');
const downloadModal = document.getElementById('download-modal');
const socialTooltip = document.getElementById('social-tooltip');
const btnPlugins = document.getElementById('btn-plugins');
const btnMacros = document.getElementById('btn-macros');

// State
let currentTab = window.defaultTab || 'plugin'; // dynamically set based on page

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

    if (grid) renderGrid();
    if (homeGrid) renderHomeOverview();

    setupSocialHover();
    createNotificationNav();
    setupPageTransitions();
    
    // If on product page, render the product details
    if (window.location.pathname.endsWith('product.html')) {
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
        // Only target internal HTML links
        if (link.hostname === window.location.hostname && 
            link.pathname.endsWith('.html') &&
            link.target !== '_blank' &&
            !link.hasAttribute('download')) {
            
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
            badgesHTML += `<div class="card-badge">On Sale</div>`;
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
            </div>
            <h3 class="card-title">${item.name}</h3>
            ${priceBadgeHTML}
        `;

        card.onclick = () => {
            window.location.href = 'product.html?id=' + item.id;
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
        } else if (item.id === 'AutoFileOrganizer') {
            downloadCountHTML = `<div style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: #000; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; z-index: 10; text-transform: uppercase;">500+ Downloads</div>`;
        }

        let badgesHTML = '';
        if (item.price && item.salePrice) {
            badgesHTML += `<div class="card-badge">On Sale</div>`;
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
            window.location.href = 'product.html?id=' + item.id;
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
    const page = window.location.pathname.split('/').pop() || 'index.html';

    const pages = [
        {
            id: 'plugins',
            label: 'Plugins & Macros',
            href: 'Plugins_and_Macros.html',
            match: 'Plugins_and_Macros.html',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {
            id: 'projects',
            label: 'Project File',
            href: 'Projects.html',
            match: 'Projects.html',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {
            id: 'scripting',
            label: 'Scripting',
            href: 'Davinci_Scripting_Plugin.html',
            match: 'Davinci_Scripting_Plugin.html',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6L2 12l6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {
            id: 'expression',
            label: 'Expression',
            href: 'Fusion_Expression.html',
            match: 'Fusion_Expression.html',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        }
    ];

    // ── DESKTOP: Pill nav at top ──
    const nav = document.createElement('nav');
    nav.id = 'notification-nav';
    nav.setAttribute('aria-label', 'Section Navigation');

    const isHomePage = (page === '' || page === 'index.html');

    if (isHomePage) {
        nav.classList.add('dropdown-style');
        const activePage = pages.find(p => page === p.match) || pages[0];

        const trigger = document.createElement('div');
        trigger.className = 'notif-trigger';
        trigger.innerHTML = activePage.icon + '<span>Davinci Resolve All Tools</span> <svg class="dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; margin-left: 4px;"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        const menu = document.createElement('div');
        menu.className = 'notif-dropdown-menu';

        pages.forEach((p) => {
            const isActive = page === p.match;
            const link = document.createElement('a');
            link.href = p.href;
            link.className = 'notif-nav-link' + (isActive ? ' active' : '');
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
            link.innerHTML = p.icon + '<span>' + p.label + '</span>';
            menu.appendChild(link);
        });

        nav.appendChild(trigger);
        nav.appendChild(menu);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                nav.classList.remove('open');
            }
        });
    } else {
        nav.classList.add('classic-style');
        pages.forEach((p) => {
            const isActive = page === p.match;
            const link = document.createElement('a');
            link.href = p.href;
            link.className = 'notif-nav-link' + (isActive ? ' active' : '');
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
            link.innerHTML = p.icon + '<span>' + p.label + '</span>';
            nav.appendChild(link);
        });
    }

    document.body.appendChild(nav);

    // ── MOBILE/TABLET: Bottom tab bar ──
    const mobileNav = document.createElement('nav');
    mobileNav.id = 'mobile-bottom-nav';
    mobileNav.setAttribute('aria-label', 'Mobile Section Navigation');

    pages.forEach((p) => {
        const isActive = page === p.match;
        const link = document.createElement('a');
        link.href = p.href;
        link.className = 'mobile-tab-link' + (isActive ? ' active' : '');
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
        link.innerHTML = p.icon + '<span>' + p.label + '</span>';
        mobileNav.appendChild(link);
    });

    document.body.appendChild(mobileNav);

    // Trigger both navs after loader
    const triggerNav = () => {
        setTimeout(() => {
            nav.classList.add('visible');
            mobileNav.classList.add('visible');
        }, 50); // Make this almost instant!
    };

    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        const observer = new MutationObserver(() => {
            if (loader.style.display === 'none' || loader.classList.contains('fade-out')) {
                triggerNav();
                document.body.classList.add('page-loaded');
                observer.disconnect();
            }
        });
        observer.observe(loader, { attributes: true, attributeFilter: ['style', 'class'] });

    } else {
        triggerNav();
        document.body.classList.add('page-loaded');
    }
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
                <div class="card-icon-placeholder" style="margin: 0 auto 1.5rem auto; width: 80px; height: 80px; background: rgba(0, 242, 255, 0.1); border-radius: 24px; border: 1px solid rgba(0,242,255,0.3);">
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
            priceDisplay.innerHTML = `<span style="text-decoration: line-through; color: #888; font-size: 1rem; margin-right: 8px;">$${item.price}</span>$${item.salePrice} <span style="font-size: 0.8rem; color: #ffeb3b; margin-left: 8px; padding: 2px 6px; border: 1px solid #ffeb3b; border-radius: 4px;">SALE</span>`;
            getBtnText.textContent = `Buy Now - $${item.salePrice}`;
        } else {
            priceDisplay.innerHTML = `$${item.price}`;
            getBtnText.textContent = `Buy Now - $${item.price}`;
        }
    } else {
        priceDisplay.style.display = 'none';
        getBtnText.textContent = 'Download';
    }

    const btn = document.getElementById('info-get-btn');
    
    if (item.comingSoon) {
        getBtnText.textContent = 'Coming Soon';
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

// Start
document.addEventListener('DOMContentLoaded', () => {
    init();
    initAmbientOrbs();
    initPageTransitions();
    initScrollToTop();
});

/**
 * Render Product Page dynamically based on URL parameter
 */
function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

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

    // Set document title
    document.title = item.name + ' - Reveace Clone';

    // Populate Hero Details
    document.getElementById('product-title').innerText = item.name;
    document.getElementById('product-desc').innerText = item.description;

    // Type styling
    const typeEl = document.getElementById('product-type');
    typeEl.innerText = item.type;
    typeEl.style.background = 'rgba(13, 187, 195, 0.1)';
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

    // Buy Box Icon
    const iconBox = document.getElementById('product-icon-box');
    if (item.image && !item.heroImage) {
        // Only use image in icon box if we don't have a hero image (preventing duplication)
        iconBox.innerHTML = `<img src="${item.image}" alt="Icon">`;
        iconBox.style.background = 'transparent';
        iconBox.style.border = 'none';
    } else {
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z';
        if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z';
        if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z';
        if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6';
        if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16';
        
        iconBox.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${iconPath}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    // Price
    const priceEl = document.getElementById('product-price');
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
    
    if (item.price) {
        getBtnText.innerText = `Buy Now`;
    } else {
        getBtnText.innerText = `Download for Free`;
    }

    getBtn.onclick = () => {
        if (item.price) {
            window.open(`https://payhip.com/b/${item.payhipKey}`, '_blank');
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
}

// Block right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Block browser dev tools shortcuts
document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }
    // Ctrl+Shift+C / Cmd+Option+C
    if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    // Ctrl+Shift+J / Cmd+Option+J
    if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
    }
    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
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

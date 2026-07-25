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
    
    // Hash change for URL modal routing
    window.addEventListener('hashchange', handleHashChange);
    createInfoModal();
    handleHashChange(); // initial check
}

/**
 * Initialize Loading Screen
 */
function initLoader() {
    const ring = document.getElementById('particle-ring');
    const particleCount = 24;

    // Create Particles
    if (ring) {
        for (let i = 0; i < particleCount; i++) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('particle-wrapper');

            const angle = (360 / particleCount) * i;
            wrapper.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(60px)`;

            const particle = document.createElement('div');
            particle.classList.add('particle');
            // Stagger animations
            particle.style.animationDelay = `-${(i / particleCount) * 2}s`;

            wrapper.appendChild(particle);
            ring.appendChild(wrapper);
        }
    }

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
        card.className = 'card box-card'; 
        // Stagger the slide-in animation fast
        card.style.animationDelay = `${index * 0.05}s`;

        // Set different icons based on type for visual variety
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; // default plugin
        if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'; // generic doc icon
        if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'; // folder
        if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6'; // code
        if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16'; // specific icon for expression

        let newBadgeHTML = '';
        if (item.isNew) {
            newBadgeHTML = `<div style="position: absolute; top: 12px; right: 12px; background: rgba(0, 242, 255, 0.1); color: var(--primary); padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.6rem; font-weight: 800; border: 1px solid rgba(0, 242, 255, 0.3); z-index: 10; letter-spacing: 1px; text-transform: uppercase;">New</div>`;
        }

        let priceBadgeHTML = '';
        if (item.price) {
            if (item.salePrice) {
                priceBadgeHTML = `<div style="margin-top: 0.5rem; font-size: 0.85rem; font-weight: bold; color: var(--primary);"><span style="text-decoration: line-through; color: #888; font-size: 0.75rem; margin-right: 5px;">$${item.price}</span>$${item.salePrice}</div>`;
            } else {
                priceBadgeHTML = `<div style="margin-top: 0.5rem; font-size: 0.85rem; font-weight: bold; color: var(--primary);">$${item.price}</div>`;
            }
        }

        card.innerHTML = `
            ${newBadgeHTML}
            <div class="card-icon-placeholder" style="margin-bottom: 1.5rem; width: 64px; height: 64px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${iconPath}" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="card-title" style="text-align: center; font-size: 1.2rem;">${item.name}</h3>
            <div class="card-type" style="margin-top: 0.5rem; font-size: 0.65rem;">${item.type}</div>
            ${priceBadgeHTML}
        `;

        card.onclick = () => {
            window.location.hash = item.id;
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
        card.className = 'card box-card'; 

        // Set different icons based on type for visual variety
        let iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; // default plugin
        if (item.type === 'macro') iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'; // generic doc icon
        if (item.type === 'project') iconPath = 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'; // folder
        if (item.type === 'scripting') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6'; // code
        if (item.type === 'expression') iconPath = 'M16 18l6-6-6-6M8 6L2 12l6 6M14 4l-4 16'; // specific icon for expression

        let downloadCountHTML = '';
        if (item.id === 'Rectangle_V3') {
            downloadCountHTML = `<div style="position: absolute; top: 12px; right: 12px; background: var(--primary); color: #000; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; box-shadow: 0 4px 15px rgba(0, 242, 255, 0.4); z-index: 10; letter-spacing: 0.5px; text-transform: uppercase;">2500+ Downloads</div>`;
        } else if (item.id === 'AutoFileOrganizer') {
            downloadCountHTML = `<div style="position: absolute; top: 12px; right: 12px; background: var(--primary); color: #000; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; box-shadow: 0 4px 15px rgba(0, 242, 255, 0.4); z-index: 10; letter-spacing: 0.5px; text-transform: uppercase;">500+ Downloads</div>`;
        }

        // Ensure the card can contain the absolute positioned badge
        card.style.position = 'relative';
        
        let newBadgeHTML = '';
        if (item.isNew) {
            newBadgeHTML = `<div style="position: absolute; top: 12px; left: 12px; background: rgba(0, 242, 255, 0.1); color: var(--primary); padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.6rem; font-weight: 800; border: 1px solid rgba(0, 242, 255, 0.3); z-index: 10; letter-spacing: 1px; text-transform: uppercase;">New</div>`;
        }

        card.innerHTML = `
            ${newBadgeHTML}
            <div class="card-icon-placeholder" style="margin-bottom: 1.5rem; width: 64px; height: 64px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${iconPath}" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="card-title" style="text-align: center; font-size: 1.2rem;">${item.name}</h3>
            <div class="card-type" style="margin-top: 0.5rem; font-size: 0.65rem;">${item.type}</div>
            ${downloadCountHTML}
        `;

        card.onclick = () => {
            // When clicked on home page, open the item in the info modal
            openInfoModal(item);
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
    // Switch views to Downloading
    document.getElementById('info-details-view').style.display = 'none';
    const dlView = document.getElementById('info-downloading-view');
    dlView.style.display = 'flex';
    
    document.getElementById('downloading-item-name').textContent = itemName;
    
    // Trigger Progress Bar
    const progressFill = document.querySelector('.progress-bar-fill');
    if (progressFill) {
        progressFill.style.width = '0%';
        progressFill.style.transition = 'none'; // Reset
        setTimeout(() => {
            progressFill.style.transition = 'width 3.4s cubic-bezier(0.1, 0.8, 0.3, 1)';
            progressFill.style.width = '100%';
        }, 50);
    }

    // Simulate Processing Time (give it 3.5 seconds to watch the smooth animation)
    setTimeout(() => {
        // Record Download Event in Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'download', {
                'event_category': 'Software Download',
                'event_label': itemName,
                'file_name': filename.split('/').pop()
            });
        }

        // Trigger Download
        const link = document.createElement('a');
        link.href = filename;
        // Use only the filename (not full path) — browsers block download attr with path separators
        link.download = filename.split('/').pop();
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Hide Modal
        closeInfoModal();

    }, 3500);
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

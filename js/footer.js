const footerHTML = `
<footer class="modern-footer">
    <div class="footer-content">
        <div class="footer-left">
            <h3 class="footer-brand">Alok Video Editor</h3>
            <p>Premium Resources for DaVinci Resolve</p>
        </div>
        <div class="footer-right">
            <p>&copy; 2023 - <span id="current-year"></span> Alok Mahato. All rights reserved.</p>
        </div>
    </div>
</footer>
`;

function injectFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = footerHTML;
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
} else {
    injectFooter();
}

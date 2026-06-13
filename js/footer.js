const footerHTML = `
<footer class="modern-footer">
    <div class="footer-content">
        <div class="footer-center" style="text-align: center; width: 100%;">
            <h3 class="footer-brand">Alok Video Editor</h3>
            <p style="color: var(--text-muted); font-size: 1rem;">Premium Resources for DaVinci Resolve</p>
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

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('tracker-grid');
    const warningBox = document.getElementById('warning-box');
    const totalDownloadsEl = document.getElementById('total-downloads');
    const totalItemsEl = document.getElementById('total-items');

    // Hide the warning box since we no longer need Firebase!
    if (warningBox) warningBox.style.display = 'none';

    // Set total items
    totalItemsEl.textContent = projectData.length;

    let globalTotal = 0;

    // Function to animate numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Initialize UI and fetch data for each plugin
    projectData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.id = `card-${item.id}`;

        card.innerHTML = `
            <div class="item-type">${item.type}</div>
            <h3 class="item-name">${item.name}</h3>
            <div class="item-downloads">
                <span>Downloads</span>
                <strong id="count-${item.id}">Loading...</strong>
            </div>
        `;

        grid.appendChild(card);

        // Fetch live count from CounterAPI
        fetch(`https://api.counterapi.dev/v1/alokvideoeditor/${item.id}`)
            .then(res => res.json())
            .then(data => {
                const count = data.count || 0;
                const countEl = document.getElementById(`count-${item.id}`);
                
                // Animate individual card
                animateValue(countEl, 0, count, 800);

                // Update total
                const oldTotal = globalTotal;
                globalTotal += count;
                animateValue(totalDownloadsEl, oldTotal, globalTotal, 800);
            })
            .catch(err => {
                // If never downloaded before, it returns 404
                const countEl = document.getElementById(`count-${item.id}`);
                countEl.innerHTML = "0";
            });
    });
});

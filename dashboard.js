document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');

            // Update Nav UI
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update Sections UI
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // If switching to monitoring, render charts
            if (target === 'monitoring') {
                renderAllCharts();
            }
        });
    });

    // Real-time Dashboard Simulation
    function updateDashboardData() {
        const phValue = document.getElementById('ph-value');
        const phNeedle = document.getElementById('ph-needle');
        const acidValue = document.getElementById('acid-value');
        const acidFill = document.getElementById('acid-fill');
        const humidityValue = document.getElementById('humidity-value');

        if (phValue && phNeedle) {
            const ph = (Math.random() * 1 + 5.8).toFixed(1);
            phValue.textContent = ph;
            const rotation = (ph - 5) * 40; 
            phNeedle.setAttribute('transform', `rotate(${rotation} 50 45)`);
        }
        
        if (acidValue && acidFill) {
            const acid = Math.floor(Math.random() * 10 + 38);
            acidValue.textContent = acid + '%';
            const height = (acid / 100) * 50;
            acidFill.setAttribute('height', height);
            acidFill.setAttribute('y', 55 - height);
        }

        if (humidityValue) {
            const humidity = Math.floor(Math.random() * 10 + 82);
            humidityValue.textContent = humidity + '%';
        }
    }

    setInterval(updateDashboardData, 4000);
    updateDashboardData();

    // Chart Rendering Logic
    function renderTrendChart(svgId, data, labels, maxY) {
        const svg = document.getElementById(svgId);
        if (!svg) return;

        svg.innerHTML = ''; // Clear previous

        const width = 400;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Draw Grid and Y labels
        const steps = 5;
        for (let i = 0; i <= steps; i++) {
            const y = padding + chartHeight - (i / steps) * chartHeight;
            const value = (i / steps) * maxY;
            
            // Grid line
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", padding);
            line.setAttribute("y1", y);
            line.setAttribute("x2", width - padding);
            line.setAttribute("y2", y);
            line.setAttribute("class", "chart-axis");
            svg.appendChild(line);

            // Y Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", padding - 10);
            text.setAttribute("y", y + 4);
            text.setAttribute("text-anchor", "end");
            text.setAttribute("class", "chart-text");
            text.textContent = value.toFixed(value % 1 === 0 ? 0 : 1);
            svg.appendChild(text);
        }

        // Generate Path Points
        let pathData = "";
        data.forEach((val, i) => {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - (val / maxY) * chartHeight;
            pathData += (i === 0 ? "M" : "L") + x + "," + y;

            // Dot
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", 4);
            circle.setAttribute("class", "chart-point");
            svg.appendChild(circle);

            // X Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x);
            text.setAttribute("y", height - 15);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("class", "chart-text");
            text.textContent = labels[i];
            svg.appendChild(text);
        });

        // Draw Line
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("class", "chart-line");
        svg.appendChild(path);
    }

    function renderAllCharts() {
        const phData = [4, 3.8, 5, 6, 6.5];
        const humData = [50, 47, 60, 72, 90];
        const labels = ["Jan", "Fev", "Mar", "Abril", "Maio"];

        renderTrendChart("ph-trend-chart", phData, labels, 7);
        renderTrendChart("humidity-trend-chart", humData, labels, 100);
    }

    // Configuration Screen Logic
    const slider = document.querySelector('.custom-slider');
    const valueBox = document.querySelector('.value-box');
    
    if (slider && valueBox) {
        slider.addEventListener('input', (e) => {
            valueBox.textContent = e.target.value + ' min';
        });
    }

    const btnSave = document.querySelector('.btn-green-save');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            btnSave.textContent = 'SALVANDO...';
            btnSave.style.opacity = '0.7';
            setTimeout(() => {
                btnSave.textContent = 'ALTERAÇÕES SALVAS!';
                btnSave.style.backgroundColor = '#2E7D32';
                setTimeout(() => {
                    btnSave.textContent = 'SALVAR ALTERAÇÃO';
                    btnSave.style.opacity = '1';
                    btnSave.style.backgroundColor = '';
                }, 2000);
            }, 1500);
        });
    }

    // Initial render for active view
    if (document.getElementById('monitoring') && document.getElementById('monitoring').classList.contains('active')) {
        renderAllCharts();
    }
});

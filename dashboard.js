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
            // Map 0-7 pH to 0-180 degrees, ensuring it stays within the arc
            const rotation = Math.min((ph / 7) * 180, 180); 
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
            
            // Salva as configurações de alertas
            saveAlertSettings();

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

    // Report Generation Logic
    const btnGerar = document.getElementById('btn-gerar-relatorio');
    const reportPreview = document.getElementById('report-preview');
    
    if (btnGerar && reportPreview) {
        btnGerar.addEventListener('click', () => {
            const nomeInput = document.getElementById('relatorio-nome');
            const paramSelect = document.getElementById('relatorio-parametro');
            
            const nameToSet = nomeInput.value.trim() !== '' ? nomeInput.value : 'Relatório Sem Nome';
            const paramToSet = paramSelect.options[paramSelect.selectedIndex].text;
            
            const dateStr = new Date().toLocaleDateString('pt-BR');
            
            // Add a small loading effect
            btnGerar.textContent = 'GERANDO...';
            btnGerar.style.opacity = '0.7';
            
            setTimeout(() => {
                btnGerar.textContent = 'GERAR RELATÓRIO';
                btnGerar.style.opacity = '1';
                
                document.getElementById('preview-name').textContent = nameToSet;
                document.getElementById('preview-date').textContent = dateStr;
                document.getElementById('preview-param').textContent = paramToSet;
                
                reportPreview.style.display = 'block';
                // Scroll to preview smoothly
                reportPreview.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 800);
        });
    }

    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    if (btnDownloadPdf) {
        btnDownloadPdf.addEventListener('click', () => {
            const element = document.getElementById('report-preview');
            const reportName = document.getElementById('preview-name').textContent;
            
            btnDownloadPdf.textContent = 'PROCESSANDO...';
            btnDownloadPdf.disabled = true;

            html2canvas(element, {
                scale: 2,
                backgroundColor: "#FFFFFF",
                logging: false,
                useCORS: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.setFontSize(18);
                pdf.setTextColor(46, 125, 50);
                pdf.text("Sensor Soil - Relatório de Monitoramento", 10, 20);
                
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 10, 28);
                
                pdf.addImage(imgData, 'PNG', 10, 35, pdfWidth, pdfHeight);
                pdf.save(`${reportName.replace(/\s+/g, '_')}.pdf`);
                
                btnDownloadPdf.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> BAIXAR PDF`;
                btnDownloadPdf.disabled = false;
            }).catch(err => {
                console.error(err);
                alert('Erro ao gerar PDF. Tente novamente.');
                btnDownloadPdf.textContent = 'BAIXAR PDF';
                btnDownloadPdf.disabled = false;
            });
        });
    }

    // Monitoramento Filter Logic
    const filterSelects = document.querySelectorAll('.filter-select');
    const trendCards = document.querySelectorAll('.trend-card');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            trendCards.forEach(card => {
                card.style.opacity = '0.3';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 600);
            });
        });
    });

    // --- Sensor Management ---
    const sensorListContainer = document.getElementById('sensor-list-container');
    const modalSensor = document.getElementById('modal-sensor');
    const btnAddSensor = document.getElementById('btn-add-sensor');
    const btnCancelSensor = document.getElementById('btn-cancel-sensor');
    const btnSaveSensor = document.getElementById('btn-save-sensor');
    
    let sensors = JSON.parse(localStorage.getItem('ss_sensors')) || [
        { name: 'Sensor A', id: 'SS-01', battery: '80%', signal: 4 }
    ];

    function saveSensors() {
        localStorage.setItem('ss_sensors', JSON.stringify(sensors));
    }

    function renderSensors() {
        if (!sensorListContainer) return;
        sensorListContainer.innerHTML = '';
        sensors.forEach((sensor, index) => {
            const card = document.createElement('div');
            card.className = 'card sensor-card';
            card.style.display = 'flex';
            card.style.justifyContent = 'space-between';
            card.style.alignItems = 'center';
            card.style.padding = '15px 20px';
            card.style.marginBottom = '12px';

            card.innerHTML = `
                <div class="sensor-info" style="display: flex; align-items: center; gap: 12px;">
                    <div class="sensor-icon-bg" style="width: 40px; height: 40px; background-color: #f0f0f0; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#2E7D32"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z"/></svg>
                    </div>
                    <div class="sensor-text" style="display: flex; flex-direction: column;">
                        <span class="sensor-name" style="font-size: 1rem; font-weight: 700;">${sensor.name}</span>
                        <span class="sensor-id" style="font-size: 0.75rem; color: #777;">ID: ${sensor.id}</span>
                    </div>
                </div>
                <div class="sensor-status" style="display: flex; align-items: center; gap: 15px;">
                    <div class="battery-status" style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 600;">
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                            <rect x="0.5" y="0.5" width="20" height="11" rx="1.5" stroke="#B8B8B8"/>
                            <rect x="2" y="2" width="${(parseInt(sensor.battery)/100)*14}" height="8" rx="1" fill="#6BC46D"/>
                            <path d="M21.5 4V8" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>${sensor.battery}</span>
                    </div>
                    <button class="btn-delete-sensor" data-index="${index}" style="background: none; border: none; color: #ff4444; cursor: pointer; padding: 5px; display: flex; align-items: center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            sensorListContainer.appendChild(card);
        });

        // Add delete listeners
        document.querySelectorAll('.btn-delete-sensor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                sensors.splice(index, 1);
                saveSensors();
                renderSensors();
            });
        });
    }

    if (btnAddSensor) {
        btnAddSensor.addEventListener('click', () => {
            modalSensor.classList.add('active');
        });
    }

    if (btnCancelSensor) {
        btnCancelSensor.addEventListener('click', () => {
            modalSensor.classList.remove('active');
        });
    }

    if (btnSaveSensor) {
        btnSaveSensor.addEventListener('click', () => {
            const nameInput = document.getElementById('new-sensor-name');
            const name = nameInput.value.trim();
            
            if (name) {
                // Gera ID automático baseado no timestamp para garantir unicidade simples
                const timestamp = new Date().getTime().toString().slice(-4);
                const generatedId = `SS-${timestamp}`;

                sensors.push({
                    name: name,
                    id: generatedId,
                    battery: '100%',
                    signal: 4
                });
                saveSensors();
                renderSensors();
                modalSensor.classList.remove('active');
                nameInput.value = '';
            } else {
                alert('Por favor, insira o nome do sensor.');
            }
        });
    }

    // Initial render
    renderSensors();

    // Configurações - Limpar Histórico
    const btnClearHistory = document.getElementById('btn-clear-history');
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            const confirmar = confirm('Atenção! Você deseja realmente apagar todo o histórico de dados de parâmetros do solo? Esta ação não pode ser desfeita.');
            if (confirmar) {
                alert('O histórico de medições foi apagado.');
            }
        });
    }

    // Configurações - Exportar Dados
    const btnCsv = document.querySelector('.btn-csv');
    if (btnCsv) {
        btnCsv.addEventListener('click', () => {
            downloadCSV();
        });
    }

    function downloadCSV() {
        const data = [
            ['Data', 'pH', 'Umidade (%)', 'Temperatura (C)'],
            ['2026-05-10', '6.2', '85', '24'],
            ['2026-05-11', '6.1', '82', '25'],
            ['2026-05-12', '6.3', '88', '23'],
            ['2026-05-13', (Math.random() * 1 + 5.8).toFixed(1), Math.floor(Math.random() * 10 + 82), '24']
        ];
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + data.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sensor_soil_data_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- Alert Systems ---
    function loadAlertSettings() {
        const settings = JSON.parse(localStorage.getItem('ss_alert_settings')) || {
            master: true,
            ph: true,
            humidity: false,
            phThreshold: '4.5',
            humidityThreshold: '80'
        };

        const masterCheck = document.getElementById('alert-master');
        const phCheck = document.getElementById('alert-ph');
        const humidityCheck = document.getElementById('alert-humidity');
        const phThreshold = document.getElementById('threshold-ph');
        const humidityThreshold = document.getElementById('threshold-humidity');

        if (masterCheck) masterCheck.checked = settings.master;
        if (phCheck) phCheck.checked = settings.ph;
        if (humidityCheck) humidityCheck.checked = settings.humidity;
        if (phThreshold) phThreshold.textContent = settings.phThreshold;
        if (humidityThreshold) humidityThreshold.textContent = settings.humidityThreshold;
    }

    function saveAlertSettings() {
        const masterCheck = document.getElementById('alert-master');
        const phCheck = document.getElementById('alert-ph');
        const humidityCheck = document.getElementById('alert-humidity');
        const phThreshold = document.getElementById('threshold-ph');
        const humidityThreshold = document.getElementById('threshold-humidity');

        const settings = {
            master: masterCheck ? masterCheck.checked : true,
            ph: phCheck ? phCheck.checked : true,
            humidity: humidityCheck ? humidityCheck.checked : false,
            phThreshold: phThreshold ? phThreshold.textContent.trim() : '4.5',
            humidityThreshold: humidityThreshold ? humidityThreshold.textContent.trim() : '80'
        };
        localStorage.setItem('ss_alert_settings', JSON.stringify(settings));
    }

    // Carrega configurações iniciais
    loadAlertSettings();

    // Initial render for active view
    if (document.getElementById('monitoring') && document.getElementById('monitoring').classList.contains('active')) {
        renderAllCharts();
    }
});

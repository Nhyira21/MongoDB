/**
 * ModalChartCreator - A flexible class for creating modal windows with charts
 * Supports multiple chart types, responsive design, and theme switching
 */
export class ModalChartCreator {
    constructor(config) {
      this.config = config;
      this.modal = null;
      this.charts = [];
      this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      
      // Default themes for charts
      this.themes = {
        light: {
          backgroundColor: 'white',
          textColor: '#333',
          borderColor: '#e0e0e0',
          gridColor: 'rgba(0, 0, 0, 0.1)',
          colors: ['#4a86f7', '#f8b627', '#37c978', '#e74c3c', '#9b59b6', '#3498db']
        },
        dark: {
          backgroundColor: '#1e1e2d',
          textColor: '#e0e0e0',
          borderColor: '#2c2c40',
          gridColor: 'rgba(255, 255, 255, 0.1)',
          colors: ['#4a86f7', '#f8b627', '#37c978', '#ff6b6b', '#bd93f9', '#6cb2eb']
        }
      };
      
      // Create style element for the modal
      this.createStyles();
      
      // Listen for theme changes
      this.setupThemeListener();
    }
    
    /**
     * Create and inject CSS styles for the modal
     */
    createStyles() {
      const styleId = 'modal-chart-creator-styles';
      
      // Check if styles already exist
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        
        style.textContent = `
          .modal-chart-creator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          
          .modal-chart-creator.active {
            opacity: 1;
            pointer-events: all;
          }
          
          .modal-chart-container {
            width: 90%;
            max-width: 1200px;
            max-height: 90vh;
            background-color: var(--content-bg, white);
            color: var(--text-color, #333);
            border-radius: 8px;
            box-shadow: var(--card-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: translateY(20px);
            transition: transform 0.3s ease;
          }
          
          .modal-chart-creator.active .modal-chart-container {
            transform: translateY(0);
          }
          
          .modal-header {
            padding: 16px 24px;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
          }
          
          .modal-close {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.5rem;
            color: var(--icon-color, #8c8c8c);
            transition: var(--transition, all 0.3s ease);
          }
          
          .modal-close:hover {
            color: var(--text-color, #333);
          }
          
          .modal-body {
            padding: 24px;
            overflow-y: auto;
          }
          
          .chart-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
          }
          
          .chart-item {
            background-color: var(--content-bg, white);
            border-radius: 8px;
            border: 1px solid var(--border-color, #e0e0e0);
            overflow: hidden;
          }
          
          .chart-item.full-width {
            grid-column: 1 / -1;
          }
          
          .chart-header {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
          }
          
          .chart-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
          }
          
          .chart-content {
            padding: 16px;
            position: relative;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
          }
          
          .stat-item {
            text-align: center;
            padding: 16px;
          }
          
          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 4px;
            color: var(--active-color, #4a86f7);
          }
          
          .stat-label {
            font-size: 0.875rem;
            color: var(--subtext-color, #666);
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .data-table th,
          .data-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
          }
          
          .data-table th {
            font-weight: 600;
          }
          
          .data-table tr:last-child td {
            border-bottom: none;
          }
          
          .theme-switch {
            display: flex;
            align-items: center;
            margin-left: 16px;
            cursor: pointer;
          }
          
          .theme-switch-icon {
            margin-right: 8px;
            color: var(--icon-color, #8c8c8c);
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .chart-grid {
              grid-template-columns: 1fr;
            }
            
            .modal-chart-container {
              width: 95%;
              max-height: 95vh;
            }
          }
        `;
        
        document.head.appendChild(style);
      }
    }
    
    /**
     * Listen for theme changes to update charts accordingly
     */
    setupThemeListener() {
      // Watch for theme attribute changes on the document element
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
            if (this.currentTheme !== newTheme) {
              this.currentTheme = newTheme;
              this.updateChartsTheme();
            }
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
    }
    
    /**
     * Update all charts with the current theme
     */
    updateChartsTheme() {
      this.charts.forEach(chart => {
        if (chart.instance && typeof chart.instance.update === 'function') {
          const theme = this.themes[this.currentTheme];
          
          // Update chart options based on theme
          chart.instance.options.scales = chart.instance.options.scales || {};
          
          // Update x axis if it exists
          if (chart.instance.options.scales.x) {
            chart.instance.options.scales.x.grid = chart.instance.options.scales.x.grid || {};
            chart.instance.options.scales.x.grid.color = theme.gridColor;
            chart.instance.options.scales.x.ticks = chart.instance.options.scales.x.ticks || {};
            chart.instance.options.scales.x.ticks.color = theme.textColor;
          }
          
          // Update y axis if it exists
          if (chart.instance.options.scales.y) {
            chart.instance.options.scales.y.grid = chart.instance.options.scales.y.grid || {};
            chart.instance.options.scales.y.grid.color = theme.gridColor;
            chart.instance.options.scales.y.ticks = chart.instance.options.scales.y.ticks || {};
            chart.instance.options.scales.y.ticks.color = theme.textColor;
          }
          
          // Update legend text color
          if (chart.instance.options.plugins && chart.instance.options.plugins.legend) {
            chart.instance.options.plugins.legend.labels = chart.instance.options.plugins.legend.labels || {};
            chart.instance.options.plugins.legend.labels.color = theme.textColor;
          }
          
          // Update tooltip
          if (chart.instance.options.plugins && chart.instance.options.plugins.tooltip) {
            chart.instance.options.plugins.tooltip.backgroundColor = this.currentTheme === 'dark' ? '#2a2a3a' : 'rgba(0, 0, 0, 0.7)';
          }
          
          chart.instance.update();
        }
      });
    }
    
    /**
     * Create the modal structure
     */
    createModal() {
      const modal = document.createElement('div');
      modal.id = this.config.modalId;
      modal.className = 'modal-chart-creator';
      
      const container = document.createElement('div');
      container.className = 'modal-chart-container';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'modal-header';
      
      const titleContainer = document.createElement('div');
      titleContainer.style.display = 'flex';
      titleContainer.style.alignItems = 'center';
      
      const title = document.createElement('h2');
      title.className = 'modal-title';
      title.textContent = this.config.title || 'Chart Dashboard';
      titleContainer.appendChild(title);
      
      // Add theme toggle
      const themeSwitch = document.createElement('div');
      themeSwitch.className = 'theme-switch';
      themeSwitch.innerHTML = `
        <span class="theme-switch-icon">
          ${this.currentTheme === 'dark' ? '☀️' : '🌙'}
        </span>
        <span>${this.currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      `;
      
      themeSwitch.addEventListener('click', () => {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.currentTheme = newTheme;
        themeSwitch.innerHTML = `
          <span class="theme-switch-icon">
            ${this.currentTheme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span>${this.currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        `;
      });
      
      titleContainer.appendChild(themeSwitch);
      header.appendChild(titleContainer);
      
      const closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => this.close());
      header.appendChild(closeButton);
      
      // Create body
      const body = document.createElement('div');
      body.className = 'modal-body';
      
      const chartGrid = document.createElement('div');
      chartGrid.className = 'chart-grid';
      
      // Add charts
      if (this.config.charts && Array.isArray(this.config.charts)) {
        this.config.charts.forEach(chartConfig => {
          const chartItem = this.createChartItem(chartConfig);
          
          // Set full width for tables and stat cards
          if (chartConfig.type === 'table' || (chartConfig.fullWidth === true)) {
            chartItem.classList.add('full-width');
          }
          
          chartGrid.appendChild(chartItem);
        });
      }
      
      body.appendChild(chartGrid);
      
      // Assemble modal
      container.appendChild(header);
      container.appendChild(body);
      modal.appendChild(container);
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close();
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
          this.close();
        }
      });
      
      return modal;
    }
    
    /**
     * Create a chart item based on config
     * @param {Object} chartConfig - Configuration for the chart
     * @returns {HTMLElement} - The chart container element
     */
    createChartItem(chartConfig) {
      const chartItem = document.createElement('div');
      chartItem.className = 'chart-item';
      
      const chartHeader = document.createElement('div');
      chartHeader.className = 'chart-header';
      
      const chartTitle = document.createElement('h3');
      chartTitle.className = 'chart-title';
      chartTitle.textContent = chartConfig.title || 'Chart';
      chartHeader.appendChild(chartTitle);
      
      const chartContent = document.createElement('div');
      chartContent.className = 'chart-content';
      
      // Set height if specified
      if (chartConfig.height) {
        chartContent.style.height = chartConfig.height;
      }
      
      chartItem.appendChild(chartHeader);
      chartItem.appendChild(chartContent);
      
      // Render different chart types
      switch (chartConfig.type) {
        case 'stats':
          this.renderStatsCard(chartContent, chartConfig);
          break;
        case 'table':
          this.renderTable(chartContent, chartConfig);
          break;
        case 'line':
        case 'bar':
        case 'pie':
        case 'doughnut':
        case 'radar':
        case 'polarArea':
          this.renderChart(chartContent, chartConfig);
          break;
        default:
          chartContent.textContent = 'Unsupported chart type';
      }
      
      return chartItem;
    }
    
    /**
     * Render stats card
     * @param {HTMLElement} container - The container element
     * @param {Object} config - Stats configuration
     */
    renderStatsCard(container, config) {
      const statsGrid = document.createElement('div');
      statsGrid.className = 'stats-grid';
      
      config.data.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = stat.value;
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = stat.label;
        
        statItem.appendChild(statValue);
        statItem.appendChild(statLabel);
        statsGrid.appendChild(statItem);
      });
      
      container.appendChild(statsGrid);
    }
    
    /**
     * Render data table
     * @param {HTMLElement} container - The container element
     * @param {Object} config - Table configuration
     */
    renderTable(container, config) {
      const table = document.createElement('table');
      table.className = 'data-table';
      
      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      config.data.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Create table body
      const tbody = document.createElement('tbody');
      
      config.data.rows.forEach(row => {
        const tr = document.createElement('tr');
        
        row.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
      });
      
      table.appendChild(tbody);
      container.appendChild(table);
    }
    
    /**
     * Render a chart using Chart.js
     * @param {HTMLElement} container - The container element
     * @param {Object} config - Chart configuration
     */
    renderChart(container, config) {
      const theme = this.themes[this.currentTheme];
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);
      
      // Prepare data based on chart type
      let chartData = {};
      let chartOptions = {};
      
      // Common chart options
      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: config.type !== 'line' && config.type !== 'bar',
            labels: {
              color: theme.textColor
            }
          },
          tooltip: {
            backgroundColor: this.currentTheme === 'dark' ? '#2a2a3a' : 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: theme.borderColor,
            borderWidth: 1
          }
        }
      };
      
      // For line and bar charts
      if (config.type === 'line' || config.type === 'bar') {
        const labels = config.data.map(item => item.label);
        const values = config.data.map(item => item.value);
        
        chartData = {
          labels: labels,
          datasets: [{
            label: config.datasetLabel || 'Data',
            data: values,
            backgroundColor: config.type === 'line' ? theme.colors[0] + '20' : theme.colors,
            borderColor: config.type === 'line' ? theme.colors[0] : theme.colors,
            borderWidth: 2,
            fill: config.type === 'line',
            tension: config.type === 'line' ? 0.3 : 0, // Smooth line
          }]
        };
        
        // Add scales for these chart types
        chartOptions.scales = {
          x: {
            grid: {
              color: theme.gridColor
            },
            ticks: {
              color: theme.textColor
            }
          },
          y: {
            grid: {
              color: theme.gridColor
            },
            ticks: {
              color: theme.textColor
            },
            beginAtZero: true
          }
        };
      } 
      // For pie, doughnut, polarArea charts
      else if (['pie', 'doughnut', 'polarArea'].includes(config.type)) {
        const labels = config.data.map(item => item.label);
        const values = config.data.map(item => item.value);
        
        chartData = {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: theme.colors,
            borderColor: this.currentTheme === 'dark' ? '#1e1e2d' : '#ffffff',
            borderWidth: 2
          }]
        };
      }
      // For radar charts
      else if (config.type === 'radar') {
        const labels = config.data.map(item => item.label);
        const values = config.data.map(item => item.value);
        
        chartData = {
          labels: labels,
          datasets: [{
            label: config.datasetLabel || 'Data',
            data: values,
            backgroundColor: theme.colors[0] + '40',
            borderColor: theme.colors[0],
            borderWidth: 2,
            pointBackgroundColor: theme.colors[0]
          }]
        };
        
        chartOptions.scales = {
          r: {
            pointLabels: {
              color: theme.textColor
            },
            grid: {
              color: theme.gridColor
            },
            angleLines: {
              color: theme.gridColor
            },
            ticks: {
              color: theme.textColor,
              backdropColor: 'transparent'
            }
          }
        };
      }
      
      // Merge user-defined options with our default options
      if (config.options) {
        chartOptions = this.deepMerge(chartOptions, config.options);
      }
      
      // Create chart instance
      const chartInstance = new Chart(canvas, {
        type: config.type,
        data: chartData,
        options: chartOptions
      });
      
      // Store chart reference
      this.charts.push({
        type: config.type,
        instance: chartInstance
      });
    }
    
    /**
     * Open the modal
     */
    open() {
      if (!this.modal) {
        this.modal = this.createModal();
        document.body.appendChild(this.modal);
        
        // Force reflow to enable transition
        this.modal.offsetHeight;
      }
      
      this.modal.classList.add('active');
      
      // Update charts when modal is opened (to ensure proper sizing)
      setTimeout(() => {
        this.charts.forEach(chart => {
          if (chart.instance && typeof chart.instance.update === 'function') {
            chart.instance.update();
          }
        });
      }, 100);
    }
    
    /**
     * Close the modal
     */
    close() {
      if (this.modal) {
        this.modal.classList.remove('active');
        
        // Allow animation to complete before removing
        setTimeout(() => {
          if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
            this.modal = null;
            
            // Clear chart instances
            this.charts.forEach(chart => {
              if (chart.instance && typeof chart.instance.destroy === 'function') {
                chart.instance.destroy();
              }
            });
            this.charts = [];
            
            // Call onClose callback if provided
            if (typeof this.config.onClose === 'function') {
              this.config.onClose();
            }
          }
        }, 300);
      }
    }
    
    /**
     * Deep merge two objects
     * @param {Object} target - The target object
     * @param {Object} source - The source object
     * @returns {Object} - Merged object
     */
    deepMerge(target, source) {
      const output = Object.assign({}, target);
      
      if (this.isObject(target) && this.isObject(source)) {
        Object.keys(source).forEach(key => {
          if (this.isObject(source[key])) {
            if (!(key in target)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = this.deepMerge(target[key], source[key]);
            }
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      
      return output;
    }
    
    /**
     * Check if value is an object
     * @param {*} item - Item to check
     * @returns {boolean} - True if object
     */
    isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item));
    }
  }
  
  // Example usage:
  /*
  // Load Chart.js first
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
  script.onload = () => {
    // Create configuration
    const dashboardConfig = {
      modalId: 'analyticsDashboard',
      title: 'Analytics Dashboard',
      charts: [
        // Add chart configurations here
      ],
      onClose: () => console.log('Dashboard closed')
    };
    
    // Create and open the modal
    const dashboard = new ModalChartCreator(dashboardConfig);
    dashboard.open();
  };
  document.head.appendChild(script);
  */
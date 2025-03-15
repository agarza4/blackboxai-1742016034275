// Initialize data store with sample historical data
let financialData = {
    revenue: [
        { amount: 42000, date: '2024-02-15' }  // Previous month's data for growth calculation
    ],
    expenses: [
        { amount: 32000, date: '2024-02-15' }
    ],
    assets: []
};

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    let revenueChart, cashFlowChart;

    // Function to update KPIs and charts
    function updateDashboard() {
        const latestRevenue = financialData.revenue[financialData.revenue.length - 1] || { amount: 0 };
        const prevRevenue = financialData.revenue[financialData.revenue.length - 2] || { amount: latestRevenue.amount };
        const latestExpense = financialData.expenses[financialData.expenses.length - 1] || { amount: 0 };

        // Calculate KPIs
        const revenueGrowth = prevRevenue.amount > 0 
            ? ((latestRevenue.amount - prevRevenue.amount) / prevRevenue.amount) * 100 
            : 0;
        
        const profitMargin = latestRevenue.amount > 0 
            ? ((latestRevenue.amount - latestExpense.amount) / latestRevenue.amount) * 100 
            : 0;

        // Update KPI cards
        const kpiCards = document.querySelectorAll('.dashboard-card');
        if (kpiCards.length >= 4) {
            // Revenue Growth
            kpiCards[0].querySelector('.text-3xl').textContent = `+${revenueGrowth.toFixed(1)}%`;
            
            // Profit Margin
            kpiCards[1].querySelector('.text-3xl').textContent = `${profitMargin.toFixed(1)}%`;
            
            // CAC and ROI remain static for demo
            kpiCards[2].querySelector('.text-3xl').textContent = '$125';
            kpiCards[3].querySelector('.text-3xl').textContent = '215%';
        }

        // Update charts
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenueData = {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Revenue',
                    data: [30000, 35000, 32000, 38000, prevRevenue.amount, latestRevenue.amount],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: [25000, 28000, 26000, 30000, 32000, latestExpense.amount],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        const cashFlowData = {
            labels: monthLabels,
            datasets: [{
                label: 'Cash Flow',
                data: [5000, 7000, 6000, 8000, 
                    prevRevenue.amount - financialData.expenses[financialData.expenses.length - 2]?.amount || 10000,
                    latestRevenue.amount - latestExpense.amount
                ],
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 2,
                type: 'bar'
            }]
        };

        if (revenueChart) {
            revenueChart.data = revenueData;
            revenueChart.update();
        } else {
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                revenueChart = new Chart(revenueCtx, {
                    type: 'line',
                    data: revenueData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        }
                    }
                });
            }
        }

        if (cashFlowChart) {
            cashFlowChart.data = cashFlowData;
            cashFlowChart.update();
        } else {
            const cashFlowCtx = document.getElementById('cashFlowChart');
            if (cashFlowCtx) {
                cashFlowChart = new Chart(cashFlowCtx, {
                    type: 'bar',
                    data: cashFlowData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    // Initialize dashboard
    updateDashboard();

    // Handle tab navigation
    const tabs = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active state from all tabs
            tabs.forEach(t => {
                t.classList.remove('border-blue-500', 'text-blue-600');
                t.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Add active state to clicked tab
            tab.classList.remove('border-transparent', 'text-gray-500');
            tab.classList.add('border-blue-500', 'text-blue-600');

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show the selected tab content
            const tabName = tab.getAttribute('data-tab');
            const selectedContent = document.getElementById(tabName + '-section');
            if (selectedContent) {
                selectedContent.classList.remove('hidden');
                if (tabName === 'dashboard') {
                    updateDashboard();
                }
            }
        });
    });

    // Handle Export button click
    const exportButton = document.querySelector('button i.fa-download').closest('button');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const data = {
                revenue: financialData.revenue,
                expenses: financialData.expenses,
                assets: financialData.assets,
                kpis: {
                    revenueGrowth: document.querySelector('.dashboard-card:nth-child(1) .text-3xl').textContent,
                    profitMargin: document.querySelector('.dashboard-card:nth-child(2) .text-3xl').textContent,
                    cac: document.querySelector('.dashboard-card:nth-child(3) .text-3xl').textContent,
                    roi: document.querySelector('.dashboard-card:nth-child(4) .text-3xl').textContent
                }
            };
            
            console.log('Exporting financial data:', data);
            alert('Generating financial report...');
        });
    }

    // Handle Investor Mode toggle
    const investorModeButton = document.querySelector('button i.fa-eye').closest('button');
    if (investorModeButton) {
        investorModeButton.addEventListener('click', () => {
            document.body.classList.toggle('investor-mode');
            investorModeButton.classList.toggle('bg-blue-600');
            investorModeButton.classList.toggle('text-white');
            investorModeButton.classList.toggle('bg-gray-100');
            investorModeButton.classList.toggle('text-gray-700');
        });
    }

    // Handle form submissions
    const saveDataButton = document.querySelector('button[type="submit"]');
    if (saveDataButton) {
        saveDataButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                revenue: {
                    amount: parseFloat(document.getElementById('revenue').value) || 0,
                    date: document.getElementById('revenue-date').value
                },
                expense: {
                    type: document.getElementById('expense-type').value,
                    amount: parseFloat(document.getElementById('expense-amount').value) || 0,
                    date: document.getElementById('expense-date').value
                },
                asset: {
                    value: parseFloat(document.getElementById('asset-value').value) || 0,
                    type: document.getElementById('asset-type')?.value
                }
            };

            // Add data to store
            if (formData.revenue.amount) {
                financialData.revenue.push(formData.revenue);
            }
            if (formData.expense.amount) {
                financialData.expenses.push(formData.expense);
            }
            if (formData.asset.value) {
                financialData.assets.push(formData.asset);
            }

            // Update dashboard
            updateDashboard();
            
            // Show success message
            alert('Financial data saved successfully!');
            
            // Clear form fields
            document.getElementById('revenue').value = '';
            document.getElementById('revenue-date').value = '';
            document.getElementById('expense-amount').value = '';
            document.getElementById('expense-date').value = '';
            document.getElementById('asset-value').value = '';

            // Switch back to dashboard
            const dashboardTab = document.querySelector('[data-tab="dashboard"]');
            if (dashboardTab) {
                dashboardTab.click();
            }
        });
    }

    // Handle window resize for chart responsiveness
    window.addEventListener('resize', () => {
        if (revenueChart) revenueChart.resize();
        if (cashFlowChart) cashFlowChart.resize();
    });
});

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format percentage
function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// Utility function to format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

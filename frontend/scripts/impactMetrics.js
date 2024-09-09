document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await apical('/api/impact-metrics', 'GET');
        

        // Carbon Emissions - Pie Chart
        Plotly.newPlot('carbonEmissionsChart', [{
            labels: ['Carbon Emissions'],
            values: [metrics.carbonEmissions],
            type: 'pie'
        }], {
            title: 'Carbon Emissions'
        });

        // Waste Generated - Scatter plot
        Plotly.newPlot('wasteGeneratedChart', [{
            x: ['waste Generated'],
            y: [metrics.wasteGenerated],
            mode: 'markers',
            type: 'scatter'
        }], {
            title: 'Waste Generated'
        });

        // Water Usage - Line Chart
        Plotly.newPlot('waterUsageChart', [{
            x: ['water Usage'],
            y: [metrics.waterUsage],
            mode: 'lines+markers',
            type: 'scatter'
        }], {
            title: 'Water Usage'
        });

        // Energy consumption - Area Chart
        Plotly.newPlot('energyConsumptionChart', [{
            x: ['energy Consumption'],
            y: [metrics.energyConsumption],
            fill: 'tozeroy',
            type: 'scatter'
        }], {
            title: 'Energy Consumption'
        });

    } catch (error) {
        console.log('Error fetching impact metrics:', error);
    }
});
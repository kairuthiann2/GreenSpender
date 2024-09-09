document.addEventListener('DOMContentLoaded', async () => {
    console.log('DoM fully loaded and parsed')
    try {
        console.log('Attempting to call the API...');
        const response = await apiCall('/api/impact-metrics', 'GET');
        console.log('API call successful, response:', response);
        

        // Carbon Emissions - Pie Chart
        Plotly.newPlot('carbonEmissionsChart', [{
            labels: ['Carbon Emissions'],
            values: [metrics.carbonEmissions],
            type: 'pie'
        }], {
            title: 'Carbon Emissions'
        });
        console.log('Carbo emissions chart plotted');

        // Waste Generated - Scatter plot
        Plotly.newPlot('wasteGeneratedChart', [{
            x: ['waste Generated'],
            y: [metrics.wasteGenerated],
            mode: 'markers',
            type: 'scatter'
        }], {
            title: 'Waste Generated'
        });
        console.log('Waste generated chart plotted')

        // Water Usage - Line Chart
        Plotly.newPlot('waterUsageChart', [{
            x: ['water Usage'],
            y: [metrics.waterUsage],
            mode: 'lines+markers',
            type: 'scatter'
        }], {
            title: 'Water Usage'
        });
        console.log('Waste Usage chart plotted')

        // Energy consumption - Area Chart
        Plotly.newPlot('energyConsumptionChart', [{
            x: ['energy Consumption'],
            y: [metrics.energyConsumption],
            fill: 'tozeroy',
            type: 'scatter'
        }], {
            title: 'Energy Consumption'
        });
        console.log('Energy consumption chart plotted')

    } catch (error) {
        console.log('Error fetching impact metrics:', error);
    }
});
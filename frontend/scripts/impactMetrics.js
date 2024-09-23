document.addEventListener('DOMContentLoaded', async () => {
    console.log('DoM fully loaded and parsed')
    try {
        // console.log('Attempting to call the API...');
        const response = await apiCall('/api/impact-metrics', 'GET');
        console.log('API call successful, response:', response);

        // Assign the API response to the metrics 
        const metrics = response;
        console.log('Api Metrics data:', metrics);

        // Prepare data for combine chart
        const trace = {
            x: ['Carbon Emissions', 'waste Generated', 'water Usage', 'energy Consumption'],
            y: [metrics.carbonEmissions, metrics.wasteGenerated, metrics.waterUsage, metrics.energyConsumption],
            type: 'bar'
        };

        const data = [trace];

        // plot the combined bar chart 
        Plotly.newPlot('metricsChart', data, {
            title: 'Environmental Impact Metrics',
            xaxis: {
                title: 'metrics'
            },
            yaxis: {
                title: 'values'
            }
        });

        console.log('Combined impact metrics chart plotted');

    } catch (error) {
        console.log('Error fetching impact metrics:', error);
    }
});
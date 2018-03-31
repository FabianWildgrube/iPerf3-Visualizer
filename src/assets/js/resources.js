window.chartColors =  [
        {
            opaque: 'rgb(27,70,115)',
            translucent: 'rgba(27, 70, 115, 0.4)'
        },
        {
            opaque: 'rgb(227,18,92)',
            translucent: 'rgba(227,18,92, 0.4)'
        },
        {
            opaque: 'rgb(16,42,69)',
            translucent: 'rgba(16,42,69, 0.4)'
        },
        {
            opaque: 'rgb(156,12,63)',
            translucent: 'rgba(156,12,63, 0.4)'
        },
        {
            opaque: 'rgb(93,7,37)',
            translucent: 'rgba(93,7,37, 0.4)'
        }
    ];

window.lineChartBorderWidth  = 3;
window.lineChartPointRadius  = 5;

window.sleepLength = 50;

window.nrOfCharts = 0;
window.iPerfCharts = [];

window.standardLineChartDefinition = {
    type: 'line',

    data: {
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: "Seconds"
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0
                },
                scaleLabel: {
                    display: true,
                    labelString: "MBits/s"
                }
            }]
        }
    }
};
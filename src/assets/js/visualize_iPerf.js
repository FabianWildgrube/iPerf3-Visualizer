var informationDiv;
var testStartSeconds;
var iPerfData;

var chartsContainer;

window.addEventListener("load", function()  {
    chartsContainer = document.getElementById('chartsContainer');
    informationDiv = document.getElementById('testInfo');
    var fileDialog = document.getElementById('fileDialog');

    fileDialog.addEventListener("change", function (ev) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            if (fileDialog.files.length == 0){
                alert("Please select at least one file!");
                return;
            } else {
                window.iPerfCharts.push({
                    chart: undefined,
                    raw_data_sets: [],
                    datasets_names: []
                });

                for (var i = 0; i < fileDialog.files.length; i++){
                    var file = fileDialog.files[i];
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        window.iPerfCharts[window.nrOfCharts].raw_data_sets.push(JSON.parse(reader.result));
                    };
                    console.log("Reading file: " + file.name);
                    reader.readAsText(file);
                    window.iPerfCharts[window.nrOfCharts].datasets_names.push(file.name);
                }

                var waitForLoadTimeout = undefined;

                var createChartIfAllDataIsLoaded = function () {
                    console.log("Waiting for data to load");
                    if (window.iPerfCharts[window.nrOfCharts].raw_data_sets.length === fileDialog.files.length){
                        console.log("Data seems to have loaded");
                        createChart();
                    } else {
                        waitForLoadTimeout = setTimeout(createChartIfAllDataIsLoaded, window.sleepLength);
                    }
                };

                waitForLoadTimeout = setTimeout(createChartIfAllDataIsLoaded, window.sleepLength);
            }
        } else {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }
    });
});


function createChart() {
    console.log("Creating chart");

    var ctx = document.createElement('canvas');
    chartsContainer.appendChild(ctx);
    var newChart = new Chart(ctx, standardLineChartDefinition);

    var raw_datasets = window.iPerfCharts[window.nrOfCharts].raw_data_sets;
    var dataset_names = window.iPerfCharts[window.nrOfCharts].datasets_names;
    var processed_datasets = [];
    var titleString = "Chart of testruns: ";
    var lengthOfLongestDataset = 0;

    for (var i = 0; i < raw_datasets.length; i++){
        var raw_dataset = raw_datasets[i];
        var dataset_name = dataset_names[i].replace(/\.json/, '');
        titleString += dataset_name + ", ";

        var data_points = parseDataPoints(raw_dataset.intervals);
        if (data_points.length > lengthOfLongestDataset) lengthOfLongestDataset = data_points.length;

        var processed_dataset = {
            label: dataset_name,
            data: data_points,
            borderWidth: window.lineChartBorderWidth,
            backgroundColor: window.chartColors[i % window.chartColors.length].translucent,
            borderColor: window.chartColors[i % window.chartColors.length].opaque,
            pointRadius: window.lineChartPointRadius,
            fill: true
        };

        processed_datasets.push(processed_dataset);
    }

    newChart.data.datasets = processed_datasets;
    newChart.data.labels = range(0, lengthOfLongestDataset);
    newChart.options.title.text = titleString;
    newChart.update();

    window.iPerfCharts[window.nrOfCharts].chart = newChart;
    window.nrOfCharts++;
}

function parseDataPoints(intervalsData) {
    var dataPoints = [];

    for (var i = 0; i < intervalsData.length; i++) {
        dataPoints.push((intervalsData[i].sum.bits_per_second/(1000*1000)).toFixed(2)); //MegaBits per Second
    }

    return dataPoints;
}

function parseTestRunInfo(startData, endData) {
    var testTitle = document.createElement('h4');
    testTitle.innerHTML = "iPerf Testrun from " + startData.connected[0].local_host + ":" + startData.connected[0].local_port +
                                        " to "  + startData.connected[0].remote_host + ":" + startData.connected[0].remote_port;

    var infoTable = document.createElement('TABLE');
    infoTable.appendChild(createTableRow("iPerf Version", [startData.version]));
    infoTable.appendChild(createTableRow("Duration", [endData.sum_received.seconds.toFixed(2) + "s"]));
    infoTable.appendChild(createTableRow("Started", [startData.timestamp.time]));
    infoTable.appendChild(createTableRow("Transferred Bytes", [endData.sum_received.bytes]));

    informationDiv.appendChild(testTitle);
    informationDiv.appendChild(infoTable);
}


/* NOT NEEDED ANYMORE */
function paintChart(ctx, datapoints, timepoints){
    var chart01 = new Chart(ctx, {
        type: 'line',

        data: {
            labels: timepoints,
            datasets: [{
                label: 'Test Data',
                data: datapoints,
                borderWidth: 3,
                borderColor: '#E1721C',
                pointRadius: 5
            }]
        },
        options: {
            title: {
                text: 'Time Tryout'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'second'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Time"
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
    });
}


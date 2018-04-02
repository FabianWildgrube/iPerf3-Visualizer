var chartsContainer;

window.addEventListener("load", function()  {
    chartsContainer = document.getElementById('chartsContainer');

    var initialFileChooserContainer = document.getElementById('fileChooserContainer');
    initialFileChooserContainer.appendChild(createFileChooser());

    var fileDialog = initialFileChooserContainer.getElementsByTagName('input')[0];

    fileDialog.addEventListener("change", function () {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            if (fileDialog.files.length === 0){
                alert("Please select at least one file!");

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

        }
    });
});


function createInfoBoxes(raw_datasets, dataset_names) {
    var infoBoxesContainer = document.createElement('div');
    infoBoxesContainer.classList.add('infoBoxesContainer');

    for (var k = 0; k < raw_datasets.length; k++) {
        //Create info box for each dataset
        var testRunInfoBox = createTestrunInfoBox(raw_datasets[k], dataset_names[k].replace(/\.json/, ''), window.chartColors[k % window.chartColors.length].opaque);
        testRunInfoBox.classList.add('infoBox');
        infoBoxesContainer.appendChild(testRunInfoBox);
    }
    var clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    infoBoxesContainer.appendChild(clearDiv);

    return infoBoxesContainer;
}

function createChart() {
    console.log("Creating chart");
    var raw_datasets = window.iPerfCharts[window.nrOfCharts].raw_data_sets;
    var dataset_names = window.iPerfCharts[window.nrOfCharts].datasets_names;

    var chartContainer = document.createElement('div');
    chartContainer.classList.add('chartContainer');

    var ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);
    var newChart = new Chart(ctx, window.standardLineChartDefinition);

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
    console.log("Datasets: " + newChart.data.datasets[0].data);
    newChart.data.labels = range(0, lengthOfLongestDataset);
    console.log("Labels: " + newChart.data.labels);
    newChart.options.title.text = titleString;

    chartsContainer.appendChild(chartContainer);
    newChart.update();

    var infoBoxesContainer = createInfoBoxes(raw_datasets, dataset_names);
    chartContainer.appendChild(infoBoxesContainer);

    window.iPerfCharts[window.nrOfCharts].chart = newChart;
    window.nrOfCharts++;
}

function parseDataPoints(intervalsData) {
    var dataPoints = [];

    for (var i = 0; i < intervalsData.length; i++) {
        dataPoints.push(intervalsData[i].sum.bits_per_second/(1000*1000)); //MegaBits per Second
    }

    return dataPoints;
}

function createTestrunInfoBox(raw_dataset, title, color) {
    var startData = raw_dataset.start;
    var endData = raw_dataset.end;

    var date = startData.timestamp.time;
    var source = startData.connected[0].local_host;
    var destination = startData.connected[0].remote_host;
    var data_sent = endData.sum_received.bytes;
    var duration = endData.sum_received.seconds.toFixed(2);
    var average_speed = (endData.sum_received.bits_per_second/(1000*1000)).toFixed(2);

    var box = document.createElement('div');
    box.style.borderColor = color;
    
    var title_h3 = document.createElement('h3');
    title_h3.innerHTML = title;
    title_h3.style.color = color;
    box.appendChild(title_h3);

    var date_p = document.createElement('p');
    date_p.innerHTML = date;
    date_p.classList.add('date');
    box.appendChild(date_p);

    var source_dest_p = document.createElement('p');
    source_dest_p.innerHTML = 'From <span class="ip">' +  source + "</span>" + " to " + '<span class="ip">' +  destination + "</span>";
    box.appendChild(source_dest_p);
    
    var data_sent_p = document.createElement('p');
    data_sent_p.innerHTML = data_sent + " Bytes sent in " + duration + "s";
    box.appendChild(data_sent_p);

    var average_speed_p = document.createElement('p');
    average_speed_p.innerHTML = "Average: " + average_speed + " Mbps";
    box.appendChild(average_speed_p);
    
    return box;
}
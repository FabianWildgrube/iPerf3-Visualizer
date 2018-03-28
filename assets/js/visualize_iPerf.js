var informationDiv;
var testStartSeconds;
var iPerfData;


window.addEventListener("load", function()  {
    informationDiv = document.getElementById('testInfo');
    var fileDialog = document.getElementById('fileDialog');

    fileDialog.addEventListener("change", function (ev) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            if (fileDialog.files.length == 0){
                alert("Please select at least one file!");
                return;
            } else {
                var reader = new FileReader();
                reader.onload = function (ev) {
                    iPerfData = JSON.parse(reader.result);
                    main();
                };
                reader.readAsText(fileDialog.files[0]);
            }
        } else {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }
    });
});

function main() {
    testStartSeconds = moment.unix(iPerfData.start.timestamp.timesecs);
    parseTestRunInfo(iPerfData.start, iPerfData.end);
    var dataWithTimePoints = parseDataPoints(iPerfData.intervals);
    var dataPoints = dataWithTimePoints.dataPoints;
    var timePoints = dataWithTimePoints.timePoints;
    paintChart(dataPoints, timePoints);
}

function newDate(days) {
    return moment().add(days, 'd').toDate();
}

function parseDataPoints(intervalsData) {
    var dataWithTimePoints = {
        dataPoints: [],
        timePoints: []
    };

    var timecounter = testStartSeconds;

    var timeArray = [];

    for (var i = 0; i < intervalsData.length; i++) {
        dataWithTimePoints.dataPoints.push(intervalsData[i].sum.bits_per_second/(1000*1000)); //MegaBits per Second
        timecounter = timecounter.add(intervalsData[i].sum.seconds, "seconds");
        dataWithTimePoints.timePoints.push(timecounter.toDate());
        timecounter = moment(timecounter.toDate()); //create new copy, otherwise the whole array will point to the same date-object
    }

    console.log(timeArray);

    return dataWithTimePoints;
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

function createTableRow(rowtitle, rowdata_in){
    var row = document.createElement('TR');
    var rowHead = document.createElement('TD');
    rowHead.innerHTML = rowtitle;
    row.appendChild(rowHead);

    for (var i = 0; i < rowdata_in.length; i++){
        var rowData = document.createElement('TD');
        rowData.innerHTML = rowdata_in[i];
        row.appendChild(rowData);
    }

    return row;
}

function paintChart(datapoints, timepoints){
    var ctx = document.getElementById('perfChart01').getContext('2d');

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


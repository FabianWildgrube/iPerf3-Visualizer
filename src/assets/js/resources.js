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
                ticks: {
                    min: 0
                },
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

function createFileChooser() {
    var containerDiv = document.createElement('div');
    containerDiv.classList.add("fileChooser");

    var infoTextField = document.createElement('p');
    infoTextField.classList.add("infotext");
    infoTextField.innerHTML = 'no files chosen';
    containerDiv.appendChild(infoTextField);

    var hiddenFileInput = document.createElement('input');
    hiddenFileInput.type='file';
    hiddenFileInput.multiple = true;
    hiddenFileInput.accept = 'application/json';
    hiddenFileInput.addEventListener('change', function () {
        var filenames = "";
        if (hiddenFileInput.files.length > 0) {
            for (var i = 0; i < hiddenFileInput.files.length; i++){
                var file = hiddenFileInput.files[i];
                filenames += file.name;
                filenames += (i !== hiddenFileInput.files.length-1) ? ", " : "";
            }
        } else {
            filenames = 'no files chosen';
        }

        infoTextField.innerHTML = filenames;
    });
    containerDiv.appendChild(hiddenFileInput);

    var uploadButton = document.createElement('img');
    uploadButton.src = './assets/images/upload.png';
    uploadButton.classList.add('uploadButton');
    uploadButton.addEventListener('click', function (ev) {
        if (hiddenFileInput.click) {
            hiddenFileInput.click();
        } else if (hiddenFileInput.onclick) {
            hiddenFileInput.onclick(ev);
        }
    });
    containerDiv.appendChild(uploadButton);

    return containerDiv;
}
function range(from, to){
    var arr = [];
    while(from <= to){
        arr.push(from++);
    }
    return arr;
}

function newDate(days) {
    return moment().add(days, 'd').toDate();
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
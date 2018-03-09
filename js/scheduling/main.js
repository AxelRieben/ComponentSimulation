let PROCESS_STATES = {NOT_ARRIVED: -1, READY: 0, WAITING: 1, RUNNING: 2, TERMINATED: 3};
const MAX_PROCESS = 15;
const MAX_ARRIVAL = 40;
const MAX_DURATION = 15;
const MIN_ARRIVAL = 0;
const MIN_DURATION = 1;

class Process {
    constructor(name, arrival, duration) {
        this.name = name;
        this.arrival = arrival;
        this.duration = duration;
        this.ramainingTime = duration;
        this.responseTime = -1;
        this.state = PROCESS_STATES.NOT_ARRIVED;
    }
}

processesArray = [];

function addProcess(name, arrival, duration) {
    p = new Process(name, arrival, duration);
    processesArray.push(p);
    updateTableProcess();
}


function resetProcess() {
    processesArray = [];
    updateTableProcess();
}

function updateTableProcess() {
    let table = $('#processes_table_body');
    table.empty();
    processesArray.forEach(p => {
            table.append(
                "<tr>" +
                "<td>" + p.name + "</td>" +
                "<td>" + p.arrival + "</td>" +
                "<td>" + p.duration + "</td>" +
                "</tr>");
        }
    );
}

/***********************************\
 Events handling
 \***********************************/

$('#btn_add_process').click(function () {
    let name = "P" + processesArray.length;
    let arrival = parseInt($('#in_arrival').val());
    let duration = parseInt($('#in_duration').val());

    if (arrival > MAX_ARRIVAL)
        arrival = MAX_ARRIVAL;

    if (arrival < MIN_ARRIVAL)
        arrival = MIN_ARRIVAL;

    if (duration > MAX_DURATION)
        duration = MAX_DURATION;

    if (duration < MIN_DURATION)
        duration = MIN_DURATION;

    if (!isNaN(arrival) && !isNaN(duration)) {
        addProcess(name, arrival, duration);
    }
});


$('#btn_add_random').click(function () {
    let name = "P" + processesArray.length;
    let arrival = Math.floor(Math.random() * MAX_ARRIVAL + MIN_ARRIVAL);
    let duration = Math.floor(Math.random() * MAX_DURATION + MIN_DURATION);

    addProcess(name, arrival, duration);
});


$('#btn_reset').click(function () {
    resetProcess();
});
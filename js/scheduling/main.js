let PROCESS_STATES = {NOT_ARRIVED: -1, READY: 0, WAITING: 1, RUNNING: 2, TERMINATED: 3};
const ALGO = {'fcfs': fcfs, 'sjf_np': sjf_np, 'sjf_p': sjf_p, 'rr': rr};
const MAX_PROCESS = 10;
const MAX_ARRIVAL = 40;
const MAX_DURATION = 15;
const MIN_ARRIVAL = 0;
const MIN_DURATION = 1;
let time = -1;
let currentAlgo = 'fcfs';

class Process {
    constructor(name, arrival, duration) {
        this.name = name;
        this.arrival = arrival;
        this.duration = duration;
        this.remainingTime = duration;
        this.responseTime = -1;
        this.waitingTime = 0;
        this.turnAroundTime = 0;
        this.state = PROCESS_STATES.NOT_ARRIVED;
    }
}

processesArray = [];

function addProcess(name, arrival, duration) {
    if (processesArray.length >= MAX_PROCESS) {
        alert("Maximum " + MAX_PROCESS + " process");
    }
    else {
        p = new Process(name, arrival, duration);
        processesArray.push(p);
        updateTableProcess();
    }
}

function resetProcess() {
    processesArray = [];
    updateTableProcess();
    updateTableExecutionHeader();
    $('#execution_table_body').empty();
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

function updateTableExecutionHeader() {
    let table = $('#execution_table_head');
    table.empty();
    table.append("<th>Time</th>");
    processesArray
        .sort((p1, p2) => p1.arrival - p2.arrival)
        .forEach(p => table.append("<th>" + p.name + "</th>"));
}

function addRowExexcutionTable(cellArray) {
    let table = $('#execution_table_body');
    table.append("<tr>");
    table.append("<td>" + time + "</td>");
    cellArray.forEach(c => {
        let classTag = c.running ? "positive" : "";
        table.append("<td class=\"" + classTag + "\">" + c.val + "</td>")
    });
    table.append("</tr>");
}

function sjf_np(time) {
    console.log("sjf_np");
}

function sjf_p(time) {
    console.log("sjf_p");
}

function rr(time) {
    console.log("rr");
}

function fcfs(time) {
    console.log("fcfs");
    let cellArray = [];
    let isAProcessRunning = false;
    processesArray.forEach((p) => {
        let val = "";
        let running = false;
        if (time >= p.arrival) {
            val = p.remainingTime;
            if (p.remainingTime > 0) {
                if (!isAProcessRunning) {
                    if (p.responseTime < 0) // set response time only once
                        p.responseTime = time - p.arrival; // in FCFS waiting time and response time are equal
                    isAProcessRunning = running = true;
                    p.remainingTime--;
                }
                else {
                    running = false;
                    p.waitingTime++;
                }
            }
            else if (val === 0) {
                p.remainingTime--;
                p.turnAroundTime = time - p.arrival
            }
            else
                val = "";
        }
        else {
            val = "-";
        }
        cellArray.push({val: val, running: running})
    });
    return cellArray;
}

function isFinished() {
    finished = true;
    processesArray
        .map(p => p.remainingTime)
        .forEach(r => {
            if (r > -1)
                finished = false;
        });
    return finished;
}

function tick() {
    time++;
    let cellArray = ALGO[currentAlgo](time);
    addRowExexcutionTable(cellArray);
}

function startAnimation(isManual) {
    toggleButtons(true);
    updateTableExecutionHeader();
    currentAlgo = $('#select_algo').val();
    if (isManual) {
        tick();
        if (isFinished()) {
            toggleButtons(false);
            console.log(processesArray);
        }

    }
    else {
        while (!isFinished()) {
            tick();
        }
        console.log(processesArray);
        toggleButtons(false);
    }
}

function toggleButtons(animation) {
    btn_next = $('#btn_next');
    btn_manual = $('#btn_manual');
    btn_auto = $('#btn_auto');
    btn_next.prop('disabled', !animation);
    btn_manual.prop('disabled', animation);
    if (animation) {
        btn_manual.addClass('disabled');
        btn_auto.addClass('disabled');
        btn_next.removeClass('disabled');
    }
    else {
        btn_next.addClass('disabled');
        btn_manual.removeClass('disabled');
        btn_auto.removeClass('disabled');
    }
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
    time = -1;
    $('#btn_manual').prop('disabled', false);
    $('#btn_next').prop('disabled', true);
});

$('#btn_manual').click(function () {
    startAnimation(true);
});

$('#btn_auto').click(function () {
    startAnimation(false);
});

$('#btn_next').click(function () {
    tick();
    if (isFinished()) {
        toggleButtons(false);
        console.log(processesArray);
    }
});

let contentDivResult;
let stateDivResult = 0;

$('#btn_stats').click(function () {
    if (isFinished()) {
        let divResult = $('#div_result');
        if (stateDivResult === 0) {
            contentDivResult = divResult.html();
            stateDivResult = 1;
            let meanW = 0, meanT = 0, meanR = 0, w = "", t = "", r = "";
            divResult.empty();
            processesArray.forEach(p => {
                meanW += p.waitingTime;
                meanT += p.turnAroundTime;
                meanR += p.responseTime;
                w += "<li>" + p.name + " : " + p.waitingTime + "</li>";
                t += "<li>" + p.name + " : " + p.turnAroundTime + "</li>";
                r += "<li>" + p.name + " : " + p.responseTime + "</li>";
            });
            meanW = meanW / processesArray.length;
            meanT = meanT / processesArray.length;
            meanR = meanR / processesArray.length;
            divResult.append("<p>Waiting time (Moyenne = " + meanW + ")</p><ul>" + w + "</ul>");
            divResult.append("<p>Turnaroud time (Moyenne = " + meanT + ")</p><ul>" + t + "</ul>");
            divResult.append("<p>Response time (Moyenne = " + meanR + ")</p><ul>" + r + "</ul>");
        }
        else {
            stateDivResult = 0;
            divResult.empty();
            divResult.html(contentDivResult);
        }
    }

});

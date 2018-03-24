/**
 * main.js
 *
 * Simulation of process scheduling with FCFS, SJF (P), and RR algorithms
 *
 * @license Apache 2.0
 * @version 0.1
 * @author  Axel Rieben, Sylvain Renaud
 * @updated 2018-03-16
 * @link    https://axelrieben.github.io/ComponentSimulation/index.html
 *
 */
const PROCESS_STATES = {NOT_ARRIVED: -1, READY: 0, RUNNING: 1, LEAVING: 2, TERMINATED: 3};
const ALGO = {'fcfs': fcfs, 'sjf_np': sjf_np, 'sjf_p': sjf_p, 'rr': rr};
const MAX_PROCESS = 10;
const MAX_ARRIVAL = 40;
const MAX_DURATION = 15;
const MIN_ARRIVAL = 0;
const MIN_DURATION = 1;
let time = -1;
let currentAlgo = 'fcfs'; // Set default algo to fcfs
let processArray = [];
let stateHistoryArray = [];

/**
 * Representation of a process with some attributes
 */
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

/**
 * Add a process to the process array
 * @param name
 * @param arrival
 * @param duration
 */
function addProcess(name, arrival, duration) {
    if (processArray.length >= MAX_PROCESS) {
        alert("Maximum " + MAX_PROCESS + " process");
    }
    else {
        p = new Process(name, arrival, duration);
        processArray.push(p);
        updateInputTable();
    }
}

/**
 * Reset simulation
 */
function resetProcess() {
    processArray = [];
    stateHistoryArray = [];
    updateInputTable();
    createExecutionTableHeader();
    $('#execution_table_body').empty();
}

/**
 * Update the input table with the current process array
 */
function updateInputTable() {
    let table = $('#processes_table_body');
    table.empty();
    processArray.forEach(p => {
            table.append(
                "<tr>" +
                "<td>" + p.name + "</td>" +
                "<td>" + p.arrival + "</td>" +
                "<td>" + p.duration + "</td>" +
                "</tr>");
        }
    );
}

/**
 * Create the header of the execution table (with the current process array
 */
function createExecutionTableHeader() {
    let table = $('#execution_table_head');
    table.empty();
    table.append("<th>Time</th>");
    processArray
        .sort((p1, p2) => p1.arrival - p2.arrival)
        .forEach(p => table.append("<th>" + p.name + "</th>"));
}

/**
 * Redraw the execution table with the simulation history
 */
function updateExecutionTable() {
    let table = $('#execution_table_body');
    table.empty();
    stateHistoryArray.forEach((array, index) => {
        table.append("<tr>");
        table.append("<td>" + index + "</td>");

        array.forEach(p => {
            let currentVal = "";

            switch (p.state) {
                case PROCESS_STATES.NOT_ARRIVED:
                    currentVal = '-';
                    break;
                case PROCESS_STATES.READY:
                case PROCESS_STATES.RUNNING:
                case PROCESS_STATES.LEAVING:
                    currentVal = p.remainingTime;
                    currentVal = p.remainingTime;
                    currentVal = p.remainingTime;
                    break;
                case PROCESS_STATES.TERMINATED:
                    currentVal = '';
                    break;
                default:
                    console.log(p.state);
            }
            let classTag = p.state === PROCESS_STATES.RUNNING ? "positive" : "";
            table.append("<td class=\"" + classTag + "\">" + currentVal + "</td>")
        });

        table.append("</tr>");
    });

}

/**
 * Shortest job first non preemptive algorithm
 */
function sjf_np() {
    console.log("sjf_np");
    let processRunningArray = processArray.filter(p => p.state === PROCESS_STATES.RUNNING);
    processRunningArray.push(null);
    let currentProcessRunning = processRunningArray[0]; //Null if no process is running
    let isAProcessLeaving = false;
    let processReadyArray = processArray.filter(p => p.state === PROCESS_STATES.READY)
        .sort((p1, p2) => p1.remainingTime - p2.remainingTime);

    processArray.forEach((p) => {
        if (time >= p.arrival) {
            if (p.remainingTime > 0) {
                if (p === currentProcessRunning || p === processReadyArray[0]) {

                    if (p === processReadyArray[0]) {
                        currentProcessRunning = p;
                    }

                    if (p.responseTime < 0) // set response time only once
                    {
                        p.responseTime = time - p.arrival; // in FCFS waiting time and response time are equal
                    }

                    if (p.responseTime < 0) // set response time only once
                    {
                        p.responseTime = time - p.arrival; // in FCFS waiting time and response time are equal
                    }

                    if (!isAProcessLeaving) {
                        p.remainingTime--;
                    }

                    if (p.remainingTime === 0) { // Process leaving
                        p.state = PROCESS_STATES.LEAVING;
                        currentProcessRunning = null;
                        isAProcessLeaving = true;
                        p.turnAroundTime = time - p.arrival;
                    }
                    else {
                        p.state = PROCESS_STATES.RUNNING;
                    }
                }
                else {
                    p.waitingTime++;
                    p.state = PROCESS_STATES.READY;
                }
            }
            else {
                p.state = PROCESS_STATES.TERMINATED;
            }
        }
        else {
            p.state = PROCESS_STATES.NOT_ARRIVED;
        }
    });

}

/**
 * Shortest job first preemptive algorithm
 */
function sjf_p() {
    console.log("sjf_p");
}

/**
 * Round robin algorithm
 */
function rr() {
    console.log("rr");
}

/**
 * First come first serve algorithm
 */
function fcfs() {
    console.log("using fcfs");
    let isAProcessRunning = false;

    processArray.forEach((p) => {
        if (time >= p.arrival) {
            if (p.remainingTime > 0) {
                if (!isAProcessRunning) {
                    isAProcessRunning = true;
                    p.state = PROCESS_STATES.RUNNING;
                }
                else {
                    p.state = PROCESS_STATES.READY;
                }
            }
            else {
                if (p.remainingTime === 0) {
                    p.state = PROCESS_STATES.LEAVING;
                }
                else {
                    p.state = PROCESS_STATES.TERMINATED;
                }
            }
        }
        else {
            p.state = PROCESS_STATES.NOT_ARRIVED;
        }
    });
}

/**
 * Check if all process have terminated
 * @returns {boolean}
 */
function isFinished() {
    let finished = true;
    processArray
        .map(p => p.state)
        .forEach(s => {
            if (s !== PROCESS_STATES.TERMINATED)
                finished = false;
        });
    return finished;
}

/**
 * Call to increment time and process an algo
 */
function tick() {
    time++;
    // Update process state using choosed algo
    ALGO[currentAlgo]();

    // Save a deep copy of the curret process array
    stateHistoryArray[time] = JSON.parse(JSON.stringify(processArray));

    // Update process values
    processArray.forEach(p => {
        switch (p.state) {
            case PROCESS_STATES.NOT_ARRIVED:
                break;
            case PROCESS_STATES.READY:
                p.waitingTime++;
                break;
            case PROCESS_STATES.RUNNING:
                if (p.responseTime < 0) // set response time only once
                {
                    p.responseTime = time - p.arrival; // in FCFS waiting time and response time are equal
                }
                p.remainingTime--;
                break;
            case PROCESS_STATES.LEAVING:
                p.remainingTime--;
                p.turnAroundTime = time - p.arrival;
                break;
            case PROCESS_STATES.TERMINATED:
                break;
            default:
                console.log(p.state);
        }
    });
}

/**
 * Entry point of the animation
 * @param isManual
 */
function startAnimation(isManual) {
    toggleButtons(true);
    createExecutionTableHeader();
    currentAlgo = $('#select_algo').val();
    if (isManual) {
        tick();
        if (isFinished()) {
            toggleButtons(false);
            console.log(stateHistoryArray[stateHistoryArray.length - 1]);
        }
    }
    else {
        while (!isFinished()) {
            tick();
            updateExecutionTable();
        }
        console.log(stateHistoryArray[stateHistoryArray.length - 1]);
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
    let name = "P" + processArray.length;
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
    let name = "P" + processArray.length;
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

$('#btn_test_data').click(function () {
    addProcess("P1", 0, 10);
    addProcess("P2", 36, 2);
    addProcess("P3", 3, 6);
    addProcess("P4", 2, 5);
    addProcess("P5", 4, 2);
    addProcess("P6", 10, 2);
    addProcess("P7", 5, 6);
});

$('#btn_manual').click(function () {
    startAnimation(true);
});

$('#btn_auto').click(function () {
    startAnimation(false);
});

$('#btn_next').click(function () {
    tick();
    updateExecutionTable();
    if (isFinished()) {
        toggleButtons(false);
        console.log(processArray);
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
            stateHistoryArray[stateHistoryArray.length - 1].forEach(p => {
                meanW += p.waitingTime;
                meanT += p.turnAroundTime;
                meanR += p.responseTime;
                w += "<li>" + p.name + " : " + p.waitingTime + "</li>";
                t += "<li>" + p.name + " : " + p.turnAroundTime + "</li>";
                r += "<li>" + p.name + " : " + p.responseTime + "</li>";
            });
            meanW = meanW / stateHistoryArray[stateHistoryArray.length - 1].length;
            meanT = meanT / stateHistoryArray[stateHistoryArray.length - 1].length;
            meanR = meanR / stateHistoryArray[stateHistoryArray.length - 1].length;
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

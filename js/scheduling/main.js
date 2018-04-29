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
let quantum = 5;

toggleDivQuantum();

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
        this.roundRobinCycle = 0;
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
        return;
    }
    p = new Process(name, arrival, duration);
    processArray.push(p);
    updateInputTable();
}

/**
 * Reset simulation
 */
function resetProcess() {
    processArray = [];
    stateHistoryArray = [];
    updateInputTable();
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
                "<td class=\"center aligned\">" + p.name + "</td>" +
                "<td class=\"center aligned\">" + p.arrival + "</td>" +
                "<td class=\"center aligned\">" + p.duration + "</td>" +
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
    table.append('<th class="center aligned">Time</th>');
    processArray
        .sort((p1, p2) => p1.arrival - p2.arrival)
        .forEach(p => table.append('<th class="center aligned">' + p.name + '</th>'));
}

/**
 * Redraw the execution table with the simulation history
 */
function updateExecutionTable() {
    let table = document.getElementById('execution_table_body');
    table.innerHTML = '';
    let html = '';
    stateHistoryArray.forEach((array, index) => {
        html += "<tr>";
        html += '<td class="center aligned">' + index + '</td>';
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
                    break;
                case PROCESS_STATES.TERMINATED:
                    currentVal = '';
                    break;
                default:
                    console.log(p.state);
            }
            if (p.state === PROCESS_STATES.RUNNING) {
                let cell = '<td class="positive center aligned running">';
                cell += '<b>';
                cell += currentVal;
                cell += '</b>';
                /*cell += ' <i class="hand point left outline icon"></i>';*/
                cell += '</td>';
                html += cell;
            }
            else {
                html += '<td class="center aligned">' + currentVal + '</td>';
            }
        });
        html += "</tr>";
    });
    table.innerHTML = html;
}

/**
 * Shortest job first non preemptive algorithm
 */
function sjf_np() {
    console.log("sjf_np");

    //Retrieve the current running process
    let processRunning = processArray.filter(p => p.state === PROCESS_STATES.RUNNING)[0];

    //Set state for all processes, except the RUNNING state
    processArray.forEach((p) => {
        if (time >= p.arrival) {
            if (p.remainingTime > 0) {
                if (p !== processRunning) {
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

    //Retrieve the current running process
    processRunning = processArray.filter(p => p.state === PROCESS_STATES.RUNNING)[0];

    if (processRunning === undefined) {
        //Retrive the process with the shortest remaining time
        let sjProcess = processArray
            .filter(p => p.state === PROCESS_STATES.READY || p.state === PROCESS_STATES.RUNNING)
            .sort((p1, p2) => p1.remainingTime - p2.remainingTime)[0];

        if (sjProcess !== undefined) {
            sjProcess.state = PROCESS_STATES.RUNNING;
        }
    }
}

/**
 * Shortest job first preemptive algorithm
 */
function sjf_p() {
    console.log("sjf_p");

    //Set state for all processes, except the RUNNING state
    processArray.forEach((p) => {
        if (time >= p.arrival) {
            if (p.remainingTime > 0) {
                p.state = PROCESS_STATES.READY;
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

    //Retrive the process with the shortest remaining time
    let sjProcess = processArray
        .filter(p => p.state === PROCESS_STATES.READY || p.state === PROCESS_STATES.RUNNING)
        .sort((p1, p2) => p1.remainingTime - p2.remainingTime)[0];

    //Set the running process
    if (sjProcess !== undefined) {
        sjProcess.state = PROCESS_STATES.RUNNING;
    }
}

/**
 * Round robin algorithm
 */
function rr() {
    quantum = $('#quantum').val();
    console.log("using rr with quantum " + quantum);

    processArray.forEach(p => {
        if (time >= p.arrival) {
            if (p.remainingTime > 0) {
                if (p.state !== PROCESS_STATES.RUNNING) {
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

    let runningProcess = processArray.filter(p => p.state === PROCESS_STATES.RUNNING)[0];
    let potentialProcesses = processArray
        .filter(p => p.state === PROCESS_STATES.READY || p.state === PROCESS_STATES.RUNNING)
        .sort((p1, p2) => p1.roundRobinCycle - p2.roundRobinCycle);

    //Set the running process
    if (potentialProcesses.length !== 0) {
        if (potentialProcesses.length > 1) {
            if (runningProcess !== undefined) {
                const elapsedTime = runningProcess.duration - runningProcess.remainingTime;
                if (elapsedTime % quantum !== 0 || elapsedTime === 0) {
                    runningProcess.state = PROCESS_STATES.RUNNING;
                    console.log("Run");
                }
                else {
                    console.log("Ready");
                    runningProcess.state = PROCESS_STATES.READY;
                    runningProcess.roundRobinCycle++;

                    let nextRunningProcess = runningProcess;
                    let i = 0;

                    while (nextRunningProcess === runningProcess && i < potentialProcesses.length) {
                        nextRunningProcess = potentialProcesses[i];
                        i++;
                        console.log("Next");
                    }
                    nextRunningProcess.state = PROCESS_STATES.RUNNING;
                }
            }
        }
        else {
            potentialProcesses[0].state = PROCESS_STATES.RUNNING;
        }
    }
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
        }
        console.log(stateHistoryArray[stateHistoryArray.length - 1]);
        toggleButtons(false);
        updateExecutionTable();
    }
}

/**
 * Toggle the control buttons
 * @param animation
 */
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

/**
 * Display quantum input Round Robin algo is selected
 */
function toggleDivQuantum() {
    if ($('#select_algo').val() === "rr") {
        $('#div_quantum').show();
    }
    else {
        $('#div_quantum').hide();
    }
}

/**
 * Display stats about the current execution in the div with the given id.
 */
function getStatsDiv() {
    let statsDiv = '';
    let meanW = 0, meanT = 0, meanR = 0, w = "", t = "", r = "";
    let lines = '';

    statsDiv += `<table class="ui definition celled table"><thead><tr class="center aligned">
<th></th>
<th>Waiting time</th>
<th>Turn around time</th>
<th>Response time</th>
</tr></thead><tbody>`;

    function addLine(name, wt, tt, rt) {
        return '<tr class="center aligned"><td>' + name + '</td><td>' + wt + '</td><td>' + tt + '</td><td>' + rt + '</td></tr>';
    }

    stateHistoryArray[stateHistoryArray.length - 1].forEach(p => {
        meanW += p.waitingTime;
        meanT += p.turnAroundTime;
        meanR += p.responseTime;
        statsDiv += addLine(p.name, p.waitingTime, p.turnAroundTime, p.responseTime);
        w += "<li>" + p.name + " : " + p.waitingTime + "</li>";
        t += "<li>" + p.name + " : " + p.turnAroundTime + "</li>";
        r += "<li>" + p.name + " : " + p.responseTime + "</li>";
    });

    meanW = meanW / stateHistoryArray[stateHistoryArray.length - 1].length;
    meanT = meanT / stateHistoryArray[stateHistoryArray.length - 1].length;
    meanR = meanR / stateHistoryArray[stateHistoryArray.length - 1].length;
    /*
    statsDiv += "<p><strong>Waiting time</strong> (Moyenne = " + meanW.toFixed(2) + ")</p><ul>" + w + "</ul>";
    statsDiv += "<p><strong>Turnaroud time</strong> (Moyenne = " + meanT.toFixed(2) + ")</p><ul>" + t + "</ul>";
    statsDiv += "<p><strong>Response time</strong> (Moyenne = " + meanR.toFixed(2) + ")</p><ul>" + r + "</ul>";
    */

    statsDiv += '<tr class="center aligned"><td>' + 'Mean' + '</td><td><strong>'
        + meanW.toFixed(2) + '</strong></td><td><strong>'
        + meanT.toFixed(2) + '</strong></td><td><strong>'
        + meanR.toFixed(2) + '</strong></td></tr>';

    statsDiv += '</tbody></table>';
    return statsDiv;
}

/***********************************\
 Events handling
 \***********************************/

/**
 * Print Temporal distribution, Stats and Gantt diagram
 * Credits : https://stackoverflow.com/questions/2255291/print-the-contents-of-a-div
 */
function print() {
    let mywindow = window.open('', 'Print', 'height=600,width=800');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('<link rel="stylesheet" type="text/css" href="css/print.css">');
    mywindow.document.write('</head><body><div class="container">');

    // Temporal distribution
    mywindow.document.write('<div id="input_stats"><div id="temp_distribution"><h3>Temporal distribution</h3>');
    mywindow.document.write('<table id="processes_table">');
    mywindow.document.write(document.getElementById('processes_table').innerHTML);
    mywindow.document.write('</table></div>');

    // Stats
    mywindow.document.write('<div id="stats"><h3>Statistics</h3>');
    mywindow.document.write('<div>');
    mywindow.document.write(getStatsDiv());
    mywindow.document.write('</div>');
    mywindow.document.write('</div></div>');

    // Gantt
    mywindow.document.write('<div id="gantt"><h3>Gantt diagram</h3>');
    mywindow.document.write('<table id="execution_table">');
    mywindow.document.write(document.getElementById('execution_table').innerHTML);
    mywindow.document.write('</table></div>');

    mywindow.document.write('</div>');
    mywindow.document.write('<script type="text/javascript">onload = () => {window.print(); window.close();}</script>');
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    return true;
}

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
    document.getElementById('div_result').hidden = true;
    document.getElementById('div_stats').hidden = true;
    document.getElementById('div_stats_content').innerHTML = '';
    toggleButtons(false);
});

$('#btn_test_data').click(function () {
    addProcess("P" + processArray.length, 0, 10);
    addProcess("P" + processArray.length, 36, 2);
    addProcess("P" + processArray.length, 3, 6);
    addProcess("P" + processArray.length, 2, 5);
    addProcess("P" + processArray.length, 4, 2);
    addProcess("P" + processArray.length, 10, 2);
    addProcess("P" + processArray.length, 5, 6);
});

$('#btn_manual').click(function () {
    document.getElementById('div_result').hidden = false;
    startAnimation(true);
});

$('#btn_auto').click(function () {
    stateHistoryArray = [];
    $('#execution_table_body').empty();
    document.getElementById('div_result').hidden = false;
    startAnimation(false);
});

$('#btn_next').click(function () {
    tick();
    updateExecutionTable();
    if (isFinished()) {
        toggleButtons(false);
        console.log(processArray);
    }
    window.scrollTo(0, document.body.scrollHeight);
});

$('#btn_stats').click(function () {
    if (isFinished()) {
        let div_stats = document.getElementById('div_stats');
        if (div_stats.hidden) {
            document.getElementById('div_stats_content').innerHTML = getStatsDiv();
        }
        div_stats.hidden = !div_stats.hidden;
    }
});

$('#select_algo').change(() => {
    toggleDivQuantum();
});
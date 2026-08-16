// NAVIGATION
function showSection(id) {
    let sections = document.querySelectorAll(".section");

    sections.forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}


// TASK SYSTEM
function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value.trim();

    if (task === "") return;

    let li = document.createElement("li");
    li.innerText = task;

    li.onclick = function () {
        li.remove();
    };

    document.getElementById("taskList").appendChild(li);
    input.value = "";
}


// POMODORO TIMER
let time = 1500;
let timer = null;

function updateTime() {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    document.getElementById("time").innerText =
        `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function startTimer() {
    if (timer !== null) clearInterval(timer);

    timer = setInterval(() => {
        if (time > 0) {
            time--;
            updateTime();
        } else {
            clearInterval(timer);
            timer = null;
            alert("Time's up! Take a break ☕");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    pauseTimer();
    time = 1500;
    updateTime();
}

updateTime();
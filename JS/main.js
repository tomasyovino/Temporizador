const $timeRemaining = document.querySelector("#timeRemaining"),
    $btnStart = document.querySelector("#btnStart"),
    $btnPause = document.querySelector("#btnPause"),
    $btnStop = document.querySelector("#btnStop"),
    $minutes = document.querySelector("#minutes"),
    $seconds = document.querySelector("#seconds"),
    $inputsContainer = document.querySelector("#inputsContainer");

let idInterval = null,
    timeDifference = 0,
    futureDate = null;

const loadSound = (font) => {
    const sound = document.createElement("audio");
    sound.src = font;
    sound.loop = true;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
}

const sound = loadSound("../Assets/alarm.mp3");
const hideElement = (element) => {
    element.style.display = "none";
}
const showElement = (element) => {
    element.style.display = "";
}

const startTimer = (minutes, seconds) => {
    hideElement($inputsContainer);
    hideElement($btnStart);
    showElement($btnPause);
    hideElement($btnStop);
    if (futureDate) {
        futureDate = new Date(new Date().getTime() + timeDifference);
        timeDifference = 0;
    } else {
        const milliseconds = (seconds + (minutes * 60)) * 1000;
        futureDate = new Date(new Date().getTime() + milliseconds);
    }
    clearInterval(idInterval);
    idInterval = setInterval(() => {
        const timeRemaining = futureDate.getTime() - new Date().getTime();
        if (timeRemaining <= 0) {
            clearInterval(idInterval);
            sound.play();
            hideElement($btnPause);
            showElement($btnStop);
        } else {
            $timeRemaining.textContent = millisecondsToMinutesAndSeconds(timeRemaining);
        }
    }, 50);
}

const pauseTimer = () => {
    hideElement($btnPause);
    showElement($btnStart);
    showElement($btnStop);
    timeDifference = futureDate.getTime() - new Date().getTime();
    clearInterval(idInterval)
}

const stopTimer = () => {
    clearInterval(idInterval);
    futureDate = null;
    timeDifference = 0;
    sound.currentTime = 0;
    sound.pause();
    $timeRemaining.textContent = "00:00.0";
    init();
}

const addZeroIfNeeded = (value) => {
    if (value < 10) {
        return "0" + value;
    } else {
        return "" + value;
    }
}

const millisecondsToMinutesAndSeconds = (milliseconds) => {
    const minutes = parseInt(milliseconds / 1000 / 60);
    milliseconds -= minutes * 60 * 1000;
    seconds = (milliseconds / 1000);
    return `${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(seconds.toFixed(1))}`;
}

const init = () => {
    $minutes.value = "";
    $seconds.value = "";
    showElement($inputsContainer);
    showElement($btnStart);
    hideElement($btnPause);
    hideElement($btnStop);
    if (Number.isNaN(($minutes.valueAsNumber))) {
        $minutes.value = 0;
    }
    if (Number.isNaN(($seconds.valueAsNumber))) {
        $seconds.value = 0;
    }
}

$btnStart.onclick = () => {
    const minutes = parseInt($minutes.value);
    const seconds = parseInt($seconds.value);
    if (isNaN(minutes) || isNaN(seconds) || (seconds <= 0 && minutes <= 0)) {
        return;
    }
    startTimer(minutes, seconds);
}
init();
$btnPause.onclick = pauseTimer;
$btnStop.onclick = stopTimer;
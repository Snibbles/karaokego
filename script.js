let audioPlayer = document.getElementById('audioPlayer');
let lyricsContainer = document.getElementById('lyrics-container');
let scoreCounter = document.getElementById('scoreCounter');
let lyricsData = [
    { time: 0, text: "Music" },
    { time: 20000, text: "We're no strangers to love" },
    { time: 24000, text: "You know the rules and so do I" },
    { time: 28000, text: "A full commitment's what I'm thinking of" },
    { time: 33000, text: "You wouldn't get this from any other guy" },
    { time: 36000, text: "I just wanna tell you how I'm feeling" },
    { time: 41000, text: "Gotta make you understand" },
    { time: 43000, text: "Never gonna give you up" },
    { time: 45000, text: "Never gonna let you down" },
    { time: 47000, text: "Never gonna run around and desert you" },
    { time: 51000, text: "Never gonna make you cry" },
    { time: 54000 , text: "Never gonna say goodbye" },
    { time: 56000, text: "Never gonna tell a lie and hurt you" }
];
let currentLine = 0;
let isPaused = false;
let score = 0;
let scoreTimer;

function startKaraoke() {
    displayLyrics();
    playAudio();
}

function displayLyrics() {
    let intervalId = setInterval(() => {
        let currentTime = Math.floor(audioPlayer.currentTime * 1000);

        while (currentLine < lyricsData.length && lyricsData[currentLine].time <= currentTime) {
            lyricsContainer.textContent = lyricsData[currentLine].text;
            score += 10; // Increase score by 10 for each line displayed
            scoreCounter.textContent = score; // Update score counter
            currentLine++;
        }

        if (currentLine >= lyricsData.length) {
            clearInterval(intervalId);
        }
    }, 100); // Check every 100ms for timing accuracy
}

function playAudio() {
    audioPlayer.play();
}

function pauseKaraoke() {
    audioPlayer.pause();
    isPaused = true;
}

function stopKaraoke() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPaused = false;
    currentLine = 0;
    lyricsContainer.textContent = '';
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            recordedChunks = [];

            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start();

            document.getElementById('recordButton').style.display = 'none';
            document.getElementById('stopRecordButton').style.display = 'inline';
        })
        .catch(error => {
            console.error('Error accessing microphone: ', error);
        });
}

function stopRecording() {
    mediaRecorder.stop();

    document.getElementById('recordButton').style.display = 'none';
    document.getElementById('stopRecordButton').style.display = 'none';
    document.getElementById('playButton').style.display = 'inline';
}   

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function playRecording() {
    const blob = new Blob(recordedChunks, { type: 'audio/webm; codecs=opus' });
    const url = URL.createObjectURL(blob);
    audioPlayer.src = url;

    audioPlayer.play();
    scoreTimer = setInterval(() => {
        score += 10; // Increase score by 10 every 5 seconds
        scoreCounter.textContent = score; // Update score counter
    }, 5000);
}

function pauseRecording() {
    audioPlayer.pause();
    clearInterval(scoreTimer);
}

function shareOnFacebook() {
    const shareData = {
        title: 'Karaoke GO',
        text: 'Check out this awesome karaoke website!',
        url: window.location.href
    };
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    window.open(facebookUrl, '_blank');
}

function shareOnInstagram() {
    alert("Copy the link to share on Instagram: " + window.location.href);
}

function shareOnTiktok() {
    alert("Copy the link to share on TikTok: " + window.location.href);
}
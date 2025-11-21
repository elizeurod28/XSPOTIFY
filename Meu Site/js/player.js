let audio = new Audio();
let isPlaying = false;

function playMusic(url, title, cover) {
    audio.src = url;
    document.getElementById("player-title").innerText = title;
    document.getElementById("player-cover").src = cover;

    audio.play();
    isPlaying = true;

    document.getElementById("play-btn").innerText = "⏸";
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        document.getElementById("play-btn").innerText = "▶";
    } else {
        audio.play();
        document.getElementById("play-btn").innerText = "⏸";
    }

    isPlaying = !isPlaying;
}
onclick="playMusic(url, title, cover)"

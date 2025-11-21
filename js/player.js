function playMusic(url, title, artist) {
    const player = document.getElementById("audio-player");
    const titleBox = document.getElementById("player-title");

    player.src = url;
    player.play();

    titleBox.innerText = `${title} — ${artist}`;
}

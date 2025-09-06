let currentsong = new Audio();
let play = document.getElementById("play");
let currentindex = -1;
let imgs = [];
let forward = document.getElementById("forward");
let backward = document.getElementById("backward");
let shuffle = document.getElementById("shuffle");
let ct = document.getElementById("CT");
let dt = document.getElementById("DT");
let circle = document.querySelector(".circle");
let seekbar = document.querySelector(".seekbar");
let Heart = document.getElementById("heart");

// ---------------------------
// SONG LIST
let Songs = [
    "songs/Humble.mp3",
    "songs/White Ferrari.mp3",
    "songs/Desires.mp3",
    "songs/Luther.mp3",
    "songs/Moonlight.mp3"
];
// ---------------------------

function Playmusic(Song, i) {
    currentsong.src = Song;
    currentsong.play();
    currentindex = i;
}

function Loadmusic(Song, i) {
    currentsong.src = Song;
    currentindex = i;
}

(function main() {
    imgs = Array.from(document.getElementsByClassName("icon-img"));

    Loadmusic(Songs[0], 0);
    imgs[0].src = "assets/play-scroller.png";
    play.src = "assets/play.png";

    // FORWARD BUTTON
    forward.addEventListener("click", () => {
        let nextindex = (currentindex + 1) % Songs.length;
        Playmusic(Songs[nextindex], nextindex);
        imgs.forEach(img => img.src = "assets/play-scroller.png");
        imgs[nextindex].src = "assets/pause-scroller.png";
    });

    // BACKWARD BUTTON
    backward.addEventListener("click", () => {
        let previousindex = (currentindex - 1 + Songs.length) % Songs.length;
        Playmusic(Songs[previousindex], previousindex);
        imgs.forEach(img => img.src = "assets/play-scroller.png");
        imgs[previousindex].src = "assets/pause-scroller.png";
    });

    // SHUFFLE BUTTON
    shuffle.addEventListener("click", () => {
        let r = Math.floor(Math.random() * Songs.length);
        Playmusic(Songs[r], r);
        imgs.forEach(img => img.src = "assets/play-scroller.png");
        imgs[r].src = "assets/pause-scroller.png";
    });

    // SONG ENDED
    currentsong.addEventListener("ended", () => {
        let Forwarding = (currentindex + 1) % Songs.length;
        Playmusic(Songs[Forwarding], Forwarding);
        imgs.forEach(img => img.src = "assets/play-scroller.png");
        imgs[Forwarding].src = "assets/pause-scroller.png";
        play.src = "assets/pause.png";
    });

    // ICON CLICK
    imgs.forEach((e, i) => {
        e.addEventListener("click", () => {
            if (currentsong.paused || currentindex !== i) {
                Playmusic(Songs[i], i);
                imgs.forEach(img => img.src = "assets/play-scroller.png");
                imgs[i].src = "assets/pause-scroller.png";
                play.src = "assets/pause.png";
            } else {
                currentsong.pause();
                imgs[i].src = "assets/play-scroller.png";
                play.src = "assets/play.png";
            }
        });
    });
})();

// PLAY BUTTON
play.addEventListener("click", () => {
    if (currentindex === -1) return;
    if (currentsong.paused) {
        currentsong.play();
        play.src = "assets/pause.png";
        imgs[currentindex].src = "assets/pause-scroller.png";
    } else {
        currentsong.pause();
        play.src = "assets/play.png";
        imgs[currentindex].src = "assets/play-scroller.png";
    }
});

// TIME FORMAT
function formatTime(seconds) {
    seconds = Math.floor(seconds);
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 10) secs = "0" + secs;
    return `${minutes}:${secs}`;
}

let start = 23;
let distance = 52.8;

// CURRENT TIME UPDATE
currentsong.addEventListener("timeupdate", () => {
    ct.innerHTML = formatTime(currentsong.currentTime);
    circle.style.left = start + (currentsong.currentTime / currentsong.duration) * distance + "%";
});

// DURATION UPDATE
currentsong.addEventListener("loadedmetadata", () => {
    dt.innerHTML = formatTime(currentsong.duration);
});

// SEEKBAR CLICK
seekbar.addEventListener("click", (e) => {
    let Percent = e.offsetX / e.target.getBoundingClientRect().width;
    currentsong.currentTime = currentsong.duration * Percent;
    circle.style.left = start + Percent * distance + "%";
});

// HEART CLICK
Heart.addEventListener("click", () => {
    if (Heart.src.includes("Blackheart.png")) {
        Heart.src = "assets/Redheart.png";
    } else {
        Heart.src = "assets/Blackheart.png";
    }
});


// ADDING CLASSES THROUGH JS....
let Element1 = document.querySelector(".main-footer")
Element1.classList.add("flex")
// Kártyákat tartalmazó tömb deklarálása
let cardArray = [
    { name: "blue", img: "images/blue.png", },
    { name: "blue", img: "images/blue.png", },
    { name: "cry", img: "images/cry.png", },
    { name: "cry", img: "images/cry.png", },
    { name: "heart", img: "images/heart.png", },
    { name: "heart", img: "images/heart.png", },
    { name: "leaf", img: "images/leaf.png", },
    { name: "leaf", img: "images/leaf.png", },
    { name: "smile", img: "images/smile.png", },
    { name: "smile", img: "images/smile.png", },
    { name: "wow", img: "images/wow.png", },
    { name: "wow", img: "images/wow.png", },
];

// Változók deklarálása
let grid = document.querySelector(".grid");
let scoreBoard = document.querySelector(".scoreBoard");
let timerBoard = document.querySelector(".timerBoard");
let popup = document.querySelector(".popup");
let person;
let playAgain = document.querySelector(".playAgain");
let list = $('#list');
let imgs;
let cardsId = [];
let cardsSelected = [];
let cardsWon = 0;
let cardNum = 0;
let mySound = document.getElementById("sound");
let win = document.getElementById("win");
let seconds = 0;
let minutes = 0;
let hours = 0;
let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;
let fulltime;
let id = 0;

// Zene hangereje
let audio = document.getElementById("myAudio");
audio.play()
audio.currentTime = null
audio.volume = 0.1;

// Játéktér deklarálása
function createBoard(grid, cardArray) {
    for (let i = 0; i < cardArray.length; i++) {
        let img = document.createElement("img");
        img.setAttribute("src", "images/blank.png");
        img.setAttribute("data-id", i);
        grid.appendChild(img);
    }
}

// Kártyák random lehelyezése
function arrangeCard() {
    cardArray.sort(() => 0.5 - Math.random())
}

// Kártyák felfordítása
function flipCard() {
    let selected = this.dataset.id;
    cardsSelected.push(cardArray[selected].name);
    cardsId.push(selected);
    this.classList.add("flip");
    this.setAttribute("src", cardArray[selected].img);

    if (cardsId.length === 2) {
        setTimeout(checkForMatch, 1000);
    }
}

// Azonosság vizsgálata
function checkForMatch() {
    let imgs = document.querySelectorAll("img");
    let firstCard = cardsId[0];
    let secondCard = cardsId[1];

    if (cardsSelected[0] === cardsSelected[1] && firstCard !== secondCard) {
        mySound.play();
        cardNum += 1;
        cardsWon += 100;
        scoreBoard.innerHTML = cardsWon;
        setTimeout(checkWon,500);
    }

    else {
        imgs[firstCard].setAttribute("src", "images/blank.png");
        imgs[secondCard].setAttribute("src", "images/blank.png"); imgs[firstCard].classList.remove("flip"); imgs[secondCard].classList.remove("flip");
        if (cardsWon >= 10) {
            cardsWon -= 10;
            scoreBoard.innerHTML = cardsWon;
        }
    }
    cardsSelected = [];
    cardsId = [];
}

// Győzelem vizsgálata
function checkWon() {
    if (cardNum === cardArray.length / 2) {
        person = prompt("You won!\n\n" + "Please enter your name!");
        setTimeout(()=> popup.style.display = "flex" ,300);
        localStorage.setItem(person, cardsWon);

        // Feltöltjük a toplistát
        fill_toplist();
        win.play();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Pálya kirajzolása, randomizálása
    createBoard(grid, cardArray);
    arrangeCard();
    playAgain.addEventListener("click", replay);

    // Kattintás funkció hozzáadása a képekhez
    imgs = document.querySelectorAll("img");
    Array.from(imgs).forEach(img =>
        img.addEventListener("click", flipCard)
    )
});

// Toplista feltöltése
function fill_toplist() {
    // Végigmegyünk a localStorage mentett elemein és egy új tömbbe pakoljuk
    let data = [];
    for (let i = 0; i < localStorage.length; i++) {
        data[i] = [localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i)))];
    }
    // Csökkenő sorrendbe rendezzük az elemeket az elért pontszám alapján
    data.sort(function (a, b) {
        return b[1] - a[1];
    });
    // Az 5 legtöbb pontot elért jatékost jelezzük ki a listán
    for (let act_data of data.keys()) {
        id++;
        if (act_data < 5) {
            list.append(id + ' - ' + data[act_data][0] + ' - ' + data[act_data][1] + '<br><hr width="50%">');
        }
    }
}

// Időzítő függvénye
function stopWatch() {
    seconds++;

    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;

        if (minutes / 60 === 1) {
            minutes = 0;
            hours++;
        }
    }

    if (seconds < 10){
        displaySeconds = "0" + seconds.toString();
    }
    else {
        displaySeconds = seconds;
    }
    if (minutes < 10){
        displayMinutes = "0" + minutes.toString();
    }
    else {
        displayMinutes = minutes;
    }
    if (hours < 10){
        displayHours = "0" + hours.toString();
    }
    else {
        displayHours = hours;
    }

    fulltime = displayHours.toString() + ":" + displayMinutes.toString() + ":" + displaySeconds.toString();

    timerBoard.innerHTML = fulltime;
}
window.setInterval(stopWatch, 1000);

// Újrajátszás függvénye
function replay() {
    arrangeCard();
    grid.innerHTML = "";
    createBoard(grid, cardArray);
    cardsWon = 0;
    scoreBoard.innerHTML = 0;
    popup.style.display = "none";
}
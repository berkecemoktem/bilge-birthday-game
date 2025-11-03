const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

// Fail popup elements
const failPopup = document.getElementById("fail-popup");
const failRestartBtn = document.getElementById("fail-restart-btn");
const failImage = document.getElementById("fail-image");

// Success popup elements
const successPopup = document.getElementById("success-popup");
const successMessage = document.getElementById("success-message");
const successRestartBtn = document.getElementById("success-restart-btn");
const successImage = document.getElementById("success-image");

let moves = 0;
let flippedCards = [];
let matchedCount = 0;
let gameOver = false;

// 12 pairs of images (24 cards) + 1 "X" card = 25 total
let images = [...Array(12).keys()].flatMap(n => [`bilge${n + 1}`, `bilge${n + 1}`]);
images.push("X"); // Game Over card
images.sort(() => Math.random() - 0.5); // Shuffle

function createBoard() {
  board.innerHTML = "";
  moves = 0;
  matchedCount = 0;
  flippedCards = [];
  gameOver = false;
  scoreDisplay.textContent = "Moves: 0";
  
  // Hide both popups
  failPopup.classList.add("hidden");
  failPopup.classList.remove("show");
  successPopup.classList.add("hidden");
  successPopup.classList.remove("show");

  images.sort(() => Math.random() - 0.5);

  images.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = img;
    card.addEventListener("click", handleFlip);
    board.appendChild(card);
  });
}

function handleFlip(e) {
  if (gameOver) return; // Prevent actions after game ends

  const card = e.target;

  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flippedCards.length === 2
  ) return;

  // Show the image or X
if (card.dataset.image === "X") {
  card.textContent = "X";
  card.style.fontSize = "3em";
} else {
  const img = document.createElement("img");
  img.src = `assets/${card.dataset.image}.jpeg`;
  img.alt = card.dataset.image;
  card.innerHTML = ""; // Clear any text first
  card.appendChild(img);
}
  
  card.classList.add("flipped");
  flippedCards.push(card);

  // If "X" card is flipped → game over immediately
  if (card.dataset.image === "X") {
    card.style.backgroundColor = "#ff0000";
    card.style.color = "white";
    setTimeout(() => showFailPopup(), 600);
    return;
  }

  if (flippedCards.length === 2) {
    moves++;
    scoreDisplay.textContent = `Moves: ${moves}`;
    const [first, second] = flippedCards;

    if (first.dataset.image === second.dataset.image) {
      first.classList.add("matched");
      second.classList.add("matched");
      flippedCards = [];
      matchedCount += 2;

      if (matchedCount === images.length - 1) { // exclude X
        setTimeout(() => showSuccessPopup(), 800);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          if (card.dataset.image !== "X") {
            card.classList.remove("flipped");
            card.innerHTML = ""; // Clear the image
          }
        });
        flippedCards = [];
      }, 1500);
    }
  }
}

// Show FAIL popup
function showFailPopup() {
  gameOver = true;
  failPopup.classList.remove("hidden");
  setTimeout(() => failPopup.classList.add("show"), 10);
}

// 🎉 Show SUCCESS popup
function showSuccessPopup() {
  gameOver = true;
  successMessage.innerHTML = `🎂 Amazing! You matched all pairs<br>in just <strong>${moves}</strong> moves! 🎂`;
  successPopup.classList.remove("hidden");
  setTimeout(() => successPopup.classList.add("show"), 10);
}

// Restart button handlers
failRestartBtn.addEventListener("click", () => {
  failPopup.classList.remove("show");
  setTimeout(createBoard, 300);
});

successRestartBtn.addEventListener("click", () => {
  successPopup.classList.remove("show");
  setTimeout(createBoard, 300);
});

// TESTING ONLY - Reveal all cards (press R key)
document.addEventListener('keydown', function(e) {
  if (e.key === 'r' || e.key === 'R') {
    document.querySelectorAll('.card').forEach(card => {
      if (!card.classList.contains('matched')) {
        if (card.dataset.image === 'X') {
          card.textContent = 'X';
          card.style.backgroundColor = '#ff6b6b';
          card.style.fontSize = '2em';
        } else {
          const img = document.createElement("img");
          img.src = `assets/${card.dataset.image}.jpeg`;
          img.alt = card.dataset.image;
          card.appendChild(img);
        }
      }
    });
  }
});

createBoard();
// 🎵 Sounds
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

// 🎮 Game State
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let gameMode = ""; // single / double

// 🏆 Score
let scoreX = 0;
let scoreO = 0;

// 📦 DOM Elements
const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const modePopup = document.getElementById("modePopup");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");

// 🧠 Winning Patterns
const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// 🚀 Start Game
function startGame(mode) {
  gameMode = mode;
  modePopup.style.display = "none";
  resetBoard();
  gameActive = true;
  statusText.textContent = "Player X's Turn";
}

// 🖱️ Cell Click
cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, "X");

  // 🤖 AI Move
  if (gameMode === "single" && gameActive) {
    setTimeout(computerMove, 400);
  }
}

// 🎯 Make Move
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  clickSound.play();
  vibrate(50);

  const result = checkGameState();

  if (result === "win") {
    gameActive = false;

    highlightWin();

    winSound.play();
    vibrate(200);

    if (player === "X") {
      scoreX++;
      scoreXText.textContent = scoreX;
    } else {
      scoreO++;
      scoreOText.textContent = scoreO;
    }

    showPopup(`🎉 Player ${player} Wins!`);
    return;
  }

  if (result === "draw") {
    gameActive = false;

    drawSound.play();
    vibrate([100, 50, 100]);

    showPopup("🤝 Game Draw!");
    return;
  }

  // 🔁 Switch Turn
  currentPlayer = player === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// 🧠 Check Game State
function checkGameState() {
  for (let [a,b,c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return "win";
    }
  }

  if (!board.includes("")) {
    return "draw";
  }

  return "continue";
}

// 🤖 Smart AI (Minimax)
function computerMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  makeMove(move, "O");
}

// 🧠 Minimax Algorithm
function minimax(board, depth, isMaximizing) {
  let result = checkWinnerMini(board);

  if (result !== null) {
    const scores = {
      "O": 10,
      "X": -10,
      "draw": 0
    };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }

    return bestScore;
  }
}

// 🧠 Winner Check for AI
function checkWinnerMini(board) {
  for (let [a,b,c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes("")) return "draw";

  return null;
}

// ✨ Highlight Winning Cells
function highlightWin() {
  for (let [a,b,c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");
    }
  }
}

// 📳 Vibration
function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// 📢 Show Popup
function showPopup(message) {
  popupText.textContent = message;
  popup.style.display = "flex";
}

// 🔄 Reset Board
function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
}

// 🔁 New Game
function newGame() {
  resetBoard();
  gameActive = true;
  popup.style.display = "none";
  statusText.textContent = "Player X's Turn";
}
function User(name, marker) {
  return { name, marker };
}

const player1 = {};
const player2 = {};

const turnHandler = (function () {
  let turn = player1.marker;
  function setTurn() {
    if (turn == player1.marker) {
      turn = player2.marker;
    } else {
      turn = player1.marker;
    }
  }
  function getTurn() {
    return turn;
  }
  function reset() {
    turn = player1.marker;
  }
  return { setTurn, getTurn, reset };
})();

const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];
  const winningPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const markBoard = function (marker, position) {
    if (gameController.isGameOver()) {
      return;
    }
    if (marker == turnHandler.getTurn() && board[position] == "") {
      board[position] = marker;
      turnHandler.setTurn();
    } else {
      throw Error("can not add the maker to board successfully!");
    }
    flowOfTheGame();
  };
  const resetBoard = function () {
    board.forEach((_, i) => {
      board[i] = "";
    });
  };

  const fullBoard = function () {
    return board.every((n) => n != "");
  };
  const winnerBoard = function () {
    for (let pattern of winningPattern) {
      let [a, b, c] = pattern;
      if (
        board[a] == player1.marker &&
        board[a] == board[b] &&
        board[b] == board[c]
      ) {
        return player1.marker;
      } else if (
        board[a] == player2.marker &&
        board[a] == board[b] &&
        board[b] == board[c]
      ) {
        return player2.marker;
      }
    }
    if (fullBoard()) {
      return "tie";
    }
  };
  return {
    markBoard,
    resetBoard,
    fullBoard,
    winnerBoard,
  };
})();

function flowOfTheGame() {
  const winnerCheck = gameBoard.winnerBoard();
  if (winnerCheck == player1.marker) {
    announcementControl.updateAnnouncement(
      `${player1.name} has won the game!!`
    );
    displayAnnouncement();
    scoreController.addScore(player1.marker);
    gameController.setGameOver();
  } else if (winnerCheck == player2.marker) {
    announcementControl.updateAnnouncement(
      `${player2.name} has won the game!!`
    );
    displayAnnouncement();
    scoreController.addScore(player2.marker);
    gameController.setGameOver();
  } else if (winnerCheck == "tie") {
    announcementControl.updateAnnouncement("Tie!!!");
    displayAnnouncement();
    gameController.setGameOver();
  }
}

const gameController = (function () {
  let gameOver = false;

  const isGameOver = () => gameOver;
  const setGameOver = () => (gameOver = true);
  const resetGameOver = () => (gameOver = false);

  return {
    isGameOver,
    setGameOver,
    resetGameOver,
  };
})();

const announcementControl = (function () {
  let announcement = "";
  const getAnnouncement = () => announcement;
  const updateAnnouncement = function (text) {
    announcement = text;
  };
  return {
    getAnnouncement,
    updateAnnouncement,
  };
})();

const scoreController = (function () {
  let p1score = 0;
  let p2score = 0;
  function addScore(value) {
    return value == player1.marker ? p1score++ : p2score++;
  }
  function getScore() {
    return { p1score, p2score };
  }
  return { addScore, getScore };
})();

// form
function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}
const form = document.querySelector("form");
const cells = document.querySelectorAll(".cell");
const announcementBox = document.querySelector(".announcement");
const scoreBox = document.querySelector(".score");
const gameContainer = document.querySelector(".game-container");
gameContainer.style.display = "none";
addGlobalEventListener("submit", "form", (e) => {
  e.preventDefault();
  player1.name = form.p1name.value;
  player2.name = form.p2name.value;
  player1.marker = form.marker.value;
  player2.marker = player1.marker == "X" ? "O" : "X";
  gameContainer.style.display = "flex";
  form.style.display = "none";
  turnHandler.setTurn();
  announcementControl.updateAnnouncement(
    `Welcome ${player1.name} and ${player2.name}`
  );
  displayAnnouncement();
  displayScore();
});

function displayAnnouncement() {
  announcementBox.innerText =
    announcementControl.getAnnouncement() != null
      ? announcementControl.getAnnouncement()
      : "";
  setTimeout(() => {
    announcementBox.innerText = "";
  }, 2000);
}

function displayScore() {
  values = scoreController.getScore();
  scoreBox.innerText = `${player1.name} ${values.p1score} : ${values.p2score} ${player2.name} `;
}

addGlobalEventListener("click", ".cell", (e) => {
  if (gameController.isGameOver()) {
    return;
  }
  classList = e.target.classList;
  currentTurn = turnHandler.getTurn();
  gameBoard.markBoard(turnHandler.getTurn(), classList[1]);
  e.target.innerHTML =
    currentTurn == "X"
      ? '<span class="x">X</span>'
      : '<span class="o">O</span>';
});

function restart() {
  turnHandler.reset();
  gameBoard.resetBoard();
  gameController.resetGameOver();
  cells.forEach((cell) => (cell.innerHTML = ""));
}

addGlobalEventListener("click", ".restart", () => {
  restart();
});

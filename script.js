function User(name, marker) {
  return { name, marker };
}

const player1 = {};
const player2 = {};

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
  let turn = player1.marker;
  const markBoard = function (marker, position) {
    if (gameController.isGameOver()) {
      console.log("Game is already over!");
      return;
    }
    if (marker == turn && board[position] == "") {
      board[position] = marker;
      if (marker == player1.marker) {
        turn = player2.marker;
      } else {
        turn = player1.marker;
      }
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

  const showBoard = function () {
    console.log(board);
  };
  const winnerBoard = function () {
    for (pattern of winningPattern) {
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
    showBoard,
    winnerBoard,
  };
})();

function flowOfTheGame() {
  let Announcement = "";
  const winnerCheck = gameBoard.winnerBoard();
  if (winnerCheck == player1.marker) {
    gameBoard.showBoard();
    Announcement = `${player1.name} has won the game!!`;
    gameController.setGameOver();
  } else if (winnerCheck == player2.marker) {
    gameBoard.showBoard();
    Announcement = `${player2.name} has won the game!!`;
    gameController.setGameOver();
  } else if (winnerCheck == "tie") {
    gameBoard.showBoard();
    Announcement = `Tie!`;
    gameController.setGameOver();
  }
  gameBoard.showBoard();
  console.log(Announcement);
}

const gameController = (function () {
  let gameOver = false;

  const isGameOver = () => gameOver;
  const setGameOver = () => (gameOver = true);
  const resetGameOver = () => (gameOver = false);

  return { isGameOver, setGameOver, resetGameOver };
})();

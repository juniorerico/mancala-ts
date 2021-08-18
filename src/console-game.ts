// Implementação teste só pra testar o código..

import { Board } from "./lib/Board";
import { bestMove } from "./lib/minimax";

console.log("Mancala game");
console.log("Creating board...");

var stdin = process.openStdin();
let board = new Board();
board.currentPlayer = board.players[1];

console.log("You play first!");
board.print();

console.log("Select a hole index to play: ");

stdin.addListener("data", function (data: Buffer) {
  checkGameOver();

  console.log("you played: [" + data.toString().trim() + "]");

  let move = parseInt(data.toString().trim());
  if (board.isMoveValid(board.players[1], move)) {
    board.makeMove(move);
    board.print();

    checkGameOver();

    console.log("\n\nAI is playing...");
    bestMove(board).then((move) => {
      board.makeMove(move);

      console.log("\nAI played: [" + move + "]");
      board.print();

      checkGameOver();

      console.log("Select a hole index to play: ");
    });
  } else {
    console.log("Move not valid. Do another one: ");
    board.print();
  }
});

function checkGameOver() {
  if (board.isGameOver()) {
    let winner = board.scores[0] > board.scores[1] ? 0 : 1;
    console.log("Game is over! Player " + winner + " wins! ");
    process.exit();
  }
}

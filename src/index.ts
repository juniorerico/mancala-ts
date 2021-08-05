import { Board } from "./Board";

let b = new Board();
b.currentPlayer = b.players[1];
b.makeMove(2);
b.makeMove(2);
b.makeMove(5);
b.makeMove(1);
b.makeMove(4);
b.makeMove(0);
b.makeMove(3);
b.print();

console.log(b.getPossibleMoves(b.players[0]));

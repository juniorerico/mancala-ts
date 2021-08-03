import { Board } from "./Board";

let b = new Board();
b.print();

console.log(b.getPossibleMoves(b.players[0]));

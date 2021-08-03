import { Board } from "../src/Board";

test("initial board should contain 6 possibles moves", () => {
  let board = new Board();

  let possibleMoves: number[] = board.getPossibleMoves(board.players[0]);
  expect(possibleMoves).toHaveLength(6);
  expect(possibleMoves).toEqual(expect.arrayContaining([0, 1, 2, 3, 4, 5]));
});

test("holes with 1 stone are not playable if there holes with more than 1 stone", () => {
  let board = new Board();

  board.holes[0] = [
    { stones: 0 },
    { stones: 1 },
    { stones: 2 },
    { stones: 7 },
    { stones: 1 },
    { stones: 0 },
  ];

  let possibleMoves: number[] = board.getPossibleMoves(board.players[0]);

  expect(possibleMoves).toHaveLength(2);
  expect(possibleMoves).toEqual(expect.arrayContaining([2, 3]));
});

test("holes with 1 stone are playable if other holes contain 0 or 1 stone", () => {
  let board = new Board();

  board.holes[0] = [
    { stones: 0 },
    { stones: 1 },
    { stones: 1 },
    { stones: 1 },
    { stones: 0 },
    { stones: 1 },
  ];

  let possibleMoves: number[] = board.getPossibleMoves(board.players[0]);

  expect(possibleMoves).toHaveLength(4);
  expect(possibleMoves).toEqual(expect.arrayContaining([1, 2, 3, 5]));
});

test("if all holes are empty, there is no possible move", () => {
  let board = new Board();

  board.holes[0] = [
    { stones: 0 },
    { stones: 0 },
    { stones: 0 },
    { stones: 0 },
    { stones: 0 },
    { stones: 0 },
  ];

  let possibleMoves: number[] = board.getPossibleMoves(board.players[0]);

  expect(possibleMoves).toHaveLength(0);
});

test("try to get possible moves for a invalid user should throw an exception", () => {
  let board = new Board();
  expect(() => {
    board.getPossibleMoves({ name: "invalid" });
  }).toThrowError(Error);
});

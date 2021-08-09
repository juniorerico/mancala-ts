import { Board } from "../../lib/Board";

// 'makeMove' tests
describe("makeMove should distribute the stones to the other holes in a counter clockwise order", () => {
  describe.each([
    {
      playerIndex: 0,
      holeIndex: 5,
      expectedHoleState: [
        [4, 5, 5, 5, 5, 0],
        [4, 4, 4, 4, 4, 4],
      ],
    },
    {
      playerIndex: 0,
      holeIndex: 1,
      expectedHoleState: [
        [5, 0, 4, 4, 4, 4],
        [5, 5, 5, 4, 4, 4],
      ],
    },
    {
      playerIndex: 1,
      holeIndex: 0,
      expectedHoleState: [
        [4, 4, 4, 4, 4, 4],
        [0, 5, 5, 5, 5, 4],
      ],
    },
    {
      playerIndex: 1,
      holeIndex: 4,
      expectedHoleState: [
        [4, 4, 4, 5, 5, 5],
        [4, 4, 4, 4, 0, 5],
      ],
    },
  ])("makeMove($holeIndex) as the player $playerIndex on initial board", ({ playerIndex, holeIndex, expectedHoleState }) => {
    test(`will leave the board as [${expectedHoleState}]`, () => {
      let board = new Board();

      board.currentPlayer = board.players[playerIndex];
      board.makeMove(holeIndex);

      // convert the Hole array to an array of numbers. To be easy to compare
      let currentHoleState = board.holes.map((row) => row.map((hole) => hole.stones));

      expect(currentHoleState).toEqual(expect.arrayContaining(expectedHoleState));

      expect(board.scores).toEqual(expect.arrayContaining([0, 0]));
    });
  });

  test("makeMove should switch the current player", () => {
    let board = new Board();

    expect(board.currentPlayer).toEqual(board.players[0]);
    board.makeMove(2);
    expect(board.currentPlayer).toEqual(board.players[1]);
    board.makeMove(2);
    expect(board.currentPlayer).toEqual(board.players[0]);
  });

  test("trying to make an invalid move should throw an expection", () => {
    let board = new Board();
    expect(() => {
      board.makeMove(6);
    }).toThrowError(Error);
  });

  describe("make a move should score if the last hole has 2 or 3 stones", () => {
    test("player 1 score 1 point after a sequence of moves", () => {
      let board = new Board();

      board.makeMove(2); // player 0
      board.makeMove(2); // player 1
      board.makeMove(5); // player 0
      board.makeMove(1); // player 1
      board.makeMove(4); // player 0
      board.makeMove(0); // player 1

      expect(board.scores).toEqual(expect.arrayContaining([0, 2]));
    });

    test("player 0 scores 5 point after player 1 score 2 points a sequence of moves", () => {
      let board = new Board();

      board.makeMove(2); // player 0
      board.makeMove(2); // player 1
      board.makeMove(5); // player 0
      board.makeMove(1); // player 1
      board.makeMove(4); // player 0
      board.makeMove(0); // player 1 scores 1 point
      board.makeMove(3); // player 0 scores 5 points

      expect(board.scores).toEqual(expect.arrayContaining([5, 2]));
    });
  });
});

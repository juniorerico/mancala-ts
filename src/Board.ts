const INITIAL_STONES_PER_HOLE = 4;
const NUM_PLAYERS = 2;
const NUM_HOLES_PER_PLAYER = 6;

interface Player {
  name: string;
}

interface Hole {
  stones: number;
}

export class Board {
  holes: Hole[][] = [];
  players: Player[];
  currentPlayer: Player;
  scores: number[] = [0, 0];

  constructor() {
    this.players = [{ name: "p1" }, { name: "p2" }];
    this.currentPlayer = this.players[0];
    this.resetBoard();
  }

  private resetBoard() {
    this.scores = [0, 0];
    this.holes = [[], []];

    for (let row = 0; row < NUM_PLAYERS; row++) {
      for (let col = 0; col < NUM_HOLES_PER_PLAYER; col++) {
        this.holes[row][col] = { stones: INITIAL_STONES_PER_HOLE };
      }
    }
  }

  makeMove(holeIndex: number) {
    let possibleMoves: number[] = this.getPossibleMoves(this.currentPlayer);

    if (possibleMoves.indexOf(holeIndex) == -1) {
      throw new Error(
        "Can't make a move. This it not a valid move for this user."
      );
    }
  }

  getPossibleMoves(player: Player) {
    let playerIndex = this.players.indexOf(player);

    if (playerIndex == -1) {
      throw new Error("Can't get possible moves. Player not found.'");
    }

    let playerHoles: Hole[] = this.holes[playerIndex];
    let possibleIndexes: number[] = [];
    let holesWithMoreThanOneStone: number = playerHoles.filter(
      (hole) => hole.stones > 1
    ).length;

    playerHoles.forEach((hole, holeIndex) => {
      if (hole.stones > 0) {
        if (
          hole.stones > 1 ||
          (hole.stones == 1 && holesWithMoreThanOneStone == 0)
        )
          possibleIndexes.push(holeIndex);
      }
    });

    return possibleIndexes;
  }

  print() {
    console.table(this.holes.map((hole) => hole.map((h) => h.stones)));
    console.log("Player 1: " + this.scores[0]);
    console.log("Player 2: " + this.scores[1]);
  }
}

const INITIAL_STONES_PER_HOLE = 4;
const NUM_PLAYERS = 2;
const NUM_HOLES_PER_PLAYER = 6;

/**
 * Player object contract
 */
export interface Player {
  name: string;
}

/**
 * Hole object contract
 */
export interface Hole {
  stones: number;
  row: number;
  col: number;
}

/**
 * Class that represents a board
 */
export class Board {
  holes: Hole[][];
  players: Player[];
  currentPlayer: Player;
  scores: number[];

  constructor() {
    this.players = [{ name: "COMPUTER" }, { name: "HUMAN" }];
    this.holes = [[], []];
    this.scores = [0, 0];
    this.currentPlayer = this.players[0];

    this.resetBoard();
  }

  /**
   * Reset the board to the initial state
   */
  private resetBoard() {
    this.scores = [0, 0];
    this.holes = [[], []];

    for (let row = 0; row < NUM_PLAYERS; row++) {
      for (let col = 0; col < NUM_HOLES_PER_PLAYER; col++) {
        this.holes[row][col] = {
          stones: INITIAL_STONES_PER_HOLE,
          row,
          col,
        };
      }
    }
  }

  /**
   * Make a move in the board. If the move is not valid, an exception is thrown.
   *
   * @param holeIndex Column where the hole is.
   * @throws Error
   */
  makeMove(holeIndex: number) {
    if (!this.isMoveValid(this.currentPlayer, holeIndex)) {
      throw new Error(
        `Can't make a move. Move '${holeIndex}' is not valid for the current player (${
          this.currentPlayer.name
        }). Available moves: ${this.getPossibleMoves(this.currentPlayer)}`
      );
    }

    let playerIndex = this.players.indexOf(this.currentPlayer);
    let currentHole = this.holes[playerIndex][holeIndex];

    currentHole = this.distributeStones(currentHole);

    // count the scores
    while ((currentHole.stones === 2 || currentHole.stones === 3) && currentHole.row !== playerIndex) {
      // increase the user's score
      this.scores[playerIndex] += currentHole.stones;
      currentHole.stones = 0;

      // move clockwise to check if other holes also score
      if (currentHole.row === 0) {
        if (currentHole.col < 5) {
          currentHole = this.holes[currentHole.row][currentHole.col + 1];
        } else {
          currentHole = this.holes[1][currentHole.col];
        }
      } else {
        if (currentHole.col > 0) {
          currentHole = this.holes[currentHole.row][currentHole.col - 1];
        } else {
          currentHole = this.holes[0][currentHole.col];
        }
      }
    }

    // switch the current player
    this.currentPlayer = playerIndex === 0 ? this.players[1] : this.players[0];
  }

  /**
   *
   * @param currentHole current selected hole
   * @returns the current hole where the distribution stopped
   */
  private distributeStones(currentHole: Hole): Hole {
    let stones = currentHole.stones;

    // remove the stones of the selected hole
    currentHole.stones = 0;

    // move clockwise dropping stone in each hole
    for (let i = 0; i < stones; i++) {
      if (currentHole.row === 0) {
        if (currentHole.col > 0) {
          currentHole = this.holes[currentHole.row][currentHole.col - 1];
        } else {
          currentHole = this.holes[1][currentHole.col];
        }
      } else {
        if (currentHole.col < 5) {
          currentHole = this.holes[currentHole.row][currentHole.col + 1];
        } else {
          currentHole = this.holes[0][currentHole.col];
        }
      }
      currentHole.stones += 1;
    }

    return currentHole;
  }

  /**
   * Check if a move is valid for a given player.
   *
   * @param player
   * @param holeIndex
   * @returns
   */
  isMoveValid(player: Player, holeIndex: number): boolean {
    let possibleMoves: number[] = this.getPossibleMoves(this.currentPlayer);
    return possibleMoves.includes(holeIndex);
  }

  /**
   * Check if the game is over
   */
  isGameOver(): boolean {
    if (this.scores[0] >= 24 || this.scores[1] >= 24 || this.getPossibleMoves(this.currentPlayer).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getWinner(): number | null {
    if (!this.isGameOver()) {
      return null;
    } else if (this.scores[0] > this.scores[1]) {
      return 0;
    } else {
      return 1;
    }
  }

  /**
   * Get possible moves for a given player
   * @param player
   * @returns
   */
  getPossibleMoves(player: Player) {
    let playerIndex = this.players.indexOf(player);

    if (playerIndex === -1) {
      throw new Error("Can't get possible moves. Player not found.'");
    }

    let playerHoles: Hole[] = this.holes[playerIndex];
    let possibleIndexes: number[] = [];
    let holesWithMoreThanOneStone: number = playerHoles.filter((hole) => hole.stones > 1).length;

    playerHoles.forEach((hole, holeIndex) => {
      if (hole.stones > 0) {
        if (hole.stones > 1 || (hole.stones === 1 && holesWithMoreThanOneStone === 0)) possibleIndexes.push(holeIndex);
      }
    });

    return possibleIndexes;
  }

  print() {
    console.table(this.holes.map((row) => row.map((hole) => hole.stones)));
    console.log("Player 1: " + this.scores[0]);
    console.log("Player 2: " + this.scores[1]);
  }
}

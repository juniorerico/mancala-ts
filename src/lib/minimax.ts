import { Board } from "./Board";
var _ = require("lodash");

/**
 * Find the best move for a given board.
 *
 * @param board the current board
 * @param maxDepth max depth the algoritgm is going to search
 * @returns the best move
 */
export function bestMove(board: Board, maxDepth: number = 6): number {
  let bestScore = -Infinity;
  let move = board.getPossibleMoves(board.currentPlayer)[0];
  let possibleMoves = board.getPossibleMoves(board.currentPlayer);

  shuffleArray(possibleMoves).forEach((m) => {
    let newBoard: Board = _.cloneDeep(board);
    newBoard.makeMove(m);
    let score = minimax(newBoard, maxDepth, true, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      move = m;
    }
  });

  return move;
}

/**
 * Shuffle an array elements. This method modifies the current array.
 *
 * @param array
 * @returns
 */
function shuffleArray(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Where the magic happens..
 *
 * @param board
 * @param depth
 * @param maximizingPlayer
 * @param alpha
 * @param beta
 * @returns
 */
function minimax(board: Board, depth: number, maximizingPlayer: boolean, alpha: number = -Infinity, beta: number = Infinity): number {
  if (depth == 0 || board.isGameOver()) {
    return board.scores[0] - board.scores[1];
  }

  if (maximizingPlayer) {
    let maxScore = -Infinity;

    for (const move of shuffleArray(board.getPossibleMoves(board.currentPlayer))) {
      let newBoard: Board = _.cloneDeep(board);
      newBoard.makeMove(move);

      let score = minimax(newBoard, depth - 1, false, alpha, beta);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break;
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;

    for (const move of shuffleArray(board.getPossibleMoves(board.currentPlayer))) {
      let newBoard: Board = _.cloneDeep(board);
      newBoard.makeMove(move);

      let score = minimax(newBoard, depth - 1, false, alpha, beta);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break;
      }
    }
    return minScore;
  }
}

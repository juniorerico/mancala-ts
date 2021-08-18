export const IMAGE_SCALE = 0.97; // %
export const ANIMATION_DELAY = 150; //ms
export const STONES_PER_HOLE = 4;
export const BOARD_ROWS = 2;
export const BOARD_COLS = 6;
export const STONE_SIZE = 0.028; // % of window width

export const Constants = {
  IMAGE_SCALE: 0.97, // %
  ANIMATION_DELAY: 250, //ms
  STONES_PER_HOLE: 4,
  BOARD_ROWS: 2,
  BOARD_COLS: 6,
  STONE_SIZE: 0.028, // % of window width
} as const;

export enum StoneColors {
  RED = "#e6475c",
  GREEN = "#5c9f56",
  BLUE = "#738ab0",
  YELLOW = "#ffbe40",
}

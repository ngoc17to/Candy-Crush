export let CONST = {
    score: 0,
    highscore: 0,
    boardTileSize: 0,
    gridWidth: 8,
    gridHeight: 10,
    tileWidth: 48,
    tileHeight: 48,
    swapSpeed: 200,
    destroySpeed: 100,
    fallSpeed: 200,
    TRANSITION_DELAY: 8000,
    HINT_APPEAR: 5000,
    candyTypes: [
        'blueItem',
        'greenItem',
        'redItem',
        'purpleItem',
        'yellowItem',
        'pinkItem',
    ],
    GRID_OFFSET_X: 0,
    GRID_OFFSET_Y: 0,
    backgroundWidth: 0,
    backgroundHeight: 0,
    backgroundX: 0,
    backgroundY: 0,
};

export const explodeFrameMap: { [key: string]: string } = {
    'blueItem': 'blueExplode',
    'greenItem': 'greenExplode',
    'redItem': 'redExplode',
    'purpleItem': 'purpleExplode',
    'yellowItem': 'yellowExplode',
    'pinkItem': 'pinkExplode',
};

// Tính offset 
export function calculateOffsets(screenWidth: number, screenHeight: number) {
    const BOARD_WIDTH = 532;
    const BOARD_HEIGHT = 660;
    const BOARD_SCALE = 0.75;
    const BOARD_POS_X = screenWidth / 2;
    const BOARD_POS_Y = screenHeight * 3 / 5;

    // Tính toán kích thước của board sau khi scale
    const scaledBoardWidth = BOARD_WIDTH * BOARD_SCALE;
    const scaledBoardHeight = BOARD_HEIGHT * BOARD_SCALE;

    // Tính toán vị trí bắt đầu của board (tính đến điểm gốc của nó nằm ở giữa)
    const boardStartX = BOARD_POS_X - (scaledBoardWidth / 2);
    const boardStartY = BOARD_POS_Y - (scaledBoardHeight / 2);

    // Tính toán offset để căn giữa tile grid bên trong board
    const gridWidth = CONST.gridWidth * CONST.tileWidth;
    const gridHeight = CONST.gridHeight * CONST.tileHeight;

    CONST.GRID_OFFSET_X = boardStartX + (scaledBoardWidth - gridWidth) / 2 + 2;
    CONST.GRID_OFFSET_Y = boardStartY + (scaledBoardHeight - gridHeight) / 2 + 2;
    // 15 is board shader width
    CONST.boardTileSize = (scaledBoardWidth - 15) / CONST.gridWidth
}

export function getRandomMineIndexes (mineCount, cols, rows) {
    const cellCount = cols * rows;
    let mines = new Set();
    do {
        mines.add(Math.round(Math.random() * (cellCount - 1)));
    } while (mines.size < mineCount && mines.size < cellCount);
    return mines;
}
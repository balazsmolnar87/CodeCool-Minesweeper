import {game} from "./game";
import {getRandomMineIndexes} from "./util";

export function drawBoard () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const rows = parseInt(urlParams.get('rows'));
    const cols = parseInt(urlParams.get('cols'));
    const mineCount = parseInt(urlParams.get('mines'));
    game.mines = mineCount;
    const minePlaces = getRandomMineIndexes(mineCount, cols, rows);

    //Set how many flags do we have
    game.flagsLeftCounter.setAttribute("value", mineCount.toString());
    game.flagsLeft = mineCount;

    let gameField = document.querySelector('.game-field');
    setGameFieldSize(gameField, rows, cols);
    let cellIndex = 0
    for (let row = 0; row < rows; row++) {
        const rowElement = addRow(gameField);
        for (let col = 0; col < cols; col++) {
            addCell(rowElement, row, col, minePlaces.has(cellIndex));
            cellIndex++;
        }
    }
}

function setGameFieldSize (gameField, rows, cols) {
    gameField.style.width = (gameField.dataset.cellWidth * rows) + 'px';
    gameField.style.height = (gameField.dataset.cellHeight * cols) + 'px';
}

function addRow (gameField) {
    gameField.insertAdjacentHTML(
        'beforeend',
        '<div class="row"></div>'
    );
    return gameField.lastElementChild;
}

export function addCell (rowElement, row, col, isMine) {
    rowElement.insertAdjacentHTML(
        'beforeend',
        `<div class="field${isMine ? ' mine' : ''}"
                        data-row="${row}"
                        data-col="${col}"></div>`);
}
const flagsLeftCounter = document.querySelector('#flags-left-counter');
let isGameOver = false;
let flagsLeft = 0;
let mines = 0;

function checkForWin() {
    const fields = document.querySelectorAll('.game-field .row .field');
    
    let total = 0;
    for (let field of fields) {
        if (field.classList.contains("mine") && field.classList.contains("flagged")) total++;
    }
    if (total === mines) {
        alert('You won!')
        isGameOver = true;
    }    
}

function gameOver() {
    const fields = document.querySelectorAll('.game-field .row .field');
    
    for (let field of fields) {
        if (field.classList.contains("mine")) {
            field.classList.add("open")   
        }
    }
    
    alert('Boom! Game over!');
    isGameOver = true;
}

const game = {
    init: function () {
        //Create the board
        this.drawBoard();

        //What should happen when we click on a tile    
        this.initRightClick();
        this.initLeftClick();

    },

    drawBoard: function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const rows = parseInt(urlParams.get('rows'));
        const cols = parseInt(urlParams.get('cols'));
        const mineCount = parseInt(urlParams.get('mines'));
        mines = mineCount;
        const minePlaces = this.getRandomMineIndexes(mineCount, cols, rows);
        
        //Set how many flags do we have
        flagsLeftCounter.setAttribute("value", mineCount.toString());
        flagsLeft = mineCount;

        let gameField = document.querySelector('.game-field');
        this.setGameFieldSize(gameField, rows, cols);
        let cellIndex = 0
        for (let row = 0; row < rows; row++) {
            const rowElement = this.addRow(gameField);
            for (let col = 0; col < cols; col++) {
                this.addCell(rowElement, row, col, minePlaces.has(cellIndex));
                cellIndex++;
            }
        }
    },

    getRandomMineIndexes: function (mineCount, cols, rows) {
        const cellCount = cols * rows;
        let mines = new Set();
        do {
            mines.add(Math.round(Math.random() * (cellCount - 1)));
        } while (mines.size < mineCount && mines.size < cellCount);
        return mines;
    },

    setGameFieldSize: function (gameField, rows, cols) {
        gameField.style.width = (gameField.dataset.cellWidth * rows) + 'px';
        gameField.style.height = (gameField.dataset.cellHeight * cols) + 'px';
    },

    addRow: function (gameField) {
        gameField.insertAdjacentHTML(
            'beforeend',
            '<div class="row"></div>'
        );
        return gameField.lastElementChild;
    },
    
    addCell: function (rowElement, row, col, isMine, adjacent=0) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field${isMine ? ' mine' : ''}"
                        data-row="${row}"
                        data-col="${col}"></div>`);
    },

    initRightClick: function () {
        const fields = document.querySelectorAll('.game-field .row .field');
        
        for (let field of fields) {
            field.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                if (isGameOver) return;
                if (!field.classList.contains('opened')){
                    if (!field.classList.contains('flagged') && flagsLeft > 0){
                        field.classList.add('flagged');
                        flagsLeft--;
                        flagsLeftCounter.setAttribute("value", flagsLeft.toString());
                        checkForWin();
                    } else {
                        if (field.classList.contains('flagged')){
                            field.classList.remove('flagged');
                            flagsLeft++;
                            flagsLeftCounter.setAttribute("value", flagsLeft.toString());
                        }
                    }
                }
            });
        }
    },
    
    initLeftClick: function () {
        const fields = document.querySelectorAll('.game-field .row .field');
        
        for (let field of fields) {
            field.addEventListener('click', function (event) {
                if (isGameOver) return;
                if (field.classList.contains('open') || field.classList.contains('flagged')) return;

                function countAdjacentMines(field) {
                    let total = 0;
                    let row = Number(field.getAttribute('data-row'));
                    let col = Number(field.getAttribute('data-col'));

                    for (let f of fields){
                        let fRow = Number(f.getAttribute('data-row'));
                        let fCol = Number(f.getAttribute('data-col'));
                        if (fRow == row -1 && fCol == col -1 && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row -1 && fCol == col && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row -1 && fCol == col +1 && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row && fCol == col -1 && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row && fCol == col +1 && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row +1 && fCol == col -1 && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row +1 && fCol == col && f.classList.contains('mine')){
                            total++;
                        }
                        if (fRow == row +1 && fCol == col +1 && f.classList.contains('mine')){
                            total++;
                        }
                    }
                    return total;
                }

                if (field.classList.contains('mine')) {
                    gameOver();
                } else {
                    let total = countAdjacentMines(field);
                    if (total != 0) {
                        field.classList.add('open');
                        field.innerHTML = total;
                        return
                    }
                }
                field.classList.add('open');
            });
        }
    },
};

game.init();

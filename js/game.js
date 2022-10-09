let isGameOver = false;

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
        const minePlaces = this.getRandomMineIndexes(mineCount, cols, rows);

        let gameField = document.querySelector(".game-field");
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
                        data-col="${col}"
                        data-adjacent="${adjacent}"></div>`);
    },

    initRightClick() {
        const fields = document.querySelectorAll('.game-field .row .field');
        
        for (let field of fields) {
            field.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                event.currentTarget.classList.toggle('flagged');
            });
        }
    },
    
    initLeftClick() {
        const fields = document.querySelectorAll('.game-field .row .field');

        for (let field of fields) {
            field.addEventListener('click', function (event) {
                if (isGameOver) return;
                if (field.classList.contains('open') || field.classList.contains('flagged')) return;
                if (field.classList.contains('mine')) {
                    console.log('Boom! Game over!');
                } else {
                    let total = field.getAttribute('data-adjacent');
                    if (total != 0) {
                        field.classList.add('open');
                        field.innerHTML = total;
                        return
                    }
                }
                field.classList.add('open');
            });
        }
    }
};

game.init();

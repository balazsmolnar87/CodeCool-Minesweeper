const game = {
    flagsLeftCounter: document.querySelector('#flags-left-counter'),
    isGameOver : false,
    flagsLeft : 0,
    mines : 0,

    init: function () {
        //Create the board
        game.drawBoard();

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
        game.mines = mineCount;
        const minePlaces = this.getRandomMineIndexes(mineCount, cols, rows);
        
        //Set how many flags do we have
        game.flagsLeftCounter.setAttribute("value", mineCount.toString());
        game.flagsLeft = mineCount;

        let gameField = document.querySelector('.game-field');
        this.setGameFieldSize(gameField, rows, cols);
        let cellIndex = 0
        for (let row = 0; row < rows; row++) {
            const rowElement = this.addRow(gameField);
            for (let col = 0; col < cols; col++) {
                this.addCell(rowElement, row, col, minePlaces.has(cellIndex), cellIndex);
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
    
    addCell: function (rowElement, row, col, isMine, cellIndex) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field${isMine ? ' mine' : ''}"
                        id="${cellIndex}"
                        data-row="${row}"
                        data-col="${col}"></div>`);
    },

    initRightClick: function () {
        const fields = document.querySelectorAll('.game-field .row .field');

        function addOrRemoveFlag(field) {
            if (!field.classList.contains('flagged') && game.flagsLeft > 0){
                field.classList.add('flagged');
                game.flagsLeft--;
                game.flagsLeftCounter.setAttribute("value", game.flagsLeft.toString());
                game.checkForWin();
            } else {
                if (field.classList.contains('flagged')){
                    field.classList.remove('flagged');
                    game.flagsLeft++;
                    game.flagsLeftCounter.setAttribute("value", game.flagsLeft.toString());
                }
            }
        }

        for (let field of fields) {
            field.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                if (game.isGameOver) return;
                if (!field.classList.contains('opened')){
                    addOrRemoveFlag(field);
                }
            });
        }
    },

    initLeftClick: function () {
        const fields = document.querySelectorAll('.game-field .row .field');

        function leftClick(field) {
            if (game.isGameOver) return;
            if (field.classList.contains('open') || field.classList.contains('flagged')) return;
            
            function getNeighbors(field){
                let row = Number(field.getAttribute('data-row'));
                let col = Number(field.getAttribute('data-col'));
                
                let neighbors = [];
                
                neighbors.push(getNode(row-1,col-1));
                neighbors.push(getNode(row-1,col));
                neighbors.push(getNode(row-1,col+1));
                neighbors.push(getNode(row,col-1));
                neighbors.push(getNode(row,col+1));
                neighbors.push(getNode(row+1,col-1));
                neighbors.push(getNode(row+1,col));
                neighbors.push(getNode(row+1,col+1));
                
                return neighbors.filter(x => x != null);
            }
            
            function getNode(row, col) {
                return document.querySelector(`div[data-row="${row}"][data-col="${col}"]`);
            }

            function countAdjacentMines(field) {
                let total = 0;

                function hasMine(node){
                    return node.classList.contains('mine')
                }
                
                for (let neighbor of getNeighbors(field)) {
                    if (hasMine(neighbor)) total++;
                }

                return total;
            }

            function recur(field) {
                for (let neighbor of getNeighbors(field)) leftClick(neighbor)
            }

            if (field.classList.contains('mine')) {
                game.gameOver();
            } else {
                let total = countAdjacentMines(field);

                if (total !== 0) {
                    field.classList.add('open');
                    field.innerHTML = total;
                    return;
                } else{
                    field.classList.add('open');
                    recur(field);
                }
            }
            field.classList.add('open');
        }

        for (let field of fields) {
            field.addEventListener('click', () => leftClick(field));
        }
    },

    checkForWin: function () {
        const fields = document.querySelectorAll('.game-field .row .field');
        
        let total = 0;
        for (let field of fields) {
            if (field.classList.contains("mine") && field.classList.contains("flagged")) total++;
        }
        if (total === game.mines) {
            alert('You won!')
            game.isGameOver = true;
        }    
    },
    
    gameOver: function () {
        const fields = document.querySelectorAll('.game-field .row .field');
        for (let field of fields) {
            if (field.classList.contains("mine")) {
                field.classList.add("open")
            }
        }
    
        alert('Boom! Game over!');
        game.isGameOver = true;
    }
};

game.init();

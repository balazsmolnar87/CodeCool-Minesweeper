const game = {
    init: function () {
        this.drawBoard();
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
};

game.init();

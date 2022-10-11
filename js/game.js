import {checkForWin} from 'js/checks'
import {drawBoard} from 'js/domManipulation'

export const game = {
    flagsLeftCounter: document.querySelector('#flags-left-counter'),
    isGameOver : false,
    flagsLeft : 0,
    mines : 0,

    init: function () {
        //Create the board
        drawBoard();

        //What should happen when we click on a tile    
        this.initRightClick();
        this.initLeftClick();
    },

    initRightClick: function () {
        const fields = document.querySelectorAll('.game-field .row .field');

        function addOrRemoveFlag(field) {
            if (!field.classList.contains('flagged') && game.flagsLeft > 0){
                field.classList.add('flagged');
                game.flagsLeft--;
                game.flagsLeftCounter.setAttribute("value", game.flagsLeft.toString());
                checkForWin();
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

            function countAdjacentMines(field) {
                let total = 0;
                let row = Number(field.getAttribute('data-row'));
                let col = Number(field.getAttribute('data-col'));

                for (let f of fields){
                    let fRow = Number(f.getAttribute('data-row'));
                    let fCol = Number(f.getAttribute('data-col'));

                    if      (fRow === row-1 && fCol === col-1 && f.classList.contains('mine')) total++;
                    else if (fRow === row-1 && fCol === col   && f.classList.contains('mine')) total++;
                    else if (fRow === row-1 && fCol === col+1 && f.classList.contains('mine')) total++;
                    else if (fRow === row   && fCol === col-1 && f.classList.contains('mine')) total++;
                    else if (fRow === row   && fCol === col+1 && f.classList.contains('mine')) total++;
                    else if (fRow === row+1 && fCol === col-1 && f.classList.contains('mine')) total++;
                    else if (fRow === row+1 && fCol === col   && f.classList.contains('mine')) total++;
                    else if (fRow === row+1 && fCol === col+1 && f.classList.contains('mine')) total++;
                }
                return total;
            }

            function recur() {
                for (let cell of fields){
                    let row = Number(field.getAttribute('data-row'));
                    let col = Number(field.getAttribute('data-col'));

                    let cRow = Number(cell.getAttribute('data-row'));
                    let cCol = Number(cell.getAttribute('data-col'));

                    if (cRow === row-1 && cCol === col-1) leftClick(cell);
                    if (cRow === row-1 && cCol === col)   leftClick(cell);
                    if (cRow === row-1 && cCol === col+1) leftClick(cell);
                    if (cRow === row   && cCol === col-1) leftClick(cell);
                    if (cRow === row   && cCol === col+1) leftClick(cell);
                    if (cRow === row+1 && cCol === col-1) leftClick(cell);
                    if (cRow === row+1 && cCol === col)   leftClick(cell);
                    if (cRow === row+1 && cCol === col+1) leftClick(cell);
                }
            }

            if (field.classList.contains('mine')) {
                gameOver();
            } else {
                let total = countAdjacentMines(field);
                if (total !== 0) {
                    field.classList.add('open');
                    field.innerHTML = total;
                    return;
                }
                recur();
            }
            field.classList.add('open');
        }

        for (let field of fields) {
            field.addEventListener('click', () => leftClick(field)); 
        }
    },
};

function gameOver() {
    const fields = document.querySelectorAll('.game-field .row .field');
    for (let field of fields) {
        if (field.classList.contains("mine")) {
            field.classList.add("open")   
        }
    }
    
    alert('Boom! Game over!');
    game.isGameOver = true;
}

game.init();

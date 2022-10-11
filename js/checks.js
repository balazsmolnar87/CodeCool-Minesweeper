import {game} from 'js/game'

export function checkForWin() {
    const fields = document.querySelectorAll('.game-field .row .field');
    let total = 0;
    for (let field of fields) {
        if (field.classList.contains("mine") && field.classList.contains("flagged")) total++;
    }
    if (total === game.mines) {
        alert('You won!')
        game.isGameOver = true;
    }
}
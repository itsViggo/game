let selectedOption = 'Yes';
let visible = false;

export function showGameOver() {
    visible = true;
    document.getElementById('gameOver').classList.add('show');
}

export function setSelectedOption(newOption: 'Yes' | 'No') {
    if (visible) {
        selectedOption = newOption;
        if (newOption === 'Yes') {
            document.getElementById('yesText').classList.add('selectedOption');
            document.getElementById('noText').classList.remove('selectedOption');
        } else {
            document.getElementById('noText').classList.add('selectedOption');
            document.getElementById('yesText').classList.remove('selectedOption');
        }
    }
}

export function onEnter() {
    if (visible) {
        if (selectedOption === 'Yes') {
            location.reload();
        } else {
            window.close();
        }
    }
}
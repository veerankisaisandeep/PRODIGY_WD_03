let currentPlayer = '';
let gameMode = '';
let grid = ['', '', '', '', '', '', '', '', ''];
let playerSymbol = '';
let aiSymbol = '';

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('selection-container').classList.remove('hidden');
}

function chooseSymbol(symbol) {
    playerSymbol = symbol;
    aiSymbol = symbol === 'X' ? 'O' : 'X';
    currentPlayer = playerSymbol;
    document.getElementById('selection-container').classList.add('hidden');
}

function makeMove(index) {
    if (grid[index] !== '' || checkWin()) return;

    grid[index] = currentPlayer;
    renderGrid();

    if (checkWin()) {
        displayMessage(`${currentPlayer} Wins!`);
    } else if (grid.every(cell => cell !== '')) {
        displayMessage('Draw!');
    } else {
        currentPlayer = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;

        if (gameMode === 'ai' && currentPlayer === aiSymbol) {
            aiMove();
        }
    }
}

function renderGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        item.textContent = grid[index];
        item.classList.remove('winning');
    });

    const winIndices = getWinningCombination();
    if (winIndices) {
        winIndices.forEach(index => {
            gridItems[index].classList.add('winning');
        });
    }
}

function getWinningCombination() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
            return combination;
        }
    }
    return null;
}

function checkWin() {
    return getWinningCombination() !== null;
}

function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] === '') {
            grid[i] = aiSymbol;
            let score = minimax(grid, 0, false);
            grid[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    makeMove(move);
}

function minimax(grid, depth, isMaximizing) {
    const winner = getWinner();
    if (winner !== null) {
        return winner === aiSymbol ? 10 - depth : depth - 10;
    }

    if (grid.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i] === '') {
                grid[i] = aiSymbol;
                let score = minimax(grid, depth + 1, false);
                grid[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i] === '') {
                grid[i] = playerSymbol;
                let score = minimax(grid, depth + 1, true);
                grid[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner() {
    const winCombination = getWinningCombination();
    if (winCombination) {
        return grid[winCombination[0]];
    }
    return null;
}

function displayMessage(text) {
    const messageContainer = document.getElementById('message-container');
    document.getElementById('message').textContent = text;
    messageContainer.classList.remove('hidden');
}

function resetGame() {
    // Reset the grid array
    grid = ['', '', '', '', '', '', '', '', ''];

    // Clear the grid items in the DOM
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.textContent = ''; // Clear the text content
        item.classList.remove('winning'); // Remove the winning class if applied
    });

    // Hide the message container
    document.getElementById('message-container').classList.add('hidden');

    // Show the selection container to choose X or O again
    document.getElementById('selection-container').classList.remove('hidden');
}

function quitGame() {
    resetGame();
    document.getElementById('game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
}

class ReversiGame {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.currentPlayer = 'black'; // black starts first
        this.gameActive = true;
        this.moveHistory = [];
        this.scores = { black: 2, white: 2 };
        this.validMoves = new Set();
        
        this.initializeBoard();
        this.setupEventListeners();
        this.updateGameDisplay();
        this.calculateValidMoves();
    }
    
    initializeBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        
        // Set up initial pieces
        const mid = this.boardSize / 2;
        this.board[mid-1][mid-1] = 'white';
        this.board[mid-1][mid] = 'black';
        this.board[mid][mid-1] = 'black';
        this.board[mid][mid] = 'white';
        
        // Create board UI
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col]) {
                    const disk = document.createElement('div');
                    disk.className = `disk ${this.board[row][col]}`;
                    cell.appendChild(disk);
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                boardElement.appendChild(cell);
            }
        }
    }
    
    setupEventListeners() {
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('rules-btn').addEventListener('click', () => this.showRules());
        document.getElementById('close-rules').addEventListener('click', () => this.hideRules());
        document.getElementById('rules-modal').addEventListener('click', (e) => {
            if (e.target.id === 'rules-modal') this.hideRules();
        });
    }
    
    handleCellClick(row, col) {
        if (!this.gameActive) return;
        
        const moveKey = `${row},${col}`;
        if (!this.validMoves.has(moveKey)) {
            this.showInvalidMove();
            return;
        }
        
        this.makeMove(row, col);
    }
    
    makeMove(row, col) {
        // Place the disk
        this.board[row][col] = this.currentPlayer;
        
        // Flip opponent's disks
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        let totalFlipped = 0;
        
        directions.forEach(([dx, dy]) => {
            const flipped = this.flipInDirection(row, col, dx, dy);
            totalFlipped += flipped;
        });
        
        // Add to history
        this.moveHistory.unshift({
            player: this.currentPlayer,
            position: { row, col },
            flipped: totalFlipped
        });
        
        // Update UI
        this.updateBoardUI(row, col);
        
        // Switch player
        const previousPlayer = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        
        // Update scores
        this.calculateScores();
        
        // Check for valid moves
        this.calculateValidMoves();
        
        // If no valid moves for current player, skip turn
        if (this.validMoves.size === 0 && this.gameActive) {
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
            this.calculateValidMoves();
            
            // If still no valid moves, game over
            if (this.validMoves.size === 0) {
                this.endGame();
                return;
            }
            
            this.updateGameDisplay(`${this.currentPlayer === 'black' ? 'White' : 'Black'} has no moves. ${this.currentPlayer === 'black' ? 'Black' : 'White'}'s turn again.`);
        } else {
            this.updateGameDisplay();
        }
    }
    
    flipInDirection(row, col, dx, dy) {
        let flipped = 0;
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        let currentRow = row + dx;
        let currentCol = col + dy;
        const toFlip = [];
        
        while (
            currentRow >= 0 && currentRow < this.boardSize &&
            currentCol >= 0 && currentCol < this.boardSize &&
            this.board[currentRow][currentCol] === opponent
        ) {
            toFlip.push([currentRow, currentCol]);
            currentRow += dx;
            currentCol += dy;
        }
        
        if (
            currentRow >= 0 && currentRow < this.boardSize &&
            currentCol >= 0 && currentCol < this.boardSize &&
            this.board[currentRow][currentCol] === this.currentPlayer
        ) {
            toFlip.forEach(([r, c]) => {
                this.board[r][c] = this.currentPlayer;
                flipped++;
            });
        }
        
        return flipped;
    }
    
    calculateValidMoves() {
        this.validMoves.clear();
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] !== null) continue;
                
                let isValid = false;
                const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
                
                for (const [dx, dy] of directions) {
                    let currentRow = row + dx;
                    let currentCol = col + dy;
                    let foundOpponent = false;
                    
                    while (
                        currentRow >= 0 && currentRow < this.boardSize &&
                        currentCol >= 0 && currentCol < this.boardSize &&
                        this.board[currentRow][currentCol] === opponent
                    ) {
                        foundOpponent = true;
                        currentRow += dx;
                        currentCol += dy;
                    }
                    
                    if (
                        foundOpponent &&
                        currentRow >= 0 && currentRow < this.boardSize &&
                        currentCol >= 0 && currentCol < this.boardSize &&
                        this.board[currentRow][currentCol] === this.currentPlayer
                    ) {
                        isValid = true;
                        break;
                    }
                }
                
                if (isValid) {
                    this.validMoves.add(`${row},${col}`);
                }
            }
        }
        
        this.updateValidMovesUI();
    }
    
    calculateScores() {
        let black = 0, white = 0;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'black') black++;
                if (this.board[row][col] === 'white') white++;
            }
        }
        
        this.scores.black = black;
        this.scores.white = white;
        
        document.getElementById('black-score').textContent = black;
        document.getElementById('white-score').textContent = white;
    }
    
    updateBoardUI(newRow, newCol) {
        const boardElement = document.getElementById('board');
        const cells = boardElement.children;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = cells[row * this.boardSize + col];
                
                // Clear existing disks
                const existingDisk = cell.querySelector('.disk');
                if (existingDisk) {
                    existingDisk.remove();
                }
                
                // Add new disk if present
                if (this.board[row][col]) {
                    const disk = document.createElement('div');
                    disk.className = `disk ${this.board[row][col]}`;
                    
                    // Add animation for newly placed disk
                    if (row === newRow && col === newCol) {
                        disk.classList.add('placed');
                    }
                    
                    cell.appendChild(disk);
                }
            }
        }
        
        this.updateHistoryUI();
    }
    
    updateValidMovesUI() {
        const boardElement = document.getElementById('board');
        const cells = boardElement.children;
        
        // Remove valid class from all cells
        Array.from(cells).forEach(cell => {
            cell.classList.remove('valid');
        });
        
        // Add valid class to valid move cells
        this.validMoves.forEach(moveKey => {
            const [row, col] = moveKey.split(',').map(Number);
            const cell = cells[row * this.boardSize + col];
            cell.classList.add('valid');
        });
    }
    
    updateGameDisplay(message = null) {
        const gameStatus = document.getElementById('game-status');
        const blackIndicator = document.getElementById('black-indicator');
        const whiteIndicator = document.getElementById('white-indicator');
        
        // Update player indicators
        if (this.currentPlayer === 'black') {
            document.querySelector('.player-black').classList.add('active');
            document.querySelector('.player-white').classList.remove('active');
            blackIndicator.innerHTML = '<i class="fas fa-play"></i> Your turn';
            whiteIndicator.textContent = 'Waiting...';
        } else {
            document.querySelector('.player-white').classList.add('active');
            document.querySelector('.player-black').classList.remove('active');
            whiteIndicator.innerHTML = '<i class="fas fa-play"></i> Your turn';
            blackIndicator.textContent = 'Waiting...';
        }
        
        // Update game status message
        if (message) {
            gameStatus.textContent = message;
        } else if (this.gameActive) {
            gameStatus.textContent = `${this.currentPlayer === 'black' ? 'Black' : 'White'}'s turn`;
        }
    }
    
    updateHistoryUI() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        this.moveHistory.slice(0, 10).forEach((move, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const playerInfo = document.createElement('div');
            playerInfo.className = 'history-player';
            
            const disk = document.createElement('div');
            disk.className = `history-disk ${move.player}`;
            
            const playerName = document.createElement('span');
            playerName.textContent = move.player === 'black' ? 'Black' : 'White';
            
            playerInfo.appendChild(disk);
            playerInfo.appendChild(playerName);
            
            const moveInfo = document.createElement('div');
            moveInfo.className = 'history-move-info';
            moveInfo.innerHTML = `Row ${move.position.row + 1}, Col ${move.position.col + 1}<br><small>Flipped ${move.flipped}</small>`;
            
            historyItem.appendChild(playerInfo);
            historyItem.appendChild(moveInfo);
            
            historyList.appendChild(historyItem);
        });
    }
    
    endGame() {
        this.gameActive = false;
        this.validMoves.clear();
        this.updateValidMovesUI();
        
        let winnerMessage;
        if (this.scores.black > this.scores.white) {
            winnerMessage = `Game Over! Black wins with ${this.scores.black} to ${this.scores.white}!`;
        } else if (this.scores.white > this.scores.black) {
            winnerMessage = `Game Over! White wins with ${this.scores.white} to ${this.scores.black}!`;
        } else {
            winnerMessage = `Game Over! It's a tie! ${this.scores.black} to ${this.scores.white}`;
        }
        
        this.updateGameDisplay(winnerMessage);
    }
    
    showInvalidMove() {
        const overlay = document.getElementById('invalid-move');
        overlay.style.display = 'block';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1500);
    }
    
    showRules() {
        document.getElementById('rules-modal').classList.add('active');
    }
    
    hideRules() {
        document.getElementById('rules-modal').classList.remove('active');
    }
    
    restartGame() {
        this.currentPlayer = 'black';
        this.gameActive = true;
        this.moveHistory = [];
        this.scores = { black: 2, white: 2 };
        this.validMoves.clear();
        
        this.initializeBoard();
        this.calculateValidMoves();
        this.updateGameDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReversiGame();
});
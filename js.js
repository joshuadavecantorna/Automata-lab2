const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');
const restartBtn = document.getElementById('restart-btn');

// Game variables
let bird = {
    x: 50,
    y: 300,
    width: 34,
    height: 24,
    velocity: 0,
    gravity: 0.15,
    jump: -4
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let gameRunning = false;
let gameOver = false;

// Pipe settings
const pipeWidth = 52;
const pipeGap = 180;
const pipeSpeed = 1.8;

// Bird image (using CSS for simplicity, but can be replaced with actual image)
function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    // Simple eye
    ctx.fillStyle = '#000';
    ctx.fillRect(bird.x + 25, bird.y + 5, 5, 5);
}

// Pipe drawing
function drawPipe(pipe) {
    ctx.fillStyle = '#228B22';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Draw bird
    drawBird();

    // Update and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        drawPipe(pipe);

        // Check collision
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)) {
            endGame();
        }

        // Score when passing pipe
        if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            pipe.passed = true;
            score++;
            scoreElement.textContent = 'Score: ' + score;
        }

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        let bottomHeight = canvas.height - topHeight - pipeGap;
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            bottomHeight: bottomHeight,
            passed: false
        });
    }

    // Check ground collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Jump function
function jump() {
    if (!gameRunning) {
        startGame();
    } else {
        bird.velocity = bird.jump;
    }
}

// End game function
function endGame() {
    gameOver = true;
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyBirdHighScore', highScore);
    }
    finalScoreElement.textContent = 'Score: ' + score;
    highScoreElement.textContent = 'High Score: ' + highScore;
    gameOverElement.style.display = 'block';
}

// Start game
function startGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.textContent = 'Score: 0';
    gameRunning = true;
    gameOver = false;
    gameOverElement.style.display = 'none';
    gameLoop();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

canvas.addEventListener('click', jump);

restartBtn.addEventListener('click', startGame);

// Initial setup
ctx.fillStyle = '#70c5ce';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#000';
ctx.font = '24px Arial';
ctx.textAlign = 'center';
ctx.fillText('Click or Press Space to Start', canvas.width / 2, canvas.height / 2);

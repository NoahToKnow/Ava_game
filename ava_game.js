document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    document.getElementById('gameCanvas').style.display = 'block';
    document.querySelector('header').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    initGame();
}

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    const bird = {
        x: 50,
        y: 150,
        width: 20,
        height: 20,
        gravity: 0.6,
        lift: -15,
        velocity: 0
    };

    const pipes = [];
    const pipeWidth = 30;
    const pipeGap = 150;
    let frame = 0;
    let score = 0;

    document.addEventListener('keydown', () => {
        bird.velocity = bird.lift;
    });

    function drawBird() {
        context.fillStyle = '#FFD700';
        context.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipes() {
        context.fillStyle = '#00FF00';
        pipes.forEach(pipe => {
            context.fillRect(pipe.x, 0, pipeWidth, pipe.top);
            context.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
        });
    }

    function updateBird() {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            resetGame();
        }
    }

    function updatePipes() {
        if (frame % 75 === 0) {
            const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
            pipes.push({
                x: canvas.width,
                top: pipeHeight,
                bottom: canvas.height - pipeHeight - pipeGap
            });
        }

        pipes.forEach(pipe => {
            pipe.x -= 2;
            if (pipe.x + pipeWidth < 0) {
                pipes.shift();
                score++;
            }
        });
    }

    function detectCollision() {
        pipes.forEach(pipe => {
            if (
                bird.x < pipe.x + pipeWidth &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
            ) {
                resetGame();
            }
        });
    }

    function resetGame() {
        bird.y = 150;
        bird.velocity = 0;
        pipes.length = 0;
        score = 0;
    }

    function drawScore() {
        context.fillStyle = '#FFF';
        context.font = '20px Arial';
        context.fillText(`Score: ${score}`, 10, 20);
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        drawScore();
        updateBird();
        updatePipes();
        detectCollision();
        frame++;
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}


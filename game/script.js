var canvas = document.getElementById("game_board");
var context = canvas.getContext("2d");
var gridSize = {cols: 15, rows: 15};
var playerSize = {width: Math.ceil(canvas.width / gridSize.cols), height: Math.ceil(canvas.height / gridSize.rows)};

var player = {};    // Player er x og y coordinater
var playerDirection;

var score = 0;
var highScore = 0;
var lastHighScore = 0;

var pipes = [];
var pipeHole1;
var pipeHole2;
var pipePosX = gridSize.cols + 1;
var holes = 2;

var gameSpeed = 5;

var StateMachine = {
    PLAY: 0,
    PAUSE: 1
};

var gameState = StateMachine.PLAY;

var MovingDirection = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    STAND_STILL: 4
};

init();

function init() {
    startGame();
}

function startGame() {
    resetPlayerPosition();

    lastHighScore = localStorage.getItem("pipeLine_score") || 0;

    score = 0;
    resetPipesPosiiton();
    randomHole();
    setPipeSpeed();
    if (gameState == StateMachine.PLAY) {
        gameLoop();
    } else {
        drawGameMenu();
    }
}

function resetPlayerPosition() {
    player.x = 2;
    player.y = 4;
}
function resetPipesPosiiton() {
    pipes = [];
    pipePosX = gridSize.cols + 1;
    for (var i = 0; i < gridSize.rows; i++) {
        pipes.push({x: 5, y: i});
    }
    createPipeHole();
}

function gameLoop() {
    update();
    draw();
    tick();
}

function tick() {
    if (gameState == StateMachine.PLAY) {
        setTimeout(gameLoop, 1000 / gameSpeed);
    }
}

function checkPlayerMovement() {
    if (allowPlayerMovement())
        movePlayer();
}
function update() {
    createPipeHole();
    checkPlayerHitsPipeFilterOnHoles();
    updateScore();
    updatePipePosX();
}

function updatePipePosX() {
    pipePosX--;
}

function checkPlayerHitsPipeFilterOnHoles() {
    if (holes == 1) {
        checkIfPlayerHitsPipe(false);
    } else {
        checkIfPlayerHitsPipe(pipeHole2);
    }
}

function checkIfPlayerHitsPipe(hole2) {
    if ((pipes[0].x == player.x) && (player.y != pipeHole1 && player.y != hole2)) {
        gameState = StateMachine.PAUSE;
        startGame();
    }
}

function createPipeHole() {
    if (gameState == StateMachine.PAUSE || pipePosX == 0) {
        pipePosX = gridSize.cols;
        randomHole();
        setPipeSpeed();
    }
}

function randomHole() {
    holes = Math.floor((Math.random() * 2) + 1);

    pipeHole1 = Math.floor((Math.random() * (gridSize.rows - 2)) + 1);
    pipeHole2 = pipeHole1++;
}

function setPipeSpeed() {
    if (holes == 2) {
        gameSpeed = 5;
    } else {
        gameSpeed = 10;
    }
}

function updateScore() {
    if (pipes[0].x == 1) {
        score++;
        checkHighScore();
    }
}

function checkHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("pipeLine_score", highScore);
    }
}

function draw() {
    if (gameState == StateMachine.PLAY) {
        resetCanvas();

        // Draw player
        context.fillStyle = "#C3E172";
        context.fillRect(player.x * playerSize.width, player.y * playerSize.height,
            canvas.width / gridSize.cols, canvas.height / gridSize.rows);

        // Draw pipes
        context.fillStyle = "#31EF24";

        if (holes == 1) {
            drawPipes(false);
        } else if (holes == 2) {
            drawPipes(pipeHole2);
        }

        // Draw score
        drawText("HighScore: " + lastHighScore + ". Score: " + score, "#31EF24", canvas.width / 3, canvas.height - 30);
    }
}

function drawPipes(hole2) {
    for (var i = 0; i < gridSize.rows; i++) {
        pipes[i].x = pipePosX;
        if (i != pipeHole1 && i !== hole2) {
            context.fillRect(pipes[i].x * playerSize.width, pipes[i].y * playerSize.height,
                canvas.width / gridSize.cols, canvas.height / gridSize.rows);
        }
    }
}

function drawGameMenu() {
    resetCanvas();
    drawText("Press 'n' to start new game", "#000", canvas.width / 3, canvas.height - 30);
}

function drawText(text, color, posX, posY) {
    context.fillStyle = color;
    context.font = "30px Arial";
    context.fillText(text, posX, posY);
}

function resetCanvas() {
    context.fillStyle = "#2782D2";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function allowPlayerMovement() {
    return !movingPastTopOfMap() && !movingPastBottomOfMap();
}

function movingPastTopOfMap() {
    return playerDirection == MovingDirection.UP && player.y == 0;
}

function movingPastBottomOfMap() {
    return playerDirection == MovingDirection.DOWN && player.y == gridSize.rows - 1;
}

function movePlayer() { // Want movement and stopping in the same function
    var checkDirection = playerDirection;
    playerDirection = MovingDirection.STAND_STILL;
    switch (checkDirection) {
        case MovingDirection.LEFT:
            player.x--;
            break;
        case MovingDirection.UP:
            player.y--;
            break;
        case MovingDirection.RIGHT:
            player.x++;
            break;
        case MovingDirection.DOWN:
            player.y++;
            break;
    }
}

document.addEventListener('keydown', function (event) {
    if (gameState == StateMachine.PAUSE) {
        if (event.keyCode == 78) {
            gameState = StateMachine.PLAY;
            startGame();
        }
    }
    if (gameState == StateMachine.PLAY) {
        switch (event.keyCode) {
            case 37:
                //       playerDirection = MovingDirection.LEFT;
                checkPlayerMovement();
                draw();
                break;
            case 38:
                playerDirection = MovingDirection.UP;
                checkPlayerMovement();
                draw();
                break;
            case 39:
                //       playerDirection = MovingDirection.RIGHT;
                checkPlayerMovement();
                draw();
                break;
            case 40:
                playerDirection = MovingDirection.DOWN;
                checkPlayerMovement();
                draw();
                break;
            default:
                playerDirection = MovingDirection.STAND_STILL;
        }
    }
});


var canvas = document.getElementById("game_board");
var context = canvas.getContext("2d");
var gridSize = {cols: 15, rows: 15};

var playerSize = {width: Math.ceil(canvas.width / gridSize.cols), height: Math.ceil(canvas.height / gridSize.rows)};
var player = {};    // Player er x og y coordinater
var playerDirection;

var pipes = []; // Pipes kan være et array

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
    player.x = 2;
    player.y = 4;

    playerDirection = MovingDirection.STAND_STILL;
    gameLoop();
}

function gameLoop() {
    update();
    draw();

    setTimeout(gameLoop, 1000 / 5);
}

function update() {
    if (allowPlayerMovement())
        movePlayer();


}

// Move to a more fitting location. Must refresh after each point.
var hole1 = Math.floor(Math.random() * gridSize.rows - 2) + 1;
var hole2 = hole1++;

function draw() {
    // Reset canvas
    context.fillStyle = "#2782D2";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillStyle = "#C3E172";
    context.fillRect(player.x * playerSize.width, player.y * playerSize.height,
        canvas.width / gridSize.cols, canvas.height / gridSize.rows);


    for (var i = 0; i < gridSize.rows; i++) {
        pipes.push({x: 11, y: i});
    }



    context.fillStyle = "#31EF24";
    for (var i = 0; i < gridSize.rows; i++) {
        if (i != hole1 && i != hole2) {
            context.fillRect(pipes[i].x * playerSize.width, pipes[i].y * playerSize.height,
                canvas.width / gridSize.cols, canvas.height / gridSize.rows);
        }
    }
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
    switch (event.keyCode) {
        case 37:
            //       playerDirection = MovingDirection.LEFT;
            update();
            draw();
            break;
        case 38:
            playerDirection = MovingDirection.UP;
            update();
            draw();
            break;
        case 39:
            //       playerDirection = MovingDirection.RIGHT;
            update();
            draw();
            break;
        case 40:
            playerDirection = MovingDirection.DOWN;
            update();
            draw();
            break;
        default:
            playerDirection = MovingDirection.STAND_STILL;
    }
});


var canvas = document.getElementById("game_board");
var context = canvas.getContext("2d");
var gridSize = {cols: 15, rows: 15};

var playerSize = {width: Math.ceil(canvas.width / gridSize.cols), height: Math.ceil(canvas.height / gridSize.rows)};
var player = {};    // Player skal inneholde x og y coordinater
var playerDirection;

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
    movePlayer();
}

function draw() {
    // Reset canvas
    context.fillStyle = "#2782D2";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillStyle = "#C3E172";
    context.fillRect(player.x * playerSize.width, player.y * playerSize.height,
        canvas.width / gridSize.cols, canvas.height / gridSize.rows);
}

function movePlayer() { // Want movement and stopping in the same function
    var checkDirection = playerDirection;
    playerDirection = MovingDirection.STAND_STILL;
    switch (checkDirection) {
        case MovingDirection.LEFT:
            player.x--;
            break;
        case MovingDirection.UP:
            if (player.y > 0) {
                player.y--;
            }
            break;
        case MovingDirection.RIGHT:
            player.x++;
            break;
        case MovingDirection.DOWN:
            if (player.y < gridSize.rows - 1) {
                player.y++;
            }
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


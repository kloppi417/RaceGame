const canvasWrapper = document.getElementById("canvas-wrapper");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    board.totalWidth = window.innerWidth;
    board.totalHeight = window.innerHeight;
}

let board = new Board("maps/map2.json", 50);

let playerCount = 2;
let playerColors = [{r: 255, g: 255, b: 255}, {r: 200, g: 0, b: 0}];
let players = []
let turn = 0;

window.onload = () => {
    resize();
    const crt = document.getElementById("crt");

    setInterval(() => {
        board.draw();

        // pre-game (deploying cars)
        if (players.length != playerCount) {
            for (let i = 0; i < players.length; i++) {
                players[i].draw(board);
            }

            for (let i = 0; i < players.length; i++) {
                if (board.tileHovered.x == players[i].x && board.tileHovered.y == players[i].y) return;
            }

            if (board.collision(board.tileHovered.x, board.tileHovered.y) != "start") return;
            let color = playerColors[players.length];
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
            ctx.beginPath();
            ctx.arc(
                board.xOffset + (board.tileSize * (board.tileHovered.x)) + (board.tileSize / 2), 
                board.yOffset + (board.tileSize * (board.tileHovered.y)) + (board.tileSize / 2), 
                board.tileSize / 5, 
                0, 
                2 * Math.PI
            );
            ctx.fill();
            return;
        };

        // during game
        let openTiles = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const nextX = players[turn].nextMove.x + x;
                const nextY = players[turn].nextMove.y + y;
                if (nextX < 0) continue;
                if (nextY < 0) continue;
                if (nextX >= board.data.width) continue;
                if (nextY >= board.data.height) continue;
                
                const collision = board.collision(nextX, nextY);
                if (collision != "none") continue;

                openTiles.push({
                    x: x,
                    y: y
                });
            }
        }
        players[turn].drawMoveIndicators(openTiles, board);
        
        for (let i = 0; i < players.length; i++) {
            players[i].draw(board);
        }

        // ctx.drawImage(crt, -75, -40, window.innerWidth + 150, window.innerHeight + 80);

    }, 1000 / 60);
};

window.onclick = () => {
    const collision = board.collision(board.tileHovered.x, board.tileHovered.y);
    
    // pre-game (deploying cars)
    if (players.length != playerCount) {
        if (collision != "start") return;
        for (let i = 0; i < players.length; i++) {
            if (board.tileHovered.x == players[i].x && board.tileHovered.y == players[i].y) return;
        }
        players.push(new Player(board.tileHovered.x, board.tileHovered.y, playerColors[players.length]));
        return;
    }

    // during game
    if (Math.abs(board.tileHovered.x - players[turn].nextMove.x) > 1) return;
    if (Math.abs(board.tileHovered.y - players[turn].nextMove.y) > 1) return;
    if (collision == "wall" || collision == "start") return;
    if (board.tileHovered.x < 0) return;
    if (board.tileHovered.y < 0) return;
    if (board.tileHovered.x >= board.data.width) return;
    if (board.tileHovered.y >= board.data.height) return;

    players[turn].move(board.tileHovered.x, board.tileHovered.y);

    turn += 1;
    if (turn == players.length) turn = 0;
}





window.onresize = resize;

let mouse = {
    x: 0,
    y: 0
}

window.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
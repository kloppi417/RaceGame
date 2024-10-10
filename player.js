class Player {
    x;
    y;
    color; // {r, g, b} object
    prevVel;

    get nextMove() {
        return {
            x: this.x + this.prevVel.x,
            y: this.y + this.prevVel.y
        }
    }

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.prevVel = {
            x: 0,
            y: 0
        };
    }

    move(x, y) {
        this.prevVel = {
            x: x - this.x,
            y: y - this.y
        };

        this.x = x;
        this.y = y;
    }

    draw(board, offset = {x: 0, y: 0}, opacity = 1.0) {
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`
        ctx.beginPath();
        ctx.arc(
            board.xOffset + (board.tileSize * (this.x + offset.x)) + (board.tileSize / 2), 
            board.yOffset + (board.tileSize * (this.y + offset.y)) + (board.tileSize / 2), 
            board.tileSize / 5, 
            0, 
            2 * Math.PI
        );
        ctx.fill();
    }

    // tiles is an array of {x, y} objects that are where the indicators should be drawn
    drawMoveIndicators(tiles, board) {
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`
        for (let tile of tiles) {
            let xPos = this.x + tile.x + this.prevVel.x;
            let yPos = this.y + tile.y + this.prevVel.y;

            let opacity = 0.3;

            if (xPos == board.tileHovered.x && yPos == board.tileHovered.y) {
                opacity = 0.6;
            }

            tile.x += this.prevVel.x;
            tile.y += this.prevVel.y;

            this.draw(board, tile, opacity);
        }
    }

    hover(x, y, board) {

    }
}
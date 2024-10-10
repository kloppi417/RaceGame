// const this.border = 50;

// const p1 = 
// const p2 = 

// returns this.tileSize

class Board {

    data;
    border;
    totalWidth;
    totalHeight;

    get width() { return this.totalWidth - 2 * this.border; }
    get height() { return this.totalHeight - 2 * this.border; }
    get tileSize() { return Math.min(this.width / this.data.width, this.height / this.data.height); }
    get xOffset() { return this.border + (this.width - this.data.width * this.tileSize) / 2; }
    get yOffset() { return this.border + (this.height - this.data.height * this.tileSize) / 2; }
    
    get tileHovered() {
        let pos = canvas.getBoundingClientRect();
        return {
            x: Math.floor((mouse.x - this.xOffset - pos.x) / this.tileSize),
            y: Math.floor((mouse.y - this.yOffset - pos.y) / this.tileSize)
        }
    }

    constructor(file, border) {
        this.border = border;

        fetch(file)
        .then(response => {
            return response.json();
        })
        .then(data => {
            this.data = data;
            if (data.width == 0 && data.height == 0) {
                this.data.width = parseInt(prompt("Width: "));
                this.data.height = parseInt(prompt("Height: "));
            }
        });
    }

    draw() {
        ctx.fillStyle = `rgb(100, 100, 100)`;
        ctx.fillRect(0, 0, this.totalWidth, this.totalHeight); 

        // grid background
        ctx.fillStyle = `rgb(50, 50, 50)`;
        ctx.fillRect(this.xOffset, this.yOffset, this.data.width * this.tileSize, this.data.height * this.tileSize);

        // lines
        ctx.strokeStyle = `rgb(100, 100, 100)`;
        ctx.lineWidth = 1;

        for (let x = 0; x < this.data.width + 1; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.tileSize + this.xOffset, this.border);
            ctx.lineTo(x * this.tileSize + this.xOffset, this.totalHeight - this.border);
            ctx.stroke();
        }

        for (let y = 0; y < this.data.height + 1; y++) {
            ctx.beginPath();
            ctx.moveTo(this.border, y * this.tileSize + this.yOffset);
            ctx.lineTo(this.totalWidth - this.border, y * this.tileSize + this.yOffset);
            ctx.stroke();
        }

        for (let wall of this.data.walls) {
            this.colorTile(wall.x, wall.y, {r: 100, g: 100, b: 100});
        }

        for (let start of this.data.start) {
            this.colorTile(start.x, start.y, {r: 255, g: 255, b: 0}, 0.5);
        }

        for (let end of this.data.end) {
            this.colorTile(end.x, end.y, {r: 0, g: 255, b: 0}, 0.5);
        }
    }

    collision(x, y, type) {

        for (let wall of this.data.walls) {
            if (x == wall.x && y == wall.y) return "wall";
        }
        for (let start of this.data.start) {
            if (x == start.x && y == start.y) return "start";
        }
        return "none";
        
    }
    
    colorTile(x, y, color, opacity = 1.0) {
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        ctx.fillRect(this.xOffset + (x * this.tileSize), this.yOffset + (y * this.tileSize), this.tileSize, this.tileSize);
    }

    tileExists(x, y) {
        for (let tile of this.data.walls) {
            if (tile.x == x && tile.y == y) return true;
        }

        for (let tile of this.data.start) {
            if (tile.x == x && tile.y == y) return true;
        }

        for (let tile of this.data.end) {
            if (tile.x == x && tile.y == y) return true;
        }
    }

    addTile(x, y, type) {
        switch (type) {
            case "wall":
                this.data.walls.push({x: x, y: y});
                break;
            case "start":
                this.data.start.push({x: x, y: y});
                break;
            case "end":
                this.data.end.push({x: x, y: y});
                break;
        }
    }

    removeTile(x, y, type = "all") {
        for (let i = 0; i < this.data.walls.length; i++) {
            let tile = this.data.walls[i];
            if (type != "wall" && type != "all") return;
            if (tile.x == x && tile.y == y) {
                this.data.walls.splice(i, 1);
                return;
            } 
        }

        for (let i = 0; i < this.data.start.length; i++) {
            let tile = this.data.start[i];
            if (type != "start" && type != "all") return;
            if (tile.x == x && tile.y == y) {
                this.data.start.splice(i, 1);
                return;
            } 
        }

        for (let i = 0; i < this.data.end.length; i++) {
            let tile = this.data.end[i];
            if (type != "end" && type != "all") return;
            if (tile.x == x && tile.y == y) {
                this.data.end.splice(i, 1);
                return;
            } 
        }
    }
}
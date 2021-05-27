class Engine {
    /**
     * @param {HTMLCanvasElement} canv 
     */
    constructor(canv) {
        this._zero = {
            x: canv.offsetWidth / 2,
            y: canv.offsetHeight / 2
        };
        this._tiles = [];
        this._grid = undefined;
        this._canvas = canv;
        this._context2D = canv.getContext("2d");
        this.scale = 1;
        this._isClicked = false;
    }

    get dpi() {
        return this._dpi;
    }

    set dpi(dpi) {
        this._dpi = dpi;
        this._canvas.width = this._canvas.offsetWidth * dpi;
        this._canvas.height = this._canvas.offsetHeight * dpi;
        this._context2D.scale(dpi, dpi);
        this._context2D.strokeStyle = this._context2D.fillStyle = "white";
    }

    init() {
        this.dpi = 4;

        this._context2D.strokeStyle = this._context2D.fillStyle = "white";
        this._grid = new PolarGrid(0, 0, 60, 4);

        this._canvas.onmousedown = (ev) => {
            this._isClicked = true;

            let x = (ev.offsetX - this._zero.x) / this.scale;
            let y = -(ev.offsetY - this._zero.y) / this.scale;

            for (let tile of this._tiles) {
                if (tile.checkClick(x, y, this._context2D, this.scale)) return;
            }
        }

        this._canvas.onmouseup = this._canvas.onmouseleave = () => {
            this._isClicked = false;

            this._tiles.forEach( (tile) => tile._isClicked = false);
        }

        this._canvas.onmousemove = (ev) => {
            let dx = ev.movementX / this.scale;
            let dy = -ev.movementY / this.scale;
            if (this._isClicked) this._tiles.forEach( (tile) => tile.move(dx, dy));
            this.draw();
        }
    }

    addTiles(...tiles) {
        this._tiles.push(...tiles);

        this.scale = this._grid.maxSize / Math.max(...this._tiles.map((arrow) => arrow._length));
    }

    clearTiles() {
        this._tiles = [];
    }

    reset() {
        this.clearTiles();
        this.draw();
    }

    draw() {
        this._context2D.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context2D.save();

        //scale sample
        let scaleSample = new Path2D(`m0 0 v -10 m0 5 h ${this._grid._step} m0 -5 v 10`);
        this._context2D.save();
        this._context2D.translate(20, 2 * this._zero.y - 10);
        this._context2D.textAlign = "center";
        this._context2D.fillText((this._grid._step / this.scale).toFixed(6), this._grid._step / 2, -10);
        this._context2D.stroke(scaleSample);
        this._context2D.restore();

        this._context2D.translate(this._zero.x, this._zero.y);
        this._grid.draw(this._context2D);
        this._tiles.forEach((tile) => tile.draw(this._context2D, this.scale));
        this._context2D.restore();
    }

    save() {
        let link = document.createElement("a");
        let tmp_ctx = document.createElement("canvas").getContext("2d");
        
        tmp_ctx.canvas.width = this._canvas.width;
        tmp_ctx.canvas.height = this._canvas.height;

        tmp_ctx.fillStyle = "white";
        tmp_ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        tmp_ctx.filter = "invert(1)";
        tmp_ctx.drawImage(this._canvas, 0, 0);

        link.href = tmp_ctx.canvas.toDataURL("image/jpg");
        link.download = "canvas.jpg";
        link.click();
    }
}
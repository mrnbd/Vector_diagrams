class Arrow {
    constructor(x=0, y=0, length, angle, name="") {
        this._x = x;
        this._y = y;
        this._length = length;
        this._angle = angle;
        this._nameOffset = {
            x: this._dxdy.dx / 2,
            y: this._dxdy.dy / 2
        }
        this._name = name;
        this._isClicked = false;
    }

    get _dxdy() {
        return {
            dx: this._length * Math.cos(this._angle),
            dy: this._length * Math.sin(this._angle)
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx, scale = 1) {
        ctx.save();

        ctx.lineWidth = 2;
        ctx.font = "600 16px Roboto";

        ctx.translate(this._x * scale, -this._y * scale);
        ctx.rotate(-this._angle);

        // body
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this._length * scale - 3 * ctx.lineWidth, 0);
        ctx.closePath();
        ctx.stroke();

        // head
        ctx.translate(this._length * scale, 0);
        let head = new Path2D();
        head.moveTo(0, 0);
        head.lineTo(-18 * ctx.lineWidth, 3 * ctx.lineWidth);
        head.lineTo(-18 * ctx.lineWidth, -3 * ctx.lineWidth);
        head.lineTo(0, 0);
        ctx.fill(head);

        // litera
        ctx.translate(-this._length * scale, 0);
        ctx.rotate(this._angle);
        ctx.fillText(this._name, this._nameOffset.x * scale, -this._nameOffset.y * scale);
        
        ctx.restore();
    }

    /** @param {CanvasRenderingContext2D} ctx */
    checkClick(x, y, ctx, scale) {
        let measure = ctx.measureText(this._name);
        let namePos = {
            x: this._x + this._nameOffset.x,
            y: this._y + this._nameOffset.y,
            dx: measure.width / scale,
            dy: (measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent) / scale
        };
        if (namePos.x < x && x < namePos.x + namePos.dx && namePos.y < y && y < namePos.y + namePos.dy) this._isClicked = true;
        return this._isClicked;
    }

    move(dx, dy) {
        if (this._isClicked) {
            this._nameOffset.x += dx;
            this._nameOffset.y += dy;
        }
    }
}
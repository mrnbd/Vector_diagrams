class PolarGrid {
    constructor(x, y, step, count) {
        this._x = x;
        this._y = y;
        this._step = step;
        this._count = count;
    } 

    get maxSize() {
        return this._step * this._count;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.translate(this._x, this._y);

        // cross
        ctx.beginPath();
        ctx.moveTo(-(this._count + 0.5) * this._step, 0);
        ctx.lineTo((this._count + 0.5) * this._step, 0);
        ctx.moveTo(0, -(this._count + 0.5) * this._step);
        ctx.lineTo(0, (this._count + 0.5) * this._step);
        ctx.closePath();
        ctx.stroke();

        // circles
        ctx.beginPath();
        for (let i = 0; i <= this._count; ++i) {
            ctx.arc(0, 0, i * this._step, 0, 2 * Math.PI);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}
class Complex {
    #a; #b
    /**
     * @param {Number} a 
     * @param {Number} b 
     */
    constructor(a=0, b=0) {
        this.#a = a;
        this.#b = b;
    }

    get a() { return this.#a; }

    get b() { return this.#b; }

    get r() {
        return Math.sqrt(this.#a*this.#a + this.#b*this.#b);
    }

    get theta() {
        return Math.atan2(this.#b, this.#a);
    }

    toVector(x0, y0, name) {
        return new Arrow(x0, y0, this.r, this.theta, name);
    }

    add(number) {
        switch (number.constructor) {
            case Complex:
                this.#a = +(this.#a + number.a).toFixed(10);
                this.#b = +(this.#b + number.b).toFixed(10);
            break;

            case Number:
                this.#a = +(this.#a + number).toFixed(10);
            break;

            default:
                throw Error("number must be Complex or Number.")
        }

        return this;
    }

    static sum(...numbers) {
        return numbers.reduce(
            (prev, curr) => prev.add(curr),
        new Complex(0, 0));
    }
}
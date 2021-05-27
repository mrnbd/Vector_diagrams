class FormParser {
    #parameters = "UI"
    /** @param {HTMLElement} inputElement */
    constructor(inputElement, parameter = "I") {
        this._parameter = parameter;
        this._inputs = ["A", "B", "C"].map((phase) => {
            return {
                name: phase,
                parts: ["1", "2", "0"].map((part) => {
                    return {
                        name: part,
                        /** @type {HTMLInputElement} */
                        form: inputElement.querySelector(`input.${phase}.p${part}`)
                    };
                })
            };
        });
    }

    /** @param {String} str */
    #str2val(str) {
        const testPattern = /^(?=[j.\d+-])(?<real>[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?![j.\d]))?(?<imag>[+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)?j)?$/

        let value = null;
        let match = testPattern.exec(str);

        if (match) {
            let real = match.groups.real;
            let imag = match.groups.imag;

            if (real) real = parseFloat(real);
            else real = 0;

            if (imag) {
                if (/^[+-]?j$/.test(imag)) imag = imag.replace("j", "1");
                else imag = imag.replace("j", "");

                imag = parseFloat(imag);
            } else imag = 0;

            value = new Complex(real, imag);
        }

        return value;
    }

    proceed() {
        for (let phase of this._inputs) {
            phase.value = 0;
            for (let part of phase.parts) {
                part.form.parentNode.classList.remove("invalid");
                part.value = this.#str2val(part.form.value.toLowerCase());
                if (part.value === null) {
                    part.form.parentNode.classList.add("invalid");
                    return false;
                };
                phase.value = Complex.sum(phase.value, part.value);
            }
        }
        return true;
    }

    changeParameter() {
        document.querySelector(`#input>table>thead>tr>th>span.${this._parameter}`).classList.remove("selected");
        this._parameter = this.#parameters.replace(this._parameter, "");
        document.querySelector(`#input>table>thead>tr>th>span.${this._parameter}`).classList.add("selected");

        document.querySelectorAll("#input span.p").forEach( (el) => el.innerHTML = this._parameter);
    }

    get vectors() {
        let vectors = [];

        this._inputs.forEach(
            (phase) => {
                if (phase.value.r !== 0) vectors.push(phase.value.toVector(0, 0, `${this._parameter}${phase.name.toLowerCase()}`));
                phase.parts.reduce(
                (coords, part) => {
                    if (part.value.r !== 0) vectors.push(part.value.toVector(coords[0], coords[1], `${this._parameter}${phase.name.toLowerCase()}${part.name}`));
                    return [coords[0] + part.value.a, coords[1] + part.value.b];
                },
            [0, 0]);
            }
        );

        return vectors;
    }
}
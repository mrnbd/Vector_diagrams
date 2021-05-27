function main() {
    const parameters = ["U", "I"];
    const input = document.querySelector("#input");
    const parser = new FormParser(input);
    const engine = new Engine(document.querySelector("#canv"));

    engine.init();
    engine.addTiles(new Arrow(0, 0, 120, Math.PI / 4, "Ic0"));
    engine.draw();

    input.querySelector(".switcher").onclick = () => parser.changeParameter();

    input.querySelector("#drawButton").onclick = () => {
        if (!parser.proceed()) return;
        engine.reset();
        engine.addTiles(...parser.vectors);
        engine.draw();
    };

    input.querySelector("#saveButton").onclick = () => engine.save();
}

function toDegrees(radianAngle) {
    return radianAngle / Math.PI * 180;
}

window.onload = main;
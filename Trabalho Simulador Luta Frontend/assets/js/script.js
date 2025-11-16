// ADICIONADO: Declara as variáveis aqui para que os listeners de reinício possam acessá-las
let stage;
let log;

document.getElementById("start-button").addEventListener("click", () => {
    const p1NameInput = document.getElementById("p1-name").value;
    const p1Class = document.getElementById("p1-class").value;
    const p1Image = document.querySelector(
        'input[name="p1-image"]:checked'
    ).value;
    const p1Name = p1NameInput || "Jogador 1";

    const p2NameInput = document.getElementById("p2-name").value;
    const p2Class = document.getElementById("p2-class").value;
    const p2Image = document.querySelector(
        'input[name="p2-image"]:checked'
    ).value;
    const p2Name = p2NameInput || "Jogador 2";

    function createCharacter(className, name) {
        switch (className) {
            case "knight":
                return new Knight(name);
            case "sorcerer":
                return new Sorcerer(name);
            case "chicken":
                return new ChickenLittle(name);
            case "bigmac":
                return new BigMac(name);
            default:
                return new Knight(name);
        }
    }

    let fighter_um = createCharacter(p1Class, p1Name);
    let fighter_dois = createCharacter(p2Class, p2Name);

    log = new Log(document.querySelector(".log"));
    log.clear();

    stage = new Stage(
        fighter_um,
        fighter_dois,
        document.querySelector("#char"),
        document.querySelector("#monster"),
        log,
        p1Image,
        p2Image
    );

    document.getElementById("selection-screen").style.display = "none";
    document.getElementById("game-area").classList.remove("hidden");
    
    document.getElementById("end-game-options").classList.add("hidden");

    stage.start();
});

document.getElementById("restart-button").addEventListener("click", () => {
    if (stage && log) {
        stage.fighter1.life = stage.fighter1.maxLife;
        stage.fighter2.life = stage.fighter2.maxLife;

        log.clear();
        log.addMesage("Batalha reiniciada!", "system");

        stage.turn = stage.fighter1;

        stage.update();

        document.getElementById("end-game-options").classList.add("hidden");
    }
});

document.getElementById("selection-button").addEventListener("click", () => {
    location.reload();
});
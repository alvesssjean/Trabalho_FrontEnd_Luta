class Character {
    _life = 1;
    maxLife = 1;
    attack = 0;
    defense = 0;

    constructor(name) {
        this.name = name;
    }

    get life() {
        return this._life.toFixed(2);
    }

    set life(newLife) {
        let numLife = parseFloat(newLife);
        
        if (isNaN(numLife)) {
            numLife = 0;
        }
        this._life = numLife < 0 ? 0 : numLife;
    }
}

class Knight extends Character {
    constructor(name) {
        super(name);
        this.life = 100;
        this.attack = 10;
        this.defense = 8;
        this.maxLife = this.life;
    }
}

class Sorcerer extends Character {
    constructor(name) {
        super(name);
        this.life = 80;
        this.attack = 15;
        this.defense = 3;
        this.maxLife = this.life;
    }
}

class ChickenLittle extends Character {
    constructor(name) {
        super(name);
        this.life = 40;
        this.attack = 4;
        this.defense = 4;
        this.maxLife = this.life;
    }
}

class BigMac extends Character {
    constructor(name) {
        super(name);
        this.life = 120;
        this.attack = 16;
        this.defense = 6;
        this.maxLife = this.life;
    }
}

class Stage {
    constructor(
        fighter1,
        fighter2,
        fighter1EL,
        fighter2EL,
        logObject,
        f1Image,
        f2Image
    ) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.fighter1EL = fighter1EL;
        this.fighter2EL = fighter2EL;
        this.log = logObject;
        this.f1Image = f1Image;
        this.f2Image = f2Image;
        this.turn = this.fighter1;
    }

    start() {
        this.fighter1EL.querySelector("img").src = this.f1Image;
        this.fighter2EL.querySelector("img").src = this.f2Image;

        this.update();

        this.fighter1EL
            .querySelector(".attack-button")
            .addEventListener("click", () => {
                if (this.turn === this.fighter1) {
                    this.doAttack(this.fighter1, this.fighter2);
                }
            });

        this.fighter2EL
            .querySelector(".attack-button")
            .addEventListener("click", () => {
                if (this.turn === this.fighter2) {
                    this.doAttack(this.fighter2, this.fighter1);
                }
            });
    }

    doAttack(attacking, attacked) {
        if (attacking.life <= 0) {
            this.log.addMesage("Você está morto! Morto não ataca!", "system");
            return;
        }
        if (attacked.life <= 0) {
            this.log.addMesage(
                `Você é covarde, ${attacking.name}! ${attacked.name} já está morto...`,
                "system"
            );
            return;
        }

        let attackFactor = (Math.random() * 2).toFixed(2);
        let defenseFactor = (Math.random() * 2).toFixed(2);
        let actualAttack = attacking.attack * attackFactor;
        let actualDefense = attacked.defense * defenseFactor;
        let life_recovery = (actualDefense - actualAttack).toFixed(2);
        let extraTurn = actualAttack < 1;
        let attackerType = attacking === this.fighter1 ? "hero" : "monster";

        if (actualAttack > actualDefense) {
            attacked.life -= actualAttack;
            this.log.addMesage(
                `${attacking.name} causou ${actualAttack.toFixed(2)} de dano em ${
                    attacked.name
                }`,
                attackerType
            );
        } else {
            this.log.addMesage(
                `${attacked.name} conseguiu defender o ataque de ${attacking.name} e recuperou ${life_recovery}HP`,
                attackerType
            );
        }

        if (attacked.life <= 0) {
            this.log.addMesage(`${attacked.name} foi derrotado!`, "system");
            this.log.addMesage(
                `🎉 ${attacking.name} é o VENCEDOR! 🎉`,
                "system"
            );
            this.endGame();
            return;
        }

        if (extraTurn) {
            this.log.addMesage(
                `Ataque muito fraco! ${attacking.name} ganha mais um turno.`,
                "system"
            );
        } else {
            this.turn =
                this.turn === this.fighter1 ? this.fighter2 : this.fighter1;
        }

        this.update();
    }

    update() {
        this.fighter1EL.querySelector(
            ".name"
        ).innerHTML = `${this.fighter1.name} - ${this.fighter1.life} HP`;
        let f1pct = (this.fighter1.life / this.fighter1.maxLife) * 100;
        this.fighter1EL.querySelector(".bar").style.width = `${f1pct}%`;
        this.fighter1EL.querySelector(".attack-button").disabled =
            this.turn !== this.fighter1;

        this.fighter2EL.querySelector(
            ".name"
        ).innerHTML = `${this.fighter2.name} - ${this.fighter2.life} HP`;
        let f2pct = (this.fighter2.life / this.fighter2.maxLife) * 100;
        this.fighter2EL.querySelector(".bar").style.width = `${f2pct}%`;
        this.fighter2EL.querySelector(".attack-button").disabled =
            this.turn !== this.fighter2;
    }

    endGame() {
        this.fighter1EL.querySelector(".attack-button").disabled = true;
        this.fighter2EL.querySelector(".attack-button").disabled = true;

        document.getElementById("end-game-options").classList.remove("hidden");
    }
}

class Log {
    list = [];

    constructor(ListEL) {
        this.ListEL = ListEL;
    }

    addMesage(msg, type = "system") {
        this.list.push({ text: msg, type: type });
        this.render();
    }

    render() {
        this.ListEL.innerHTML = "";
        for (let i in this.list) {
            let logItem = this.list[i];
            this.ListEL.innerHTML += `<li class="log-${logItem.type}">${logItem.text}</li>`;
        }
        this.ListEL.scrollTop = this.ListEL.scrollHeight;
    }

    clear() {
        this.list = [];
        this.render();
    }
}
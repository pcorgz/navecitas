var loadState = {

    init: function () {
        this.version = "0.0.0.4";
    },

    preload: function () {
        var loadingLabel = game.add.text(80, 150, "loading...", { font: "30px Courier", fill: "#333" });
        game.add.tween(loadingLabel.scale).to({ x: 2, y: 2 }, 500, Phaser.Easing.Linear.None, true, 1000);

        game.load.image("player", "assets/player.png?v=" + this.version);
        game.load.image("bullet", "assets/bullet.png?v=" + this.version);
        game.load.image("enemy", "assets/enemy.png?v=" + this.version);
        game.load.image("healthbar_container", "assets/healthbar_container.png?v=" + this.version);
        game.load.image("playerHealthbar", "assets/player_healthbar.png?v=" + this.version);

        //game.load.image("arrowup", "assets/arrow_up.png?v=" + this.version);

        game.load.image("bg1", "assets/bg_1.png?v=" + this.version);
        game.load.image("bg2", "assets/bg_2.png?v=" + this.version);
        game.load.image("bg3", "assets/bg_3.png?v=" + this.version);

    },

    create: function () {
        game.state.start("menu");
    }
}

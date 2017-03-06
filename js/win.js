var winState = {

  create: function () {
    var winLabel = game.add.text(80, 80, "Ganaste :D!", { font: "50px Arial", fill: "#222" });

    var restartLabel = game.add.text(80, game.world.height - 80, "Presiona [R] para volver a jugar", { font: "25px Arial", fill: "#333" });

    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);

    rkey.onDown.addOnce(this.restart, this);

    this.player = game.add.sprite(game.world.width / 2, game.world.height / 2, "player");
    this.player.anchor.setTo(0.5);
  },

  update: function () {
    this.player.rotation += .15;
  },

  restart: function () {
      game.state.start("play");
  }

};

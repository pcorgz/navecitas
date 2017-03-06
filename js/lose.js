var loseState = {

  create: function () {
    var loseLabel = game.add.text(80, 80, "Perdiste :(", { font: "50px Arial", fill: "#222" });

    var restartLabel = game.add.text(80, game.world.height - 80, "Presiona [R] para volver a jugar", { font: "25px Arial", fill: "#333" });

    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);

    rkey.onDown.addOnce(this.restart, this);
  },

  restart: function () {
      game.state.start("play");
  }

};

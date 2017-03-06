var menuState = {
  create: function () {
    var nameLabel = game.add.text(80, 80, "Navecitas ~", { font: "50px Arial", fill: "#222" });

    var instructions = game.add.text(80, 280, "Logra 600 puntos para ganar\n" +
                                              "Instrucciones:\n" +
                                              "-  Muévete con [W] y [S]\n" +
                                              "-  Apunta con el mouse y click para disparar");

    var startLabel = game.add.text(80, game.world.height - 80, "Presiona [R] para iniciar", { font: "25px Arial", fill: "#333" });

    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);

    rkey.onDown.addOnce(this.start, this);
  },

  start: function () {
    game.state.start("play");
  }
};

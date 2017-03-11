var Navecitas = Navecitas || {};

Navecitas.MenuState = function () {
  "use strict";
  Phaser.State.call(this);
};

Navecitas.prototype = Object.create(Phaser.State.prototype);
Navecitas.prototype.constructor = Navecitas.MenuState;

Navecitas.MenuState.prototype.create = function () {
  "use strict";
  var nameLabel = this.game.add.text(80, 80, "Navecitas ~", 
                                { font: "50px Arial", fill: "#222" });

  var instructions = this.game.add.text(80, 280, "Logra 600 puntos para ganar\n" +
                                "Instrucciones:\n" +
                                "-  Muévete con [W] y [S]\n" +
                                "-  Apunta con el mouse y click para disparar");

  var startLabel = this.game.add.text(80, this.game.world.height - 80, 
                                  "Presiona [R] para iniciar", 
                                  { font: "25px Arial", fill: "#333" });

  var rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

  rkey.onDown.addOnce(this.start, this);
};

Navecitas.MenuState.prototype.start = function () {
  "use strict";
  this.game.state.start("PlayState");
};

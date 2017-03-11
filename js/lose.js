var Navecitas = Navecitas || {};

Navecitas.LoseState = function () {
  "use strict";
  Phaser.State.call(this);
};

Navecitas.prototype = Object.create(Phaser.State.prototype);
Navecitas.prototype.constructor = Navecitas.LoseState;

Navecitas.LoseState.prototype.create = function () {
  "use strict";
  var loseLabel = this.game.add.text(80, 80, "Perdiste :(", 
                                      { font: "50px Arial", fill: "#222" });

  var restartLabel = this.game.add.text(80, game.world.height - 80, 
                                        "Presiona [R] para volver a jugar",
                                        { font: "25px Arial", fill: "#333" });

  var rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

  rkey.onDown.addOnce(this.restart, this);
};

Navecitas.LoseState.prototype.restart = function () {
  "use strict";
  this.game.state.start("PlayState");
};

var Navecitas = Navecitas || {};

Navecitas.WinState = function () {
  "use strict";
  Phaser.State.call(this);
};

Navecitas.prototype = Object.create(Phaser.State.prototype);
Navecitas.prototype.constructor = Navecitas.WinState;

Navecitas.WinState.prototype.create = function () {
  "use strict";
  var winLabel = this.game.add.text(80, 80, "Ganaste :D!", 
                                    { font: "50px Arial", fill: "#222" });

  var restartLabel = this.game.add.text(80, this.game.world.height - 80, 
                                        "Presiona [R] para volver a jugar", 
                                        { font: "25px Arial", fill: "#333" });

  var rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

  rkey.onDown.addOnce(this.restart, this);

  this.player = this.game.add.sprite(this.game.world.width / 2,
                                      game.world.height / 2, "player");
  this.player.anchor.setTo(0.5);
};

Navecitas.WinState.prototype.update = function () {
  "use strict";
  this.player.rotation += .15;
};

Navecitas.WinState.prototype.restart = function () {
  "use strict";
  this.game.state.start("PlayState");
};

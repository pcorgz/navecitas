var Navecitas = Navecitas || {};

Navecitas.BootState = function () {
  "use strict";
  Phaser.State.call(this);
};

Navecitas.prototype = Object.create(Phaser.State.prototype);
Navecitas.prototype.constructor = Navecitas.BootState;
  
Navecitas.BootState.prototype.create = function () {
  "use strict";
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.renderer.renderSession.roundPixels = true;

  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.pageAlignHorizontally = true;
  this.game.scale.pageAlignVertically = true;

  this.game.stage.backgroundColor = "#4e5dff";

  this.game.state.start("LoadState");
};

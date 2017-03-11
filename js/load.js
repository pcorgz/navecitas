var Navecitas = Navecitas || {};

Navecitas.LoadState = function () {
  "use strict";
  Phaser.State.call(this);
};

Navecitas.prototype = Object.create(Phaser.State.prototype);
Navecitas.prototype.constructor = Navecitas.LoadState;

Navecitas.LoadState.prototype.init = function () {
  this.version = "0.0.0.4";
};

Navecitas.LoadState.prototype.preload = function () {
  "use strict";
  var loadingLabel = this.game.add.text(80, 150, "loading...", 
                                        { font: "30px Courier", fill: "#333" });
  
  this.game.add.tween(loadingLabel.scale)
        .to({ x: 2, y: 2 }, 500, Phaser.Easing.Linear.None, true, 1000);
  
  this.game.load.image("player", "assets/player.png?v=" + this.version);
  this.game.load.image("bullet", "assets/bullet.png?v=" + this.version);
  this.game.load.image("enemy", "assets/enemy.png?v=" + this.version);
  this.game.load.image("healthbarContainer", 
                        "assets/healthbar_container.png?v=" + this.version);
  this.game.load.image("playerHealthbar", 
                        "assets/player_healthbar.png?v=" + this.version);
  
  //game.load.image("arrowup", "assets/arrow_up.png?v=" + this.version);
  
  this.game.load.image("bg1", "assets/bg_1.png?v=" + this.version);
  this.game.load.image("bg2", "assets/bg_2.png?v=" + this.version);
  this.game.load.image("bg3", "assets/bg_3.png?v=" + this.version);
  
  this.game.load.audio("shot", "assets/shot.wav?v=" + this.version);

};

Navecitas.LoadState.prototype.create = function () {
  "use strict";
  this.game.state.start("MenuState");
};

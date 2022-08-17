var Navecitas = Navecitas || {};

Navecitas.PlayState = function () {
  "use strict";
  Phaser.State.call(this);
};

Navecitas.prototype = Object.create(Phaser.State.prototype);
Navecitas.prototype.constructor = Navecitas.PlayState;

Navecitas.PlayState.prototype.init = function () {
  "use strict";
  this.player = null;
  this.enemies = {
    spawnRate: this.randomIntFromInterval(200, 500),
    lastSpawned: this.game.time.time,
    speed: -400,
    group: null,
    health: 100,
    points: 20
  };
  this.bullets = null;

  this.fireRate = 200;
  this.nextFire = 0;
};

Navecitas.PlayState.prototype.create = function () {
  "use strict";
  this.keyboard = this.game.input.keyboard;

  this.bg1 = this.game.add.tileSprite(0, 0, 2400, 675, "bg1");
  this.bg2 = this.game.add.tileSprite(0, 0, 2400, 675, "bg2");

  this.bullets = this.game.add.physicsGroup();

  this.player = this.game.add.sprite(96, this.game.world.height / 2, "player");
  this.player.health = 100;
  this.player.score = 0;
  this.game.physics.arcade.enable(this.player);
  this.player.body.immovable = true;
  this.player.anchor.setTo(0.5);
  this.player.body.collideWorldBounds = true;
  this.player.body.setSize(56, 36, 0, 2);

  this.player.maxRotation = 75 * Math.PI / 180; // 60° in radians
  this.player.minRotation = -75 * Math.PI / 180; // -60° in radians

  this.enemies.group = this.game.add.physicsGroup();
  for (var en = 0; en < 15; en++) {
    var enemy = this.enemies.group.create(800, 0, "enemy");
    enemy.kill();
  }
  this.game.physics.arcade.enable(this.enemies.group);
  this.enemies.group.setAll("anchor.x", 0.5);
  this.enemies.group.setAll("anchor.y", 0.5);
  this.enemies.group.setAll("body.immovable", true);
  this.enemies.group.setAll("health", this.enemies.health);

  this.game.physics.arcade.enable(this.bullets);
  this.bullets.createMultiple(20, "bullet");
  this.bullets.setAll("checkWorldBounds", true);
  this.bullets.setAll("outOfBoundsKill", true);
  this.bullets.setAll("anchor.x", 0.5);
  this.bullets.setAll("anchor.y", 0.5);

  this.bg3 = this.game.add.tileSprite(0, 0, 2400, 675, "bg3");

  this.playerHealthbar = this.game.add.sprite(150, 30, "playerHealthbar");
  this.playerHealthbar.cropEnabled = true;
  this.healthBarContainer = this.game.add.sprite(150, 30, "healthbarContainer");

  this.scoreLabel = this.game.add.text(150, this.game.world.height - 30, 
                                        "Score: " + this.player.score);

  this.shotSound = this.game.add.audio("shot");
  this.shotSound.volume = .5;

  //var btnUp = this.game.add.button(100, this.game.world.height - 250, "arrowup", null, this);
  //btnUp.scale.setTo(0.25, 0.25);

  //var btnDown = this.game.add.button(100, this.game.world.height - 150, "arrowup", null, this);
  //btnDown.scale.setTo(0.25, 0.25);
  //btnDown.anchor.setTo(1, 1);
  //btnDown.angle = 180;
};

Navecitas.PlayState.prototype.update = function () {
  "use strict";
  if (!this.player.alive) {
      return;
  }
  this.bg1.tilePosition.x -= 5;
  this.bg2.tilePosition.x -= 10;
  this.bg3.tilePosition.x -= 20;
  this.updateEnemies();

  var angleToPointer = this.game.physics.arcade.angleToPointer(this.player);
  if (angleToPointer >= this.player.minRotation && 
      angleToPointer <= this.player.maxRotation) {
    this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
  }

  if (this.game.input.activePointer.isDown) {
    this.playerFire();
  }

  if (this.keyboard.isDown(Phaser.Keyboard.W)) {
    this.player.body.velocity.y = -275;
  } else if (this.keyboard.isDown(Phaser.Keyboard.S)) {
    this.player.body.velocity.y = 275;
  } else {
    this.player.body.velocity.y = 0;
  }

  this.playerHealthbar.width = this.player.health;
  this.scoreLabel.setText("Score: " + this.player.score);

  if (this.player.score >= 600) {
    this.game.state.start("WinState");
  }
};
 
Navecitas.PlayState.prototype.playerFire = function () {
  "use strict";
  if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
    this.nextFire = this.game.time.now + this.fireRate;

    this.shotSound.play();

    var bullet = this.bullets.getFirstDead();
    bullet.rotation = this.player.rotation;

    bullet.reset(this.player.x, this.player.y);

    var point = this.game.physics.arcade
                    .velocityFromRotation(bullet.rotation, 900);

    bullet.body.velocity.x = point.x;
    bullet.body.velocity.y = point.y;
  }
};

Navecitas.PlayState.prototype.updateEnemies = function () {
  "use strict";
  this.game.physics.arcade.collide(this.player, this.enemies.group,
                                    this.playerCollideEnemy, null, this);
  this.game.physics.arcade.collide(this.bullets, this.enemies.group,
                                    this.bulletCollideEnemy, null, this);

  var currentTime = this.game.time.time;

  if (currentTime - this.enemies.lastSpawned > this.enemies.spawnRate &&
      this.enemies.group.countDead() > 0) {
    this.enemies.spawnRate = this.randomIntFromInterval(200, 500);
    this.enemies.lastSpawned = currentTime;

    var enemyX = this.randomIntFromInterval(1200, 1300);
    var enemyY = this.randomIntFromInterval(50, 625);

    var enemy = this.enemies.group.getFirstDead();
    enemy.body.enable = true;
    enemy.reset(enemyX, enemyY, this.enemies.health);
    enemy.rotation = 0;

    enemy.body.velocity.x = this.enemies.speed;
  }

  this.enemies.group.forEach(function (enemy) {
    if (enemy.x < -70 && enemy.alive) {
      enemy.kill();
    }
  });
};

Navecitas.PlayState.prototype.playerCollideEnemy = function (player, enemy) {
  "use strict";
  if (player.health - 20 <= 0) {
      this.playerKill();
  } else {
      player.damage(20);
      player.score += 5;
      this.enemyKilled(enemy);
  }
};

Navecitas.PlayState.prototype.bulletCollideEnemy = function (bullet, enemy) {
  "use strict";
  bullet.kill();
  this.player.score += 5;
  if (enemy.health > 60) {
    enemy.damage(60);
  } else {
    this.enemyKilled(enemy);
    this.player.score += this.enemies.points;
  }
};

Navecitas.PlayState.prototype.enemyKilled = function (enemy) {
  "use strict";
  enemy.body.enable = false;
  var fallingTween = this.game.add.tween(enemy);
  fallingTween.to({ x: enemy.x + this.enemies.speed, y: enemy.y + 675, rotation: 18 }, 1600, Phaser.Easing.Linear.None);
  fallingTween.onComplete.addOnce(function () {
    if (enemy.alive) {
      enemy.kill();
    }
  }, this);
  fallingTween.start();
};

Navecitas.PlayState.prototype.randomIntFromInterval = function (min, max) {
  "use strict";
  return Math.floor(Math.random() * (max - min + 1) + min);
};

Navecitas.PlayState.prototype.playerKill = function () {
  "use strict";
  this.player.health = 1;
  this.player.body.enable = false;
  this.player.alive = false;
  var fallingTween = this.game.add.tween(this.player);
  fallingTween.to({ x: this.player.x + 300, y: this.player.y + 675, rotation: 18 }, 1600, Phaser.Easing.Linear.None);
  fallingTween.onComplete.addOnce(function () {
    this.player.kill();
    this.game.state.start("LoseState");
  }, this);
  fallingTween.start();
};

Navecitas.PlayState.prototype.render = function () {
  // this.game.debug.body(this.player);

  // this.enemies.group.forEachAlive(function (enemy) {
  //   //game.debug.body(enemy);
  //   //game.debug.text(enemy.health, enemy.x, enemy.y + 30);
  //   this.game.debug.text(enemy.z, enemy.x, enemy.y + 30);
  // }, this);

  // this.game.debug.text(this.bg1.z, 0, 32);
  // this.game.debug.text(this.bg2.z, 0, 48);

  // this.game.debug.text(this.player.z, this.player.x, this.player.y + 30);

  // this.game.debug.text(this.enemies.group.countLiving() + ' / ' + this.enemies.group.countDead(), 32, 32, "Arial 50px");

  // this.game.debug.text(this.player.health, 32, 450);
};

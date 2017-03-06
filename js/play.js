var playState = {

  init: function () {
    this.player = null;
    this.enemies = {
      spawnRate: this.randomIntFromInterval(200, 500),
      lastSpawned: game.time.time,
      speed: -400,
      group: null,
      health: 100,
      points: 20
    };
    this.bullets = null;

    this.fireRate = 200;
    this.nextFire = 0;
  },

  create: function () {
    this.keyboard = game.input.keyboard;

    this.bg1 = game.add.tileSprite(0, 0, 2400, 675, "bg1");
    this.bg2 = game.add.tileSprite(0, 0, 2400, 675, "bg2");

    this.bullets = game.add.physicsGroup();

    this.player = game.add.sprite(96, game.world.height / 2, "player");
    this.player.health = 100;
    this.player.score = 0;
    game.physics.arcade.enable(this.player);
    this.player.body.immovable = true;
    this.player.anchor.setTo(0.5);
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(56, 36, 0, 2);

    this.player.maxRotation = 75 * Math.PI / 180; // 60° in radians
    this.player.minRotation = -75 * Math.PI / 180; // -60° in radians

    this.enemies.group = game.add.physicsGroup();
    for (var en = 0; en < 15; en++) {
      var enemy = this.enemies.group.create(800, 0, "enemy");
      enemy.kill();
    }
    game.physics.arcade.enable(this.enemies.group);
    this.enemies.group.setAll("anchor.x", 0.5);
    this.enemies.group.setAll("anchor.y", 0.5);
    this.enemies.group.setAll("body.immovable", true);
    this.enemies.group.setAll("health", this.enemies.health);

    game.physics.arcade.enable(this.bullets);
    this.bullets.createMultiple(20, "bullet");
    this.bullets.setAll("checkWorldBounds", true);
    this.bullets.setAll("outOfBoundsKill", true);
    this.bullets.setAll("anchor.x", 0.5);
    this.bullets.setAll("anchor.y", 0.5);

    this.bg3 = game.add.tileSprite(0, 0, 2400, 675, "bg3");

    this.playerHealthbar = game.add.sprite(150, 30, "playerHealthbar");
    this.playerHealthbar.cropEnabled = true;
    this.healthBarContainer = game.add.sprite(150, 30, "healthbar_container");

    this.scoreLabel = game.add.text(150, game.world.height - 30, "Score: " + this.player.score);

    //var btnUp = game.add.button(100, game.world.height - 250, "arrowup", null, this);
    //btnUp.scale.setTo(0.25, 0.25);

    //var btnDown = game.add.button(100, game.world.height - 150, "arrowup", null, this);
    //btnDown.scale.setTo(0.25, 0.25);
    //btnDown.anchor.setTo(1, 1);
    //btnDown.angle = 180;
  },

  update: function () {
    if (!this.player.alive) {
        return;
    }
    this.bg1.tilePosition.x -= 5;
    this.bg2.tilePosition.x -= 10;
    this.bg3.tilePosition.x -= 20;
    this.updateEnemies();

    var angleToPointer = game.physics.arcade.angleToPointer(this.player);
    if (angleToPointer >= this.player.minRotation && angleToPointer <= this.player.maxRotation) {
      this.player.rotation = game.physics.arcade.angleToPointer(this.player);
    }

    if (game.input.activePointer.isDown) {
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
      game.state.start("win");
    }
  },

  playerFire: function () {
    if (game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = game.time.now + this.fireRate;

      var bullet = this.bullets.getFirstDead();
      bullet.rotation = this.player.rotation;

      bullet.reset(this.player.x, this.player.y);

      var point = game.physics.arcade.velocityFromRotation(bullet.rotation, 900);

      bullet.body.velocity.x = point.x;
      bullet.body.velocity.y = point.y;
    }
  },

  updateEnemies: function () {
    game.physics.arcade.collide(this.player, this.enemies.group, this.playerCollideEnemy, null, this);
    game.physics.arcade.collide(this.bullets, this.enemies.group, this.bulletCollideEnemy, null, this);

    var currentTime = game.time.time;

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
  },

  playerCollideEnemy: function (player, enemy) {
    if (player.health - 20 <= 0) {
        this.playerKill();
    } else {
        player.damage(20);
        player.score += 5;
        this.enemyKilled(enemy);
    }
  },

  bulletCollideEnemy: function (bullet, enemy) {
    bullet.kill();
    this.player.score += 5;
    if (enemy.health > 60) {
      enemy.damage(60);
    } else {
      this.enemyKilled(enemy);
      this.player.score += this.enemies.points;
    }
  },

  enemyKilled: function (enemy) {
    enemy.body.enable = false;
    var fallingTween = game.add.tween(enemy);
    fallingTween.to({ x: enemy.x + this.enemies.speed, y: enemy.y + 675, rotation: 18 }, 1600, Phaser.Easing.Linear.None);
    fallingTween.onComplete.addOnce(function () {
      if (enemy.alive) {
        enemy.kill();
      }
    }, this);
    fallingTween.start();
  },

  randomIntFromInterval: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  playerKill: function () {
    this.player.body.enable = false;
    this.player.alive = false;
    var fallingTween = game.add.tween(this.player);
    fallingTween.to({ x: this.player.x + 300, y: this.player.y + 675, rotation: 18 }, 1600, Phaser.Easing.Linear.None);
    fallingTween.onComplete.addOnce(function () {
      this.player.kill();
      game.state.start("lose");
    }, this);
    fallingTween.start();
  },

  render: function () {
    // game.debug.body(this.player);

    // this.enemies.group.forEachAlive(function (enemy) {
    //   //game.debug.body(enemy);
    //   //game.debug.text(enemy.health, enemy.x, enemy.y + 30);
    //   game.debug.text(enemy.z, enemy.x, enemy.y + 30);
    // }, this);

    // game.debug.text(this.bg1.z, 0, 32);
    // game.debug.text(this.bg2.z, 0, 48);

    // game.debug.text(this.player.z, this.player.x, this.player.y + 30);

    // game.debug.text(this.enemies.group.countLiving() + ' / ' + this.enemies.group.countDead(), 32, 32, "Arial 50px");

    // game.debug.text(this.player.health, 32, 450);
  }

};


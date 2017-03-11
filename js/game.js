var Phaser = Phaser || {};
var Navecitas = Navecitas || {};

var game = new Phaser.Game(1200, 675, Phaser.CANVAS, "");

game.state.add("BootState", new Navecitas.BootState());
game.state.add("LoadState", new Navecitas.LoadState());
game.state.add("MenuState", new Navecitas.MenuState());
game.state.add("PlayState", new Navecitas.PlayState());
game.state.add("WinState", new Navecitas.WinState());
game.state.add("LoseState", new Navecitas.LoseState());

game.state.start("BootState");
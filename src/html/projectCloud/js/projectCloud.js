'use strict';
if(typeof nullandvoidgaming === "undefined" || typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.com.makeSubNameSpace("com.projectCloud", nullandvoidgaming);





nullandvoidgaming.com.projectCloud.Init = function() {
	var projectCloud = nullandvoidgaming.com.projectCloud;
	projectCloud.time = new Date();
	projectCloud.cam = null;
	nullandvoidgaming.com.Engine.Game.state = {
		running: true,
		scene: new nullandvoidgaming.com.Engine.Game.Map()
	}
	projectCloud.gameArea = {
		canvas: document.createElement("canvas"),
		start : function() {
				var projectCloud = nullandvoidgaming.com.projectCloud;
				this.canvas.width = 640;
				this.canvas.height = 480;
				this.context = this.canvas.getContext("2d");
				var placement = document.getElementById("projectCloud");
				if(!placement)
					throw new Error("No ID: projectCloud");
				placement.appendChild(this.canvas);
				//document.body.insertBefore(this.canvas, document.body.childNodes[0]);
				this.interval = setInterval(updateGame, 20);
				this.canvas.addEventListener('blur', this.loseFocus);
			},
		clear : function() {
				this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
			},
		loseFocus : function() {
				var projectCloud = nullandvoidgaming.com.projectCloud;
			}
		};
}

function loadGame() {
	var Display = nullandvoidgaming.com.Engine.IO.Display;
	var Game = nullandvoidgaming.com.Engine.Game;
	var Entity = nullandvoidgaming.com.Engine.Entity;
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var projectCloud = nullandvoidgaming.com.projectCloud;
	projectCloud.cam = new Display.NewCamera(projectCloud.gameArea.context, 0,0);
	Display.setImage("player",document.getElementById("player"));
	Display.setImage("outside",document.getElementById("TS_outside"));
	//var controller = new Input.KeyBoardController();
	var controller = new Input.MouseController(projectCloud.gameArea.canvas);
	var p1 =  Entity.NewPlayer("player",controller);
	controller.setControlled(p1,projectCloud.cam);
	Game.state.scene.entities[Game.state.scene.entities.length] =  p1;
	projectCloud.cam.followEntity(p1,0.07);
	var ent = new Entity.EntBuilder.newEntity();
	ent.frame = new Entity.EntBuilder.newFrame(Display.getImage("player"),54,54,60);
	ent.position.width = 48; ent.position.height = 48;
	ent.position.vector.x = 100; ent.position.vector.y = 100;
	ent.frame.xBuffer = 10;
	ent.collider = new Entity.EntBuilder.newCollider(ent,24,24,8,24);
	Game.state.scene.entities[Game.state.scene.entities.length] = ent;
	Game.state.scene.tileSize = 64;
	Game.state.scene.horTile = 20;
	Game.state.scene.verTile = 20;
	for (var y = 0; y < Game.state.scene.verTile; y++) {
		for (var x = 0; x < Game.state.scene.horTile; x++) {
			var tile = new Entity.Tile(
				x,
				y,
				Display.getImage("outside")
				);
			if (x == 0) { tile.frame.horizontal = 0; }
			if (y == 0) { tile.frame.vertical = 0; }
			if( x == 19) { tile.frame.horizontal = 2; }
			if( y == 19) { tile.frame.vertical = 2;}

			Game.state.scene.tiles[Game.state.scene.tiles.length] = tile;
		}
	}
}

function startGame() {
	var projectCloud = nullandvoidgaming.com.projectCloud;
	projectCloud.Init();
	projectCloud.gameArea.start();
	loadGame();
}

function updateGame() {
	var using = nullandvoidgaming.com.projectCloud;
	var Game = nullandvoidgaming.com.Engine.Game;
	var oldTime = using.time;
	using.time = new Date();
	var gT = using.time - oldTime;

	if (Game.state.running) {
		Game.state.scene.update();
		using.cam.update();
	}
	Game.state.scene.draw(gT,using.cam);

	using.gameArea.clear();
	using.cam.flush();
	Game.state.scene.debugDraw(using.cam);
}

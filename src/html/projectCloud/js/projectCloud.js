if(typeof nullandvoidgaming === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.makeSubNameSpace("com.projectCloud", nullandvoidgaming);

var time = new Date()
nullandvoidgaming.com.Engine.Game.state = {
	running: true,
	scene: new nullandvoidgaming.com.Engine.Game.Map()
}


var controller = new nullandvoidgaming.com.Engine.IO.Input.KeyBoardController();

var gameArea = {
	canvas: document.createElement("canvas"),
	start : function() {
			this.canvas.width = 640;
			this.canvas.height = 480;
			this.context = this.canvas.getContext("2d");
			document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			this.interval = setInterval(updateGame, 20);
			window.addEventListener('keydown', controller.pressKey);
			window.addEventListener('keyup', controller.relKey);
			this.canvas.addEventListener('blur', this.loseFocus);
		},
	clear : function() {
			this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
		},
	loseFocus : function() {
			controller.clear();
		}

}

var cam = null;

function loadGame() {
	var Display = nullandvoidgaming.com.Engine.IO.Display;
	var Game = nullandvoidgaming.com.Engine.Game;
	var projectCloud = nullandvoidgaming.com.projectCloud;
	nullandvoidgaming.com.projectCloud.cam = new Display.NewCamera(gameArea.context, 0,0);
	Display.setImage("player",document.getElementById("player"));
	Display.setImage("outside",document.getElementById("TS_outside"));

	var p1 =  nullandvoidgaming.com.Engine.Entity.NewPlayer("player",controller);
	Game.state.scene.entities[Game.state.scene.entities.length] =  p1;
	projectCloud.cam.followEntity(p1,0.07);
	var ent = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newEntity();
	ent.frame = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newFrame(Display.getImage("player"),54,54,60);
	ent.position.width = 48; ent.position.height = 48;
	ent.position.vector.x = 100; ent.position.vector.y = 100;
	ent.frame.xBuffer = 10;
	ent.collider = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newCollider(ent,24,24,8,24);
	Game.state.scene.entities[Game.state.scene.entities.length] = ent;
	for (var x = 0; x < 20; x++) {
		for (var y = 0; y < 20; y++) {
			var pos = new Game.Position.NewPosition(x*64, y*64)
			pos.width = 64;
			pos.height = 64;
			var frame = {
					image : Display.getImage("outside"),
					horizontal : 1,
					vertical : 1,
					X : function() { return this.horizontal * this.width;},
					Y : function() { return this.vertical * this.height;},
					width : 64,
					height : 64
				}
			if (x == 0) { frame.horizontal = 0; }
			if (y == 0) { frame.vertical = 0; }
			if( x == 19) { frame.horizontal = 2; }
			if( y == 19) { frame.vertical = 2;}

			Game.state.scene.tiles[Game.state.scene.tiles.length] = {
				pos: pos,
				frame: frame,
				draw: function(dt,c) {
					c.draw( {
						frame: this.frame,
						pos: this.pos,
						depth: 0
					});
				}
			}
		}
	}
	Game.state.scene.tileSize = 64;
	Game.state.scene.horTile = 20;
	Game.state.scene.verTile = 20;
}


function startGame() {
	gameArea.start();
	loadGame();
}

function updateGame() {
	var using = nullandvoidgaming.com.projectCloud;
	var Game = nullandvoidgaming.com.Engine.Game;
	var oldTime = time;
	time = new Date();
	var gT = time - oldTime;

	if (Game.state.running) {
		Game.state.scene.update();
		using.cam.update();
	}
	Game.state.scene.draw(gT,using.cam);

	gameArea.clear();
	using.cam.flush();
	Game.state.scene.debugDraw(using.cam);
}

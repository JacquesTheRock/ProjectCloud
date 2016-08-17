'use strict';
if(typeof nullandvoidgaming === "undefined" || typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.com.makeSubNameSpace("com.projectCloud", nullandvoidgaming);





nullandvoidgaming.com.projectCloud.Init = function() {
	var projectCloud = nullandvoidgaming.com.projectCloud;
	var Engine = nullandvoidgaming.com.Engine;
	projectCloud.time = new Date();
	projectCloud.cam = null;
	Engine.Game.state.running = true;
	Engine.Game.state.scene =  new Engine.Game.Map();
	Engine.Game.state.mode = 0;//0 for start menu
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



function RequestJSON(url, callback) {
	var Game = nullandvoidgaming.com.Engine.Game;
	if(!url || !callback)
		return false;
	var xhr = new XMLHttpRequest();
	if(!xhr)
		return null;
	xhr.open("GET", url, true);
	xhr.onreadystatechange=function() {
		if(xhr.readyState == 4) {
			var data = JSON.parse(xhr.responseText);
			callback(data);
			Game.state.scene.loading = false;
		}
	}
	Game.state.scene.loading = true;
	xhr.send(null);
	return xhr;
}

function ParseMapJSON(data) {
	var Engine = nullandvoidgaming.com.Engine;
	var Game = Engine.Game;
	var Display = Engine.IO.Display;
	var Entity = Engine.Entity;
	Game.state.scene.name = data.name;
	Game.state.scene.tileSize = data.tilesheet.tileSize;
	Game.state.scene.horTile = data.width;
	Game.state.scene.verTile = data.height;
	var TileSheet = Display.getImage(data.tilesheet.image);
	var TSWidth = TileSheet.width / Game.state.scene.tileSize;
	for(var i = 0; i < data.tiles.length; i++) {
		var id = data.tiles[i].lookup;
		var cloneData = data.lookupTable[id];
		var x = data.tiles[i].position % data.width;
		var y = Math.floor(data.tiles[i].position / data.width);
		if(cloneData.typeID != 0) //Make Sure it is a tile
			continue;
		var tile = new Entity.Tile(
			x,
			y,
			TileSheet
			);
		if(cloneData.walkable)
			tile.walkable = cloneData.walkable;
		if(cloneData.frame != null) {
			tile.frame.horizontal = cloneData.frame % TSWidth;
			tile.frame.vertical = Math.floor(cloneData.frame / TSWidth);
		}
		Game.state.scene.tiles[data.tiles[i].position] = tile;
	}
	for (var i = 0; i < data.entities.length; i++) {
		var id = data.entities[i];
		var cloneData = data.lookupTable[id];
		var entity = new Entity.EntBuilder.newEntity();
		if(cloneData.position) {
			entity.position.vector.x = cloneData.position.x;
			entity.position.vector.y = cloneData.position.y;
		}
		if(cloneData.collider) {
			entity.collider = Entity.EntBuilder.newCollider(
				entity,
				cloneData.collider.width,
				cloneData.collider.height,
				cloneData.collider.xOffset,
				cloneData.collider.yOffset
			);
		}
		if(cloneData.frame) {
			entity.frame = new Entity.EntBuilder.newFrame(
				Display.getImage(cloneData.frame.image),
				cloneData.frame.width,
				cloneData.frame.height,
				cloneData.frame.frequency || 0
			);
			entity.frame.xBuffer = cloneData.frame.xBuffer || 0;
			entity.frame.yBuffer = cloneData.frame.yBuffer || 0;
			entity.position.width = cloneData.frame.width || entity.position.width;
			entity.position.height = cloneData.frame.height || entity.position.height;
		}
		if(cloneData.actions) {
			entity.actions = [];
			entity.actID = 0;
			var entC = new Engine.IO.Input.Controller();//Should make an action controller?
			entC.setControlled(entity);
			for ( var a = 0; a < cloneData.actions.length; a++) {
				var aData = cloneData.actions[a];
				var action = null;
				switch(aData.type) {
					case "Direct":
						action = Engine.Action.Move.Direct({x:aData.x,y:aData.y});
						break;
					case "Horizontal":
						action = Engine.Action.Move.Horizontal(aData.x);
						break;
					case "Vertical":
						action = Engine.Action.Move.Vertical(aData.y);
						break;
				}
				if(action)
					entity.actions[entity.actions.length] = action;
			}
		}
		Game.state.scene.entities[Game.state.scene.entities.length] = entity;
	}
}

function titleMenu(controller) {
	var projectCloud = nullandvoidgaming.com.projectCloud;
	var Engine = nullandvoidgaming.com.Engine;
	var Game = Engine.Game;
	var Input = Engine.IO.Input;
	var menu = new Game.Menu.NewMenu();
	menu.add(
		new Game.Menu.Button(
			function() {
				Game.state.mode = 1;
				loadGame(menu.controller);
				},
			"Play",
			"rgba(0,255,0,0.5)",
			200,
			150
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() { Game.state.menu = loadMenu(menu.controller,titleMenu); },
			"Load",
			"rgba(0,0,255,0.5)",
			200,
			200
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() { Game.state.menu = controlMenu(menu.controller,titleMenu); },
			"Controls",
			"rgba(0,0,255,0.5)",
			200,
			250
		)
	);
	var style = new Game.Menu.TextStyle('rgb(0,0,0)', 20, "arial", "bold");
	menu.add(
		new Game.Menu.Label(
			"You just Lost",
			200,
			100,
			style
		)
	);
	controller.setControlled(menu, projectCloud.cam);
	return menu;
}

function controlMenu(controller, prevMenu) {
	var projectCloud = nullandvoidgaming.com.projectCloud;
	var Engine = nullandvoidgaming.com.Engine;
	var Input = Engine.IO.Input;
	var Game = Engine.Game;
	var menu = new Game.Menu.NewMenu();
	menu.width = 640;
	menu.height = 480;
	menu.add(
		new Game.Menu.Button(
			function() {
				Game.state.menu = prevMenu(menu.controller);
			},
			"Back",
			"rgba(0,255,0,0.5)",
			300,
			10,
			40,
			20
		)
			
	);
	menu.add(
		new Game.Menu.Label(
			"Up:",
			280,
			65
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() {
				var b = this;
				controller.setKey("up", function() { b.text = controller.keymap.up; b.selected = false; } );
				this.text = "UNSET";
			},
			controller.keymap.up,
			"rgba(0,255,0,0.5)",
			320,
			50,
			40,
			20
		)
			
	);
	menu.add(
		new Game.Menu.Label(
			"Down:",
			280,
			105
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() {
				var b = this;
				controller.setKey("down", function() { b.text = controller.keymap.down; b.selected = false;} );
				this.text = "UNSET";
			},
			controller.keymap.down,
			"rgba(0,255,0,0.5)",
			320,
			90,
			40,
			20
		)
			
	);
	menu.add(
		new Game.Menu.Label(
			"Left:",
			280,
			145
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() {
				var b = this;
				controller.setKey("left", function() { b.text = controller.keymap.left; b.selected = false;} );
				this.text = "UNSET";
			},
			controller.keymap.left,
			"rgba(0,255,0,0.5)",
			320,
			130,
			40,
			20
		)
			
	);
	menu.add(
		new Game.Menu.Label(
			"Right:",
			280,
			185
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() {
				var b = this;
				controller.setKey("right", function() { b.text = controller.keymap.right; b.selected = false} );
				this.text = "UNSET";
			},
			controller.keymap.right,
			"rgba(0,255,0,0.5)",
			320,
			170,
			40,
			20
		)
			
	);
	menu.add(
		new Game.Menu.Label(
			"Action:",
			280,
			225
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() {
				var b = this;
				controller.setKey("action", function() { b.text = controller.keymap.action; b.selected = false} );
				this.text = "UNSET";
			},
			controller.keymap.right,
			"rgba(0,255,0,0.5)",
			320,
			210,
			40,
			20
		)
			
	);
	menu.add(
		new Game.Menu.Label(
			"Cancel:",
			280,
			265
		)
	);
	menu.add(
		new Game.Menu.Button(
			function() {
				var b = this;
				controller.setKey("cancel", function() { b.text = controller.keymap.cancel; b.selected = false} );
				this.text = "UNSET";
			},
			controller.keymap.cancel,
			"rgba(0,255,0,0.5)",
			320,
			250,
			40,
			20
		)
			
	);
	controller.setControlled(menu, projectCloud.cam);
	return menu;
}
function loadMenu(controller,prevMenu) {
	var projectCloud = nullandvoidgaming.com.projectCloud;
	var Engine = nullandvoidgaming.com.Engine;
	var Input = Engine.IO.Input;
	var Game = Engine.Game;
	var menu = new Game.Menu.NewMenu();
	menu.usePercent = true;
	menu.width = 640;
	menu.height = 480;
	menu.add(
		new Game.Menu.Button(
			function() {
				Game.state.menu = prevMenu(menu.controller);
			},
			"Back",
			"rgba(0,255,0,0.5)",
			0.45,
			0.5,
			0.1,
			0.05
		)
	);
	menu.add(
		new Game.Menu.TextField(
			0.435,
			0.4,
			10
		)
	);
	controller.setControlled(menu, projectCloud.cam);
	return menu;
}

function loadGame(controller) {
	var Display = nullandvoidgaming.com.Engine.IO.Display;
	var Game = nullandvoidgaming.com.Engine.Game;
	var Entity = nullandvoidgaming.com.Engine.Entity;
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var projectCloud = nullandvoidgaming.com.projectCloud;
	var Engine = nullandvoidgaming.com.Engine;
	Display.setImage("player",document.getElementById("player"));
	Display.setImage("outside.png",document.getElementById("TS_outside"));
	var p1 =  Entity.NewPlayer("player");
	controller.setControlled(p1,projectCloud.cam);
	Game.state.scene.entities[Game.state.scene.entities.length] =  p1;
	projectCloud.cam.followEntity(p1,0.07);
	RequestJSON("maps/example.json", ParseMapJSON);
}

function startGame() {
	var Engine = nullandvoidgaming.com.Engine;
	var projectCloud = nullandvoidgaming.com.projectCloud;
	projectCloud.Init();
	projectCloud.gameArea.start();
	projectCloud.cam = new Engine.IO.Display.NewCamera(projectCloud.gameArea.context, 0,0);
	//var controller = new Engine.IO.Input.KeyBoardController();
	var controller = new Engine.IO.Input.GamePadController();
	//var controller = new Engine.IO.Input.MouseController(projectCloud.gameArea.canvas);
	Engine.Game.state.menu = titleMenu(controller);
}

function updateGame() {
	var using = nullandvoidgaming.com.projectCloud;
	var Game = nullandvoidgaming.com.Engine.Game;
	var oldTime = using.time;
	using.time = new Date();
	var gT = using.time - oldTime;

	if(Game.state.mode == 0 ) {
		using.cam.position.vector.x = 0;//Ugh
		using.cam.position.vector.y = 0;//Ugh
		Game.state.menu.update(gT);
		Game.state.menu.draw(gT,using.cam);

	} else {
		if(!Game.state.scene.loading) {
			if (Game.state.running) {
				Game.state.scene.update(gT);
				using.cam.update(gT);
			}
			Game.state.scene.draw(gT,using.cam);
		}
	}
	using.gameArea.clear();
	using.cam.flush();
	Game.state.scene.debugDraw(using.cam);
}

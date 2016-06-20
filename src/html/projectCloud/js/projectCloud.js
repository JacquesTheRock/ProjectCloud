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
	var Game = nullandvoidgaming.com.Engine.Game;
	var Display = nullandvoidgaming.com.Engine.IO.Display;
	var Entity = nullandvoidgaming.com.Engine.Entity;
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
}


function loadGame() {
	var Display = nullandvoidgaming.com.Engine.IO.Display;
	var Game = nullandvoidgaming.com.Engine.Game;
	var Entity = nullandvoidgaming.com.Engine.Entity;
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var projectCloud = nullandvoidgaming.com.projectCloud;
	projectCloud.cam = new Display.NewCamera(projectCloud.gameArea.context, 0,0);
	Display.setImage("player",document.getElementById("player"));
	Display.setImage("outside.png",document.getElementById("TS_outside"));
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
	RequestJSON("maps/example.json", ParseMapJSON);
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

	if(Game.state.scene.loading) {
		//Do nothing for now
	} else {
		if (Game.state.running) {
			Game.state.scene.update(gT);
			using.cam.update(gT);
		}
		Game.state.scene.draw(gT,using.cam);
	}
	using.gameArea.clear();
	using.cam.flush();
	Game.state.scene.debugDraw(using.cam);
}

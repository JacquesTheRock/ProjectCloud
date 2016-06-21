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
		Game.state.scene.entities[Game.state.scene.entities.length] = entity;
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

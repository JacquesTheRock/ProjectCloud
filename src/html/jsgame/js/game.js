var Position = {
	NewPosition : function(x,y) {
		this.x = x;
		this.y = y;
		this.Normalize = function() {
			cur = Math.sqrt((this.x * this.x) + (this.y * this.y));
			this.x = this.x / cur;
			this,y = this.y / cur;
		}
	}




}
var map = {
	tiles : [],
	width : 64 * 20,
	height: 64 * 20
}

var Images = [];
var entities = [];
var controller = { //Player Controller
	keymap : {
		up : 38,
		down : 40,
		left : 37,
		right : 39,
		action: 65,
		cancel: 88
	},
	up : 0,
	down: 0,
	left : 0,
	right : 0,
	action : 0,
	cancel: 0,
	keyChange : function(e,val) {
		if (e.keyCode == controller.keymap.up) { controller.up = val; }
		if (e.keyCode == controller.keymap.down) { controller.down = val; }
		if (e.keyCode == controller.keymap.left) { controller.left = val; }
		if (e.keyCode == controller.keymap.right) { controller.right = val; }
		if (e.keyCode == controller.keymap.action) { controller.action = val; }
		if (e.keyCode == controller.keymap.cancel) { controller.cancel = val; }
	},
	relKey : function(e) { controller.keyChange(e,0); },
	pressKey : function(e) { controller.keyChange(e,1); },
	clear : function() { //lose focus means no keys are pressed
		controller.up = 0;
		controller.down = 0;
		controller.left = 0;
		controller.right = 0;
	}
}

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
		}

}

var cam = null;


function MinHeapInsert(a,data,compareFunc) {
	a[a.length] = data;
	var i = a.length - 1;
	var p = Math.floor(i/2);
	while(i > 0 && compareFunc(a[i],a[p])) {
		var s = a[i];
		a[i] = a[p];
		a[p] = s;
		i = p;
		p = Math.floor(i/2);
	}
	i = 0;
}

function MinHeapPop(a, compareFunc) {
	if (a == null)
		return null;
	out = a[0];
	a[0] = a[a.length -1]; //swap last and first
	a.splice(a.length - 1,1);
	var p = 0;
	var c = 1;
	while(c < a.length) {
		if(a[c+1] != null && !compareFunc(a[c],a[c+1])) { c = c+1; } else { c = c; }
		if(compareFunc(a[p],a[c])) {
			break;
		}
		var s = a[p];
		a[p] = a[c];
		a[c] = s;
		p = c;
		c = (p * 2) + 1;
	}
	return out;
}

function NewCamera(context, x, y) {
	this.ctx = context;
	this.spriteData = [];
	this.useDepth = true;
	this.Position = new Position.NewPosition(x,y);
	this.draw = function(SpriteDatum) {
		if(this.useDepth) {
			MinHeapInsert(
				this.spriteData,SpriteDatum, 
				function(a,b) { 
					return b == null || a.depth < b.depth;
					}
				);
		} else {
			this.spriteData[this.spriteData.length] = SpriteDatum;
		}
	}
	this.show = function() {
		if(this.spriteData.length < 100) return;
		debug = document.getElementById("spritedebug");
		debug.innerHTML = "<ol>";
		while (this.spriteData.length > 0) {
			debug.innerHTML += "<li>" + MinHeapPop(
				this.spriteData,
				function(a,b) { 
					return a.depth < b.depth; 
					}
				).depth + "</li>";
		}
		debug.innerHTML = "</ol>";
	}
	this.flush = function() {
		if(this.useDepth) {
			while(this.spriteData.length > 0) {
				data =  MinHeapPop(this.spriteData, function(a,b) { return a.depth < b.depth; });
				this.ctx.drawImage(
					data.frame.image,
					data.frame.X(),
					data.frame.Y(),
					data.frame.width,
					data.frame.height,
					data.pos.x - this.Position.x,
					data.pos.y - this.Position.y,
					data.pos.width,
					data.pos.height

				);
			}
		} else {
			
		}
	}
}

function loadGame() {
	cam = new NewCamera(gameArea.context, 0,0);
	Images["player"] = document.getElementById("player");
	Images["outside"] = document.getElementById("TS_outside");
	entities[entities.length] =  newPlayer();
	for (var x = 0; x < 20; x++) {
		for (var y = 0; y < 20; y++) {
			var pos = new Position.NewPosition(x*64, y*64)
			pos.width = 64;
			pos.height = 64;
			var frame = {
					image : Images["outside"],
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

			entities[entities.length] = {
				pos: pos,
				frame: frame,
				update: function(dt) { },
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
}


function startGame() {
	gameArea.start();
	loadGame();
}

var entBuilder = {
	newPos : function(x,y) {
		this.x = x;
		this.y = y;
		this.width = 4;
		this.height = 40;
		this.center = function() { 
			return { 
				x: this.x + this.width /2, 
				y: this.y + this.height/2
			} 
		}
	},
	newFrame : function(image,width,height, frequency) {
		this.image = image;
		this.horizontal = 0;
		this.vertical = 0;
		this.width = width;
		this.height = height;
		this.frequency = frequency;
		this.xBuffer = 14;
		this.yBuffer = 14;
		this.time = frequency;
		this.fCount = 8;
		this.animate = function(dt) { 
			this.time = this.time - dt;
			if (this.time < 0 ) {
				this.horizontal++;
				if(this.horizontal > this.fCount) { this.horizontal = 0; }
				this.time = this.time + this.frequency;
			}
		}//needs to be defined
		this.X = function() { return this.horizontal * (this.width + this.xBuffer) + this.xBuffer; }
		this.Y = function() { return this.vertical * (this.height +this.yBuffer) + this.yBuffer; }
	},
	newEntity : function() {
		this.position = new entBuilder.newPos(0,0);
		this.frame = null;
		this.update = function(dt) { }//default update is a noop
		this.draw = function(dt,c) { 
			var d =  Math.random();
			c.draw( {
				frame: this.frame,
				pos: this.position,
				depth: d
			});
		}//default draws frame based on position
	}
}
function newPlayer() {
	out = new entBuilder.newEntity;
	out.speed = 3.5;
	imge = Images["player"]; //document.getElementById("player");
	out.position.width = 48;
	out.position.height = 48;
	out.frame = new entBuilder.newFrame(imge,54,54,50);
	out.frame.xBuffer = 10;
	out.frame.yBuffer = 10;
	out.update = function(dt) {
		var x = 0;
		var y = 0;
		if (controller.up) {
			y -= 1;
		}
		if (controller.down) {
			y += 1;
		}
		if (controller.right) {
			x+=1;
		}
		if (controller.left) {
			x-=1;
		}
		if (x && y) {
			x = x * 0.70710678;
			y = y * 0.70710678;
		}
		if (this.position.x + x * this.speed < 1 || 
			this.position.x + x * this.speed + this.position.width > map.width) 
			x = 0;
		if (this.position.center().y + y * this.speed < 1 || 
			this.position.y + y * this.speed + this.position.height > map.height) 
			y = 0;
		if (x || y) {
			if (x < 0) {
				this.frame.vertical = 1;
			} else if (x > 0) {
				this.frame.vertical = 3;
			}
			else if(y<0) {
				this.frame.vertical = 0;
			} else if (y > 0) {
				this.frame.vertical = 2;
			}
			this.frame.animate(20 * (Math.abs(x) + Math.abs(y)));
			this.position.x += x * this.speed;
			this.position.y += y * this.speed;
		} else {
			this.frame.horizontal = 0;
		}
		cam.Position.x = ((this.position.center().x / map.width) * map.width) - 300;
		cam.Position.y = ((this.position.center().y / map.height) * map.height) - 300;
	}
	return out;
}


function updateGame() {
	
	for (i = 0; i < entities.length; i++) {
		entities[i].update();
	}
	for (i = 0; i < entities.length; i++) {
		entities[i].draw(20,cam);
	}
	gameArea.clear();
	cam.flush();
}



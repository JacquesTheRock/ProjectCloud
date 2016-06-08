var nullandvoidgaming = {} || nullandvoidgaming;
function makeSubNameSpace(ns, p) {
	var nsparts = ns.split(".");
	var parent = p;
	var pName = parent.toString();
	if(typeof parent === "undefined") {
		parent = {};
	}
	for (i = 0; i < nsparts.length; i++) {
		var name = nsparts[i];
		if(typeof parent[name] === "undefined") {
			parent[name] = {};
		}
		parent = parent[name];
	}
	return parent;
}

makeSubNameSpace("com.projectCloud.IO.Input", nullandvoidgaming);
makeSubNameSpace("com.projectCloud.IO.Display", nullandvoidgaming);
makeSubNameSpace("com.projectCloud.Entity", nullandvoidgaming);
makeSubNameSpace("com.projectCloud.Game", nullandvoidgaming);

//Flags are a global namespace object
nullandvoidgaming.com.projectCloud.flags = {
	draw : {
		hitbox : true,
		coords : false
	},
	debug: false

}

nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap = [
"", // [0]
"", // [1]
"", // [2]
"CANCEL", // [3]
"", // [4]
"", // [5]
"HELP", // [6]
"", // [7]
"BACK_SPACE", // [8]
"TAB", // [9]
"", // [10]
"", // [11]
"CLEAR", // [12]
"ENTER", // [13]
"ENTER_SPECIAL", // [14]
"", // [15]
"SHIFT", // [16]
"CONTROL", // [17]
"ALT", // [18]
"PAUSE", // [19]
"CAPS_LOCK", // [20]
"KANA", // [21]
"EISU", // [22]
"JUNJA", // [23]
"FINAL", // [24]
"HANJA", // [25]
"", // [26]
"ESCAPE", // [27]
"CONVERT", // [28]
"NONCONVERT", // [29]
"ACCEPT", // [30]
"MODECHANGE", // [31]
"SPACE", // [32]
"PAGE_UP", // [33]
"PAGE_DOWN", // [34]
"END", // [35]
"HOME", // [36]
"LEFT", // [37]
"UP", // [38]
"RIGHT", // [39]
"DOWN", // [40]
"SELECT", // [41]
"PRINT", // [42]
"EXECUTE", // [43]
"PRINTSCREEN", // [44]
"INSERT", // [45]
"DELETE", // [46]
"", // [47]
"0", // [48]
"1", // [49]
"2", // [50]
"3", // [51]
"4", // [52]
"5", // [53]
"6", // [54]
"7", // [55]
"8", // [56]
"9", // [57]
"COLON", // [58]
"SEMICOLON", // [59]
"LESS_THAN", // [60]
"EQUALS", // [61]
"GREATER_THAN", // [62]
"QUESTION_MARK", // [63]
"AT", // [64]
"A", // [65]
"B", // [66]
"C", // [67]
"D", // [68]
"E", // [69]
"F", // [70]
"G", // [71]
"H", // [72]
"I", // [73]
"J", // [74]
"K", // [75]
"L", // [76]
"M", // [77]
"N", // [78]
"O", // [79]
"P", // [80]
"Q", // [81]
"R", // [82]
"S", // [83]
"T", // [84]
"U", // [85]
"V", // [86]
"W", // [87]
"X", // [88]
"Y", // [89]
"Z", // [90]
"OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
"", // [92]
"CONTEXT_MENU", // [93]
"", // [94]
"SLEEP", // [95]
"NUMPAD0", // [96]
"NUMPAD1", // [97]
"NUMPAD2", // [98]
"NUMPAD3", // [99]
"NUMPAD4", // [100]
"NUMPAD5", // [101]
"NUMPAD6", // [102]
"NUMPAD7", // [103]
"NUMPAD8", // [104]
"NUMPAD9", // [105]
"MULTIPLY", // [106]
"ADD", // [107]
"SEPARATOR", // [108]
"SUBTRACT", // [109]
"DECIMAL", // [110]
"DIVIDE", // [111]
"F1", // [112]
"F2", // [113]
"F3", // [114]
"F4", // [115]
"F5", // [116]
"F6", // [117]
"F7", // [118]
"F8", // [119]
"F9", // [120]
"F10", // [121]
"F11", // [122]
"F12", // [123]
"F13", // [124]
"F14", // [125]
"F15", // [126]
"F16", // [127]
"F17", // [128]
"F18", // [129]
"F19", // [130]
"F20", // [131]
"F21", // [132]
"F22", // [133]
"F23", // [134]
"F24", // [135]
"", // [136]
"", // [137]
"", // [138]
"", // [139]
"", // [140]
"", // [141]
"", // [142]
"", // [143]
"NUM_LOCK", // [144]
"SCROLL_LOCK", // [145]
"WIN_OEM_FJ_JISHO", // [146]
"WIN_OEM_FJ_MASSHOU", // [147]
"WIN_OEM_FJ_TOUROKU", // [148]
"WIN_OEM_FJ_LOYA", // [149]
"WIN_OEM_FJ_ROYA", // [150]
"", // [151]
"", // [152]
"", // [153]
"", // [154]
"", // [155]
"", // [156]
"", // [157]
"", // [158]
"", // [159]
"CIRCUMFLEX", // [160]
"EXCLAMATION", // [161]
"DOUBLE_QUOTE", // [162]
"HASH", // [163]
"DOLLAR", // [164]
"PERCENT", // [165]
"AMPERSAND", // [166]
"UNDERSCORE", // [167]
"OPEN_PAREN", // [168]
"CLOSE_PAREN", // [169]
"ASTERISK", // [170]
"PLUS", // [171]
"PIPE", // [172]
"HYPHEN_MINUS", // [173]
"OPEN_CURLY_BRACKET", // [174]
"CLOSE_CURLY_BRACKET", // [175]
"TILDE", // [176]
"", // [177]
"", // [178]
"", // [179]
"", // [180]
"VOLUME_MUTE", // [181]
"VOLUME_DOWN", // [182]
"VOLUME_UP", // [183]
"", // [184]
"", // [185]
"SEMICOLON", // [186]
"EQUALS", // [187]
"COMMA", // [188]
"MINUS", // [189]
"PERIOD", // [190]
"SLASH", // [191]
"BACK_QUOTE", // [192]
"", // [193]
"", // [194]
"", // [195]
"", // [196]
"", // [197]
"", // [198]
"", // [199]
"", // [202]
"", // [203]
"", // [204]
"", // [205]
"", // [206]
"", // [207]
"", // [208]
"", // [209]
"", // [210]
"", // [211]
"", // [212]
"", // [213]
"", // [214]
"", // [215]
"", // [216]
"", // [217]
"", // [218]
"OPEN_BRACKET", // [219]
"BACK_SLASH", // [220]
"CLOSE_BRACKET", // [221]
"QUOTE", // [222]
"", // [223]
"META", // [224]
"ALTGR", // [225]
"", // [226]
"WIN_ICO_HELP", // [227]
"WIN_ICO_00", // [228]
"", // [229]
"WIN_ICO_CLEAR", // [230]
"", // [231]
"", // [232]
"WIN_OEM_RESET", // [233]
"WIN_OEM_JUMP", // [234]
"WIN_OEM_PA1", // [235]
"WIN_OEM_PA2", // [236]
"WIN_OEM_PA3", // [237]
"WIN_OEM_WSCTRL", // [238]
"WIN_OEM_CUSEL", // [239]
"WIN_OEM_ATTN", // [240]
"WIN_OEM_FINISH", // [241]
"WIN_OEM_COPY", // [242]
"WIN_OEM_AUTO", // [243]
"WIN_OEM_ENLW", // [244]
"WIN_OEM_BACKTAB", // [245]
"ATTN", // [246]
"CRSEL", // [247]
"EXSEL", // [248]
"EREOF", // [249]
"PLAY", // [250]
"ZOOM", // [251]
"", // [252]
"PA1", // [253]
"WIN_OEM_CLEAR", // [254]
"" // [255]
];


nullandvoidgaming.com.projectCloud.Game.Position = {
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

nullandvoidgaming.com.projectCloud.Game.Map = function() {
	this.entities = [];
	this.tiles = [];
	this.colbuckets = [];
	this.bucketsize = 5;
	this.tileSize = 0;
	this.horTile = 0;
	this.verTile = 0;
	this.width = function() { return this.tileSize * this.horTile; };
	this.height = function() { return this.tileSize * this.verTile; };
	//This function is for collision detection to work
	this.initbuckets = function()  {
			this.colbuckets = [];
			var count = (this.width() * this.height()) / (this.bucketsize * this.tileSize);
			var i = 0;
			do
			{
				this.colbuckets[i] = [];//initialize to a 0 array
				i++;
			} while (i < count);
		};
	this.update = function(gT) {
			this.initbuckets();
			for (e of this.entities) {
				e.update(gT);
				if(e.collider) {
					e.collider.fix();
					bucket = this.colbuckets[0];
					bucket[bucket.length] = e;
				}
			}
			for (bucket of this.colbuckets) {
				for(x = 0; x < bucket.length; x++) {
					for(y = x + 1; y < bucket.length; y++) {
						if(x != y) {
							var collision1 = bucket[x].collider.collides(bucket[y].collider);
							if(collision1) {
							var collision2 = bucket[y].collider.collides(bucket[x].collider);
								bucket[x].collision(collision1);
								bucket[y].collision(collision2);
							}
						}
					}
				}
			}
		};
	this.draw = function(gT,camera) {
			for (i = 0; i < this.entities.length; i++) {
				this.entities[i].draw(gT,camera);
			}
			for (i = 0; i < this.tiles.length; i++) {
				this.tiles[i].draw(gT,camera);
			}
		};
	this.debugDraw = function(camera) {
			if(nullandvoidgaming.com.projectCloud.flags.debug)
				for(e of this.entities) {
					if(nullandvoidgaming.com.projectCloud.flags.draw.hitbox && e.collider) {
						e.collider.debugDraw(0,camera);
					}
				}
		};
	return this;
}

var map = new nullandvoidgaming.com.projectCloud.Game.Map();

var time = new Date()
var state = {
	running: true,
	scene: map
}

var Images = [];

nullandvoidgaming.com.projectCloud.IO.Input.KeyBoardController = function() {
	this.keymap = {
			up : 38,
			down : 40,
			left : 37,
			right : 39,
			action: 65,
			cancel: 88
		};
	this.up = 0;
	this.down = 0;
	this.left = 0;
	this.right = 0;
	this.action = 0;
	this.cancel = 0;
	this.keyChange = function(e,val) {
			if (e.keyCode == controller.keymap.up) { controller.up = val; }
			if (e.keyCode == controller.keymap.down) { controller.down = val; }
			if (e.keyCode == controller.keymap.left) { controller.left = val; }
			if (e.keyCode == controller.keymap.right) { controller.right = val; }
			if (e.keyCode == controller.keymap.action) { controller.action = val; }
			if (e.keyCode == controller.keymap.cancel) { controller.cancel = val; }
		};
	this.relKey = function(e) { controller.keyChange(e,0); };
	this.pressKey = function(e) { controller.keyChange(e,1); };
	this.clear = function() { //lose focus means no keys are pressed
			controller.up = 0;
			controller.down = 0;
			controller.left = 0;
			controller.right = 0;
			controller.action = 0;
			controller.cancel = 0;
		};
	this.toString = function(sep, pre) {
			if (pre == null) pre = "";
			if (sep == null) sep = "";
			var out = "";
			out += pre + "Up: " + nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap[this.keymap.up] + sep;
			out += pre + "Down: " + nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap[this.keymap.down] + sep;
			out += pre + "Left: " + nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap[this.keymap.left] + sep;
			out += pre + "Right: " + nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap[this.keymap.right] + sep;
			out += pre + "Action: " + nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap[this.keymap.action] + sep;
			out += pre + "Cancel: " + nullandvoidgaming.com.projectCloud.IO.Input.keycodeMap[this.keymap.cancel];
			return out
		};
	return this;
};
var controller = new nullandvoidgaming.com.projectCloud.IO.Input.KeyBoardController();

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

nullandvoidgaming.com.projectCloud.IO.Display.NewCamera = function(context, x, y) {
	this.ctx = context;
	this.spriteData = [];
	this.useDepth = true;
	this.Position = new nullandvoidgaming.com.projectCloud.Game.Position.NewPosition(x,y);
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
	this.drawRect = function(x,y,w,h,color) {
		if (!color)
			this.ctx.fillStyle = "#000000";
		else
			this.ctx.fillStyle = color;
		this.ctx.fillRect(
			Math.round(x - this.Position.x),
			Math.round(y - this.Position.y),
			w,
			h
			);
	}
	this.show = function() {
		if(this.spriteData.length < 100) return;
		debug = document.getElementById("debug");
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
					Math.round(data.pos.x - this.Position.x),
					Math.round(data.pos.y - this.Position.y),
					data.pos.width,
					data.pos.height

				);
			}
		} else {

		}
	}
}

function loadGame() {
	cam = new nullandvoidgaming.com.projectCloud.IO.Display.NewCamera(gameArea.context, 0,0);
	Images["player"] = document.getElementById("player");
	Images["outside"] = document.getElementById("TS_outside");
	map.entities[map.entities.length] =  nullandvoidgaming.com.projectCloud.Entity.NewPlayer("player",controller);
	var ent = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newEntity();
	ent.frame = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newFrame(Images["player"],54,54,60)
	ent.position.width = 48; ent.position.height = 48;
	ent.position.x = 100; ent.position.y = 100;
	ent.frame.xBuffer = 10;
	ent.frame.xBuffer = 10;
	ent.collider = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newCollider(ent,24,24,8,24)
	map.entities[map.entities.length] = ent;
/*API:nullandvoidgaming.com.projectCloud.Entity.EntBuilder
newPos(x,y)
newFrame(img,width,height,f)
newEntity()
*/
	for (var x = 0; x < 20; x++) {
		for (var y = 0; y < 20; y++) {
			var pos = new nullandvoidgaming.com.projectCloud.Game.Position.NewPosition(x*64, y*64)
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

			map.tiles[map.tiles.length] = {
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
	map.tileSize = 64;
	map.horTile = 20;
	map.verTile = 20;
}


function startGame() {
	gameArea.start();
	loadGame();
}

/*API:nullandvoidgaming.com.projectCloud.Entity.EntBuilder
newPos(x,y)
newFrame(img,width,height,f)
newEntity()
*/
nullandvoidgaming.com.projectCloud.Entity.EntBuilder = {
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
	newCollider : function(entity, width,height, xoffset,yoffset) {
		this.owner = entity;
		this.width = width;
		this.height = height;
		this.xoffset = xoffset;
		this.yoffset = yoffset;
		this.Left = 0;
		this.Top = 0;
		this.Right = 0;
		this.Bottom = 0;
		this.deltaX = 0;
		this.deltaY = 0;
		this.trigger = false;
		this.fix = function() {
				var nextX = this.owner.position.x + xoffset;
				var nextY = this.owner.position.y + yoffset;
				this.deltaX = nextX - this.Left;
				this.deltaY = nextY - this.Top;
				this.Left = nextX;
				this.Right = this.Left + this.width;
				this.Top = nextY;
				this.Bottom = this.Top + height;
			}
		this.intersects = function(other) {
				return (this.Left <= other.Right &&
						this.Right >= other.Left &&
						this.Top <= other.Bottom &&
						this.Bottom >= other.Top);
			}
		this.contains = function(other) {
				return this.Left <= other.Left &&
					this.Right >= other.Right &&
					this.Top <= other.Top &&
					this.Bottom >= other.Bottom;
			}
		this.collides = function(other) {
				var collision = {
						trigger: other.trigger,
						collidewith: other.owner,
						me: this.owner,
						xVel : 0,
						yVel : 0,
						xCol : 0,
						yCol : 0
					}
				if(this.intersects(other)) {
					var delL = other.Right - this.Left;
					var delR = this.Right - other.Left;
					if(delL < delR)
						collision.xCol = delL;
					else if(delR < delL)
						collision.xCol = delR;
					var delT = other.Bottom - this.Top;
					var delB = this.Bottom - other.Top;
					if(delT < delB)
						collision.yCol = delT;
					else if (delB < delT)
						collision.yCol = delB;
					collision.xVel = this.deltaX;
					collision.yVel = this.deltaY;
					return collision;
				} else {
					return null;
				}
			}
		this.debugDraw = function(dt,c) {
				c.drawRect(this.Left,
					this.Top,
					this.width,
					this.height,
					'rgba(255,0,0,0.5)');
			}
	},
	newEntity : function() {
		this.position = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newPos(0,0);
		this.frame = null;
		this.collider = null;
		this.layer = 0.5; //used for draw depth
		this.update = function(dt) { }//default update is a noop
		this.draw = function(dt,c) {
				var y = this.position.center().y
				var depth = this.layer + (y / map.height()) * 0.2;
				c.draw( {
					frame: this.frame,
					pos: this.position,
					depth: depth
				});
			}//default draws frame based on position
		this.collision = function(c) {
				if(!c.trigger) {
					var hori = c.xCol - Math.abs(c.xVel) <= 0;
					var vert = c.yCol - Math.abs(c.yVel) <= 0;
					if(hori && c.xVel < 0)
						this.position.x += c.xCol;
					if(hori && c.xVel > 0)
						this.position.x -= c.xCol;
					if(vert && c.yVel < 0)
						this.position.y += c.yCol;
					if(vert && c.yVel > 0)
						this.position.y -= c.yCol;
					this.collider.fix();
				}
			}//default collision detection
	}
}
nullandvoidgaming.com.projectCloud.Entity.NewPlayer = function(imageStr,controller) {
	out = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newEntity();
	out.speed = 3;
	out.controller = controller;
	imge = Images[imageStr]; //document.getElementById("player");
	out.position.width = 48;
	out.position.height = 48;
	out.collider = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newCollider(out, 24, 24, 8, 24);
	out.frame = new nullandvoidgaming.com.projectCloud.Entity.EntBuilder.newFrame(imge,54,54,50);
	out.frame.xBuffer = 10;
	out.frame.yBuffer = 10;
	out.update = function(dt) {
		var x = 0;
		var y = 0;
		if (this.controller.up) {
			y -= 1;
		}
		if (this.controller.down) {
			y += 1;
		}
		if (this.controller.right) {
			x+=1;
		}
		if (this.controller.left) {
			x-=1;
		}
		if (x && y) {
			x = x * 0.70710678;
			y = y * 0.70710678;
		}
		if (this.position.x + x * this.speed < 1 ||
			this.position.x + x * this.speed + this.position.width > map.width())
			x = 0;
		if (this.position.center().y + y * this.speed < 1 ||
			this.position.y + y * this.speed + this.position.height > map.height())
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
		cam.Position.x = ((this.position.center().x / map.width()) * map.width()) - 300;
		cam.Position.y = ((this.position.center().y / map.height()) * map.height()) - 300;
		if (controller.action) {
			var debug = document.getElementById("debug");
			debug.innerHTML = "<table border='1'>" +  controller.toString("</td>","<td>")  + "</table>";

		}
	}
	return out;
}


function updateGame() {
	var oldTime = time;
	time = new Date();
	var gT = time - oldTime;

	if (state.running) {
		state.scene.update();
	}
	state.scene.draw(gT,cam);

	gameArea.clear();
	cam.flush();
	state.scene.debugDraw(cam);
}



'use strict';
if(typeof nullandvoidgaming === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.makeSubNameSpace("com.Engine.Game", nullandvoidgaming);
nullandvoidgaming.com.Engine.Game.Position = {
	NewPosition : function(x,y) {
		this.vector = new nullandvoidgaming.com.Engine.Game.Vector.NewVector(x,y);
		this.width = 0;
		this.height = 0;
		this.center = function() {
				var out = new nullandvoidgaming.com.Engine.Game.Vector.NewVector(this.vector.x + this.width / 2, this.vector.y + this.height / 2);
				return out;
			};
		this.setcenter = function(vector) {
				this.vector.x = vector.x - this.width / 2;
				this.vector.y = vector.y - this.height / 2;
			};
		return this;
	}
}


nullandvoidgaming.com.Engine.Game.Vector = {
	NewVector : function(x,y) {
		this.x = x;
		this.y = y;
		return this;
	},
	Add : function(op1,op2) {
		var Vector = nullandvoidgaming.com.Engine.Game.Vector;
		return new Vector.NewVector(op1.x + op2.x,op1.y + op2.y);
	},
	Subtract : function(op1,op2) {
		var Vector = nullandvoidgaming.com.Engine.Game.Vector;
		return new Vector.NewVector(op1.x - op2.x,op1.y - op2.y);
	},
	Multiply : function(op,f) {
		var Vector = nullandvoidgaming.com.Engine.Game.Vector;
		return new Vector.NewVector(op.x * f,op.y * f);

	},
	Normalize : function(op) {
			var Vector = nullandvoidgaming.com.Engine.Game.Vector;
			var out = Vector.NewVector(0,0);
			var len = this.Length(op);
			out.x = op.x / len;
			out.y = op.y / len;
			return out;
	},
	Length : function(op) {
			return Math.sqrt((op.x * op.x) + (op.y * op.y));
	}
}

nullandvoidgaming.com.Engine.Game.Map = function() {
	this.entities = [];
	this.tiles = [];
	this.bucketTileCount = 16;
	this.bucketSize = 0;
	this.bucketCounts = [];
	this.tileSize = 0;
	this.horTile = 0;
	this.verTile = 0;
	this.width = function() { return this.tileSize * this.horTile; };
	this.height = function() { return this.tileSize * this.verTile; };
	//This function is for collision detection to work
	this.initbuckets = function()  {
			if(!this.colbuckets) {
				this.colbuckets = [];
				this.bucketSize = (this.bucketTileCount);
				var count = (this.horTile * this.verTile) / this.bucketSize;
				var i = 0;
				do
				{
					this.colbuckets[i] = [];//initialize to a 0 array
					this.bucketCounts[i] = 0;
					i++;
				} while (i < count);
			} else {
				for(var i = 0; i < this.colbuckets.length; i++) {
					this.bucketCounts[i] = 0;
				}
			}
		};
	this.update = function(gT) {
			this.initbuckets();
			var e = null;
			var bucket = null;
			for (e of this.entities) {
				e.update(gT);
				if(e.collider) {
					e.collider.fix();
					var bucketID = 0;
					bucket = this.colbuckets[bucketID];
					bucket[this.bucketCounts[bucketID]++] = e;
				}
			}
			bucket = null;
			for(var b = 0; b < this.colbuckets.length; b++) {
				bucket = this.colbuckets[b];
				var count = this.bucketCounts[b];
				for(var e1 = 0; e1 < count - 1; e1++) {
					for(var e2 = e1 + 1; e2 < count; e2++) {
						if(e1 != e2) {
							var col1 = bucket[e1].collider.collides(bucket[e2].collider);
							if(col1) {
								var col2 = bucket[e2].collider.collides(bucket[e1].collider);
								bucket[e1].collision(col1);
								bucket[e2].collision(col2);
							}
						}
					}
				}
			}
		};
	this.draw = function(gT,camera) {
			var Game =  nullandvoidgaming.com.Engine.Game;
			for (var i = 0; i < this.entities.length; i++) {
				this.entities[i].draw(gT,camera);
			}
			//Draw only tiles we can see
			var yS = Math.max(0,camera.position.vector.y / Game.state.scene.tileSize - 1);
			var yE = Math.min(yS + 1+ (camera.position.height / Game.state.scene.tileSize), 
				Game.state.scene.verTile);
			var xS = Math.max(0,camera.position.vector.x / Game.state.scene.tileSize - 1);
			var xE = Math.min(xS + 1 + (camera.position.width / Game.state.scene.tileSize),
				Game.state.scene.horTile);
			yS = Math.floor(yS) ;
			yE = Math.ceil(yE);
			xS = Math.floor(xS);
			xE = Math.ceil(xE);
			for (var y = yS; y < yE ; y++) {
				for (var x = xS;  x < xE; x++) {
					var id = y*Game.state.scene.horTile + x;
					Game.state.scene.tiles[ id ].draw(gT,camera);
				}
			}
		};
	this.debugDraw = function(camera) {
			if(nullandvoidgaming.com.Engine.flags.debug)
				for(var e of this.entities) {
					if(nullandvoidgaming.com.Engine.flags.draw.hitbox && e.collider) {
						e.collider.debugDraw(0,camera);
					}
				}
		};

	return this;
}


/*
This is an 'Interface' definition
*/
nullandvoidgaming.com.Engine.Game.Scene = function() {
	this.update = function(gT) { };
	this.width = function() {
			return 10000000;
		};
	this.height = function() {
		return 10000000;
		 };
	this.draw = function(gT,camera) { };
	this.debugDraw = function(camera) { };
}

nullandvoidgaming.com.Engine.Game.state = {
	running: false,
	scene: new nullandvoidgaming.com.Engine.Game.Scene()
}

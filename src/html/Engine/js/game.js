'use strict';
if(typeof nullandvoidgaming === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Game", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Game.Position", nullandvoidgaming.com);

//Default Functions to help on Memory Allocation
nullandvoidgaming.com.Engine.Game.Position.DefaultCenter = function() {
	var out = new nullandvoidgaming.com.Engine.Game.Vector.NewVector(
		this.vector.x + this.width / 2, 
		this.vector.y + this.height /2
		);
	return out;
}
nullandvoidgaming.com.Engine.Game.Position.DefaultSetCenter = function(vector) {
	this.vector.x = vector.x - this.width / 2;
	this.vector.y = vector.y - this.height / 2;
}
//We don't use object Defineproperty because of performance implications (May be outdated)

nullandvoidgaming.com.Engine.Game.Position.NewPosition = function(x,y) {
	this.vector = new nullandvoidgaming.com.Engine.Game.Vector.NewVector(x,y);
	this.width = 0;
	this.height = 0;
	this.center = nullandvoidgaming.com.Engine.Game.Position.DefaultCenter;
	this.setcenter = nullandvoidgaming.com.Engine.Game.Position.DefaultSetCenter;
	return this;
}

nullandvoidgaming.com.Engine.Game.Rect = {
	NewRect : function(x=0,y=0,w=1,h=1) {
		var Game = nullandvoidgaming.com.Engine.Game;
		this.dimensions = new Game.Vector.NewVector(w,h);
		this.TopLeft = new Game.Vector.NewVector(x,y);
		this.Width = function() 	{ return this.dimensions.x; };
		this.Height = function()	{ return this.dimensions.y; };
		this.Left = function()		{ return this.TopLeft.x; };
		this.Top = function()		{ return this.TopLeft.y; };
		this.Right = function()		{ return this.TopLeft.x + this.dimensions.x; };
		this.Bottom = function()	{ return this.TopLeft.y + this.dimensions.y; };
		this.containsPoint = Game.Rect.DefaultContainsPoint;
		this.containsRect = Game.Rect.DefaultContainsRect;
		this.intersects = Game.Rect.DefaultIntersectsRect;
	},
	ContainsPoint : function(rect,point) {
		return rect.Left() <= point.x &&
			rect.Right() >= point.x &&
			rect.Top() <= point.y &&
			rect.Bottom() >= point.y;
	},
	ContainsRect : function(outer,inner) {
		return outer.Left() <= inner.Left() &&
			outer.Right() >= inner.RIght() &&
			outer.Top <= inner.Top() &&
			outer.Bottom() >= inner.Bottom();
	},
	Intersects : function(r1,r2) {
		return r1.Left() <= r2.Right() &&
			r1.Right() >= r2.Left() &&
			r1.Top() <= r2.Bottom() &&
			r1.Bottom() >= r2.Top();
	},
	DefaultContainsPoint : function(point) {
		return nullandvoidgaming.com.Engine.Game.Rect.ContainsPoint(this,point);
	},
	DefaultContainsRect : function(other) {
		return nullandvoidgaming.com.Engine.Game.Rect.ContainsRect(this,other);
	},
	DefaultIntersectsRect : function(other) {
		return nullandvoidgaming.com.Engine.Game.Rect.Intersects(this,other);
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
			for (var i = 0; i < this.entities.length; i++) {
				var e = this.entities[i];
				if(e.controller) e.controller.update(gT);
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
					if(Game.state.scene.tiles[id])
						Game.state.scene.tiles[ id ].draw(gT,camera);
				}
			}
		};
	this.debugDraw = function(camera) {
			if(nullandvoidgaming.com.Engine.flags.debug)
				for(var i = 0; i < this.entities.length; i++) {
					var e = this.entities[i];
					if(nullandvoidgaming.com.Engine.flags.draw.hitbox && e.collider) {
						e.collider.debugDraw(0,camera);
					}
				}
		};
	this.getTileAt = function(vector) {
		var Game =  nullandvoidgaming.com.Engine.Game;
		if(!this.tileSize)
			return null;
		var x = Math.floor(vector.x / this.tileSize);
		var y = Math.floor(vector.y / this.tileSize);
		var id = y*Game.state.scene.horTile + x;
		var out = Game.state.scene.tiles[id] 
		if(!out || out.xID != x || out.yID != y) return {xID:x,yID:y,walkable:false};
		return out;
	}
	return this;
}


/*
This is an 'Interface' definition
*/
nullandvoidgaming.com.Engine.Game.Scene = function() {
	this.update = nullandvoidgaming.com.Noop;//function(gT)
	this.width = nullandvoidgaming.com.NoopInt;//function()
	this.height = nullandvoidgaming.com.NoopInt;//function()
	this.draw = nullandvoidgaming.com.Noop;//function(gT,c)
	this.debugDraw = nullandvoidgaming.com.Noop;//function(gT,c)
}

nullandvoidgaming.com.Engine.Game.state = {
	running: false,
	scene: new nullandvoidgaming.com.Engine.Game.Scene(),
	menu : null
}

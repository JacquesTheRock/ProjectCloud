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
			if(nullandvoidgaming.com.Engine.flags.debug)
				for(e of this.entities) {
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

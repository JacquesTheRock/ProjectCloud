'use strict';
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity.DefaultFuncs", nullandvoidgaming.com);

/*
I Seperate the Default Frame functions so that Tiles may utilize Frames without
causing a massive hit due to unique Animations. This takes advantage of the this keyword
but may cause issues later. lets hope not.
*/
nullandvoidgaming.com.Engine.Entity.DefaultFuncs.FrameAnimate = function(dt) {
	this.time = this.time - dt;
	if (this.time < 0 ) {
		this.horizontal++;
		if(this.horizontal > this.fCount) { this.horizontal = 0; }
			this.time = this.time + this.frequency;
	}
}

nullandvoidgaming.com.Engine.Entity.DefaultFuncs.FrameX = function() {
	return this.horizontal * (this.width + this.xBuffer) + this.xBuffer;	
}

nullandvoidgaming.com.Engine.Entity.DefaultFuncs.FrameY = function() { 
	return this.vertical * (this.height +this.yBuffer) + this.yBuffer; 
}

nullandvoidgaming.com.Engine.Entity.EntBuilder = {
	newFrame : function(image,width,height, frequency) {
		var DFuncs = nullandvoidgaming.com.Engine.Entity.DefaultFuncs;
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
		this.animate = DFuncs.FrameAnimate;
		this.X = DFuncs.FrameX;
		this.Y = DFuncs.FrameY;
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
				var nextX = this.owner.position.vector.x + xoffset;
				var nextY = this.owner.position.vector.y + yoffset;
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
				if(this.intersects(other)) {
					var collision = {
							trigger: other.trigger,
							collidewith: other.owner,
							me: this.owner,
							xVel : 0,
							yVel : 0,
							xCol : 0,
							yCol : 0
						};
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
		this.position = new nullandvoidgaming.com.Engine.Game.Position.NewPosition(0,0);
		this.frame = null;
		this.collider = null;
		this.layer = 0.5; //used for draw depth
		this.update = nullandvoidgaming.com.Noop;//does nothing
		this.draw = function(dt,c) {
				var y = this.position.center().y;
				var depth = this.layer + (y / nullandvoidgaming.com.Engine.Game.state.scene.height()) * 0.2;
				this.depth = depth;
				c.draw(this);// why not just draw myself, can decrease data use
				;
			}//default draws frame based on position
		this.collision = function(c) {
				if(!c.trigger) {
					var hori = c.xCol - Math.abs(c.xVel) <= 0;
					var vert = c.yCol - Math.abs(c.yVel) <= 0;
					if(hori && c.xVel < 0)
						this.position.vector.x += c.xCol;
					if(hori && c.xVel > 0)
						this.position.vector.x -= c.xCol;
					if(vert && c.yVel < 0)
						this.position.vector.y += c.yCol;
					if(vert && c.yVel > 0)
						this.position.vector.y -= c.yCol;
					this.collider.fix();
				}
			}//default collision detection
	}
}

nullandvoidgaming.com.Engine.Entity.PlayerDefaultUpdate = function(dt) {
	var Game = nullandvoidgaming.com.Engine.Game;
	var map = Game.state.scene;
	var delta = new Game.Vector.NewVector(0,0);
	if (this.controller.up) {
		delta.y -= 1;
	}
	if (this.controller.down) {
		delta.y += 1;
	}
	if (this.controller.right) {
		delta.x += 1;
	}
	if (this.controller.left) {
		delta.x -= 1;
	}
	if (delta.x && delta.y) {
		delta.x = delta.x * 0.70710678;
		delta.y = delta.y * 0.70710678;
	}
	delta = Game.Vector.Multiply(delta, this.speed);
	var yEdge = this.collider.Top;
	var xEdge = this.collider.Left;
	if(delta.y > 0)
		yEdge = this.collider.Bottom;
	if(delta.x > 0)
		xEdge = this.collider.Right;
	var edge = Game.Vector.NewVector(xEdge,yEdge);
	var nPos = new Game.Vector.Add(delta,edge);
	var nextT = map.getTileAt(nPos);
	var curT = map.getTileAt(this.position.center());
	if(!nextT) {
		delta.x = 0;
		delta.y = 0;
	} else if(!nextT.walkable) {
		if(curT.xID != nextT.xID)
			delta.x = 0;
		if(curT.yID != nextT.yID)
			delta.y = 0;
	}
	if (delta.x < 0) {
		this.frame.vertical = 1;
	} else if (delta.x > 0) {
		this.frame.vertical = 3;
	}
	else if(delta.y<0) {
		this.frame.vertical = 0;
	} else if (delta.y > 0) {
		this.frame.vertical = 2;
	}
	if(delta.x||delta.y) {
		this.frame.animate(20 * (Math.abs(delta.x) + Math.abs(delta.y)));
		this.position.vector = new Game.Vector.Add(delta,this.position.vector);
	} else {
		this.frame.horizontal = 0;
	}
}

nullandvoidgaming.com.Engine.Entity.NewPlayer = function(imageStr) {
	var out = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newEntity();
	out.speed = 3;
	var imge = nullandvoidgaming.com.Engine.IO.Display.getImage(imageStr);
	out.position.width = 48;
	out.position.height = 48;
	out.collider = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newCollider(out, 24, 24, 8, 24);
	out.frame = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newFrame(imge,54,54,50);
	out.frame.xBuffer = 10;
	out.frame.yBuffer = 10;
	out.update = nullandvoidgaming.com.Engine.Entity.PlayerDefaultUpdate;
	return out;
}


nullandvoidgaming.com.Engine.Entity.DefaultTileDraw = function(dt,c) {
	c.draw(this);
}

nullandvoidgaming.com.Engine.Entity.Tile = function(x,y,img,tS=64,xID=1,yID=1) {
	var Game = nullandvoidgaming.com.Engine.Game;
	this.xID = x;
	this.yID = y;
	this.walkable = true;
	this.position= new Game.Position.NewPosition(x*64, y*64)
	this.frame = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newFrame(img,tS,tS);
	this.frame.vertical = yID;
	this.frame.horizontal = xID;
	this.frame.xBuffer = 0;
	this.frame.yBuffer = 0;
	this.position.width = 64;
	this.position.height = 64;
	this.draw = nullandvoidgaming.com.Engine.Entity.DefaultTileDraw;
	this.depth = 0;
	return this;
}


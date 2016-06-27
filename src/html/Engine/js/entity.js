'use strict';
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity.Collider", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity.DefaultFuncs", nullandvoidgaming.com);

/*
I Seperate the Default Frame functions so that Tiles may utilize Frames without
causing a massive hit due to unique Animations. This takes advantage of the this keyword
but may cause issues later. lets hope not.
*/
nullandvoidgaming.com.Engine.Entity.DefaultFuncs.FrameAnimate = function(dt) {
	this.time = this.time - dt;
	if (this.frequency > 0 && this.time < 0 ) {
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

nullandvoidgaming.com.Engine.Entity.Collider.RectCollider = function(entity,w,h,trigger=false) {
	var Game = nullandvoidgaming.com.Engine.Game;
	var out = new Game.Rect.NewRect(0,0,w,h);
	out.owner = entity;
	out.offset = new Game.Vector.NewVector(0,0);
	out.delta = new Game.Vector.NewVector(0,0);
	out.trigger = trigger;
	out.fix = function() {
			var next = Game.Vector.Add(this.owner.position.vector, this.offset);
			this.delta = Game.Vector.Subtract(next,this.TopLeft);
			this.TopLeft = next;
		}
	out.contains = out.containsRect;
	out.debugDraw = function(dt,c) {
				var color = 'rgba(255,0,0,0.5)';
				if(trigger)
					color = 'rgba(255,255,0,0.5)';
				c.drawRect(this.Left(),
					this.Top(),
					this.Width(),
					this.Height(),
					color,
					1);
			}
	return out;
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
		var out = new nullandvoidgaming.com.Engine.Entity.Collider.RectCollider(entity,width,height);
		out.offset.x = xoffset; out.offset.y = yoffset;
		out.collides = function(other) {
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
					var delL = other.Right() - this.Left();
					var delR = this.Right() - other.Left();
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
					collision.vel = this.delta;
					return collision;
				} else {
					return null;
				}
			}
		return out;
	},
	newEntity : function() {
		this.position = new nullandvoidgaming.com.Engine.Game.Position.NewPosition(0,0);
		this.frame = null;
		this.collider = null;
		this.layer = 0.5; //used for draw depth
		this.update = nullandvoidgaming.com.Noop;//does nothing
		this.draw = function(dt,c) {
				if(!this.frame) return;//Noop if it doesn't have a frame to draw
				var y = this.position.center().y;
				var depth = this.layer + (y / nullandvoidgaming.com.Engine.Game.state.scene.height()) * 0.2;
				this.depth = depth;
				c.draw(this);// why not just draw myself, can decrease data use
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
					//this.collider.fix();
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
	//map.getTileAt(new Game.Vector.NewVector(xEdge + delta.x, hitCenter.y));
	var TL = map.getTileAt(new Game.Vector.NewVector(this.collider.Left() + delta.x, this.collider.Top() + delta.y));
	var TR = map.getTileAt(new Game.Vector.NewVector(this.collider.Right() + delta.x, this.collider.Top() + delta.y));
	var BL = map.getTileAt(new Game.Vector.NewVector(this.collider.Left() + delta.x, this.collider.Bottom() + delta.y));
	var BR = map.getTileAt(new Game.Vector.NewVector(this.collider.Right() + delta.x, this.collider.Bottom() + delta.y));
	if(delta.y < 0 && !(TL.walkable && TR.walkable))
		delta.y = 0;
	else if(delta.y > 0 && !(BL.walkable && BR.walkable))
		delta.y = 0;
	if(delta.x < 0 && !(TL.walkable && BL.walkable))
		delta.x = 0;
	else if(delta.x > 0 && !(TR.walkable && BR.walkable))
		delta.x = 0;

	
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
		this.frame.animate(dt * (Game.Vector.Length(delta) / this.speed));
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


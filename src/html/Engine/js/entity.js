'use strict';
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity.Collider", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Entity.DefaultFuncs", nullandvoidgaming.com);

/*
I Seperate the Default Frame functions so that Tiles may utilize Frames without
causing a massive hit due to unique instances of the Animation function. This 
takes advantage of the 'this' keyword but may cause issues later. lets hope not.
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
	out.force = new Game.Vector.NewVector(0,0);
	out.trigger = trigger;
	out.fix = function() {
			/* Ensure The Collider maps to position */ 
			var next = Game.Vector.Add(this.owner.position.vector, this.offset);
			this.delta = Game.Vector.Subtract(next,this.TopLeft);
			this.TopLeft = next;
			//var next = Game.Vector.Add(this.owner.position.vector, this.offset);
			//this.TopLeft = next;
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
	out.applyForce = function(gT) {
		this.vel.x = this.owner.moveVel.x + this.force.x * this.rMass;
		this.vel.y = this.owner.moveVel.y + this.force.y * this.rMass;
		nullandvoidgaming.com.Engine.Entity.CheckWalls(this.owner, delta)
		this.owner.position.vector.x += delta.x; this.owner.position.vector.y += delta.y;
		this.force.x = 0; this.force.y = 0;
		this.fix();
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
		out.rMass = 1;//1/1 mass
		out.offset.x = xoffset; out.offset.y = yoffset;
		out.collides = function(other) {
				if(this.intersects(other)) {
					var collision = {
							trigger: other.trigger,
							collidewith: other.owner,
							me: this.owner,
							xCol : 0,
							yCol : 0
						};
					var delL = other.Right() - this.Left();
					var delR = this.Right() - other.Left();
					if(delL < delR)
						collision.xCol = delL;
					else if(delR < delL)
						collision.xCol = -delR;
					var delT = other.Bottom() - this.Top();
					var delB = this.Bottom() - other.Top();
					if(delT < delB)
						collision.yCol = delT;
					else if (delB < delT)
						collision.yCol = -delB;
					collision.vel = this.delta;
					return collision;
				} else {
					return null;
				}
			}
		return out;
	},
	newEntity : function() {
		var Game = nullandvoidgaming.com.Engine.Game;
		this.position = new Game.Position.NewPosition(0,0);
		this.moveVel = new Game.Vector.NewVector(0,0);//Movement will be applied to this
		this.frame = null;
		this.collider = null;
		this.speed = 1;
		this.springConstant = 0.7; //Default is Kind of frigid
		this.layer = 0.5; //used for draw depth
		this.move = nullandvoidgaming.com.Engine.Entity.DefaultMove;
		this.update = nullandvoidgaming.com.Engine.Entity.EntityDefaultUpdate;//does nothing
		this.draw = function(dt,c) {
				if(!this.frame) return;//Noop if it doesn't have a frame to draw
				var y = this.position.center().y;
				var depth = this.layer + (y / nullandvoidgaming.com.Engine.Game.state.scene.height()) * 0.2;
				this.depth = depth;
				c.draw(this);// why not just draw myself, can decrease data use
			}//default draws frame based on position
		this.collision = function(c) {
				if(!c.trigger) {
					var k = this.springConstant;
					var hori = c.xCol != 0;// - Math.abs(c.vel.x) <= 0;
					var vert = c.yCol != 0;// - Math.abs(c.vel.y) <= 0;
					if(hori && Math.abs(c.xCol) <= Math.abs(c.yCol))
						this.collider.force.x += c.xCol * k;
					if(vert && Math.abs(c.yCol) <= Math.abs(c.xCol))
						this.collider.force.y += c.yCol * k;
				} else {
					if(this.onTrigger) this.onTrigger(c);
				}
			}//default collision detection
	}
}

nullandvoidgaming.com.Engine.Entity.EntityDefaultUpdate = function(gT) {
	var Game = nullandvoidgaming.com.Engine.Game;
	var map = Game.state.scene;
	if(this.actions) {
		var action = this.actions[this.actID];
		if(action && action.condition(this))
			action.update(gT,this);
		else {
			this.controller.clear();
			this.actID++;
			if(this.actID > this.actions.length)
				this.actID = 0;
		}
	}
	if(this.controller) {
		this.move(gT,this);
	}
}

nullandvoidgaming.com.Engine.Entity.PlayerDefaultUpdate = function(dt) {
	this.move(dt,this);	
}


nullandvoidgaming.com.Engine.Entity.CheckWalls = function(ent, delta) {
	//TODO: This check should be done with ray casting
	var Game = nullandvoidgaming.com.Engine.Game;
	var map = Game.state.scene;
	var c = ent.collider.Center();
	//map.getTileAt(new Game.Vector.NewVector(xEdge + delta.x, hitCenter.y));
	var L = map.getTileAt(new Game.Vector.NewVector(ent.collider.Left() + delta.x, c.y));
	var T = map.getTileAt(new Game.Vector.NewVector(c.x, ent.collider.Top() + delta.y));
	var B = map.getTileAt(new Game.Vector.NewVector(c.x, ent.collider.Bottom() + delta.y));
	var R = map.getTileAt(new Game.Vector.NewVector(ent.collider.Right() + delta.x, c.y));
	if(delta.x && (!L.walkable || !R.walkable))
		delta.x = 0;
	if(delta.y && (!T.walkable || !B.walkable))
		delta.y = 0;
	if(delta.x || delta.y)
	var TL = map.getTileAt(new Game.Vector.NewVector(ent.collider.Left() + delta.x, ent.collider.Top() + delta.y));
	var TR = map.getTileAt(new Game.Vector.NewVector(ent.collider.Right() + delta.x, ent.collider.Top() + delta.y));
	var BL = map.getTileAt(new Game.Vector.NewVector(ent.collider.Left() + delta.x, ent.collider.Bottom() + delta.y));
	var BR = map.getTileAt(new Game.Vector.NewVector(ent.collider.Right() + delta.x, ent.collider.Bottom() + delta.y));
	if(delta.y < 0 && !(TL.walkable && TR.walkable))
		delta.y = 0;
	else if(delta.y > 0 && !(BL.walkable && BR.walkable))
		delta.y = 0;
	if(delta.x < 0 && !(TL.walkable && BL.walkable))
		delta.x = 0;
	else if(delta.x > 0 && !(TR.walkable && BR.walkable))
		delta.x = 0;
}

nullandvoidgaming.com.Engine.Entity.DefaultMove = function(dt,ent = this) {
	var Game = nullandvoidgaming.com.Engine.Game;
	var map = Game.state.scene;
	ent.moveVel.x = 0; ent.moveVel.y = 0; 
	var delta = ent.moveVel;
	if (ent.controller.up) {
		delta.y -= 1;
	}
	if (ent.controller.down) {
		delta.y += 1;
	}
	if (ent.controller.right) {
		delta.x += 1;
	}
	if (ent.controller.left) {
		delta.x -= 1;
	}
	if (delta.x && delta.y) {
		delta.x = delta.x * 0.70710678;
		delta.y = delta.y * 0.70710678;
	}
	delta.x *= ent.speed;
	delta.y *= ent.speed;
	if(ent.frame) {	
		if (delta.x < 0) {
			ent.frame.vertical = 1;
		} else if (delta.x > 0) {
			ent.frame.vertical = 3;
		}
		else if(delta.y<0) {
			ent.frame.vertical = 0;
		} else if (delta.y > 0) {
			ent.frame.vertical = 2;
		}
		if(delta.x||delta.y) {
			ent.frame.animate(dt * (Game.Vector.Length(delta) / ent.speed));
			//ent.position.vector.x += delta.x; ent.position.vector.y += delta.y;
		} else {
			ent.frame.horizontal = 0;
		}
	}
}

nullandvoidgaming.com.Engine.Entity.NewPlayer = function(imageStr) {
	var out = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newEntity();
	out.speed = 3;
	var imge = nullandvoidgaming.com.Engine.IO.Display.getImage(imageStr);
	out.position.width = 54;
	out.position.height = 54;
	out.collider = nullandvoidgaming.com.Engine.Entity.EntBuilder.newCollider(out, 28, 28, 8, 24);
	out.collider.rMass = 1;
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


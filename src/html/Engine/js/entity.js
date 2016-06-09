if(typeof nullandvoidgaming === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.makeSubNameSpace("com.Engine.Entity", nullandvoidgaming);
nullandvoidgaming.com.Engine.Entity.EntBuilder = {
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
		this.position = new nullandvoidgaming.com.Engine.Game.Position.NewPosition(0,0);
		this.frame = null;
		this.collider = null;
		this.layer = 0.5; //used for draw depth
		this.update = function(dt) { }//default update is a noop
		this.draw = function(dt,c) {
				var y = this.position.center().y;
				var depth = this.layer + (y / nullandvoidgaming.com.Engine.Game.state.scene.height()) * 0.2;
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

nullandvoidgaming.com.Engine.Entity.NewPlayer = function(imageStr,controller) {
	out = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newEntity();
	out.speed = 3;
	out.controller = controller;
	imge = nullandvoidgaming.com.Engine.IO.Display.getImage(imageStr);
	out.position.width = 48;
	out.position.height = 48;
	out.collider = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newCollider(out, 24, 24, 8, 24);
	out.frame = new nullandvoidgaming.com.Engine.Entity.EntBuilder.newFrame(imge,54,54,50);
	out.frame.xBuffer = 10;
	out.frame.yBuffer = 10;
	out.update = function(dt) {
		var map = nullandvoidgaming.com.Engine.Game.state.scene;
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
		if (this.position.vector.x + x * this.speed < 1 ||
		this.position.vector.x + x * this.speed + this.position.width > map.width())
		x = 0;
		if (this.position.center().y + y * this.speed < 1 ||
		this.position.vector.y + y * this.speed + this.position.height > map.height())
		y = 0;
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
		if(x||y) {
			this.frame.animate(20 * (Math.abs(x) + Math.abs(y)));
			this.position.vector.x += x * this.speed;
			this.position.vector.y += y * this.speed;
		} else {
			this.frame.horizontal = 0;
		}
	}
	return out;
}

'use strict';
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("Fatal: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.IO.Display", nullandvoidgaming.com);


nullandvoidgaming.com.Engine.IO.Display.images = [];

nullandvoidgaming.com.Engine.IO.Display.getImage = function(id) {
	return nullandvoidgaming.com.Engine.IO.Display.images[id];
}

nullandvoidgaming.com.Engine.IO.Display.setImage = function(id,img) {
	nullandvoidgaming.com.Engine.IO.Display.images[id] = img;
}

nullandvoidgaming.com.Engine.IO.Display.isLower = function(a,b) {
	return b == null || a.depth < b.depth;
}
nullandvoidgaming.com.Engine.IO.Display.isHigher = function(a,b) {
	return b == null || a.depth > b.depth;
}

nullandvoidgaming.com.Engine.IO.Display.NewCamera = function(context, x, y, width, height) {
	this.ctx = context;
	this.spriteData = [];
	this.spriteDataLength = 0;
	this.useDepth = true;
	this.position = new nullandvoidgaming.com.Engine.Game.Position.NewPosition(x,y);
	this.follows = null;
	this.followDamper = 0; //essentially k in Spring Equatioon (F = kX)
	if(typeof width === "undefined") {
		this.position.width = context.canvas.width;
	} else {
		this.position.width = width;
	}
	if(typeof height === "undefined") {
		this.position.height = context.canvas.height;
	} else {
		this.position.height = height;
	}
	this.draw = function(SpriteDatum) {
		if(this.useDepth) {
			nullandvoidgaming.com.Engine.util.MinHeapInsert(
					this.spriteData,
					SpriteDatum,
					nullandvoidgaming.com.Engine.IO.Display.isLower,
					this.spriteDataLength++
				);
		} else {
			this.spriteData[this.spriteDataLength++] = SpriteDatum;
		}
	};
	this.drawRect = function(x,y,w,h,color) {
		var data = { color : color };
		data.drawRect = {
			Left : function() { return x; },
			Top : function() { return y; },
			Width : function() { return w; },
			Height : function() { return h; }
		}
		this.draw(data);
	};
	this.show = function() {
		if(this.spriteDataLength < 100) return;
		debug = document.getElementById("debug");
		debug.innerHTML = "<ol>";
		if(this.useDepth) {
			while (this.spriteDataLength > 0) {
				debug.innerHTML += "<li>" + nullandvoidgaming.com.Engine.util.MinHeapPop(
					this.spriteData,
					nullandvoidgaming.com.Engine.IO.Display.isLower,
					this.spriteDataLength
					).depth + "</li>";
			} 
		} else {
			while(this.spriteDataLength > 1) { //Use Fact that length = 1 means last element to use
				debug.innerHTML += "<li>" +this.spriteData[--this.spriteDataLength]  + "</li>";
			}
		}
		debug.innerHTML = "</ol>";
	};
	this.flush = function() {
		if(this.useDepth) {
			while(this.spriteDataLength > 0) {
				var data =  nullandvoidgaming.com.Engine.util.MinHeapPop(
					this.spriteData,
					nullandvoidgaming.com.Engine.IO.Display.isLower,
					this.spriteDataLength--);
				if(data.frame)
					this.ctx.drawImage(
						data.frame.image,
						data.frame.X(),
						data.frame.Y(),
						data.frame.width,
						data.frame.height,
						Math.round(data.position.vector.x - this.position.vector.x),
						Math.round(data.position.vector.y - this.position.vector.y),
						data.position.width,
						data.position.height
					);
				else if(data.drawRect) {
					if (!data.color)
						this.ctx.fillStyle = "#000000";
					else 
						this.ctx.fillStyle = data.color;
						this.ctx.fillRect(
							Math.round(data.drawRect.Left() - this.position.vector.x),
							Math.round(data.drawRect.Top() - this.position.vector.y),
							data.drawRect.Width(),
							data.drawRect.Height());
					}
				}
				this.spriteDataLength = 0;
		} else {
			while(this.spriteDataLength > 1) {
				var data =  this.spriteData[--this.spriteDataLength];
				this.ctx.drawImage(
					data.frame.image,
					data.frame.X(),
					data.frame.Y(),
					data.frame.width,
					data.frame.height,
					Math.round(data.position.vector.x - this.position.vector.x),
					Math.round(data.position.vector.y - this.position.vector.y),
					data.position.width,
					data.position.height

				);
			}

		}
	};
	this.followEntity = function(ent,damper) {
		if(typeof ent.position !== "undefined") {
			this.follows = ent.position;
			this.position.setcenter(ent.position.center());
		}
		if(typeof damper === "number")
			this.followDamper = damper;
		else
			this.followDamper = -1;//default should be no dampening
	};
	this.screenToGame = function(vector) {
		vector.x += this.position.vector.x;
		vector.y += this.position.vector.y;
		return vector;
	};
	this.update = function(gT) {
		var Game = nullandvoidgaming.com.Engine.Game;
		if(this.follows) {
			var Vector = Game.Vector;
			var c = this.follows.center();
			if(this.followDamper < 0) {
				this.position.setcenter(c);
			} else {
				var myC = this.position.center();
				var F = Vector.Multiply(Vector.Subtract(myC,c),this.followDamper);
				this.position.setcenter(Vector.Subtract(myC,F));
			}
			var xEdges = 0;
			var xOff = 0;
			var yEdges = 0;
			var yOff = 0;
			if(this.position.vector.x + this.position.width 
				> Game.state.scene.width()) {
				this.position.vector.x =
					Game.state.scene.width() - this.position.width;
				xEdges++;
			}
			if(this.position.vector.y + this.position.height
				> Game.state.scene.height()) {
				this.position.vector.y =
					Game.state.scene.height() - this.position.height;
				yEdges++;
			}
			if(this.position.vector.x < 0) {
				xOff = this.position.vector.x;
				this.position.vector.x = 0;
				xEdges++;
			}
			if(this.position.vector.y < 0) {
				yOff = this.position.vector.y;
				this.position.vector.y = 0;
				yEdges++;
			}
			if(yEdges == 2) //Both Y edges are bad
				this.position.vector.y = yOff /2;
			if(xEdges == 2) //Both X edges are bad
				this.position.vector.x = xOff /2;

		}
	};
}

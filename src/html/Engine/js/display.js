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
				this.spriteData,SpriteDatum,
					nullandvoidgaming.com.Engine.IO.Display.isLower,
				this.spriteDataLength++
				);
		} else {
			this.spriteData[this.spriteDataLength++] = SpriteDatum;
		}
	};
	this.drawRect = function(x,y,w,h,color) {
		if (!color)
			this.ctx.fillStyle = "#000000";
		else
			this.ctx.fillStyle = color;
		this.ctx.fillRect(
			Math.round(x - this.position.vector.x),
			Math.round(y - this.position.vector.y),
			w,
			h
			);
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
	this.update = function(gT) {
		if(this.follows) {
			var Vector = nullandvoidgaming.com.Engine.Game.Vector;
			var c = this.follows.center();
			if(this.followDamper < 0) {
				this.position.setcenter(c);
			} else {
				var myC = this.position.center();
				var F = Vector.Multiply(Vector.Subtract(myC,c),this.followDamper);
				this.position.setcenter(Vector.Subtract(myC,F));
			}
		}
	};
}

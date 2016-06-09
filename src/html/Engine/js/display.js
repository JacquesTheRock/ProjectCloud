if(typeof nullandvoidgaming === "undefined")
	throw new Error("Fatal: nullandvoidgaming namespace missing");
nullandvoidgaming.makeSubNameSpace("com.Engine.IO.Display", nullandvoidgaming);

nullandvoidgaming.com.Engine.IO.Display.NewCamera = function(context, x, y, width, height) {
	this.ctx = context;
	this.spriteData = [];
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
				function(a,b) {
					return b == null || a.depth < b.depth;
					}
				);
		} else {
			this.spriteData[this.spriteData.length] = SpriteDatum;
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
		if(this.spriteData.length < 100) return;
		debug = document.getElementById("debug");
		debug.innerHTML = "<ol>";
		while (this.spriteData.length > 0) {
			debug.innerHTML += "<li>" + nullandvoidgaming.com.Engine.util.MinHeapPop(
				this.spriteData,
				function(a,b) {
					return a.depth < b.depth;
					}
				).depth + "</li>";
		}
		debug.innerHTML = "</ol>";
	};
	this.flush = function() {
		if(this.useDepth) {
			while(this.spriteData.length > 0) {
				var data =  nullandvoidgaming.com.Engine.util.MinHeapPop(this.spriteData, function(a,b) { return a.depth < b.depth; });
				this.ctx.drawImage(
					data.frame.image,
					data.frame.X(),
					data.frame.Y(),
					data.frame.width,
					data.frame.height,
					Math.round(data.pos.vector.x - this.position.vector.x),
					Math.round(data.pos.vector.y - this.position.vector.y),
					data.pos.width,
					data.pos.height

				);
			}
		} else {

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

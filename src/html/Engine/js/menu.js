'use strict';
//Requires Entity and Scene
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("Fatal: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Game.Menu", nullandvoidgaming.com);

//Menus are a type of scene, so implement that API
nullandvoidgaming.com.Engine.Game.Menu.NewMenu = function() {
	var out = new nullandvoidgaming.com.Engine.Game.Scene();
	out.backdrop = null;
	out.menuObjects = [];//Things in the menu
	out.hovered = {};
	out.hoverID = 0;
	out.controller = {}; //Requires a Controller be defined
	out.hoverNext = function() {
		this.hoverID++;
		if(this.menuObjects.length >= this.hoverID)
			this.hoverID = 0;
		if(this.hoverID < -1)
			this.hoverID = this.menuObjects.length - 1;
		this.hovered = this.menuObjects[this.hoverID];
	}
	out.add = function(menuObj) {
		this.menuObjects[this.menuObjects.length] = menuObj;
	}
	out.draw = function(gT,c)  {
		if(this.backdrop)
			backdrop.draw(gT,c);
		for (var i = 0; i < this.menuObjects.length; i++) {
			this.menuObjects[i].draw(gT,c);
		}
	};
	out.update = function(gT) {
		//Move Focused
		if(this.controller.isMouse)
			for(var i = 0; i < this.menuObjects.length; i++) {
				if(this.controller.curPos && this.menuObjects[i].hitbox.containsPoint(this.controller.curPos)) {
					this.hoverID = i;
				}
			}
		else if(this.controller.up || this.controller.left) {
			this.hoverID--;
			if(this.hoverID < 0)
				this.hoverID = this.menuObjects.length - 1;
		}
		else if(this.controller.down || this.controller.right) {
			this.hoverNext();
		}
		this.hovered.focused = false;
		this.hovered = this.menuObjects[this.hoverID];
		this.hovered.focused = true;

		//Trigger Selection
		if(this.controller.action && this.hovered) {
			this.hovered.onSelect();
		}
		//Run Update Script
		for(var i = 0; i < this.menuObjects.length; i++) {
			this.menuObjects[i].update(gT);
		}
	};
	return out;
}

nullandvoidgaming.com.Engine.Game.Menu.MenuObject = function(x = 0, y = 0, width = 60, height = 15) {
	this.update = nullandvoidgaming.com.Noop;//function(gT)
	this.draw = nullandvoidgaming.com.Noop;//function(gT)
	this.onSelect = nullandvoidgaming.com.Noop;//function(gT)
	return this;
}
nullandvoidgaming.com.Engine.Game.Menu.Button = function(f, text, color = "rgba(0.5,0.5,0.5,1)", x = 0, y = 0, w = 60, h = 15) {
	var Menu = nullandvoidgaming.com.Engine.Game.Menu;
	var out = new Menu.MenuObject();
	out.hitbox = nullandvoidgaming.com.Engine.Entity.Collider.RectCollider(this,w,h);
	out.hitbox.TopLeft.x = x;
	out.hitbox.TopLeft.y = y;
	out.hitbox.fix = nullandvoidgaming.com.Noop;//Don't allow the usage of fix
	out.color = color;
	out.text = text;
	out.f = f;
	out.isButton = true;
	out.onSelect = function() {
		this.selected = true;
		this.f();
	}
	out.draw = function(gT,c) {
		this.drawRect = this.hitbox;
		c.draw(this);
	}
	out.update = function(gT) {
		if(this.focused && ! this.selected) {
			this.color = 'rgba(155,155,155,1)'
		} else if(!this.selected) {
			this.color = this.baseColor;
		}
	}
	out.baseColor = color.slice(0);
	return out;
}

nullandvoidgaming.com.Engine.Game.Menu.Label = function(text, x = 0, y = 0) {
	var out = new Menu.MenuObject();
	out.hitbox = nullandvoidgaming.com.Engine.Entity.Collider.RectCollider(this,-1,-1);
	out.hitbox.TopLeft.x = x;
	out.hitbox.TopLeft.y = y;
	out.hitbox.fix = nullandvoidgaming.com.Noop;//Don't allow the usage of fix
	return out;
}

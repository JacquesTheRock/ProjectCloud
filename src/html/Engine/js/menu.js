'use strict';
//Requires Entity and Scene
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("Fatal: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Game.Menu", nullandvoidgaming.com);

nullandvoidgaming.com.Engine.Game.Menu.StyleClone = function(s) {
	var out = {};
	out.color = s.color.slice(0);
	out.size = s.size;
	out.fontSize = s.fontSize;
	out.family = s.family.slice(0);
	out.variant = s.variant ? s.variant.slice(0) : undefined;
	out.font = s.font;
	return out;
}

//Menu Style!
nullandvoidgaming.com.Engine.Game.Menu.Style = function(c = 'rgb(0,0,0)', s = 12,
	f = "arial", v = null) {
	this.color = c;
	this.size = s;
	this.fontSize = function() { return s + "px"; }
	this.family = f;
	if(v != null )
		this.variant = v;
	this.font = function() { 
		var out = this.fontSize();
		out += " " + this.family;
		out = this.variant ? this.variant + " " + out : out;
		return out;
	}
}

//Menus are a type of scene, so implement that API
nullandvoidgaming.com.Engine.Game.Menu.NewMenu = function() {
	var Menu = nullandvoidgaming.com.Engine.Game.Menu;
	var out = new nullandvoidgaming.com.Engine.Game.Scene();
	out.backdrop = null;
	out.style = new Menu.Style();
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
			this.menuObjects[i].draw(gT,c, Menu.StyleClone(this.style));
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
	out.draw = function(gT,c, style) {
		var me = this;
		this.drawRect = {
			color: this.color.slice(0),
			Left : function() { return me.hitbox.Left(); },
			Top : function() { return me.hitbox.Top(); },
			Width : function() { return me.hitbox.Width(); },
			Height : function() { return me.hitbox.Height(); }
		}
		this.drawText = {
			text: me.text,
			Left : function() { return me.hitbox.Left(); },
			Top : function() { return me.hitbox.Bottom() - this.style.size / 3; },
			style : style,
			color : style.color
		}
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

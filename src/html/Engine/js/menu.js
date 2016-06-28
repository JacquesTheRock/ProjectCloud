'use strict';
//Requires Entity and Scene
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("Fatal: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Game.Menu", nullandvoidgaming.com);

nullandvoidgaming.com.Engine.Game.Menu.TextStyleClone = function(s) {
	return new nullandvoidgaming.com.Engine.Game.Menu.TextStyle(
		s.color.slice(0),
		s.size,
		s.family.slice(0),
		s.variant ? s.variant.slice(0) : undefined
		);
}

//Menu Style!
nullandvoidgaming.com.Engine.Game.Menu.TextStyle = function(c = 'rgb(0,0,0)', s = 12,
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
	out.textStyle = new Menu.TextStyle();
	out.menuObjects = [];//Things in the menu
	out.hovered = new Menu.MenuObject();
	out.hoverID = 0;
	out.controller = {}; //Requires a Controller be defined
	out.hoverNext = function(incr = 1) {
		var start = this.hoverID;
		var id = start + incr;
		while(id != start) {
			if(this.menuObjects[id] && this.menuObjects[id].isInput)
				break;
			id += incr;
			if(id < 0)
				id = this.menuObjects.length - 1; //go to end
			if(id >= this.menuObjects.length)
				id = 0;// go to beginning
		}
		this.hoverID = id;
		if(this.menuObjects.length <= this.hoverID)
			this.hoverID = 0;
		if(this.hoverID <= -1)
			this.hoverID = this.menuObjects.length - 1;
	}
	out.add = function(menuObj) {
		this.menuObjects[this.menuObjects.length] = menuObj;
	}
	out.draw = function(gT,c)  {
		if(this.backdrop)
			backdrop.draw(gT,c);
		for (var i = 0; i < this.menuObjects.length; i++) {
			this.menuObjects[i].draw(gT,c, Menu.TextStyleClone(this.textStyle));
		}
	};
	out.findHovered = function() {
		var id = -1;
		if(this.controller.isMouse) {
			for(var i = 0; i < this.menuObjects.length; i++) {
				if(this.controller.curPos && this.menuObjects[i].hitbox.containsPoint(this.controller.curPos)) {
					id = i;
				}
			}
		}
		return id;
	}
	out.controllerAction = function() {
		if(this.isMouse)
			out.hoverID = out.findHovered();
		var next = out.menuObjects[out.hoverID];
		if(next) {
			if(out.hovered) out.hovered.loseFocus();
			next.gainFocus();
			out.hovered = next;
			next.onSelect();
		}
	}
	out.update = function(gT) {
		//Move Focused
		if(this.controller.isMouse) {
			this.hoverID = this.findHovered();
		}
		else if(this.controller.up || this.controller.left) {
			this.controller.left = 0;
			this.controller.up = 0;
			this.hoverNext(-1);
		}
		else if(this.controller.down || this.controller.right) {
			this.controller.right = 0;
			this.controller.down = 0;
			this.hoverNext(1);
		}
		var next = this.menuObjects[this.hoverID];
		if(this.hovered != next) {
			if(this.hovered) {
				this.hovered.loseFocus();
			}
			if(next) {
				next.gainFocus();
			}
		}
		this.hovered = next;
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
	this.gainFocus = function() { this.focused = true; }
	this.loseFocus = function() { this.focused = false; }
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
	out.isInput = true;
	out.isButton = true;
	out.onSelect = function() {
		this.selected = true;
		this.f();
	}

	out.gainFocus = function() {
		if(!this.selected) {
			this.oldColor = this.color;
			this.color = 'rgba(200,200,200,1)';
		}
			
	}

	out.loseFocus = function() {
		if(!this.selected && this.oldColor) {
			this.color = this.oldColor;
		}
			
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
			Top : function() { 
				return me.hitbox.Center().y + (this.style.size / 3); 
			},
			style : style,
			color : style.color
		}
		c.draw(this);
	}
	out.baseColor = color.slice(0);
	return out;
}


nullandvoidgaming.com.Engine.Game.Menu.TextField = function(x,y, max = 15, width = max, style) {
	var Menu = nullandvoidgaming.com.Engine.Game.Menu;
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var out = new Menu.Label("", x, y);
	out.rawtext = "";
	out.focusColor = 'white';
	out.defaultColor = 'grey';
	out.maxLength = max;
	out.isInput = true;
	out.styleOverride = {family: "monospace" } ;
	out.marketAt = -1;
	out.drawRect = {
		color: out.defaultColor,
		Left : function() { return out.hitbox.Left(); },
		Top : function() { return out.hitbox.Top() - (style ? style.size : 12) * 0.8; },
		Width : function() { return width * (style ? style.size : 12) * 0.66666666; },
		Height : function() { return style ? style.size : 12; }
	}
	out.gainFocus = function() {
		this.focused = true;
		this.drawRect.color = out.focusColor;
		this.text = this.rawtext + "|";
	}
	out.loseFocus = function() {
		this.focused = false;
		this.drawRect.color = this.defaultColor;
		this.text = this.rawtext;
	}
	out.inputListener = function(e) {
			if(!out.focused) //If I don't have focus, I should not be able to execute
				return;
			var code = e.keyCode || e.which;
			var c = Input.keycodeMap[code];
			if(c == "BACK_SPACE") {
				out.rawtext = out.text.slice(0,out.rawtext.length - 1)
				e.preventDefault();
			} else if(out.rawtext.length < out.maxLength) {
				if(c == "SPACE")
					out.rawtext += " ";
				else if(c.length == 1)
					out.rawtext += (e.shiftKey ? c.toUpperCase() : c.toLowerCase());
			}
			out.text = out.rawtext;
			out.text += "|";
		}	
	window.addEventListener('keydown', out.inputListener);
	return out;
}

nullandvoidgaming.com.Engine.Game.Menu.Label = function(text, x = 0, y = 0, style) {
	var Menu = nullandvoidgaming.com.Engine.Game.Menu;
	var out = new Menu.MenuObject();
	out.text = text;
	out.hitbox = nullandvoidgaming.com.Engine.Entity.Collider.RectCollider(this,-1,-1);
	out.hitbox.TopLeft.x = x;
	out.hitbox.TopLeft.y = y;
	out.hitbox.fix = nullandvoidgaming.com.Noop;//Don't allow the usage of fix
	out.style = style;
	out.draw = function(gT,c, style) {
		var me = this;
		if(this.styleOverride) {
			style.family = this.styleOverride.family || style.family;
			style.size = this.styleOverride.size || style.size;
			style.variant = this.styleOverride.variant || style.variant;
		}
		this.drawText = {
			text : me.text,
			Left : function() { return me.hitbox.Left(); },
			Top : function() { return me.hitbox.Top(); },
			style: me.style ? me.style : style,
			color: style.color
		}
		c.draw(this);
	}
	return out;
}

'use strict';
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.Action", nullandvoidgaming.com);
nullandvoidgaming.com.makeSubNameSpace("Engine.Action.Move", nullandvoidgaming.com);

nullandvoidgaming.com.Engine.Action.NewAction = function() {
	this.init = nullandvoidgaming.com.Noop;
	this.condition = nullandvoidgaming.com.NoopBool;
	this.update = nullandvoidgaming.com.Noop;
	this.entity = null;
	return this;
}


nullandvoidgaming.com.Engine.Action.Move.Direct = function(end) {
	var out = new nullandvoidgaming.com.Engine.Action.NewAction();
	out.condition = function(ent) { 
			return ent.position.vector.x != end.x 
				&& ent.position.vector.y != end.y; 
		}
	out.update = function(gt, ent) {
			if(ent.position.vector.x < end.x) {
				ent.controller.left = 0;
				ent.controller.right = 1;
			}
			else if(ent.position.vector.x > end.x) {
				ent.controller.left = 1;
				ent.controller.right = 0;
			}
			else{
				ent.controller.left = 0;
				ent.controller.right = 0;
			}
			if(ent.position.vector.y < end.y) {
				ent.controller.up = 0;
				ent.controller.down = 1;
			}
			else if(ent.position.vector.y > end.y) {
				ent.controller.up = 1;
				ent.controller.down = 0;
			}
			else{
				ent.controller.up = 0;
				ent.controller.down = 0;
			}
		}
}
nullandvoidgaming.com.Engine.Action.Move.Horizontal = function(end) {
	var out = new nullandvoidgaming.com.Engine.Action.NewAction();
	out.condition = function(ent) { return ent.position.vector.x != end; }
	out.update = function(gT,ent) {
			if(ent.position.vector.x > end) {
				ent.controller.left = 1;
				ent.controller.right = 0;
				}
			else if(ent.position.vector.x < end) {
				ent.controller.left = 0;
				ent.controller.right = 1;
				}
			else {
				ent.controller.left = 0;
				ent.controller.right = 0;
			}
		}
	return out;
}
nullandvoidgaming.com.Engine.Action.Move.Vertical = function(end) {
	var out = new nullandvoidgaming.com.Engine.Action.NewAction();
	out.condition = function(ent) { return ent.position.vector.y != end; }
	out.update = function(gT,ent) {
			if(ent.position.vector.y > end) {
				ent.controller.up = 1;
				ent.controller.down = 0;
				}
			else if(ent.position.vector.y < end) {
				ent.controller.up = 0;
				ent.controller.down = 1;
				}
			else {
				ent.controller.up = 0;
				ent.controller.down = 0;
			}
		}
	return out;
}

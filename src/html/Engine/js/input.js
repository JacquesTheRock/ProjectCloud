'use strict';
if(typeof nullandvoidgaming.com === "undefined")
	throw new Error("FATAL: nullandvoidgaming.com namespace missing");
nullandvoidgaming.com.makeSubNameSpace("Engine.IO.Input", nullandvoidgaming.com);

nullandvoidgaming.com.Engine.IO.Input.keycodeMap = [
"", // [0]
"", // [1]
"", // [2]
"CANCEL", // [3]
"", // [4]
"", // [5]
"HELP", // [6]
"", // [7]
"BACK_SPACE", // [8]
"TAB", // [9]
"", // [10]
"", // [11]
"CLEAR", // [12]
"ENTER", // [13]
"ENTER_SPECIAL", // [14]
"", // [15]
"SHIFT", // [16]
"CONTROL", // [17]
"ALT", // [18]
"PAUSE", // [19]
"CAPS_LOCK", // [20]
"KANA", // [21]
"EISU", // [22]
"JUNJA", // [23]
"FINAL", // [24]
"HANJA", // [25]
"", // [26]
"ESCAPE", // [27]
"CONVERT", // [28]
"NONCONVERT", // [29]
"ACCEPT", // [30]
"MODECHANGE", // [31]
"SPACE", // [32]
"PAGE_UP", // [33]
"PAGE_DOWN", // [34]
"END", // [35]
"HOME", // [36]
"LEFT", // [37]
"UP", // [38]
"RIGHT", // [39]
"DOWN", // [40]
"SELECT", // [41]
"PRINT", // [42]
"EXECUTE", // [43]
"PRINTSCREEN", // [44]
"INSERT", // [45]
"DELETE", // [46]
"", // [47]
"0", // [48]
"1", // [49]
"2", // [50]
"3", // [51]
"4", // [52]
"5", // [53]
"6", // [54]
"7", // [55]
"8", // [56]
"9", // [57]
"COLON", // [58]
"SEMICOLON", // [59]
"LESS_THAN", // [60]
"EQUALS", // [61]
"GREATER_THAN", // [62]
"QUESTION_MARK", // [63]
"AT", // [64]
"A", // [65]
"B", // [66]
"C", // [67]
"D", // [68]
"E", // [69]
"F", // [70]
"G", // [71]
"H", // [72]
"I", // [73]
"J", // [74]
"K", // [75]
"L", // [76]
"M", // [77]
"N", // [78]
"O", // [79]
"P", // [80]
"Q", // [81]
"R", // [82]
"S", // [83]
"T", // [84]
"U", // [85]
"V", // [86]
"W", // [87]
"X", // [88]
"Y", // [89]
"Z", // [90]
"OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
"", // [92]
"CONTEXT_MENU", // [93]
"", // [94]
"SLEEP", // [95]
"NUMPAD0", // [96]
"NUMPAD1", // [97]
"NUMPAD2", // [98]
"NUMPAD3", // [99]
"NUMPAD4", // [100]
"NUMPAD5", // [101]
"NUMPAD6", // [102]
"NUMPAD7", // [103]
"NUMPAD8", // [104]
"NUMPAD9", // [105]
"MULTIPLY", // [106]
"ADD", // [107]
"SEPARATOR", // [108]
"SUBTRACT", // [109]
"DECIMAL", // [110]
"DIVIDE", // [111]
"F1", // [112]
"F2", // [113]
"F3", // [114]
"F4", // [115]
"F5", // [116]
"F6", // [117]
"F7", // [118]
"F8", // [119]
"F9", // [120]
"F10", // [121]
"F11", // [122]
"F12", // [123]
"F13", // [124]
"F14", // [125]
"F15", // [126]
"F16", // [127]
"F17", // [128]
"F18", // [129]
"F19", // [130]
"F20", // [131]
"F21", // [132]
"F22", // [133]
"F23", // [134]
"F24", // [135]
"", // [136]
"", // [137]
"", // [138]
"", // [139]
"", // [140]
"", // [141]
"", // [142]
"", // [143]
"NUM_LOCK", // [144]
"SCROLL_LOCK", // [145]
"WIN_OEM_FJ_JISHO", // [146]
"WIN_OEM_FJ_MASSHOU", // [147]
"WIN_OEM_FJ_TOUROKU", // [148]
"WIN_OEM_FJ_LOYA", // [149]
"WIN_OEM_FJ_ROYA", // [150]
"", // [151]
"", // [152]
"", // [153]
"", // [154]
"", // [155]
"", // [156]
"", // [157]
"", // [158]
"", // [159]
"CIRCUMFLEX", // [160]
"EXCLAMATION", // [161]
"DOUBLE_QUOTE", // [162]
"HASH", // [163]
"DOLLAR", // [164]
"PERCENT", // [165]
"AMPERSAND", // [166]
"UNDERSCORE", // [167]
"OPEN_PAREN", // [168]
"CLOSE_PAREN", // [169]
"ASTERISK", // [170]
"PLUS", // [171]
"PIPE", // [172]
"HYPHEN_MINUS", // [173]
"OPEN_CURLY_BRACKET", // [174]
"CLOSE_CURLY_BRACKET", // [175]
"TILDE", // [176]
"", // [177]
"", // [178]
"", // [179]
"", // [180]
"VOLUME_MUTE", // [181]
"VOLUME_DOWN", // [182]
"VOLUME_UP", // [183]
"", // [184]
"", // [185]
"SEMICOLON", // [186]
"EQUALS", // [187]
"COMMA", // [188]
"MINUS", // [189]
"PERIOD", // [190]
"SLASH", // [191]
"BACK_QUOTE", // [192]
"", // [193]
"", // [194]
"", // [195]
"", // [196]
"", // [197]
"", // [198]
"", // [199]
"", // [202]
"", // [203]
"", // [204]
"", // [205]
"", // [206]
"", // [207]
"", // [208]
"", // [209]
"", // [210]
"", // [211]
"", // [212]
"", // [213]
"", // [214]
"", // [215]
"", // [216]
"", // [217]
"", // [218]
"OPEN_BRACKET", // [219]
"BACK_SLASH", // [220]
"CLOSE_BRACKET", // [221]
"QUOTE", // [222]
"", // [223]
"META", // [224]
"ALTGR", // [225]
"", // [226]
"WIN_ICO_HELP", // [227]
"WIN_ICO_00", // [228]
"", // [229]
"WIN_ICO_CLEAR", // [230]
"", // [231]
"", // [232]
"WIN_OEM_RESET", // [233]
"WIN_OEM_JUMP", // [234]
"WIN_OEM_PA1", // [235]
"WIN_OEM_PA2", // [236]
"WIN_OEM_PA3", // [237]
"WIN_OEM_WSCTRL", // [238]
"WIN_OEM_CUSEL", // [239]
"WIN_OEM_ATTN", // [240]
"WIN_OEM_FINISH", // [241]
"WIN_OEM_COPY", // [242]
"WIN_OEM_AUTO", // [243]
"WIN_OEM_ENLW", // [244]
"WIN_OEM_BACKTAB", // [245]
"ATTN", // [246]
"CRSEL", // [247]
"EXSEL", // [248]
"EREOF", // [249]
"PLAY", // [250]
"ZOOM", // [251]
"", // [252]
"PA1", // [253]
"WIN_OEM_CLEAR", // [254]
"" // [255]
];

nullandvoidgaming.com.Engine.IO.Input.Controller = function() {
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	this.lock = false;
	var me = this;
	this.controlNames = ["up","down","left","right","action","cancel"];
	this.keymap = [];
	this.up = 0;
	this.down = 0;
	this.left = 0;
	this.right = 0;
	this.action = 0;
	this.cancel = 0;
	this.keyChange = function(e,val) {
			if(this.waiting && val == 1) {
				this.waitForKey(e);
				return;
			}
			if(this.lock && val == 1) return;
			for(var i = 0; i < this.controlNames.length; i++) {
				var name = this.controlNames[i];
				if(e.keyCode == this.keymap[name]) {
					this[name] = val;
					if(name == "action" && this.checkAction && val == 1)
						this.checkAction();
					if(name == "cancel" && this.checkCancel && val == 1)
						this.checkCancel();
					break;
				}
			}
		};
	this.relKey = function(e) { this.keyChange(e,0); };
	this.pressKey = function(e) { this.keyChange(e,1); };
	this.clear = function() { //lose focus thisans no keys are pressed
			for(var i = 0; i < this.controlNames.length; i++){
				var name = this.controlNames[i];
				this[name] = 0;
			}
		};
	this.waitForKey = nullandvoidgaming.com.Noop;
	this.toString = function(sep, pre) {
			if (pre == null) pre = "";
			if (sep == null) sep = "";
			var out = "";
			if(controller.isMouse)
				out += pre + "MOUSE Controller" + sep;
			if(controller.isGamePad)
				out += pre + "GAMEPAD Controller" + sep;
			if(controller.isKeyboard)
				out += pre + "KEYBOARD Controller" + sep;
			for(var i = 0; i < this.controlNames[i]; i++) {
				var name = this.controlNames[i];
				out += pre +  name + ": " + this.keymap[name] + sep;
			}
			return out
		};
	this.checkAction = nullandvoidgaming.com.Noop;
	this.checkCancel = nullandvoidgaming.com.Noop;
	this.setControlled = nullandvoidgaming.com.Engine.IO.Input.DefaultSetControlled;
	this.update = nullandvoidgaming.com.Noop;
	return this;
};

nullandvoidgaming.com.Engine.IO.Input.DefaultSetControlled = function(controlled) {
		var me = this;
		me.p = controlled;
		me.p.controller = me;
		this.clear();
		if(!controlled) {
			throw new Error("Null Controlled Object or Camera");
		}
}


nullandvoidgaming.com.Engine.IO.Input.KeyBoardController = function() {
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var out = new Input.Controller();
	out.isKeyboard = true;
	//set default values for keys
	out.keymap["up"] = 38;
	out.keymap["down"] = 40;
	out.keymap["left"] = 37;
	out.keymap["right"] = 39;
	out.keymap["action"] = 65;
	out.keymap["cancel"] = 88;
	window.addEventListener('keydown',
		function keyboardDown(e) {
			if(!out.p) window.removeEventListener('keydown', keyboardDown);
			else out.pressKey(e);
			}
		);
	window.addEventListener('keyup',
		function keyboardUp(e) {
			if(!out.p) window.removeEventListener('keyup', keyboardUp);
			else out.relKey(e);
			}
		);
	out.setControlled = function(controlled) {
		var me = this;
		me.p = controlled;
		me.p.controller = me;
		me.checkAction = controlled.controllerAction;
		this.clear();
	}
	return out;
}

nullandvoidgaming.com.Engine.IO.Input.GamePadController = function(index=0) {
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var Vector = nullandvoidgaming.com.Engine.Game.Vector;
	if (!("getGamepads" in navigator))
		return null;
	var out = new Input.Controller();
	/*
	Default Map for an Xbox controller to use DPAD and A for action, B for cancel
	*/
	out.keymap.down = 1013;
	out.keymap.up = 1012;
	out.keymap.left = 1014;
	out.keymap.right = 1015;
	out.keymap.action = 1000;
	out.keymap.cancel = 1001;
	out.isGamePad = true;
	out.prevState = [];
	out.setState = function() {
		var gp = navigator.getGamepads()[index];
		if(!gp) return;
		if(gp.buttons.length > out.prevState.length) {
			for(var b = 0; b < gp.buttons.length; b++) {
				out.prevState[b] = false;
			}
		} else {
			for(var b = 0; b < gp.buttons.length; b++) {
				if(out.prevState[b] != gp.buttons[b].pressed) {
					out.keyChange(
						{keyCode: 1000+ b},
						out.prevState[b] ? 0 : 1);
					out.prevState[b] = !out.prevState[b];
				}
			}
		}
	}
	out.setControlled = function(controlled) {
		var me = this;
		me.p = controlled;
		me.p.controller = me;
		me.checkAction = controlled.controllerAction;
		this.clear();
	}
	window.setInterval(out.setState, 20);
	return out;
}

nullandvoidgaming.com.Engine.IO.Input.MouseController = function(clickTarget) {
	var Input = nullandvoidgaming.com.Engine.IO.Input;
	var Vector = nullandvoidgaming.com.Engine.Game.Vector;
	var out = new Input.Controller();
	out.isMouse = true;
	if(!clickTarget) {
		throw new Error("Must Specify Dom Object to Click");
		return null;
	}
	out.clickTarget = clickTarget;
	clickTarget.addEventListener('mousedown',
		function(e) {
			if(!out.p || !out.cam || !out.cam.screenToGame) {
				out.clickTarget.removeEventListener('mousedown',this);
				out.targetPos = null;
				out.curPos = null;
				out.clickTarget = null;
			}
			else {
				var pos = new Vector.NewVector(e.clientX, e.clientY);
				var offset = out.cam.ctx.canvas.getBoundingClientRect();
				pos.x -= offset.left;
				pos.y -= offset.top;
				out.curPos = pos;
				pos = out.cam.screenToGame(pos);
				out.targetPos = pos;
				out.action = 1;//Activate an action
				if(out.checkAction) out.checkAction();
			}
		});
	clickTarget.addEventListener('mouseup',
		function(e) {
			if(!out.p || !out.cam || !out.cam.screenToGame) {
				out.clickTarget.removeEventListener('mouseup',this);
				out.targetPos = null;
				out.curPos = null;
				out.clickTarget = null;
			}
			else {
				out.action = 0;//deactivate an action
			}
		});
	clickTarget.addEventListener('mousemove',
		function(e) {
			if(!out.p || !out.cam || !out.cam.screenToGame) {
				out.clickTarget.removeEventListener('mousemove',this);
				out.curPos = null;
			}
			else {
				var pos = new Vector.NewVector(e.clientX, e.clientY);
				var offset = out.cam.ctx.canvas.getBoundingClientRect();
				pos.x -= offset.left;
				pos.y -= offset.top;
				out.curPos = pos;
			}
		}
		);
	out.error = 5;//If you get within this, you have reached the destination
	out.setControlled = function(controlled, camera) {
		var me = this;
		me.checkAction = controlled.controllerAction;
		me.p = controlled;
		me.p.controller = me;
		me.cam = camera;
		this.clear();
		if(!controlled || !camera) {
			throw new Error("Null Controlled Object or Camera");
		}
	};
	out.update = function(gT) {
		if(this.targetPos && this.p) {
			var error = 15 || this.error;
			var center = this.p.position.center();
			if(center.x + error < this.targetPos.x) {
				this.right = 1;
				this.left = 0;
			} else if(center.x - error > this.targetPos.x) {
				this.left = 1;
				this.right = 0;
			} else {
				this.left = 0;
				this.right = 0;
			}
			if(center.y + error < this.targetPos.y) {
				this.down = 1;
				this.up = 0;
			} else if(center.y - error > this.targetPos.y) {
				this.up = 1;
				this.down = 0;
			} else {
				this.up = 0;
				this.down = 0;
			}
			if(!this.up && !this.down && !this.left && !this.right) {
				this.targetPos = null;//Arrival
			}
		} else {
		}
	};
	return out;
}

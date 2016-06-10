'use strict';
var nullandvoidgaming = {} || nullandvoidgaming;
nullandvoidgaming.makeSubNameSpace = function(ns, p) {
	var nsparts = ns.split(".");
	var parent = p;
	var pName = parent.toString();
	if(typeof parent === "undefined") {
		parent = {};
	}
	for (var i = 0; i < nsparts.length; i++) {
		var name = nsparts[i];
		if(typeof parent[name] === "undefined") {
			parent[name] = {};
		}
		parent = parent[name];
	}
	return parent;
}

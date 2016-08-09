'use strict';
var nullandvoidgaming = {} || nullandvoidgaming;
nullandvoidgaming.com = {} || nullandvoidgaming.com;
nullandvoidgaming.com.makeSubNameSpace = function(ns, p) {
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
nullandvoidgaming.com.Noop = function() {};
nullandvoidgaming.com.NoopInt = function() { return 0; };
nullandvoidgaming.com.NoopBool = function() { return false; };

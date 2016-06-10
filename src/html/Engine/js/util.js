'use strict';
if(typeof nullandvoidgaming === "undefined")
	throw new Error("FATAL: nullandvoidgaming namespace missing");
nullandvoidgaming.makeSubNameSpace("com.Engine.util", nullandvoidgaming);
nullandvoidgaming.com.Engine.util.MinHeapPop = function(a, compareFunc,l) {
	if (a == null)
		return null;
	var out = a[0];
	l-=1;
	a[0] = a[l]; //swap last and first
	var p = 0;
	var c = 1;
	while(c <= l && c + 1 <= l) {
		if(a[c+1] != null && !compareFunc(a[c],a[c+1])) { c = c+1; } else { c = c; }
		if(compareFunc(a[p],a[c])) {
			break;
		}
		var s = a[p];
		a[p] = a[c];
		a[c] = s;
		p = c;
		c = (p * 2) + 1;
	}
	return out;
}
nullandvoidgaming.com.Engine.util.MinHeapInsert = function(a,data,compareFunc,l) {
	a[l] = data;
	var i = l;
	var p = Math.floor(i/2);
	while(i > 0 && i <= l && compareFunc(a[i],a[p])) {
		var s = a[i];
		a[i] = a[p];
		a[p] = s;
		i = p;
		p = Math.floor(i/2);
	}
	i = 0;
}

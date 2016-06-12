

function Generate() {
	var url = window.location.href;
	var width = (new RegExp("[?&]w=([^&#]*)|&\#\$")).exec(url);
	var height = (new RegExp("[?&]h=([^&#]*)|&\#\$")).exec(url);
	height = height[1] || 20;
	width = width[1] || 20;
	
	var output = document.getElementById("output");
	output.innerHTML = "{\n";
	output.innerHTML += '\t"name" : "New Map",\n';
	output.innerHTML += '\t"width" : ' + width + ',\n';
	output.innerHTML += '\t"height" : ' + height + ',\n';
	output.innerHTML += '\t"sheet" : "outside",\n';
	output.innerHTML += '\t"tiles" : [\n';
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			var tile = 0;
			var pos = y * width + x;
			if(x == width - 1 ) {
				tile += 2;
			} else if (x > 0) {
				tile += 1;
			}
			if(y == height - 1) {
				tile += 20;
			} else if(y > 0) {
				tile += 10;
			}
				
			if(x != 0 || y != 0)
				output.innerHTML += '\t\t,{"pos" : ' +pos + 
					', "tile" : ' + tile + ' }\n';
			else
				output.innerHTML += '\t\t{"pos" : ' +pos + 
					', "tile" : ' + tile + ' }\n';
				
		}
	}
	output.innerHTML += '\t]\n';
	output.innerHTML += '}';
}

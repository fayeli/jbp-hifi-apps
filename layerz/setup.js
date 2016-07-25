/// HI ERIC
// TWO FILES
// THIS ONE CREATES STUFF
// RUN IT ONCE

//THE OTHER SCRIPT IS A CLIENT SCRIPT THAT EVERYONE SHOULD RUN

//NOT ENTITY SCRIPTS AT ALL


var startPosition = {
	x: 1000,
	y: 0,
	z: 1000,
};

var spaceBetweenLayers = 2;

var layers = [];

function createLayers() {
	var howMany = 5;
	var i;

	for (i = 0; i < howMany; i++) {
		var position = {
			x: startPosition.x,
			y: startPosition.y,
			z: startPosition.z
		};
		position.z = startPosition.z + (i * spaceBetweenLayers);
		createSingleLayer(position)
	}
};

function createSingleLayer(position) {
	var layerProps = {
		type: 'Box',
		dimensions: {
			x: 10,
			y: 10,
			z: 1
		},
		name: 'layerWall',
		color: {
			red: 100,
			blue: 100,
			green: 0
		},
		position: position,
		userData: JSON.stringify({
			shaderLocked: false,
			intersectionPosition: null,
			"ProceduralEntity": {
				//make this an accessible script for everyone
				"shaderUrl": Script.resolvePath("circle.fs?"+Math.random()),
				"version": 2,
				"uniforms": {
					// uniform float iSpeed = 1.0;
					"iSpeed": 2.0,
					// uniform vec3 iSize = vec3(1.0);
					"iSize": [1.0, 2.0, 4.0]
				}
			}
		}),
		//script: Script.resolvePath("layerWall.js?" + Math.random())
	}
	var layer = Entities.addEntity(layerProps);
	print('added layer:: ' + layer)
};

Script.scriptEnding.connect(function() {
	while (layers.length) {
		Entities.deleteEntity(layers.pop());
	}
});

createLayers();
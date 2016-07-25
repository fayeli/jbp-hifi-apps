// this script does a few things
// find the layer walls and update the whitelist
// cast a ray and see if it intersects any of those walls
// if it does, lock them and add a hole at a certain position
// if it doesn't, free any personally locked layerwalls and then

var whitelist = [];

function update() {
	findLayerWalls();


	checkIfLookingAtLayerWall();
}

var layerWalls = [];
var currentlyLookingAtLayer = null;

function findLayerWalls() {
	var unlockedLayers = [];
	var res = Entities.findEntities(MyAvatar.position, 1000);
	res.forEach(function(thing) {
		var properties = Entities.getEntityProperties(thing);
		if (properties.name === 'layerWall') {
			var userData = properties.userData;
			var data = null;
			try {
				data = JSON.parse(userData);
			} catch (err) {
				print('error parsing layerWall JSON');
				return;
			}

			if (data === null) {
				print('data is still null no JSON');
				return;
			}

			if (data.shaderLocked === false) {
				unlockedLayers.push(thing);
			}

		}
	});
	whiteList = unlockedLayers;
	print('WHITELIST:: ' + JSON.stringify(whiteList))
}


function checkIfIntersectionIsOnWhitelist(entityID) {
	whitelist.forEach(function(layerWall) {
		if (layerWall === entityID) {
			currentlyLookingAtLayer = layerWall;
			//lock this wall
			updateHoleOnLayerWall(layerWall);
			return;
		}
	})
}

function updateHoleOnLayerWall(layerWall) {
	//set it to locked and also pass it a uniform
	Enitites.editEntity(layerWall, {
		userData: JSON.stringify({
			shaderLocked: true,
			intersectionPosition: {
				x: 1,
				y: 1,
				z: 1
			}
		})
	})
};

function unlockLayerWall(layerWall) {
	Entities.editEntity(layerWall, {
		userData: JSON.stringify({
			shaderLocked: false,
			intersectionPosition: null
		})
	})
};

function checkIfLookingAtLayerWall(layerwall) {
	var cameraPosition = Camera.getPosition();
	var cameraOrientation = Camera.getOrientation();

	var front = Quat.getFront(cameraOrientation);
	var pickRay = {
		origin: cameraPosition,
		direction: front
	};

	// if (WANT_LOOK_DEBUG_LINE === true) {
	// 	_this.overlayLineOn(pickRay.origin, Vec3.sum(pickRay.origin, Vec3.multiply(front, _this.overlayLineDistance)), INTERSECT_COLOR);
	// };

	var intersection = Entities.findRayIntersection(pickRay, true, whiteList);

	if (intersection.intersects && intersection.entityID === layerwall) {
		//actually looking at a layerwall
		checkIfIntersectionIsOnWhitelist();
	} else {
		if (currentlyLookingAtLayer !== null) {
			unlockLayerWall(currentlyLookingAtLayer)
		}
		currentlyLookingAtLayer = null;
	}
}

Script.update.connect(update);
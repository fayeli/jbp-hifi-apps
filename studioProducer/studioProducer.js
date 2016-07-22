//by james b. pollack @imgntn 7/14/2016

//this script creates three cameras and three targets.
//the cameras look at the targets.

//to use:

//move cameras and targets to desired locations.

//press 1,2,3 to switch cameras
//press 4 to hide cameras+targets
//press 5 to show cameras+targets
//press 6 to exit producer mode

var CAMERA_MODEL = 'http://hifi-content.s3.amazonaws.com/james/studioProducer/ProfessionalCamera_05.fbx';
var CAMERA_COUNT = 3;
var TARGET_COUNT = 3;
var ROW_SPACER = 1.2;
var COLUMN_SPACER = 1.2;
var basePosition = MyAvatar.position;

var startRotation = Quat.angleAxis(0, {
    x: 1,
    y: 0,
    z: 0
})

var producer, oldCameraMode;

var cameraConnected = false;

function Producer() {
    this.activeCamera = 0;
    var positions = distributePointsOnGrid(basePosition, startRotation);

    var cameraPositions = positions.slice(0, CAMERA_COUNT)
    var targetPositions = positions.slice(CAMERA_COUNT, CAMERA_COUNT + TARGET_COUNT);

    this.cameras = createStartCameras(cameraPositions);
    this.targets = createStartTargets(targetPositions);
};

function jCamera(position) {
    var properties = {
        type: 'Model',
        modelURL: CAMERA_MODEL,
        dimensions: {
            x: 0.2192,
            y: 0.3463,
            z: 0.1662
        },
        // color: {
        //     red: 0,
        //     green: 255,
        //     blue: 0
        // },
        dynamic: true,
        position: position,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: true
            },
            producerKey: {
                isCamera: true,
            }
        })
    }
    this.item = Entities.addEntity(properties);

}

function jTarget(position) {
    var properties = {
        type: 'Box',
        dimensions: {
            x: 0.5,
            y: 0.5,
            z: 0.5
        },
        color: {
            red: 0,
            green: 0,
            blue: 255
        },
        collisionless: true,
        collidesWith: '',
        position: position,
        dynamic: true,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: true
            },
            producerKey: {
                isTarget: true,
            }
        })
    }
    this.item = Entities.addEntity(properties);
};

function enterSetupMode() {
    print('ENTERING SETUP MODE')
    makeProducerEntitiesVisible();
};

function enterLiveMode() {
    print('ENTERING LIVE MODE')
        // makeProducerEntitiesInvisible();
};

function createStartCameras(positions) {
    var cameras = [];
    var i;
    for (i = 0; i < CAMERA_COUNT; i++) {
        cameras.push(new jCamera(positions[i]).item);
    }
    return cameras;
};

function createStartTargets(positions) {
    var targets = [];
    var i;
    for (i = 0; i < TARGET_COUNT; i++) {
        targets.push(new jTarget(positions[i]).item);
    }
    return targets;
};

function cleanupCameras(cameras) {
    cameras.forEach(function(camera) {
        Entities.deleteEntity(camera);
    })
};

function cleanupTargets(targets) {
    targets.forEach(function(target) {
        Entities.deleteEntity(target);
    })
};

function updateCurrentCamera() {
    var cameraProperties = Entities.getEntityProperties(Camera.cameraEntity);
    var targetProperties = Entities.getEntityProperties(producer.targets[producer.activeCamera]);
    var rotation = Quat.lookAt(cameraProperties.position, targetProperties.position, Vec3.UP)
    var camEntity = Camera.cameraEntity;
    Entities.editEntity(camEntity, {
        rotation: rotation
    })
};

function switchCameraToEntity(entityID) {
    Camera.mode = "entity";
    Camera.cameraEntity = entityID;
};

function findAllProducerEntities() {
    var producers = [];
    var results = Entities.findEntities(getBasePosition(), 100);
    results.forEach(function(result) {
        var properties = Entities.getEntityProperties(result);
        if (properties.hasOwnProperty('userData')) {
            try {
                var data = JSON.parse(properties.userData);
                if (data.hasOwnProperty('producerKey')) {
                    print('found a producer entity')
                    producers.push(result);
                }
            } catch (e) {
                print('error parsing userdata');
            }
        }
    });

    return producers;
}

function switchToOriginalMode() {
    Camera.mode = oldCameraMode;
    Camera.cameraEntity = null;
    cleanupTargets(producer.targets);
    cleanupCameras(producer.cameras);
    producer.activeCamera = 0;
}

function getBasePosition() {
    var front = Quat.getFront(MyAvatar.orientation);
}

function makeProducerEntitiesVisible() {
    findAllProducerEntities().forEach(function(result) {
        Entities.editEntity(result, {
            visible: true
        });
    });
};


function makeProducerEntitiesInvisible() {
    findAllProducerEntities().forEach(function(result) {
        Entities.editEntity(result, {
            visible: false
        });
    });
}

function distributePointsOnGrid(basePosition, rotation) {
    var positions = [];

    var arrangement = [
        [1, 1, 1],
        [1, 1, 1]
    ];

    arrangement.forEach(function(row, rowIndex) {
        row.forEach(function(column, colIndex) {
            var horizontalOffset = colIndex * COLUMN_SPACER;
            var verticalOffset = rowIndex * ROW_SPACER
            var rightVector = Quat.getRight(rotation);
            var frontVector = Quat.getFront(rotation);
            var rightDisplacement = Vec3.multiply(rightVector, horizontalOffset);
            var frontDisplacement = Vec3.multiply(frontVector, verticalOffset);
            var finalPosition = Vec3.sum(basePosition, rightDisplacement);
            finalPosition = Vec3.sum(finalPosition, frontDisplacement);
            positions.push(finalPosition)
        })
    });

    return positions;
};

function handleKeyPresses(event) {
    if (event.text === '6') {
        print('PRODUCER: back to basics')
        disconnectCameraUpdate();
        Camera.mode = oldCameraMode;
        Camera.cameraEntity = null;
        enterSetupMode();
        return;
    }
    if (event.text === '1') {
        print('PRODUCER: go to camera 1')
        producer.activeCamera = 0;
        switchCameraToEntity(producer.cameras[0])
        enterLiveMode();
        connectCameraUpdate();;

    }
    if (event.text === '2') {
        print('PRODUCER: go to camera 2')
        producer.activeCamera = 1;
        switchCameraToEntity(producer.cameras[1])
        enterLiveMode();
        connectCameraUpdate();
    }
    if (event.text === '3') {
        print('PRODUCER: go to camera 3')
        producer.activeCamera = 2;
        switchCameraToEntity(producer.cameras[2])
        enterLiveMode();
        connectCameraUpdate();
    }
    if (event.text === '4') {
        print('PRODUCER: make entities invisible')
        makeProducerEntitiesInvisible();
    }
    if (event.text === '5') {
        print('PRODUCER: make entities visible')
        makeProducerEntitiesVisible();
    }

    return;
};



function disconnectCameraUpdate() {
    if (cameraConnected === true) {
        Script.update.disconnect(updateCurrentCamera);
    }
    cameraConnected = false;
}

function connectCameraUpdate() {
    cameraConnected = true;
    Script.update.connect(updateCurrentCamera);
}

function cleanup() {
    switchToOriginalMode();
    Controller.keyPressEvent.disconnect(handleKeyPresses);
    var junk = findAllProducerEntities();
    junk.forEach(function(piece) {
        Entities.deleteEntity(piece);
    })
}

function initialize() {
    //start it up
    oldCameraMode = Camera.mode;
    oldCameraMode = 'first person';
    print('oldCameraMode:' + JSON.stringify(Camera))
    producer = new Producer();
    enterSetupMode();
}

initialize();

Controller.keyPressEvent.connect(handleKeyPresses);

Script.scriptEnding.connect(cleanup);
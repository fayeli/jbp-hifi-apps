var SOUND_BASE_URL = 'http://hifi-public.s3.amazonaws.com/sounds/Xylophone/';
var XYLOPHONE_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/xylophone.fbx';
var MALLET_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet.fbx';
var MALLET_COLLISION_HULL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet_collision_hull.obj';
var XYLOPHONE_KEY_SCRIPT_URL = Script.resolvePath('xylophoneKey.js');
var MALLET_SCRIPT_URL = Script.resolvePath('malletTrackingController.js');
var xylophoneBase;
var mallets = [];
var keyEntities = [];
var KEY_SPACING = 0.18;

var baseStartPosition = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0,
    z: 0
}), Vec3.multiply(1, Quat.getFront(MyAvatar.orientation)));

baseStartPosition.y = baseStartPosition.y;


function createXylophoneBase() {
    var properties = {
        type: 'Box',
        name: 'Xylophone Base',
        dimensions: {
            x: 0.05,
            y: 0.05,
            z: 0.05,
        },
        visible: false,
        collisionless: true,
        position: {
            x: baseStartPosition.x,
            y: baseStartPosition.y - 0.25,
            z: baseStartPosition.z
        },
    }

    xylophoneBase = Entities.addEntity(properties);
}

var keyInfo = [{
    note: 'C2',
    keyLength: 0.3556,
    color: [209, 0, 0]
}, {
    note: 'D2',
    keyLength: 0.3429,
    color: [255, 102, 34]
}, {
    note: 'E2',
    keyLength: 0.3302,
    color: [255, 218, 33]
}, {
    note: 'F2',
    keyLength: 0.3175,
    color: [51, 221, 0]
}, {
    note: 'G2',
    keyLength: 0.3048,
    color: [17, 51, 204]
}, {
    note: 'A2',
    keyLength: 0.2921,
    color: [34, 0, 102]
}, {
    note: 'B2',
    keyLength: 0.2794,
    color: [51, 0, 68]
}, {
    note: 'C3',
    keyLength: 0.2667,
    color: [25, 0, 32]
}];

function createXylophoneKeys() {

    var base = Entities.getEntityProperties(xylophoneBase);
    var rotation = MyAvatar.orientation;

    keyInfo.forEach(function(xyloKey, index) {
        var vHat = Quat.getRight(rotation);
        var spacer = KEY_SPACING * index;
        var multiplier = Vec3.multiply(spacer, vHat);
        var position = Vec3.sum(baseStartPosition, multiplier);

        var properties = {
            type: 'Box',
            shapeType: 'Box',
            parentID: xylophoneBase,
            name: 'Xylophone Key ' + xyloKey.note,
            script: XYLOPHONE_KEY_SCRIPT_URL + "?" + Math.random(),
            dimensions: {
                x: 0.1008*1.5,
                y: 0.0454,
                z: xyloKey.keyLength * 2
            },
            position: position,
            rotation: rotation,
            color: {
                red: 255,
                green: 255,
                blue: 255
            },
            restitution: 0,
            damping: 1,
            angularDamping: 1,
            userData: JSON.stringify({
                grabbableKey: {
                    grabbable: false
                },
                soundKey: {
                    soundURL: SOUND_BASE_URL + xyloKey.note + ".L.wav",
                    color: xyloKey.color
                }
            })
        };

        var xyloPhoneKey = Entities.addEntity(properties);
        keyEntities.push(xyloPhoneKey);

    })
}

function createMallets() {
    var base = Entities.getEntityProperties(baseStartPosition);
    var rightVec = Quat.getRight(MyAvatar.orientation);
    var rightOffset = Vec3.sum(Vec3.multiply(rightVec, 0.35), baseStartPosition);
    var angle = 90; // quarter turn
    var axis = {
        x: 0,
        y: 1,
        z: 0
    };
    var angleAxis = Quat.angleAxis(angle, axis);
    var properties = {
        type: 'Model',
        name: 'Xylophone Mallet',
        modelURL: MALLET_MODEL_URL,
        parentID: xylophoneBase,
        dimensions: {
            x: 0.56,
            y: 0.06,
            z: 0.06
        },
        restitution: 0,
        dynamic: false,
        collidesWith: 'dynamic,static,kinematic',
        position: {
            x: rightOffset.x,
            y: rightOffset.y + 0.2,
            z: rightOffset.z
        },
        rotation: Quat.multiply(MyAvatar.orientation, angleAxis),
        shapeType: 'compound',
        script: MALLET_SCRIPT_URL + "?" + Math.random(),
        compoundShapeURL: MALLET_COLLISION_HULL_URL,
        userData: JSON.stringify({
            grabbableKey: {
                grabbable: true
            }
        })
    }

    var firstMallet = Entities.addEntity(properties);
    mallets.push(firstMallet);
    rightOffset = Vec3.sum(Vec3.multiply(rightVec, 0.35), properties.position);
    properties.position = rightOffset;
    var secondMallet = Entities.addEntity(properties);
    mallets.push(secondMallet);
}

function cleanup() {
    while (mallets.length > 0) {
        Entities.deleteEntity(mallets.pop());
    }
    while (keyEntities.length > 0) {
        Entities.deleteEntity(keyEntities.pop());
    }

    Entities.deleteEntity(xylophoneBase);
}

Script.scriptEnding.connect(cleanup);
createXylophoneBase();
createMallets();
createXylophoneKeys();
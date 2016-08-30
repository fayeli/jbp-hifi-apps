var TABLE_MODEL_URL = Script.resolvePath('assets/table/table.fbx');
var MODEL_URL = "http://hifi-production.s3.amazonaws.com/tutorials/pictureFrame/finalFrame.fbx";

var TABLE_START_POSITION

var front = Quat.getFront(MyAvatar.orientation);
var TABLE_START_POSITION = Vec3.sum(MyAvatar.position, front);

var table, entitySpawner, mat, seatSpawner;
var nextGameButton, resetGameButton, newSeatButton;

var entitySpawnerOffset = {
    forward: 0,
    vertical: 1,
    right: 0
};

var matOffset = {
    forward: 0,
    vertical: 0.469,
    right: 0
};

var seatSpawnerOffset = {
    forward: -1,
    vertical: 1,
    right: 1
};

var nextGameButtonOffset = {
    forward: 0.7,
    vertical: 0.45,
    right: -0.7
};

var resetGameButtonOffset = {
    forward: 0.7,
    vertical: 0.45,
    right: -0.9
};

var newSeatButtonOffset = {
    forward: 0.7,
    vertical: 0.45,
    right: -1.1
};

function getOffsetFromTable(forward, vertical, right) {
    var props = Entities.getEntityProperties(table);
    var position = props.position;
    var frontVector = Quat.getFront(props.rotation);
    var upVector = Quat.getUp(props.rotation);
    var rightVector = Quat.getRight(props.rotation);
    if (forward !== undefined) {
        position = Vec3.sum(position, Vec3.multiply(frontVector, forward));
    }
    if (vertical !== undefined) {
        position = Vec3.sum(position, Vec3.multiply(upVector, vertical));
    }
    if (right !== undefined) {
        position = Vec3.sum(position, Vec3.multiply(rightVector, right));
    }

    return position;
};

function createTable() {
    var props = {
        type: 'Model',
        name: 'GameTable Table',
        description: 'hifi:gameTable:table',
        modelURL: TABLE_MODEL_URL,
        shapeType: 'static',
        dimensions: {
            x: 1.255,
            y: 1.0121,
            z: 1.255
        },
        script: Script.resolvePath('table.js'),
        position: TABLE_START_POSITION
    };

    table = Entities.addEntity(props);
}

function createEntitySpawner() {
    var props = {
        type: 'Box',
        name: 'GameTable Entity Spawner',
        collisionless: true,
        description: 'hifi:gameTable:entitySpawner',
        color: {
            red: 0,
            green: 255,
            blue: 0
        },
        dimensions: {
            x: 0.25,
            y: 0.25,
            z: 0.25
        },
        parentID: table,
        position: getOffsetFromTable(entitySpawnerOffset.forward, entitySpawnerOffset.vertical, entitySpawnerOffset.right)
    };

    entitySpawner = Entities.addEntity(props);
}


function createMat() {
    // var MAT_STARTING_PICTURE = "";
    var props = {
        type: 'Model',
        modelURL: MODEL_URL,
        name: 'GameTable Mat',
        description: 'hifi:gameTable:mat',
        collisionless: true,
        color: {
            red: 0,
            green: 0,
            blue: 255
        },
        dimensions: {
            x: 1.045,
            y: 1.045,
            z: 0.075
        },
        rotation: Quat.fromPitchYawRollDegrees(90, 0, 0),
        // textures: JSON.stringify({
        //     Picture: MAT_STARTING_PICTURE
        // }),
        parentID: table,
        script: Script.resolvePath('mat.js'),
        position: getOffsetFromTable(matOffset.forward, matOffset.vertical, matOffset.right)
    };

    mat = Entities.addEntity(props);
}

function createSeatSpawner() {
    var props = {
        type: 'Box',
        name: 'GameTable Seat Spawner',
        description: 'hifi:gameTable:seatSpawner',
        collisionless: true,
        color: {
            red: 255,
            green: 255,
            blue: 0
        },
        dimensions: {
            x: 0.25,
            y: 0.25,
            z: 0.25
        },
        parentID: table,
        script: Script.resolvePath('seatSpawner.js'),
        position: getOffsetFromTable(seatSpawnerOffset.forward, seatSpawnerOffset.vertical, seatSpawnerOffset.right)
    };

    seatSpawner = Entities.addEntity(props);
}

function createNextGameButton() {
    var props = {
        type: 'Box',
        name: 'GameTable Next Button',
        description: 'hifi:gameTable:nextGameButton',
        collisionless: true,
        color: {
            red: 0,
            green: 0,
            blue: 255
        },
        dimensions: {
            x: 0.1,
            y: 0.1,
            z: 0.1
        },
        parentID: table,
        script: Script.resolvePath('nextGameButton.js'),
        position: getOffsetFromTable(nextGameButtonOffset.forward, nextGameButtonOffset.vertical, nextGameButtonOffset.right)
    };

    nextGameButton = Entities.addEntity(props);
};

function createResetGameButton() {
    var props = {
        type: 'Box',
        name: 'GameTable Reset Button',
        description: 'hifi:gameTable:resetGameButton',
        collisionless: true,
        color: {
            red: 255,
            green: 0,
            blue: 0
        },
        dimensions: {
            x: 0.1,
            y: 0.1,
            z: 0.1
        },
        parentID: table,
        script: Script.resolvePath('resetGameButton.js'),
        position: getOffsetFromTable(resetGameButtonOffset.forward, resetGameButtonOffset.vertical, resetGameButtonOffset.right)
    };

    resetGameButton = Entities.addEntity(props);
};

function createNewSeatButton() {
    var props = {
        type: 'Box',
        name: 'GameTable New Seat Button',
        description: 'hifi:gameTable:newSeatButton',
        collisionless: true,
        color: {
            red: 255,
            green: 0,
            blue: 255
        },
        dimensions: {
            x: 0.1,
            y: 0.1,
            z: 0.1
        },
        parentID: table,
        script: Script.resolvePath('newSeatButton.js'),
        position: getOffsetFromTable(newSeatButtonOffset.forward, newSeatButtonOffset.vertical, newSeatButtonOffset.right)
    };

    newSeatButton = Entities.addEntity(props);
};

function makeTable() {
    createTable();
    createMat();
    createResetGameButton();
    createNextGameButton();
    createNewSeatButton();
    createSeatSpawner();
    createEntitySpawner();
}

function cleanup() {
    Entities.deleteEntity(table);
    Entities.deleteEntity(mat);
    Entities.deleteEntity(entitySpawner);
    Entities.deleteEntity(seatSpawner);
    Entities.deleteEntity(nextGameButton);
    Entities.deleteEntity(resetGameButton);
    Entities.deleteEntity(newSeatButton);
};

Script.scriptEnding.connect(cleanup);

makeTable();
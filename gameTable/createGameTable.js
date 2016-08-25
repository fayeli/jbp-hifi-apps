var TABLE_MODEL_URL = Script.resolvePath('assets/models');

var table, entitySpawner, mat, seatSpawner;

var entitySpawnerOffset = {
    forward: 0,
    vertical: 1,
    right: 0
}
var matOffset = {
    forward: 0,
    vertical: 0.5,
    right: 0
}
var seatSpawnerOffset = {
    forward: 1,
    vertical: 0,
    right: 1
}

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
        description: 'hifi:gameTable:table',
        modelURL: TABLE_MODEL_URL,
        shapeType: 'static',
        position: TABLE_START_POSITION
    };

    table = Entities.addEntity(props);
}

function createEntitySpawner() {
    var props = {
        type: 'Box',
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
    var props = {
        type: 'Box',
        description: 'hifi:gameTable:mat',
        collisionless: true,
        color: {
            red: 0,
            green: 0,
            blue: 255
        },
        dimensions: {
            x: 0.25,
            y: 0.25,
            z: 0.25
        },
        parentID: table,
        position: getOffsetFromTable(matOffset.forward, matOffset.vertical, matOffset.right)
    };

    mat = Entities.addEntity(props);
}

function createSeatSpawner() {
    var props = {
        type: 'Box',
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
        position: getOffsetFromTable(seatSpawnerOffset.forward, seatSpawnerOffset.vertical, seatSpawnerOffset.right)
    };

    seatSpawner = Entities.addEntity(props);
}


//Script.stop();
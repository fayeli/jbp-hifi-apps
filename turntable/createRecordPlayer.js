var BASE_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/turntable/turntable_base.fbx';
var DISC_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/turntable/turntable_disc.fbx';
var NEEDLE_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/turntable/turntable_needle.fbx';

var TURNTABLE_SCRIPT_URL = Script.resolvePath('turntable.js?'+Math.random());
var baseStartPosition = Vec3.sum(Vec3.sum(MyAvatar.position, {
    x: 0,
    y: 0,
    z: 0
}), Vec3.multiply(1, Quat.getFront(MyAvatar.orientation)));


var base, disc, needle;

function createRecordPlayer() {
    createTurntableBase();
    createTurntableDisc();
    createTurntableArm();
}


function createTurntableBase() {
    var props = {
        name: 'hifi-record-base',
        type: 'Model',
        modelURL: BASE_MODEL_URL,
        // shapeType:'simple-hull',
        collisionless:true,
        shapeType: 'static-mesh',
        // dimensions: {
        //     x: 0.7683,
        //     y: 0.2427,
        //     z: 0.6379
        // },
        position: baseStartPosition,
        rotation: MyAvatar.orientation,
        script:TURNTABLE_SCRIPT_URL
    }
    base = Entities.addEntity(props);
}

function createTurntableDisc() {
    var props = {
        name: 'hifi-record-turntable-disc',
        type: 'Model',
        modelURL: DISC_MODEL_URL,
        collisionless: true,
        position: baseStartPosition,
        parentID: base,
    }
    disc = Entities.addEntity(props);

}

function createTurntableArm() {
    var props = {
        name: 'hifi-record-needle',
        type: 'Model',
        modelURL: NEEDLE_MODEL_URL,
        collisionless: true,
        position: baseStartPosition,
        parentID: base,
    }
    needle = Entities.addEntity(props);

}

createRecordPlayer()

Script.scriptEnding.connect(function(){
    Entities.deleteEntity(needle);
    Entities.deleteEntity(disc);
    Entities.deleteEntity(base);
})
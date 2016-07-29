var file  = Script.include('getActualizer.js');
 print('file?' + JSON.stringify(file))
var creations = [];
// file.voxels.forEach(function(voxel){
//     var creation = createVoxelAtPosition(voxel);
//     creations.push(creation);
// })

function createVoxelAtPosition(voxel){
var properties = {
    type:'Sphere',
    dimensions:{
        x:1,
        y:1,
        z:1
    },
    color:{
        red:getRandomInt(0,255),
        green:getRandomInt(0,255),
        blue:getRandomInt(0,255),
    },
    position:{
        x:voxel.x,
        y:voxel.y,
        z:voxel.z
    },
    collisionless:true
}
   return Entities.addEntity(properties);
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function cleanup(){
    while(creations.length>0){
        Entities.deleteEntity(creations.pop())
    }
};
Script.scriptEnding.connect(cleanup)

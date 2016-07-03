(function() {

    var _this = this;

    this.preload = function(entityID) {
    this.entityID=entityID;
    };

    this.collisionWithEntity = function(myID, otherID, collisionInfo) {
        Entities.editEntity(otherID,{
            parentID:myID
        });
        
    };

    this.unload = function(){

    };   


});
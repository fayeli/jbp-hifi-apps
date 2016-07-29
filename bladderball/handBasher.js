(function() {

    var _this;

    function HandBasher() {
        _this = this;
    }

    HandBasher.prototype = {
        colorTimeout: null,
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        collisionWithEntity: function(me, other, collision) {
            
        },
    }

    return new HandBasher();
});
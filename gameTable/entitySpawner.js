(function() {
    var _this

    function EntitySpawner() {
        _this = this;
    };

    EntitySpawner.prototype = {
        preload: function(id) {
            _this.entityID = id
        },
    }
    return new EntitySpawner()
});
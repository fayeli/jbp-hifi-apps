(function() {

    var _this;

    function EntryPoint() {
        _this = this;
    }

    HandBasher.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        enterEntity:function(){

            //desktop
            //lock avatar position
            //change camera
            //rewrite controls

        }
    }

    return new EntryPoint();
});
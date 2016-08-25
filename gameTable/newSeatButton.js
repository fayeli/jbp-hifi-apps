(function() {
    var _this

    function NewSeatButton() {
        _this = this;
    };
    NewSeatButton.prototype = {
        preload: function(id) {
            _this.entityID = id
        },
        onClick: function() {},
        startNearTrigger: function() {},
        startFarTrigger: function() {},
    };
    return new NewSeatButton();
});
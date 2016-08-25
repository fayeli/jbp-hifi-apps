(function() {
    var _this

    function ResetGameButton() {
        _this = this;
    };
    ResetGameButton.prototype = {
        preload: function(id) {
            _this.entityID = id
        },
        onClick: function() {},
        startNearTrigger: function() {},
        startFarTrigger: function() {},
    };
    return new ResetGameButton();
});
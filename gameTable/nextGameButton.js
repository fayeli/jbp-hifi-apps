(function() {
    var _this

    function NextGameButton() {
        _this = this;
    };
    NextGameButton.prototype = {
        preload: function(id) {
            _this.entityID = id
        },
        onClick: function() {},
        startNearTrigger: function() {},
        startFarTrigger: function() {},
    };
    return new NextGameButton();
});
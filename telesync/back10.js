(function() {
    var _this;

    function Back10Button() {
        _this = this;
    }
    Back10Button.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        startFarTrigger: function() {
            _this.changeFrame();
        },
        clickDownOnEntity: function() {
            _this.changeFrame();
        },
        getController: function() {
            var props = Entities.getEntityProperties(_this.entityID);
            return props.parentID
        },
        changeFrame: function() {
            Entities.callEntityMethod(_this.getController(), "rewindFrame10");
        }

    }
    return new Back10Button();
})
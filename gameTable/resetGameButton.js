(function() {
    var _this;
    var RESETGAME_SOUND_URL = "http://hifi-content.s3.amazonaws.com/caitlyn/production/bowlingAlley/bell.wav";

    function ResetGameButton() {
        _this = this;
    };
    ResetGameButton.prototype = {
        preload: function(id) {
            _this.entityID = id;
            _this.sound = SoundCache.getSound(RESETGAME_SOUND_URL);
        },
        getEntityFromGroup: function(groupName, entityName) {
            var props = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(props.position, 7.5);
            var found;
            results.forEach(function(item) {
                var itemProps = Entities.getEntityProperties(item);
                var descriptionSplit = itemProps.description.split(":");
                if (descriptionSplit[1] === groupName && descriptionSplit[2] === entityName) {
                    found = item;
                }
            });
            return found;
        },
        clickDownOnEntity: function() {
            _this.resetGame();
        },
        startNearTrigger: function() {
            _this.resetGame();
        },
        startFarTrigger: function() {},
        resetGame: function() {
            print('reset game button calling resetGame');
            var props = Entities.getEntityProperties(_this.entityID);
            var options = { position: props.position };
            var injector = Audio.playSound(_this.sound,options);
            print("play reset game sound");
            var table = _this.getEntityFromGroup('gameTable', 'table');
            Entities.callEntityMethod(table, 'resetGame');
        }
    };
    return new ResetGameButton();
});
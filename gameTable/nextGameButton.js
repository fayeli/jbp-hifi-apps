(function() {
    var _this;
    var NEXTGAME_SOUND_URL = "http://hifi-content.s3.amazonaws.com/caitlyn/production/gameTable/woodenTapClick.wav";

    function NextGameButton() {
        _this = this;
    };
    NextGameButton.prototype = {
        preload: function(id) {
            _this.entityID = id;
            _this.sound = SoundCache.getSound(NEXTGAME_SOUND_URL);
        },
        getEntityFromGroup: function(groupName, entityName) {
            var props = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(props.position, 7.5);
            var found;
            print('results? ' + results.length);
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
            _this.nextGame();
        },
        startNearTrigger: function() {
            //_this.spawnNewSeat();
        },
        startFarTrigger: function() {},
        nextGame: function() {
            print('next game button calling nextGame');
            var props = Entities.getEntityProperties(_this.entityID);
            var options = { position: props.position };
            var injector = Audio.playSound(_this.sound,options);
            print("play next game sound");
            var table = _this.getEntityFromGroup('gameTable', 'table');
            print('has table?' + table);
            var tableString = table.substr(1, table.length - 2);
            Entities.callEntityMethod(tableString, 'nextGame');
        }
    };
    return new NextGameButton();
});
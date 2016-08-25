(function() {
    var _this

    function NextGameButton() {
        _this = this;
    };
    NextGameButton.prototype = {
        preload: function(id) {
            _this.entityID = id
        },
        getEntityFromGroup: function(groupName, entityName) {
            var props = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(props.position, 7.5);
            var found;
            results.forEach(function(item) {
                var itemProps = Entities.getEntityProperties(item);
                var descriptionSplit = itemProps.description.split(":");
                if (descriptionSplit[1] === groupName && descriptionSplit[2] === entityName) {
                    return item
                }
            });
        },
        onClick: function() {},
        startNearTrigger: function() {},
        startFarTrigger: function() {},
        nextGame: function() {
            var seatSpawner = _this.getEntityFromGroup('gameTable', 'table');
            Entities.callEntityMethod(seatSpawner, 'nextGame');
        }
    };
    return new NextGameButton();
});
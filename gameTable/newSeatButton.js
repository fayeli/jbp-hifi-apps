(function() {
    var _this

    function NewSeatButton() {
        _this = this;
    };
    NewSeatButton.prototype = {
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
                    found= item
                }
            });
            return found;
        },
        clickDownOnEntity: function() {
             _this.spawnNewSeat();
        },
        startNearTrigger: function() {},
        startFarTrigger: function() {},
        spawnNewSeat: function() {
            print('seatSpawner calling spawn new seat')
            var seatSpawner = _this.getEntityFromGroup('gameTable', 'seatSpawner');
            print('seatSpawner found: ' + seatSpawner);
            Entities.callEntityMethod(seatSpawner, 'createSeat');
        },
    };
    return new NewSeatButton();
});
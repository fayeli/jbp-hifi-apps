(function() {

    var _this;

    function GameTable() {
        _this = this;
    }

    GameTable.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        resetGame: function() {

        },
        nextGame: function() {

        },
        getEntityFromGroup(groupName, entityName) {
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
        changeMatPicture: function(url) {
            Entities.editEntity(_this.getEntityFromGroup('gameTable', 'mat'), {
                textures: JSON.stringify({
                    picture: url
                })
            })
        },
        spawnNewSeat: function() {
            var seatSpawner = _this.getEntityFromGroup('gameTable', 'seatSpawner');
            Entities.callEntityMethod(seatSpawner, 'createSeat');
        }
    }

    return new GameTable();
})
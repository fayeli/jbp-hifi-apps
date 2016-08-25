(function() {
    var GAMES_LIST_ENDPOINT = '';
    var _this;
    var INITIAL_DELAY = 1000;

    function GameTable() {
        _this = this;
    }

    GameTable.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
            Script.setTimeout(function() {
                _this.setCurrentGamesList();
                _this.setInitialGameIfNone();
            }, INITIAL_DELAY)
        },
        setInitialGameIfNone: function() {
            var userData = _this.getCurrentUserData();
            if (userData.hasOwnProperty('currentGame') !== true) {
                _this.setCurrentGame(_this.gamesList[0]);
                _this.setCurrentUserData(userData);
            };
            _this.resetGame();
        },
        resetGame: function() {
            _this.cleanupGameEntities();
            _this.spawnEntitiesForGame();
        },
        nextGame: function() {
            _this.currentGameIndex++;
            if (_this.currentGameIndex > _this.gamesList.length) {
                _this.currentGameIndex = 0;
            };,
            _this.cleanupGameEntities();
            _this.setCurrentGame();
            _this.spawnEntitiesForGame();
        },
        cleanupGameEntities: function() {

        },
        setCurrentGamesList: function() {
            var userData = _this.getCurrentUserData();
            userData.gamesList = getGamesList();
            _this.gamesList = userData.gamesList;
            _this.setCurrentUserData(userData);
        },
        setCurrentGame: function() {
            var userData = _this.getCurrentUserData();
            userData.currentGame = _this.gamesList[_this.currentGameIndex];
            _this.currentGame = serData.currentGame;
            _this.setCurrentUserData(userData);
        },
        setCurrentUserData: function(data) {
            Entities.editEntity(_this.editEntity, {
                userData: data
            })
        },
        getCurrentUserData: function() {
            var props = Entities.getEntityProperties(_this.entityID);
            var json = null;
            try {
                json = JSON.parse(props.userData);
            } catch (e) {
                return;
            }
            return json;
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
        changeMatPicture: function(url) {
            Entities.editEntity(_this.getEntityFromGroup('gameTable', 'mat'), {
                textures: JSON.stringify({
                    picture: url
                })
            })
        },
        spawnEntitiesForGame: function() {
            var seatSpawner = _this.getEntityFromGroup('gameTable', 'entitySpawner');
            Entities.callEntityMethod(seatSpawner, 'spawnEntities', [JSON.stringify(_this.currentGame)]);
        }
    }

    function getGamesList() {
        var request = new XMLHttpRequest();
        request.open("GET", GAMES_LIST_ENDPOINT, false);
        request.send();

        var response = JSON.parse(request.responseText);
        return response;
    };

    return new GameTable();
})
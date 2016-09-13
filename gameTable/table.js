(function() {
    var GAMES_LIST_ENDPOINT = "https://api.myjson.com/bins/3evuu";
    var _this;
    var INITIAL_DELAY = 200;

    function GameTable() {
        _this = this;
    };

    GameTable.prototype = {
        matCorner: null,
        currentGameIndex: 0,
        preload: function(entityID) {
            _this.entityID = entityID;
            Script.setTimeout(function() {
                _this.setCurrentGamesList();
            }, INITIAL_DELAY);
        },
        setInitialGameIfNone: function() {
            var userData = _this.getCurrentUserData();

            if (userData.hasOwnProperty('gameTable') !== true || userData.gameTable.hasOwnProperty('currentGame') !== true) {
                print('userdata has no gametable or no currentgame')
                _this.setCurrentGame();
               _this.cleanupGameEntities();
                _this.resetGame();
                print('i set the game and reset the game')
            } else {
                print('already has game')
            }

        },
        resetGame: function() {
            print('RESET GAME on gameTable')
            _this.cleanupGameEntities();
            _this.spawnEntitiesForGame();
        },
        nextGame: function() {
            print('NEXT GAME on gameTable')
            _this.currentGameIndex++;
            if (_this.currentGameIndex >= _this.gamesList.length-1) {
                _this.currentGameIndex = 0;
            }
            _this.cleanupGameEntities();
            _this.setCurrentGame();
            _this.spawnEntitiesForGame();
        },
        cleanupGameEntities: function() {
            print('should cleanup game entities')
            var props = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(props.position, 10);
            var found = [];
            results.forEach(function(item) {
                var itemProps = Entities.getEntityProperties(item)
                if (itemProps.description === "hifi:gameTable:piece:" + _this.currentGame) {
                    found.push(item);
                }

            })
            found.forEach(function(foundItem) {
                Entities.deleteEntity(foundItem)
            })
        },
        setCurrentGamesList: function() {
            var gamesList = getGamesList();
            _this.gamesList = gamesList;
            print('set gameslist to: ' + JSON.stringify(gamesList))
            _this.setInitialGameIfNone();
        },
        setCurrentGame: function() {
            print('index in set current game: ' + _this.currentGameIndex);
            // print('games list in set current game' + JSON.stringify(_this.gamesList));
            print('game at index' + _this.gamesList[_this.currentGameIndex])
            _this.currentGame = _this.gamesList[_this.currentGameIndex].gameName;
            _this.currentGameFull = _this.gamesList[_this.currentGameIndex];
            _this.setCurrentUserData({
                currentGame: _this.currentGame
            });
        },
        setCurrentUserData: function(data) {
            var userData = _this.getCurrentUserData();
            userData['gameTableData'] = data;
            var success = Entities.editEntity(_this.entityID, {
                userData: JSON.stringify(userData),
            });
        },
        getCurrentUserData: function() {
            var props = Entities.getEntityProperties(_this.entityID);
            var hasUserData = props.hasOwnProperty('userData');
            print('has user data??' + hasUserData)
            print('userData is:: ' + props.userData)
            var json = {};
            try {
                json = JSON.parse(props.userData);
            } catch (e) {
                print('user data is not json' + props.userData)
            }
            return json;
        },
        getEntityFromGroup: function(groupName, entityName) {
            print('getting entity from group: ' + groupName)
            var props = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(props.position, 7.5);
            var found;
            var result = null;
            results.forEach(function(item) {
                var itemProps = Entities.getEntityProperties(item);

                var descriptionSplit = itemProps.description.split(":");
                if (descriptionSplit[1] === groupName && descriptionSplit[2] === entityName) {
                    result = item;
                }
            });
            print('result returned ought to be: ' + result)
            return result
        },
        changeMatPicture: function(url) {
            Entities.editEntity(_this.getEntityFromGroup('gameTable', 'mat'), {
                textures: JSON.stringify({
                    picture: url
                })
            })
        },
        spawnEntitiesForGame: function() {
            print('should spawn entities for game')
            var entitySpawner = _this.getEntityFromGroup('gameTable', 'entitySpawner');

            var props = Entities.getEntityProperties(_this.entityID);
            var mat = _this.getEntityFromGroup('gameTable', 'mat')

            var matProps = Entities.getEntityProperties(mat);

            var matCorner = {
                x: matProps.position.x - (0.5 * matProps.dimensions.x),
                y: matProps.position.y,
                z: matProps.position.z - (0.5 * matProps.dimensions.z)
            }
            Entities.callEntityMethod(entitySpawner, 'spawnEntities', [JSON.stringify(_this.currentGameFull), JSON.stringify(matCorner), JSON.stringify(props.rotation), JSON.stringify(props.dimensions)]);
        },

    }

    function getGamesList() {
        var request = new XMLHttpRequest();
        request.open("GET", GAMES_LIST_ENDPOINT, false);
        request.send();

        var response = JSON.parse(request.responseText);
        print('got gamesList' + request.responseText);
        return response;
    };

    return new GameTable();
})
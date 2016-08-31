(function() {
    var GAMES_LIST_ENDPOINT = 'https://api.myjson.com/bins/2p22c';
    var _this;
    var INITIAL_DELAY = 3000;

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
        
            if (userData.hasOwnProperty('gameTable') !== true || userData.gameTable.hasOwnProperty('currentGame')!==true) {
                print('userdata has no gametable or no currentgame')
                _this.setCurrentGame();
                _this.resetGame();
                print('i set the game and reset the game')
            }
            else{
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
            if (_this.currentGameIndex >= _this.gamesList.length) {
                _this.currentGameIndex = 0;
            }
            _this.cleanupGameEntities();
            _this.setCurrentGame();
            _this.spawnEntitiesForGame();
        },
        cleanupGameEntities: function() {

        },
        setCurrentGamesList: function() {
            var gamesList = getGamesList();
            _this.gamesList = gamesList;
            print('set gameslist to: ' + JSON.stringify(gamesList))
            _this.setInitialGameIfNone();
        },
        setCurrentGame: function() {
            print('games list in set current game' + _this.gamesList);
            _this.currentGame = _this.gamesList[_this.currentGameIndex].gameName;

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
            print('has user data??'+hasUserData)
            print('userData is:: '+props.userData)
            var json = {};
            try {
                json = JSON.parse(props.userData);
            } catch (e) {
                print('user data is not json' + props.userData)
                return json;
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
                    return item;
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
            var entitySpawner = _this.getEntityFromGroup('gameTable', 'entitySpawner');
            var props = Entities.getEntityProperties(_this.entityID);
            Entities.callEntityMethod(entitySpawner, 'spawnEntities', [JSON.stringify(_this.currentGame), _this.matCorner, props.rotation, props.dimensions.z]);
        },

    }

    function getGamesList() {
        var request = new XMLHttpRequest();
        request.open("GET", GAMES_LIST_ENDPOINT, false);
        request.send();

        var response = JSON.parse(request.responseText);
        print('got gamesList' + response.length);
        return response;
    };

    return new GameTable();
})
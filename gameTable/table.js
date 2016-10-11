(function() {
    var GAMES_LIST_ENDPOINT = "http://hifi-content.s3.amazonaws.com/james/gametable-dev/assets/checkers/blackChecker.json";

    var _this;
    var INITIAL_DELAY = 1000;

    function GameTable() {
        _this = this;
    };

    GameTable.prototype = {
        matCorner: null,
        currentGameIndex: 0,
        count: 0,
        preload: function(entityID) {
            _this.entityID = entityID;
            Script.setTimeout(function() {
                _this.setCurrentGamesList();
            }, INITIAL_DELAY);
        },
        collisionWithEntity: function(me, other, collision) {
            //stick the table to the ground
            if (collision.type !== 1) {
                return;
            }
            var myProps = Entities.getEntityProperties(_this.entityID, ["rotation", "position"]);
            var eulerRotation = Quat.safeEulerAngles(myProps.rotation);
            eulerRotation.x = 0;
            eulerRotation.z = 0;
            var newRotation = Quat.fromVec3Degrees(eulerRotation);

            //we zero out the velocity and angular velocity so the table doesn't change position or spin
            Entities.editEntity(_this.entityID, {
                rotation: newRotation,
                dynamic: false,
                velocity: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                angularVelocity: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            });
        },
        setInitialGameIfNone: function() {
            var userData = _this.getCurrentUserData();

            if (userData.hasOwnProperty('gameTable') !== true || userData.gameTable.hasOwnProperty('currentGame') !== true) {
                print('userdata has no gametable or no currentgame')
                _this.setCurrentGame();
                _this.cleanupGameEntities();
                print('i set the game and reset the game')
            } else {
                print('already has game')
            }

        },
        resetGame: function() {
            print('jbp RESET GAME on gameTable')
            _this.cleanupGameEntities();
        },
        nextGame: function() {
            print('jbp NEXT GAME on gameTable')
            _this.currentGameIndex++;
            if (_this.currentGameIndex >= _this.gamesList.length) {
                _this.currentGameIndex = 0;
            }
            _this.cleanupGameEntities();


        },
        cleanupGameEntities: function() {
            var matchedPiece = "hifi:gameTable:piece:" + _this.currentGame;
            print('jbp should cleanup game entities for:: ' + _this.currentGame)
            var props = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(props.position, 10);
            var found = [];
            results.forEach(function(item) {
                var itemProps = Entities.getEntityProperties(item)
                if (itemProps.description === matchedPiece) {
                    found.push(item);
                    print('found a matching piece, pushing')
                }
                if (itemProps.description.indexOf('hifi:gameTable:anchor') > -1) {
                    found.push(item);
                    print('found a matching piece, pushing')
                }
            })
            found.forEach(function(foundItem) {
                print('deleting matching piece')
                Entities.deleteEntity(foundItem)
            })
            _this.setCurrentGame();
            _this.spawnEntitiesForGame();
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
        spawnEntitiesForGame: function() {
            print('jbp should spawn entities for game.  count: ' + this.count)
            var entitySpawner = _this.getEntityFromGroup('gameTable', 'entitySpawner');

            var props = Entities.getEntityProperties(_this.entityID);
            var mat = _this.getEntityFromGroup('gameTable', 'mat')


            Entities.callEntityMethod(entitySpawner, 'spawnEntities', [JSON.stringify(_this.currentGameFull), mat, _this.entityID]);
            this.count++;
            return
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
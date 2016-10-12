(function() {
    var _this;

    //listens for a release message from entities with the snap to grid script
    //checks for the nearest snap point and sends a message back to the entity
    function PastedItem(url, spawnLocation, spawnRotation) {
        print('CREATE PastedItem FROM SPAWNER');
        var created = [];

        function create() {
            var success = Clipboard.importEntities(url);
            var dimensions = Clipboard.getContentsDimensions();
            //we want the bottom of any piece to actually be on the board, so we add half of the height of the piece to the location when we paste it,
            spawnLocation.y += (2 * dimensions.y);
            if (success === true) {
                created = Clipboard.pasteEntities(spawnLocation);
                this.created = created;
                print('created ' + created);
            }
        }

        function cleanup() {
            created.forEach(function(obj) {
                Entities.deleteEntity(obj);
            })
        }

        create();

        this.cleanup = cleanup;

    }

    function Tile(rowIndex, columnIndex) {
        var side = _this.tableSideSize / _this.game.startingArrangement.length;
        var rightVector = Quat.getRight(_this.tableRotation);
        var forwardVector = Quat.getFront(_this.tableRotation);


        var rightAmount = rowIndex * side;
        rightAmount += (0.5 * side);
        var forwardAmount = columnIndex * side;
        forwardAmount += (0.5 * side);
        this.startingPosition = _this.matCorner;
        var howFarRight = Vec3.multiply(rightAmount, rightVector);

        this.howFarRight = howFarRight;

        var howFarForward = Vec3.multiply(forwardAmount, forwardVector);
        this.howFarForward = howFarForward;
        var workingPosition = Vec3.sum(this.startingPosition, howFarRight);
        workingPosition = Vec3.sum(workingPosition, howFarForward);

        this.middle = workingPosition;

        var splitURL = _this.game.startingArrangement[rowIndex][columnIndex].split(":");
        if (splitURL[0] === '1') {
            this.url = _this.game.pieces[0][splitURL[1]]
        }
        if (splitURL[0] === '2') {
            this.url = _this.game.pieces[1][splitURL[1]]
        }
        if (splitURL[0] === 'empty') {
            this.url = 'empty';
        }

        //print('jbp made a tile: ' + JSON.stringify(this))

    }


    function EntitySpawner() {
        _this = this;
    };

    EntitySpawner.prototype = {
        matCorner: null,
        tableRotation: null,
        items: [],
        toCleanup: [],
        preload: function(id) {
            print('JBP preload entity spawner')
            _this.entityID = id;
        },
        createSingleEntity: function(url, spawnLocation) {
            // print('creating a single entity: ' + url)
            // print('creating a single entity at : ' + JSON.stringify(spawnLocation))
            var item = new PastedItem(url, spawnLocation);
            _this.items.push(item);
            return item;
        },
        changeMatPicture: function(mat) {
            print('changing mat: ' + _this.game.matURL)
            Entities.editEntity(mat, {
                textures: JSON.stringify({
                    Picture: _this.game.matURL
                })
            })
        },
        spawnEntities: function(id, params) {
            print('spawn entities called!!')
            this.items = [];
            var dimensions = Entities.getEntityProperties(params[1]).dimensions;
            print('and it has params: ' + params.length)
            _this.game = JSON.parse(params[0]);
            _this.matCorner = Entities.getEntityProperties(params[1]).position;
            _this.matCorner.x -= dimensions.x * 0.5;
            _this.matCorner.z += dimensions.x * 0.5;
            _this.matRotation = Entities.getEntityProperties(params[1]).rotation;
            _this.tableSideSize = dimensions.x;
            _this.changeMatPicture(params[1]);
            if (this.game.spawnStyle === "pile") {
                _this.spawnByPile();
            } else if (this.game.spawnStyle === "arranged") {
                _this.spawnByArranged();
            }

        },
        spawnByPile: function() {
            print('should spawn by pile')
            var props = Entities.getEntityProperties(_this.entityID);

            var i;
            for (i = 0; i < _this.game.howMany; i++) {
                print('spawning entity from pile:: ' + i)
                var spawnLocation = {
                    x: props.position.x,
                    y: props.position.y - 0.25,
                    z: props.position.z,
                };
                var url;
                if (_this.game.identicalPieces === false) {
                    url = _this.game.pieces[i];
                } else {
                    url = _this.game.pieces[0];
                }

                _this.createSingleEntity(url, spawnLocation);

            }

        },
        spawnByArranged: function() {
            print('should spawn by arranged')
                // make sure to set userData.gameTable.attachedTo appropriately
            _this.setupGrid();

        },

        createDebugEntity: function(position) {
            return Entities.addEntity({
                type: 'Sphere',
                position: {
                    x: position.x,
                    y: position.y += 0.1,
                    z: position.z
                },
                color: {
                    red: 0,
                    green: 0,
                    blue: 255
                },
                dimensions: {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1
                },
                collisionless: true
            })
        },

        setupGrid: function() {
            _this.tiles = [];
            var i;
            var j;

            for (i = 0; i < _this.game.startingArrangement.length; i++) {
                for (j = 0; j < _this.game.startingArrangement[i].length; j++) {
                    // print('jbp there is a tile at:: ' + i + "::" + j)
                    var tile = new Tile(i, j);
                    var item = _this.createSingleEntity(tile.url, tile.middle)
                    if (_this.game.hasOwnProperty('snapToGrid') && _this.game.snapToGrid === true) {
                        var anchor = _this.createAnchorEntityAtPoint(tile.middle);
                        Entities.editEntity(item, {
                            userData: JSON.stringify({
                                gameTable: {
                                    attachedTo: anchor
                                }
                            })
                        })
                    }

                    _this.tiles.push(tile);
                }
            }
        },

        findMidpoint: function(start, end) {
            var xy = Vec3.sum(start, end);
            var midpoint = Vec3.multiply(0.5, xy);
            return midpoint
        },

        createAnchorEntityAtPoint: function(position) {
            var properties = {
                type: 'Zone',
                name:'Game Table Snap To Grid Anchor',
                description: 'hifi:gameTable:anchor',
                visible: false,
                collisionless: true,
                dimensions: {
                    x: 0.075,
                    y: 0.075,
                    z: 0.075
                },
                parentID: Entities.getEntityProperties(_this.entityID).id,
                position: position,
                userData: 'available'
            }
            return Entities.addEntity(properties);
        },

        setCurrentUserData: function(data) {
            var userData = getCurrentUserData();
            userData.gameTableData = data;
            Entities.editEntity(_this.entityID, {
                userData: userData
            });
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
        cleanupEntitiesList: function() {
            _this.items.forEach(function(item) {
                item.cleanup();
            })
        },
        unload: function() {
            _this.toCleanup.forEach(function(item) {
                Entities.deleteEntity(item);
            })
        }
    }
    return new EntitySpawner();
});
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
            spawnLocation.y += 0.5 * dimensions.y;
            if (success === true) {
                created = Clipboard.pasteEntities(spawnLocation);
                this.created = created;
                print('created ' + created);
            }
        };

        function cleanup() {
            created.forEach(function(obj) {
                Entities.deleteEntity(obj);
            })
        };

        create();

        this.cleanup = cleanup;

    }


    function EntitySpawner() {
        _this = this;
    };

    EntitySpawner.prototype = {
        matCorner: null,
        tableRotation: null,
        items: [],
        preload: function(id) {
            _this.entityID = id;
        },
        createSingleEntity: function() {
            print('creating a single entity')
            var item = new PastedItem();
            _this.items.push(item);
        },
        spawnEntities: function(id, params) {
            prit('spawn entities called!!')
            this.items = [];
            print('and it has params: ' + params.length)
            _this.game = params[0];
            _this.matCorner = params[1];
            _this.tableRotation = params[2];
            _this.tableSideSize = params[3];
            if (this.game.spawnStyle === "pile") {
                _this.spawnByPile();
            }
            if (this.game.spawnStyle === "arranged") {
                _this.spawnByArranged();
            }

        },
        spawnByPile: function() {
            print('should spawn by pile')
            _this.game.pieces.forEach(function(piece) {
                var spawnLocation;
                var newPiece = new PastedItem(piece, spawnLocation);
            })
        },
        spawnByArranged: function() {
            // make sure to set userData.gameTable.attachedTo appropriately
            _this.calculateTiles();
            print('about to spawn an arrangement')
            _this.tiles.forEach(function(tile) {
                _this.createSingleEntity(tile.url, tile.center);
            });

        },
        calculateTiles: function() {
            var tiles = [];
            var rightVector = Quat.getRight(_this.tableRotation);
            var forwardVector = Quat.getFront(_this.tableRotation);
            var previousTilePosition = _this.matCorner;
            var tileSize = _this.tableSideSize / _this.game.startingArrangement.length;
            _this.game.startingArrangement.forEach(function(row, rowIndex) {
                var forwardAmount = rowIndex * tileSize;
                row.forEach(function(singleTile, tileIndex) {
                    var rightAmount = tileIndex * tileSize;
                    var tile = {
                        right: Vec3.multiply(rightVector, rightAmount),
                        forward: Vec3.multiply(forwardVector, forwardAmount),
                        halfForward: Vec3.multiply(forwardVector, forwardAmount - (0.5 * tileSize)),
                        halfRight: Vec3.multiply(rightVector, rightAmount - (0.5 * tileSize)),
                        rowIndex: rowIndex,
                        tileIndex: tileIndex,
                        url: singleTile
                    }

                    tile.rightPosition = Vec3.sum(previousTilePosition, tile.right);
                    tile.position = Vec3.sum(tile.rightPosition, tile.forward);

                    //to put in the middle -- get midpoint between each tile for right
                    //add 1/2 tile width to the fwd
                    tile.middle = Vec3.sum(previousTilePosition, tile.halfRight);
                    tile.middle = Vec3.sum(tile.middle, tile.halfForward);

                    tiles.push(tile);
                    _this.createAnchorEntityAtPoint(tile.middle);
                    previousTilePosition = tile.position;
                });
            });
            
            this.tiles = tiles;

        },

        findMidpoint: function(start, end) {
            var xy = Vec3.sum(start, end);
            var midpoint = Vec3.multiply(0.5, xy);
            return midpoint
        },

        createAnchorEntityAtPoint: function(position) {
            var properties = {
                type: 'Zone',
                description: 'hifi:gameTable:anchor',
                dimensions: {
                    x: 0.075,
                    y: 0.075,
                    z: 0.075
                },
                parentID: Entities.getEntityProperties(_this.entityID).id,
                position: position,
                userData: 'available'
            }
            var anchor = Entities.addEntity(properties);
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
    }
    return new EntitySpawner();
});
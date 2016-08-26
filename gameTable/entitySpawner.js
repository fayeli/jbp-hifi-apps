(function() {
    var _this;

    function PastedItem(url, spawnLocation, spawnRotation) {
        print('CREATE PastedItem FROM SPAWNER');
        var created = [];

        function create() {
            var success = Clipboard.importEntities(url);
            if (success === true) {
                created = Clipboard.pasteEntities(spawnLocation)
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
        preload: function(id) {
            _this.entityID = id
        },
        createSingleEntity: function() {
            var item = new PastedItem();
            _this.items.push(item);
        },
        spawnEntities: function(id, params) {
            params = JSON.parse(params);
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
            if (this.game.spawnStyle === "single") {
                _this.spawnBySingle();
            }
        },
        spawnByPile: function() {
            _this.game.pieces.forEach(function(piece) {

            })
        },
        spawnByScript: function() {

        },
        spawnByArranged: function() {

        },
        calculateTiles: function() {
            var tiles = [];
            var rightVector = Quat.getRight(_this.tableRotation);
            var forwardVector = Quat.getFront(_this.tableRotation);
            var tileSize = _this.tableSideSize / _this.game.startingArrangement.length;
            _this.game.startingArrangement.forEach(function(row, rowIndex) {
                //multiply forward times the rowIndex
                var forwardAmount = rowIndex * tileSize;
                row.forEach(function(singleTile, tileIndex) {
                    var rightAmount = tileIndex * tileSize;
                    //multiply right times the  tileIndex
                });
            });
            //to put in the middle -- get midpoint between each tile for right
            //add 1/2 tile width to the fwd
        },
        getMidpoint: function(p1, p2) {

        },
        setCurrentUserData: function(data) {
            var userData = getCurrentUserData();
            userData.gameTableData = data;
            Entities.editEntity(_this.entityID, {
                userData: userData
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
        cleanupEntitiesList: function() {
            _this.items.forEach(function(item) {
                item.cleanup();
            })
        },
    }
    return new EntitySpawner();
});
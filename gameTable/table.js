(function() {

    var _this;

    function GameTable() {
        _this = this;
    }

    GameTable.prototype = {
        preload: function() {

        },
        resetGame: function() {},
        nextGame: function() {},
        getEntitySpawner: function() {},
        getMat: function() {},
        changeMatPicture: function(url) {},
        getSeatSpawner: function() {},
    }

    return new GameTable();
})
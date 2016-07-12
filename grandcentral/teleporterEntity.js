(function() {
    var _this;

    function Teleporter() {
        _this = this;
        this.preload = function(entityID) {
            _this.entityID = entityID;
        };
        this.enterEntity = function() {
            print('handle enter teleporter')
            var properties = Entities.getEntityProperties(_this.entityID);
            var destination = properties.description.split("destination:")[1];
            Window.location = "hifi://" + destination;
        }
    }
    return new Teleporter
})
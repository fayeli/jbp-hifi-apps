(function() {
    var _this;
    var mainPath = Script.resolvePath('main.js')
    var BEAM_TRIGGER_THRESHOLD = 0.25;

    function Starter() {
        _this = this;
        this.loading = false;
        this.preload = function(entityID) {
            _this.entityID = entityID;
            Script.update.connect(_this.update);
        };
        this.clickReleaseOnEntity = function() {
            var loader = mainPath + "?" + Math.random();
            Script.include(loader)

        };
        this.unload = function() {
            Script.update.disconnect(_this.update);
        }
        this.update = function() {

            if (_this.loading === true) {
                return;
            }
            var myPosition = Entities.getEntityProperties(_this.entityID).position;
            var leftHandPosition = MyAvatar.getLeftPalmPosition();
            var rightHandPosition = MyAvatar.getRightPalmPosition();

            var rightDistance = Vec3.distance(leftHandPosition, myPosition)
            var leftDistance = Vec3.distance(rightHandPosition, myPosition)

            if (rightDistance < BEAM_TRIGGER_THRESHOLD || leftDistance < BEAM_TRIGGER_THRESHOLD) {
                _this.loading = true;
                Script.setTimeout(function() {
                    _this.loading = false;
                }, 2500)
                Script.include(mainPath + "?" + Math.random());

            }
        }
    }

    return new Starter;
})
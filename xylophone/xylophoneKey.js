(function() {
    Script.include("utils.js");

    var defaultSoundData = {
        soundURL: null
    };

    var _this;

    function XylophoneKey() {
        _this = this;
        return;
    }

    var checkPlayingInterval = null;
    XylophoneKey.prototype = {
        sound: null,
        injector: null,
        collisionWithEntity: function(thisEntity, otherEntity, collision) {
            var soundOptions = {
                localOnly: true,
                position: collision.contactPoint,
                volume: 0.5
            };

            var soundData = getEntityCustomData("soundKey", thisEntity, defaultSoundData);

            if (_this.sound !== null && _this.injector !== null && _this.injector.isPlaying !== true) {
                _this.injector = Audio.playSound(_this.sound, soundOptions);

            }
        },

        preload: function(entityID) {
            this.entityID = entityID;
            this.sound = SoundCache.getSound(soundData.soundURL);
        }
    };



    return new XylophoneKey();


});
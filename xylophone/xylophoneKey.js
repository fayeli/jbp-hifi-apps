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

    XylophoneKey.prototype = {
        sound: null,
        injector: null,
        collisionWithEntity: function(thisEntity, otherEntity, collision) {
            print('collision with key')
            var soundOptions = {
                position: collision.contactPoint,
                volume: 1
            };

            print('sound on collision' + _this.sound)

            if (_this.sound !== null) {
                print('should play sound at ' + JSON.stringify(_this.sound))
                _this.injector = Audio.playSound(_this.sound, soundOptions)
                print('AUDIO OPTIONS: ' + JSON.stringify(soundOptions));
                print('injector after play: ' + JSON.stringify(_this.injector))
            }
        },

        preload: function(entityID) {
            this.entityID = entityID;
            Script.setTimeout(function() {
                var soundData = getEntityCustomData("soundKey", entityID, defaultSoundData);
                print('SOUND URL::' + soundData.soundURL)
                _this.sound = SoundCache.getSound(soundData.soundURL);
            }, 500)

        }
    };



    return new XylophoneKey();


});
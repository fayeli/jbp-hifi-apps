(function() {
    Script.include("utils.js");

    var BASE_PATH = 'http://mpassets.highfidelity.com/1f08bb51-d5cf-45f5-bf83-5bd77a19150c-v1/';

    var defaultSoundData = {
        soundURL: null
    };

    var COLOR_TIMEOUT = 150;
    var _this;

    function XylophoneKey() {
        _this = this;
        return;
    }

    XylophoneKey.prototype = {
        sound: null,
        injector: null,
        colorTimeout: null,
        activeColor: null,
        collisionWithEntity: function(thisEntity, otherEntity, collision) {
            if (collision.type !== 0) {
                //we only want to play sounds on collision start
                return
            }

            var soundOptions = {
                position: collision.contactPoint,
                volume: 1
            };


            if (_this.sound !== null) {

                _this.injector = Audio.playSound(_this.sound, soundOptions)
                _this.changeColor();

            } else {
                var soundData = getEntityCustomData("soundKey", entityID, defaultSoundData);
                _this.sound = SoundCache.getSound(BASE_PATH + soundData.soundURL);
                _this.activeColor = soundData.color;
            }
        },

        clickDownOnEntity: function() {
            var soundOptions = {
                position: Entities.getEntityProperties(_this.entityID).position,
                volume: 1
            };

            _this.injector = Audio.playSound(_this.sound, soundOptions)
            _this.changeColor();

        },

        changeColor: function() {

            if (_this.activeColor === null) {
                var soundData = getEntityCustomData("soundKey", entityID, defaultSoundData);
                _this.activeColor = soundData.color;
            }
            var props = Entities.getEntityProperties(_this.entityID);
            if (props.description.indexOf('changing') > -1) {
                return
            }


            var originalColor = {
                red: 255,
                green: 255,
                blue: 255
            }

            Entities.editEntity(_this.entityID, {
                description: 'changing'
            });

            Entities.editEntity(_this.entityID, {
                color: {
                    red: _this.activeColor[0],
                    green: _this.activeColor[1],
                    blue: _this.activeColor[2]
                }
            })

            _this.colorTimeout = Script.setTimeout(function() {
                Entities.editEntity(_this.entityID, {
                    color: originalColor,
                    description: ''
                })
            }, COLOR_TIMEOUT)
        },

        preload: function(entityID) {
            this.entityID = entityID;
            Script.setTimeout(function() {
                var soundData = getEntityCustomData("soundKey", entityID, defaultSoundData);
                _this.sound = SoundCache.getSound(BASE_PATH + soundData.soundURL);
                _this.activeColor = soundData.color;
            }, 250)

        }
    };



    return new XylophoneKey();


});
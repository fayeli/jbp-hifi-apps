(function() {
    Script.include("utils.js");

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
        collisionWithEntity: function(thisEntity, otherEntity, collision) {
            if (collision.type !== 0) {
                //we only want to play sounds on collision start
                return
            }
            print('collision with key' + JSON.stringify(collision))
            var soundOptions = {
                position: collision.contactPoint,
                volume: 1
            };

            // print('sound on collision' + _this.sound)

            if (_this.sound !== null) {
                // print('should play sound at ' + JSON.stringify(_this.sound))
                _this.injector = Audio.playSound(_this.sound, soundOptions)
                _this.changeColor();
                // print('AUDIO OPTIONS: ' + JSON.stringify(soundOptions));
                // print('injector after play: ' + JSON.stringify(_this.injector))
            } else {
                var soundData = getEntityCustomData("soundKey", entityID, defaultSoundData);
                // print('SOUND URL::' + soundData.soundURL)
                _this.sound = SoundCache.getSound(soundData.soundURL);
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
            print('CHANGING COLOR' + _this.activeColor)


            var props = Entities.getEntityProperties(_this.entityID);
            if (props.description.indexOf('changing') > -1) {
                print('already changing colors')
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
                // print('SOUND URL::' + soundData.soundURL)
                _this.sound = SoundCache.getSound(soundData.soundURL);
                _this.activeColor = soundData.color;
            }, 500)

        }
    };



    return new XylophoneKey();


});
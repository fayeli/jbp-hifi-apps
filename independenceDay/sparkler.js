(function() {

    var SOUND_URL = Script.resolvePath('sparklerConverted.wav');
    var _this;

    function Sparkler() {
        _this = this;
    }

    Sparkler.prototype = {
        soundInjector: null,
        sparkleSound: null,
        preload: function(entityID) {
            this.entityID = entityID;
            this.sparkleSound = SoundCache.getSound(SOUND_URL);
        },

        unload: function() {

        },

        startNearGrab: function() {
            _this.activateSparkles();
            _this.startPlayingSound();
        },

        continueNearGrab: function() {
            _this.updateSoundPosition();
        },

        releaseGrab: function() {
            _this.deactivateSparkles();
            _this.stopPlayingSound();
        },

        startPlayingSound: function() {

            var audioProperties = {
                volume: 0.2,
                position: _this.getEndOfStick(),
                loop: true
            };

            _this.soundinjector = Audio.playSound(_this.sparkleSound, audioProperties);

        },

        stopPlayingSound: function() {
            _this.soundInjector.stop();
        },

        updateSoundPosition: function() {

            var audioOptions = {
                position: _this.getEndOfStick(),
            }

            _this.soundInjector.options = audioOptions;
        },


        getEndOfStick: function() {
            var properties = Entities.getEntityProperties(_this.entityID);
            var up = Quat.getUp(properties.rotation);
            var workingPosition = Vec3.multiply(up, properties.dimensions.y / 2);
            var finalPosition = Vec3.sum(properties.position, workingPosition);

            return finalPosition;
        },

        activateSparkles: function() {
            var properties = {
                parentID: _this.entityID,
                position: _this.getEndOfStick(),
                dimensions: {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1
                }
                //particle properties
                {
                    "color": {
                        "red": 255,
                        "green": 255,
                        "blue": 255
                    },
                    "isEmitting": 1,
                    "maxParticles": 1000,
                    "lifespan": 1,
                    "emitRate": 100,
                    "emitSpeed": 0.1,
                    "speedSpread": 0,
                    "emitOrientation": {
                        "x": -0.7071220278739929,
                        "y": -0.000015258869098033756,
                        "z": -0.000015258869098033756,
                        "w": 0.7070915699005127
                    },
                    "emitDimensions": {
                        "x": 0.1,
                        "y": -0.1,
                        "z": 0.1
                    },
                    "polarStart": 0,
                    "polarFinish": 2,
                    "azimuthStart": -3.1415927410125732,
                    "azimuthFinish": 0,
                    "emitAcceleration": {
                        "x": 0,
                        "y": 0.2,
                        "z": 0
                    },
                    "accelerationSpread": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    },
                    "particleRadius": 0.013,
                    "radiusSpread": 0,
                    "radiusStart": 0,
                    "radiusFinish": 0,
                    "colorSpread": {
                        "red": 135,
                        "green": 59.55882352941176,
                        "blue": 59.55882352941176
                    },
                    "colorStart": {
                        "red": 255,
                        "green": 255,
                        "blue": 255
                    },
                    "colorFinish": {
                        "red": "#",
                        "green": "4",
                        "blue": "8"
                    },
                    "alpha": 1,
                    "alphaSpread": 0,
                    "alphaStart": 1,
                    "alphaFinish": 0,
                    "emitterShouldTrail": 0,
                    "textures": "https://d1v8u1ev1s9e4n.cloudfront.net/54adc1c95ccacf158ac09eed"
                }
            }

            _this.sparkleParticles = Entities.addEntity(properties);
        },

        deactivateSparkles: function() {
            Entities.deleteEntity(_this.sparkleParticles);
        }
    }
});
//
//  Copyright 2016 High Fidelity, Inc.
//
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {

    var _this = this;

    var looperInterval;
    playSounds = function() {
        print('playing sounds');
        var myPosition = Entities.getEntityProperties(_this.entityID).position;
        _this.injectors.forEach(function(inj) {
            inj.stop();
        });

        _this.sounds.forEach(function(sound) {
            print('playing a sound', sound)
            _this.injectors.push(Audio.playSound(sound, {
                position: myPosition,
                volume: 0.5,
            }));
        })
    }

    var soundURLs = ["http://hifi-content.s3.amazonaws.com/james/synctest/synctest%201-Boffner%20Bass.wav",
        "http://hifi-content.s3.amazonaws.com/james/synctest/synctest%202-Grand%20Piano.wav",
        "http://hifi-content.s3.amazonaws.com/james/synctest/synctest%203-Audio.wav",
        // "http://hifi-content.s3.amazonaws.com/james/synctest/synctest%204-Audio.wav"
    ]
    this.preload = function(entityID) {
        print("preload(" + entityID + ")");
        _this.entityID = entityID;
        _this.sounds = [];
        _this.injectors = [];
        soundURLs.forEach(function(soundURL) {
            _this.sounds.push(SoundCache.getSound(soundURL))
        })

    };

    this.clickDownOnEntity = function(entityID, mouseEvent) {
        var myPosition = Entities.getEntityProperties(entityID).position;
        print("clickDownOnEntity()...");
        _this.sounds.forEach(function(sound) {
            print('playing a sound', sound)
            _this.injectors.push(Audio.playSound(sound, {
                position: myPosition,
                volume: 0.5,
                loop: true
            }));
        })

    };

    // this.clickDownOnEntity = function(entityID, mouseEvent) {
    //     var myPosition = Entities.getEntityProperties(entityID).position;

    //     looperInterval = Script.setInterval(playSounds, 2000)
    //     print("clickDownOnEntity()...");


    // };

    this.unload = function() {
        _this.injectors.forEach(function(inj) {
            inj.stop();
        })
        //Script.clearInterval(looperInterval);
    }

})
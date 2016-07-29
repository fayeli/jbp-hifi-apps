(function() {

    var _this;

    function Turntable() {
        _this = this;
    }

    Turntable.prototype = {
        musicInjector: null,
        current:{
            track:null
        },
        preload: function(entityID) {
            _this.entityID = entityID;
            Messages.messageReceived.connect(handleMessages);
            Messages.subscribe('hifi-record-player')
        },
        collisionWithEntity: function(me, other, collision) {
            print('jbp collision with turntable!!')
            if (collision.type !== 0) {
                return;
            }
            var myProps = Entities.getEntityProperties(me);
            var otherProps = Entities.getEntityProperties(other);
            if (otherProps.description.indexOf('hifi-record-disc') > -1) {
                print('jbp its a disc')
                _this.stopMusic();
                Messages.sendMessage('hifi-record-player', 'stop')
                _this.startRecord(otherProps)

            }
        },
        findNeedleAndTurntable: function() {
            print('jbp find needle and disc 1')
            var needle = null;
            var disc = null;

            var children = Entities.getChildrenIDs(_this.entityID);

            print('jbp children length: ' + children.length)
            children.forEach(function(child) {
                print('jbp looking for a child: ' + child)
                var props = Entities.getEntityProperties(child);
                print('has props? ' + props)
                if (props.description.indexOf('hifi-record-needle') > -1) {
                    needle = child;
                }
                if (props.description.indexOf('hifi-record-turntable') > -1) {
                    turntable = child;
                }
            });
            print('jbp find needle and disc 3')

            return {
                needle: needle,
                turntable: turntable,
            }
        },
        startRecord: function(recordProps) {
            if (_this.current.track !== null) {
                if (_this.current.track.downloaded !== true) {
                    return
                }
            }
            print('jbp start record 1')
            var myProps = Entities.getEntityProperties(_this.entityID);
            var current = _this.findNeedleAndTurntable();
            print('jbp current: ' + JSON.stringify(current))
                //move needle over

            //start rotation
            Entities.editEntity(current.turntable, {
                angularVelocity: {
                    x: 0,
                    y: 0.785398,
                    z: 0,
                },
                angularDamping: 0,
            })

            print('jbp after start record edit')

            //play music
            var url = recordProps.description.split("hifi-record-disc:")[1];
            current.url = url;
            current.track = SoundCache.getSound(url);
            _this.current = current;
            startCheckDownloadedTimers();
        },
        stopRecord: function() {
            print('jbp should stop record')
            var current = _this.findNeedleAndTurntable();

            //add angular damping
            Entities.editEntity(current.turntable, {
                    angularDamping: 0.3
                })
                //move needle over
        },

        updateRecordRotation: function(record) {
            var baseProps = Entities.getEntityProperties(_this.entityID);
            var localAngularVelocity = {
                x: 0,
                y: 0.785398,
                z: 0,
            };

            var worldAngularVelocity = Vec3.multiplyQbyV(baseProps.rotation, localAngularVelocity);
            Entities.editEntity(record, {
                angularVelocity: worldAngularVelocity
            })

        },
        playMusic: function() {
            print('jbp should play music:' + _this.current.url)
            var properties = Entities.getEntityProperties(_this.entityID);

            var audioOptions = {
                position: properties.position,
                volume: 0.75,
                loop: true
            };

            _this.musicInjector = Audio.playSound(_this.current.track, audioOptions);
            print('jbp music should be playing now')

        },

        stopMusic: function() {
            print('should stop music')
            if (_this.musicInjector !== null) {
                _this.musicInjector.stop();
            }
            print('jbp after should stop music')

        },
        unload: function() {
            _this.stopRecord();
            _this.stopMusic();
            if (checkDownloadTimer !== null) {
                Script.clearInterval(checkDownloadTimer)
            }
        }

    }


    var checkDownloadTimer = null;

    function checkDownloaded(sound) {
        var sound = _this.current.track;
        if (sound.downloaded) {
            print('sound is downloaded!')
            Script.clearInterval(checkDownloadTimer);
            _this.playMusic();
        } else {
            print('song hasnt finished downloading yet')
        }

    }

    function startCheckDownloadedTimers() {
        print('should start check download timer')
        if (checkDownloadTimer !== null) {
            Script.clearInterval(checkDownloadTimer);
        }
        checkDownloadTimer = Script.setInterval(function() {
            checkDownloaded();
        }, 100);
    }



    function handleMessages(channel, message, sender) {
        if (sender === MyAvatar.sessionUUID) {
            return
        }

        if (channel === 'hifi-record-player') {
            print('jbp got record message')
            _this.stopMusic();
            _this.stopRecord();
        }
    }

    return new Turntable();
})
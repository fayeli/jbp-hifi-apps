(function() {
    var _this;

    //seconds to wait before teleporting you
    var DELAY = 2 * 1000;

    function Beamer() {
        _this = this;
    };

    Beamer.prototype = {
        teleportTimeout: null,
        preload: function(entityID) {
            print('PRELOADING BEAMER');
            Entities.editEntity(entityID, {
                dynamic: true,
                gravity: {
                    x: 0,
                    y: -9.8,
                    z: 0
                },
                collidesWith: 'static,dynamic,kinematic',
            });
            this.entityID = entityID;
        },
        startNearGrab: function() {
            if (this.teleportTimeout !== null) {
                Script.clearTimeout(this.teleportTimeout);
            }
        },
        unload: function() {
            Script.clearTimeout()
        },
        releaseGrab: function() {
            print('RELEASE GRAB')
            this.startBeamer();
        },
        releaseEquip: function() {
            print('RELEASE EQUIP')
            this.startBeamer();
        },
        startBeamer: function() {
            print('STARTING BEAMER');
            this.teleportTimeout = Script.setTimeout(this.teleport, DELAY);
        },
        teleport: function() {
            print('TELEPORTING!')
            var properties = Entities.getEntityProperties(_this.entityID);
            var offset =  getAvatarFootOffset();
            properties.position.y +=offset;
            print('OFFSET IS::: ' + JSON.stringify(offset))
            print('TELEPORT POSITION IS:: ' + JSON.stringify(properties.position));
            MyAvatar.position = properties.position;


        }
    }

    function getAvatarFootOffset() {
        var data = getJointData();
        var upperLeg, lowerLeg, foot, toe, toeTop;
        data.forEach(function(d) {

            var jointName = d.joint;
            if (jointName === "RightUpLeg") {
                upperLeg = d.translation.y;
            }
            if (jointName === "RightLeg") {
                lowerLeg = d.translation.y;
            }
            if (jointName === "RightFoot") {
                foot = d.translation.y;
            }
            if (jointName === "RightToeBase") {
                toe = d.translation.y;
            }
            if (jointName === "RightToe_End") {
                toeTop = d.translation.y
            }
        })

        var myPosition = MyAvatar.position;
        var offset = upperLeg + lowerLeg + foot + toe + toeTop;
        offset = offset / 100;
        return offset
    };

    function getJointData() {
        var allJointData = [];
        var jointNames = MyAvatar.jointNames;
        jointNames.forEach(function(joint, index) {
            var translation = MyAvatar.getJointTranslation(index);
            var rotation = MyAvatar.getJointRotation(index)
            allJointData.push({
                joint: joint,
                index: index,
                translation: translation,
                rotation: rotation
            });
        });

        return allJointData;
    }

    return new Beamer();
});
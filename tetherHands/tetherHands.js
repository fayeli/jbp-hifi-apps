(function() {

    var TetherHands = function() {

    }

    TetherHands.prototype = {
        preload: function(entityID) {
            this.entityID = entityID;
        },
        unload: function() {
            this.destroyTetherHands();
        },
        enterEntity: function() {
            this.createTetherHands();
        },
        leaveEntity: function() {
            this.destroyTetherHands();
        },
        createTetherHands: function() {
            var boxProps = {
                type: 'Box',
                shapeType: 'box',
                dynamic: true,
                color: {
                    red: 255,
                    green: 0,
                    blue: 255
                },
                collidesWith: 'static,dynamic,kinematic',
                dimensions: {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25
                }
            }

            var leftHandPosition = MyAvatar.getLeftPalmPosition();
            var rightHandPosition = MyAvatar.getRightPalmPosition();

            var left = MyAvatar.getJointIndex('LeftHandMiddle2');
            var right = MyAvatar.getJointIndex('RightHandMiddle2');

            boxProps.position = leftHandPosition;
            boxProps.parentID = MyAvatar.sessionUUID;
            boxProps.parentJointIndex = left;
            this.leftBox = Entities.addEntity(boxProps);

            boxProps.position = rightHandPosition;
            boxProps.parentID = MyAvatar.sessionUUID;
            boxProps.parentJointIndex = right;
            this.rightBox = Entities.addEntity(boxProps);

        },

        destroyTetherHands: function() {
            Entities.deleteEntity(this.leftBox);
            Entities.deleteEntity(this.rightBox);
        }
    }
})
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
            print('enter entity tetherHands')
            this.createTetherHands();
            print('after entity enter tetherHands')
        },
        leaveEntity: function() {
            print('leave entity tetherHands')
            this.destroyTetherHands();
        },
        createTetherHands: function() {
            print('creating tether hands')
            var boxProps = {
                type: 'Box',
                shapeType: 'box',
                dynamic: false,
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


            var left = MyAvatar.getJointIndex('LeftHandMiddle2');
            var right = MyAvatar.getJointIndex('RightHandMiddle2');

            delete boxProps.localPosition;
            delete boxProps.localRotation;
            boxProps.parentID = MyAvatar.sessionUUID;
            boxProps.parentJointIndex = left;
            this.leftBox = Entities.addEntity(boxProps);
            print('leftBox ' + this.leftBox)

            boxProps.parentID = MyAvatar.sessionUUID;
            boxProps.parentJointIndex = right;
            this.rightBox = Entities.addEntity(boxProps);
            print('rightBox ' + this.rightBox)

        },

        destroyTetherHands: function() {
            print('destroyTetherHands')
            Entities.deleteEntity(this.leftBox);
            Entities.deleteEntity(this.rightBox);
        }
    }

    return new TetherHands();
})
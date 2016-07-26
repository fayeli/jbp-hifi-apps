(function() {

    var MALLET_MODEL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet.fbx';
    var MALLET_COLLISION_HULL_URL = 'http://hifi-public.s3.amazonaws.com/models/xylophone/mallet_collision_hull.obj';
    var _this;

    function Mallet() {
        _this = this;
    }

    function createSpringMallet() {
        var originalProps = Entities.getEntityProperties(_this.entityID);
        var props = {
            type: 'Model',
            name: 'Xylophone Mallet',
            modelURL: MALLET_MODEL_URL,
            dimensions: {
                x: 0.56,
                y: 0.06,
                z: 0.06
            },
            restitution: 0,
            dynamic: true,
            collidesWith: 'dynamic,static,kinematic',
            rotation: originalProps.rotation,
            position: originalProps.position,
            shapeType: 'compound',
            compoundShapeURL: MALLET_COLLISION_HULL_URL,
            visible: true
        }
        _this.springMallet = Entities.addEntity(props);
    }

    function destroySpringMallet() {
        Entities.deleteEntity(_this.springMallet);
    }

    function enterPlayingMode() {
        makeOriginalInvisible();
        createSpringMallet();
        createSpringAction();

    }

    function exitPlayingMode() {
        deleteSpringAction();
        destroySpringMallet();
        makeOriginalVisible();

    }

    function makeOriginalInvisible() {
        Entities.editEntity(_this.entityID, {
            visible: false,
            collisionless: true
        });
    }

    function makeOriginalVisible() {
        Entities.editEntity(_this.entityID, {
            visible: true,
            collisionless: false,
            angularVelocity:{
                x:0,
                y:0,
                z:0
            },
            velocity:{
                x:0,
                y:0,
                z:0
            }
        });
    }

    function createSpringAction() {
        var targetProps = Entities.getEntityProperties(_this.entityID);

        var ACTION_TTL = 10; // seconds

        var props = {
            targetPosition: targetProps.position,
            linearTimeScale: 0.02,
            targetRotation: targetProps.rotation,
            angularTimeScale: 0.02,
            tag: getTag(),
            ttl: ACTION_TTL
        };

        _this.actionID = Entities.addAction("spring", _this.springMallet, props);


        return;
    }

    function updateSpringAction() {
        // print('updating spring action::' + _this.actionID)
        var targetProps = Entities.getEntityProperties(_this.entityID);
        var ACTION_TTL = 10; // seconds

        var props = {
            targetPosition: targetProps.position,
            linearTimeScale: 0.01,
            targetRotation: targetProps.rotation,
            angularTimeScale: 0.01,
            tag: getTag(),
            ttl: ACTION_TTL
        };

        var success = Entities.updateAction(_this.springMallet, _this.actionID, props);
        return;
    }

    function deleteSpringAction() {
        Entities.deleteAction(_this.springMallet, _this.actionID);

    }

    function getTag() {
        return "mallet-" + MyAvatar.sessionUUID;
    }

    Mallet.prototype = {
        springAction: null,
        springMallet: null,
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        startNearGrab: function() {
            enterPlayingMode();
        },
        continueNearGrab: function() {
            updateSpringAction();
        },
        releaseGrab: function() {
            exitPlayingMode();
        }
    };

    return new Mallet();
});
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
                x: 0.46,
                y: 0.04,
                z: 0.04
            },
            restitution: 0,
            dynamic: true,
            collidesWith: 'dynamic,static,kinematic',
            rotation:originalProps.rotation,
            position: originalProps.position,
            shapeType: 'compound',
            compoundShapeURL: MALLET_COLLISION_HULL_URL,
            visible:true
        }
        _this.springMallet = Entities.addEntity(props);
        print('CREATED SPRING MALLET ' + _this.springMallet)
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
            collisionless: false
        });
    }

    function createSpringAction() {
        var targetProps = Entities.getEntityProperties(_this.entityID);

        var ACTION_TTL = 10; // seconds

        var props = {
            targetPosition: targetProps.position,
            linearTimeScale: 0.1,
            targetRotation: targetProps.rotation,
            angularTimeScale: 0.1,
            tag: getTag(),
            ttl: ACTION_TTL
        };

        _this.actionID = Entities.addAction("spring", _this.springMallet, props);

        print('ACTION ID??'+_this.actionID)

        return;
    }

    function updateSpringAction() {
        print('updating spring action::' + _this.actionID)
        var targetProps = Entities.getEntityProperties(_this.entityID);
        var ACTION_TTL = 10; // seconds

        var props = {
            targetPosition: targetProps.position,
            linearTimeScale: 0.1,
            targetRotation: targetProps.rotation,
            angularTimeScale: 0.1,
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
            print('PRELOADING A MALLET');
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
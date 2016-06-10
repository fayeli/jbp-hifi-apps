(function() {

    var _this;

    function ForceObject() {
        _this = this;
    }

    ForceObject.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        unload: function() {},
        startNearGrab: function() {
            _this.props = Entities.getEntityProperties(_this.entityID);
            _this.findSimilarEntities();
            _this.attachSimilarEntities();
        },
        continueNearGrab: function() {

        },
        findSimilarEntities: function() {
            print('finding entities')
            var results = Entities.findEntities(_this.props.position, 50);
            var matches = [];
            results.forEach(function(item) {
                var props = Entities.getEntityProperties(item);
                if (props.hasOwnProperty('modelURL')) {
                    print('found model')
                    if (props.modelURL === _this.props.modelURL && props.id !== _this.props.id) {
                        print('found match')
                        matches.push(item)
                    }
                }
            });
            _this.matches = matches;
        },
        releaseGrab: function() {
            _this.props = Entities.getEntityProperties(_this.entityID);
            _this.detachSimilarEntities();
        },
        attachSimilarEntities: function() {
            print('attaching entities ' + _this.matches.length)
            _this.matches.forEach(function(match) {
                Entities.editEntity(match, {
                    parentID: _this.props.id,
                    collidesWith: '',
                    dynamic: false,
                    gravity: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                })
            })
        },
        detachSimilarEntities: function() {
            print('detaching entities ')
            _this.matches.forEach(function(match) {
                Entities.editEntity(match, {
                    parentID: '{00000000-0000-0000-0000-000000000000}',
                    collidesWith: 'static,dynamic,kinematic,myAvatar,otherAvatar',
                    dynamic: true,
                    collisionless: false,
                    gravity: {
                        x: 0,
                        y: -9.8,
                        z: 0
                    },
                    velocity: {
                        x: _this.props.velocity.x,
                        y: _this.props.velocity.y - 0.1,
                        z: _this.props.velocity.z
                    },
                    angularVelocity:_this.props.angularVelocity
                })
            })
        }
    }

    return new ForceObject();
})
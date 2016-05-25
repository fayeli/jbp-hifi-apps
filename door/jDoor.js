    //@imgntn james b. pollack 5/26/2016

    (function() {

        var OPEN_ROTATION = 90;
        var CLOSED_ROTATION = 0;

        var OPEN_ANGULAR_VELOCITY = {
            x: 0,
            y: 6,
            z: 0
        }

        var CLOSE_ANGULAR_VELOCITY = {
            x: 0,
            y: -6,
            z: 0
        }

        var _this = this;

        this.preload = function(entityID) {
            this.entityID = entityID;
            this.initialProperties = Entities.getEntityProperties(entityID);
            Script.update.connect(this.update)
        }

        this.clickDownOnEntity = function(entityID) {
            var currentProperties = Entities.getEntityProperties(entityID);

            if (currentProperties.angularVelocity.y !== 0) {
                if (currentProperties.angularVelocity.y === OPEN_ANGULAR_VELOCITY.y) {
                    this.closeDoor();
                } else {
                    this.openDoor();
                }
            } else {
                if (currentProperties.rotation.y === CLOSED_ROTATION) {
                    this.openDoor();
                }
                if (currentProperties.rotation.y === OPEN_ROTATION) {
                    this.closeDoor();
                }
            }
        }

        this.openDoor = function() {
            Entities.editEntity(this.entityID, {
                angularVelocity: OPEN_ANGULAR_VELOCITY
            })
        }


        this.closeDoor = function() {
            Entities.editEntity(this.entityID, {
                angularVelocity: CLOSE_ANGULAR_VELOCITY
            })
        }

        this.update = function() {
            print('entity has id:: ' + _this.entityID)
            var props = Entities.getEntityProperties(_this.entityID);
            print('props ' + JSON.stringify(props.rotation))
            return;
            if (props.rotation.y >= OPEN_ROTATION) {
                Entities.editEntity(_this.entityID, {
                    angularVelocity: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    rotation: OPEN_ROTATION
                })

                if (props.rotation.y <= CLOSED_ROTATION) {
                    Entities.editEntity(_this.entityID, {
                        angularVelocity: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        rotation: CLOSED_ROTATION
                    })
                }
            }

            this.unload = function() {
                Script.update.disconnect(_this.update);
            }


        }

    })
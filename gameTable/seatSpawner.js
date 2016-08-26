(function() {
    var _this;

    function Seat(spawnLocation, spawnRotation) {
        print('CREATE SEAT');
        var created = [];

        function create() {
            //
            // Created by Triplelexx on 16/05/26
            // Copyright 2016 High Fidelity, Inc.
            //
            // Creates an entity that can be sat upon
            //
            // Sitting animations adapted by Triplelexx from version obtained from Mixamo
            // Links provided to copies of original animations created by High Fidelity, Inc
            // This is due to issues requiring use of overrideRoleAnimation to chain animations and not knowing a better way
            // to reference them cross-platform.
            //
            // Distributed under the Apache License, Version 2.0.
            // See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

            var BASE_PATH = "http://mpassets.highfidelity.com/875bcd3b-7b7d-45a1-a429-c0c6eefad95d-v1/";
            var CHAIR_SCRIPT_URL = BASE_PATH + "chair.js?v=1";
            var COLLIDER_SCRIPT_URL = BASE_PATH + "chairCollider.js?v=1";
            var MODEL_URL = BASE_PATH + "tempo_noCubemaps.fbx?v=1";
            var HULL_URL = BASE_PATH + "tempo_col.obj?v=1";

            var DIST_INFRONT = 1.0;
            var DIST_ABOVE = 1.0;

            var spawnPosition = spawnLocation;
            // raycast down from above the chair
            spawnLocation.y += DIST_ABOVE;
            var intersectionDown = Entities.findRayIntersection({
                direction: Vec3.UNIT_NEG_Y,
                origin: startPosition
            }, true);

            if (intersectionDown.intersects) {
                spawnPosition = intersectionDown.intersection;
            }

            var chair = Entities.addEntity({
                type: "Model",
                name: "Chair",
                modelURL: MODEL_URL,
                position: spawnPosition,
                dimensions: {
                    x: 0.65,
                    y: 1.0,
                    z: 0.65
                },
                gravity: {
                    x: 0.0,
                    y: -9.8,
                    z: 0.0
                },
                // a registration point of 0 is enforced in y 
                registrationPoint: {
                    x: 0.5,
                    y: 0.0,
                    z: 0.5
                },
                dynamic: false,
                lifetime: -1,
                collisionsWillMove: false,
                friction: 1.0,
                grabbable: false,
                damping: 0.2,
                angularDamping: 1.0,
                shapeType: "compound",
                compoundShapeURL: HULL_URL,
                script: CHAIR_SCRIPT_URL,
                userData: JSON.stringify({
                    allowScaling: false,
                    manualSitTarget: {
                        x: 0.0,
                        y: 0.0,
                        z: 0.0
                    },
                    grabbableKey: {
                        grabbable: false
                    }
                })
            });

            chairProperties = Entities.getEntityProperties(chair, ["position", "rotation"]);
            var startPosition = Vec3.sum(chairProperties.position, Vec3.multiply(-0.25, Quat.getFront(chairProperties.rotation)));

            var triggerVolume = Entities.addEntity({
                type: "Box",
                name: "Chair Collider",
                position: startPosition,
                dimensions: {
                    x: 0.65,
                    y: 1.5,
                    z: 0.65
                },
                // a registration point of 0 is enforced in y 
                registrationPoint: {
                    x: 0.5,
                    y: 0.0,
                    z: 0.5
                },
                dynamic: false,
                parentID: chair,
                visible: false,
                script: COLLIDER_SCRIPT_URL,
                collisionless: true,
                collisionsWillMove: false,
                friction: 1.0,
                grabbable: false,
                damping: 0.2,
                lifetime: -1,
                angularDamping: 1.0,
                shapeType: "box",
                userData: JSON.stringify({
                    grabbableKey: {
                        grabbable: false
                    }
                })
            });


            created.push(chair);
            created.push(triggerVolume);

        };

        function cleanup() {
            created.forEach(function(obj) {
                Entities.deleteEntity(obj);
            })
        };

        create();

        this.cleanup = cleanup;

    };

    function SeatSpawner() {
        _this = this;
    };

    SeatSpawner.prototype = {
        preload: function(id) {
            _this.entityID = id;
        },
        createSeat: function() {
            print('create seat function called');
            var props = Entities.getEntityProperties(_this.seat);
            var seat = new Seat(props.position);
        },


    }
    return new SeatSpawner();
});
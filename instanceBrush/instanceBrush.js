// instance brush
// this brush lets you 'paint' entities onto a surface

// v1
// shows you what the entity will look like before placement
// pull trigger down to create the thing, 
// left hand to 'pick'
// right hand to 'place'
//

// v1.5
// disable collisions while moving
// when placing, restore original state of object


// v2 shrubbery
// (adjustable) radius
// some variability in dimensions, position, (yaw) rotation


//v3
//undo
//redo


//v awesome
// in-world webpage overlay (HTML5 in QML)
// raypick from hand
// get properties from webpage thing


Script.include('cloner.js')

var MAPPING_NAME = "com.highfidelity.instanceBrush";

var _this;

function Brush() {
    _this = this;
    this.initialize();
    return this;
}

Brush.prototype = {
    targetProps: null,
    rightOverlayLine: null,
    leftOverlayLine: null,
    initialize: function() {
        this.createMapping();
        this.disableGrab();
        this.targetEntity = Entities.addEntity({
            name: 'Hifi-Instance-Target-Entity',
            position: MyAvatar.position,
            type: 'Sphere',
            dimensions: {
                x: 0.1,
                y: 0.1,
                z: 0.1
            },
            color: {
                red: 255,
                green: 0,
                blue: 255
            },
            collisionless: true,
            collidesWith: '',
            visible: true
        });
    },

    createMapping: function() {
        var mapping = Controller.newMapping(MAPPING_NAME);
        mapping.from([Controller.Standard.RT]).peek().to(this.handleRightTrigger);
        mapping.from([Controller.Standard.LT]).peek().to(this.handleLeftTrigger);
        Controller.enableMapping(MAPPING_NAME);
    },

    updateTargetEntity: function(intersection) {
        var targetProps = Entities.getEntityProperties(this.targetEntity);
        var position = {
            x: intersection.intersection.x,
            y: intersection.intersection.y + targetProps.dimensions.y / 2,
            z: intersection.intersection.z
        }
        Entities.editEntity(this.targetEntity, {
            position: position
        });


    },

    handleRightTrigger: function(value) {
        if (value === 0) {
            var targetProps = Entities.getEntityProperties(_this.targetEntity);
            _this.copy.position = targetProps.position;
            var lastAdded = Entities.addEntity(_this.copy);
        }

    },

    handleLeftTrigger: function(value) {

        var leftIntersection = Entities.findRayIntersection(_this.leftPickRay, true);

        if (leftIntersection.intersects) {
            _this.pickInstance(leftIntersection);
        };

    },

    pickInstance: function(leftIntersection) {
        Entities.deleteEntity(this.targetEntity);

        this.copy = cloner.shallow.copy(leftIntersection.properties)

        leftIntersection.properties.collisionless = 1;
        leftIntersection.properties.collidesWith = '';
        this.targetEntity = Entities.addEntity(leftIntersection.properties);

    },

    disableGrab: function() {
        Messages.sendLocalMessage('Hifi-Hand-Disabler', 'both');
    },

    enableGrab: function() {
        Messages.sendLocalMessage('Hifi-Hand-Disabler', 'none');
    },

    rightRay: function() {

        var rightPosition = Vec3.sum(Vec3.multiplyQbyV(MyAvatar.orientation, Controller.getPoseValue(Controller.Standard.RightHand).translation), MyAvatar.position);

        var rightRotation = Quat.multiply(MyAvatar.orientation, Controller.getPoseValue(Controller.Standard.RightHand).rotation)

        var rightPickRay = {
            origin: rightPosition,
            direction: Quat.getUp(rightRotation),
        };

        this.rightPickRay = rightPickRay;

        var location = Vec3.sum(rightPickRay.origin, Vec3.multiply(rightPickRay.direction, 500));
        this.rightLineOn(rightPickRay.origin, location, {
            red: 255,
            green: 0,
            blue: 0
        });
        var rightIntersection = Entities.findRayIntersection(_this.rightPickRay, true, [], [this.targetEntity]);

        if (rightIntersection.intersects) {
            this.updateTargetEntity(rightIntersection);
        };
    },


    leftRay: function() {
        var leftPosition = Vec3.sum(Vec3.multiplyQbyV(MyAvatar.orientation, Controller.getPoseValue(Controller.Standard.LeftHand).translation), MyAvatar.position);


        var leftRotation = Quat.multiply(MyAvatar.orientation, Controller.getPoseValue(Controller.Standard.LeftHand).rotation)
        var leftPickRay = {
            origin: leftPosition,
            direction: Quat.getUp(leftRotation),
        };

        this.leftPickRay = leftPickRay;

        var location = Vec3.sum(leftPickRay.origin, Vec3.multiply(leftPickRay.direction, 500));
        this.leftLineOn(leftPickRay.origin, location, {
            red: 0,
            green: 255,
            blue: 0
        });

    },

    update: function() {
        _this.leftRay();
        _this.rightRay();
    },

    rightLineOn: function(closePoint, farPoint, color) {
        // draw a line
        if (this.rightOverlayLine === null) {
            var lineProperties = {
                lineWidth: 5,
                start: closePoint,
                end: farPoint,
                color: color,
                ignoreRayIntersection: true, // always ignore this
                visible: true,
                alpha: 1
            };

            this.rightOverlayLine = Overlays.addOverlay("line3d", lineProperties);

        } else {
            var success = Overlays.editOverlay(this.rightOverlayLine, {
                lineWidth: 5,
                start: closePoint,
                end: farPoint,
                color: color,
                visible: true,
                ignoreRayIntersection: true, // always ignore this
                alpha: 1
            });
        }
    },

    leftLineOn: function(closePoint, farPoint, color) {
        // draw a line
        if (this.leftOverlayLine === null) {
            var lineProperties = {
                lineWidth: 5,
                start: closePoint,
                end: farPoint,
                color: color,
                ignoreRayIntersection: true, // always ignore this
                visible: true,
                alpha: 1
            };

            this.leftOverlayLine = Overlays.addOverlay("line3d", lineProperties);

        } else {
            var success = Overlays.editOverlay(this.leftOverlayLine, {
                lineWidth: 5,
                start: closePoint,
                end: farPoint,
                color: color,
                visible: true,
                ignoreRayIntersection: true, // always ignore this
                alpha: 1
            });
        }
    },

    rightOverlayOff: function() {
        if (this.rightOverlayLine !== null) {
            Overlays.deleteOverlay(this.rightOverlayLine);
        }
    },

    leftOverlayOff: function() {
        if (this.leftOverlayLine !== null) {
            Overlays.deleteOverlay(this.leftOverlayLine);
        }
    },

    rotateTargetWithHand: function() {

    }



}

function cleanup(brush) {
    Controller.disableMapping(MAPPING_NAME);
    brush.enableGrab();
    brush.rightOverlayOff();
    brush.leftOverlayOff();
    Entities.deleteEntity(_this.targetEntity);
    Script.update.disconnect(brush.update);
}

var brush = new Brush();

Script.scriptEnding.connect(function() {
    cleanup(brush);
})

Script.update.connect(brush.update)


//utilities

function assign(target) {
    for (var
            hOP = Object.prototype.hasOwnProperty,
            copy = function(key) {
                if (!hOP.call(target, key)) {
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(this, key)
                    );
                }
            },
            i = arguments.length; 1 < i--; Object.keys(arguments[i]).forEach(copy, arguments[i])) {}
    return target;
}
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
            name:'Hifi-Instance-Target-Entity',
            position:MyAvatar.position,
            type:'Sphere',
            dimensions:{
                x:0.1,
                y:0.1,
                z:0.1
            },
            color:{
                red:255,
                green:0,
                blue:255
            },
            visible:true
        });
    },

    createMapping: function() {
        var mapping = Controller.newMapping(MAPPING_NAME);
        mapping.from([Controller.Standard.RT]).peek().to(this.handleRightTrigger);
        mapping.from([Controller.Standard.LT]).peek().to(this.handleLeftTrigger);
        Controller.enableMapping(MAPPING_NAME);
    },


    updateTargetEntity: function(intersection) {
            
            print('target entity is: '+this.targetEntity)
            print('updating target position to: '+ JSON.stringify(intersection.intersection));
            var targetProps = Entities.getEntityProperties(this.targetEntity);

            var position = {
                x:intersection.intersection.x,
                y:intersection.intersection.y + targetProps.dimensions.y/2,
                z:intersection.intersection.z
            }
         //   print('target is:: ' + JSON.stringify(Entities.getEntityProperties(this.targetEntity)))
            Entities.editEntity(this.targetEntity, {
                position: position
            });

     
    },

    handleRightTrigger: function(value) {
        print('right trigger value::' + value);
        if(value===0){
             var targetProps = Entities.getEntityProperties(_this.targetEntity);
        var lastAdded = Entities.addEntity(targetProps);  
        }
     
    },

    handleLeftTrigger: function(value) {
        print('left trigger value:: ' + value);

        var leftIntersection = Entities.findRayIntersection(_this.leftPickRay, true);

        if (leftIntersection.intersects) {
            print('LEFT INTERSECTION :: ');
            _this.pickInstance(leftIntersection);
        };

    },

    paintInstance: function(position) {

        if (this.targetProps !== null) {
            this.targetProps.position = position;
            Entities.addEntity(this.targetProps);
        } else {
            print('pick something first!!');
        }

    },

    pickInstance: function(leftIntersection) {
        print('pick instance:: ' + leftIntersection.entityID);
        print('target entity in pick: ' + this.targetEntity);
        print('before edit in pick')
        Entities.deleteEntity(this.targetEntity);
        this.targetEntity=Entities.addEntity(leftIntersection.properties);
        print('after edit in pick')

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
        var rightIntersection = Entities.findRayIntersection(_this.rightPickRay, true,[],[this.targetEntity]);

        if (rightIntersection.intersects) {
            print('RIGHT INTERSECTION :: ');
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

}

function cleanup(brush) {
    // Controller.disableMapping(MAPPING_NAME);
    brush.enableGrab();
    brush.rightOverlayOff();
    brush.leftOverlayOff();
    Entities.deleteEntity(this.targetEntity);
    Script.update.disconnect(brush.update);
}

var brush = new Brush();

Script.scriptEnding.connect(function() {
    cleanup(brush);
})

Script.update.connect(brush.update)
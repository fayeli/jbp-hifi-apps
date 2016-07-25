var API_ENDPOINT = 'https://ju7ebcvgv5.execute-api.us-east-1.amazonaws.com/prod/getTemporaryDomains';
var STATION_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/grandcentral/03_FBX_scbL_dark.FBX';
var SPACER = 1.2;

var teleporterScript = Script.resolvePath('teleporterEntity.js')

var center = {
    x: 995,
    y: 1000,
    z: 990
};

function getDomains() {
    var request = new XMLHttpRequest();
    request.open("GET", API_ENDPOINT, false);
    request.send();

    var response = JSON.parse(request.responseText);
    return response.rows;
};


function isOccupied(domain) {
    return domain[1] === 1;
};

function isNotOccupied(domain) {
    return domain[1] === 0;
};

function getOccupiedDomains() {
    return getDomains().filter(isOccupied);
};

function getUnoccupiedDomains() {
    return getDomains().filter(isNotOccupied);
};

function howManyUnccupied() {
    return getOccupiedDomains().length;
};

function howManyOccupied() {
    return getOccupiedDomains().length;
};

function sortedByOccupancy() {
    return getDomains().sort(function(a, b) {
        return b[1] - a[1];
    });
};

function createSingleOpenStation(position, parent, domain) {
    var stationProps = {
        name: 'Transportation Station Open: ' + domain[0],
        description: 'destination:' + domain[0],
        parent: parent,
        position: position,
        // type: 'Model',
        // modelURL: STATION_MODEL_URL,
        //rotation: getRotationTowardCenter(position),
        // angularVelocity: {
        //     x: getRandomInt(0, 3),
        //     y: getRandomInt(0, 3),
        //     z: getRandomInt(0, 3)
        // },
        // angularDamping: 0,
        rotation: Quat.angleAxis(0, {
            x: 1,
            y: 0,
            z: 0
        }),
        type: 'Box',
        dimensions: {
            x: 0.5,
            y: domain[1] * 3,
            z: 0.5,
        },
        color: {
            red: getRandomInt(0, 255),
            green: getRandomInt(0, 255),
            blue: getRandomInt(0, 255)
        }
    };

    var station = Entities.addEntity(stationProps);
    print('made a station: ' + station)
    return station;
};

function createSingleStationEntry(position, domain) {
    var entryProps = {
        name: 'Transportation Station Entry: ' + domain[0],
        description: 'destination:' + domain[0],
        type: 'Box',
        dimensions: {
            x: 1.5,
            y: domain[1] * 3,
            z: 1.5,
        },
        position: position,
        collisionless: true,
        collidesWith: '',
        color: {
            red: getRandomInt(0, 255),
            green: getRandomInt(0, 255),
            blue: getRandomInt(0, 255)
        },
        // rotation: getRotationTowardCenter(position),
        rotation: Quat.angleAxis(0, {
            x: 1,
            y: 0,
            z: 0
        }),
        visible: false,
        script: teleporterScript
    };

    var entry = Entities.addEntity(entryProps);
    return entry;
};

function createSingleClosedStation(position, domain) {
    var stationProps = {
        name: 'Transportation Station: Closed' + domain[0],
        description: 'destination:' + domain[0],
        // type:'Model',
        // url:STATION_MODEL_URL,
        type: 'Sphere',
        dimensions: {
            x: 1,
            y: 1,
            z: 1,
        },
        position: position,
        // rotation: getRotationTowardCenter(position),
        rotation: Quat.angleAxis(0, {
            x: 1,
            y: 0,
            z: 0
        }),
        color: {
            red: getRandomInt(0, 255),
            green: getRandomInt(0, 255),
            blue: getRandomInt(0, 255)
        }
    };

    var station = Entities.addEntity(stationProps);
    return station;
};


function createTextEntity(position, parent, domain) {
    var rotation = getRotationTowardCenter(position);


    var position = {
        x: position.x,
        y: position.y,
        // y: position.y + domain[1] * 2,
        z: position.z
    };

    var parentProps = Entities.getEntityProperties(parent);


    var frontVec = Quat.getFront(parentProps.rotation);
    var newPosition = Vec3.sum(position, Vec3.multiply(frontVec, -1));

    var textEntityProps = {
        name: 'Station Sign: ' + domain[0],
        type: 'Text',
        textColor: {
            red: 255,
            green: 255,
            blue: 255
        },
        description: 'destination:' + domain[0],
        parent: parent,
        backgroundColor: {
            red: 0,
            green: 0,
            blue: 0
        },
        //faceCamera:true,
        rotation: Quat.angleAxis(0, {
            x: 1,
            y: 0,
            z: 0
        }),
        lineHeight: 0.1,
        text: domain[1] + " at " + domain[0],
        dimensions: {
            x: 1,
            y: 0.5,
            z: 0.25,
        },
        position: newPosition
    };
    var textEntity = Entities.addEntity(textEntityProps);
    return textEntity;
};

function distributePointsAroundCircle(center, numberOfPoints, radiusX, radiusY, isVertical) {
    var positions = [];
    for (var pointNum = 0; pointNum < numberOfPoints; pointNum++) {
        // "i" now represents the progress around the circle from 0-1
        // we multiply by 1.0 to ensure we get a fraction as a result.
        var i = (pointNum * 1.0) / numberOfPoints;

        // get the angle for this step (in radians, not degrees)
        var angle = i * Math.PI * 2;

        // the X  Y position for this angle are calculated using Sin &amp; Cos
        var x = Math.sin(angle) * radiusX;
        var y = Math.cos(angle) * radiusY;


        if (isVertical === true) {
            var pos = {
                x: x + center.x,
                y: y + center.y,
                z: 0 + center.z
            }

        } else {

            var pos = {
                x: x + center.x,
                y: 0 + center.z,
                z: y + center.y
            }
        }

        // print('CREATE POINT '+numberOfPoints+' AT:' + pos.x + "/" + pos.y + "/" + pos.z);
        positions.push(pos)
    }
    return positions;
};

var ROW_SPACER = 3;
var COLUMN_SPACER = 3;

function distributePointsOnGrid(basePosition, rotation) {
    var positions = [];
    var chunkedDomains = chunk(getDomains(), 4);
    chunkedDomains.forEach(function(row, rowIndex) {
        row.forEach(function(column, colIndex) {
            var horizontalOffset = colIndex * COLUMN_SPACER;
            var verticalOffset = rowIndex * ROW_SPACER
            var rightVector = Quat.getRight(rotation);
            var frontVector = Quat.getFront(rotation);
            var rightDisplacement = Vec3.multiply(rightVector, horizontalOffset);
            var frontDisplacement = Vec3.multiply(frontVector, verticalOffset);
            var finalPosition = Vec3.sum(basePosition, rightDisplacement);
            finalPosition = Vec3.sum(finalPosition, frontDisplacement);
            positions.push(finalPosition)
        })
    });

    return positions;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRotationTowardCenter(position) {
    var rotation = Quat.lookAt(center, position, Vec3.UP)
    return rotation
}

function clearAllStations() {
    var results = Entities.findEntities(center, 1000);
    results.forEach(function(result) {
        var properties = Entities.getEntityProperties(result);
        if (properties.hasOwnProperty('description') && properties.description.indexOf('destination:') > -1) {
            Entities.deleteEntity(result);
        }
    })
};

var ZERO = {
    x: 0,
    y: 0,
    z: 0
};

function createStations() {
    var domains = getDomains();
    //  var pointsAroundCircle = distributePointsAroundCircle(center, domains.length, SPACER * domains.length / 4, SPACER * domains.length / 4, false);

    // var rotation =Quat.lookAt(center,ZERO,Vec3.UP)
    var rotation = Quat.angleAxis(0, {
        x: 1,
        y: 0,
        z: 0
    })
    var pointsOnGrid = distributePointsOnGrid(center, rotation);
    // print('POINTS ON GRID: ' + JSON.stringify(pointsOnGrid));

    domains.forEach(function(domain) {
        if (domain[1] > 0) {
            //  var position = pointsAroundCircle.shift();
            var position = pointsOnGrid.shift();
            var parent = createSingleStationEntry(position, domain);
            createSingleOpenStation(position, parent, domain);
            createTextEntity(position, parent, domain);
        } else {
            var position = pointsOnGrid.shift();
            // var position = pointsAroundCircle.shift();
            createSingleClosedStation(position, domain)
        }
    });
};

function chunk(array, size) {
    var result = []
    for (var i = 0; i < array.length; i += size)
        result.push(array.slice(i, i + size))
    return result
}

function refresh() {
    clearAllStations();
    Script.setTimeout(function() {
        createStations();
        print('after create stations')
            //Script.stop();
    }, 1000);
}

// Script.setInterval(function(){
// },5000)

refresh();

// Script.scriptEnding.connect(function() {
//     clearAllStations();
// })
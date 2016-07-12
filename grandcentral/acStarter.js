var initialized = false;
var secondaryInit = false;
var center = {
    x: 1000,
    y: 1000,
    z: 1000
};


EntityViewer.setPosition(center);
EntityViewer.setKeyholeRadius(60000);
var octreeQueryInterval = Script.setInterval(function() {
    EntityViewer.queryOctree();
}, 100);

var API_ENDPOINT = 'https://ju7ebcvgv5.execute-api.us-east-1.amazonaws.com/prod/getTemporaryDomains';
var STATION_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/grandcentral/03_FBX_scbL_dark.FBX';
var SPACER = 1.2;

var teleporterScript = Script.resolvePath('teleporterEntity.js')


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
        rotation: getRotationTowardCenter(position),
        // angularVelocity: {
        //     x: getRandomInt(0, 3),
        //     y: getRandomInt(0, 3),
        //     z: getRandomInt(0, 3)
        // },
        // angularDamping: 0,
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
        rotation: getRotationTowardCenter(position),
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
        rotation: getRotationTowardCenter(position),
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

    var frontVec = Quat.getFront(rotation);
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
        rotation: rotation,
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRotationTowardCenter(position) {
    var rotation = Quat.lookAt(center, position, Vec3.UP)
    return rotation
}

function clearAllStations() {
    var results = Entities.findEntities(center, 10000);
    print('RESULTS LENGTH AT CLEAR: ' + results.length)
    print('typeof results: ' + typeof results)
    var i;
    if(results.length===0){
        print('results -- none, returning')
        return;
    }
    var success = Entities.deleteEntity(results[1]);
    print('results deleted one?' + success)
    for (i = 0; i < results.length; i++) {
        var s = results[i];
        s = s.slice(1, s.length - 1);
            var success = Entities.deleteEntity(results[i]);

            // Entities.deleteEntity(results[i].toString());
                    print('results deleted entity? '+ ": " + s)

        // var success = Entities.deleteEntity(s);

    }
    // results.forEach(function(result) {
    //                 Entities.deleteEntity(result);

    //     // var properties = Entities.getEntityProperties(result);
    //     // if (properties.hasOwnProperty('description') && properties.description.indexOf('destination:') > -1) {
    //     //     Entities.deleteEntity(result);
    //     // }
    // })
    createStations();
};

function createStations() {
    print('results should create station')
    var domains = getDomains();
    var pointsAroundCircle = distributePointsAroundCircle(center, domains.length, SPACER * domains.length / 4, SPACER * domains.length / 4, false)
    domains.forEach(function(domain) {
        if (domain[1] > 0) {
            var position = pointsAroundCircle.shift();
            var parent = createSingleStationEntry(position, domain);
            createSingleOpenStation(position, parent, domain);
            createTextEntity(position, parent, domain);
        } else {

            var position = pointsAroundCircle.shift();
            createSingleClosedStation(position, domain)
        }
    });
};

function refresh() {
    clearAllStations();

}

refresh();

var refreshInterval = Script.setInterval(function() {
    refresh();
}, 10000)

Script.scriptEnding.connect(function() {
    Script.clearInterval(refreshInterval);
    Script.clearInterval(octreeQueryInterval);
})
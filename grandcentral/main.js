var API_ENDPOINT = 'https://ju7ebcvgv5.execute-api.us-east-1.amazonaws.com/prod/getTemporaryDomains';
var STATION_MODEL_URL = '';
var SPACER = 4;

var center = {
    x: 0,
    y: 0,
    z: 0
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
        parentID: parent,
        // type:'Model',
        // url:STATION_MODEL_URL,
        type: 'Box',
        dimensions: {
            x: 1,
            y: domain[1],
            z: 1,
        },
        color: {
            red: getRandomInt(0, 255),
            green: getRandomInt(0, 255),
            blue: getRandomInt(0, 255)
        }
    };

    var station = Entities.addEntity(stationProps);
    return station;
};

function createSingleStationEntry(position, domain) {
    var entryProps = {
        name: 'Transportation Station Entry: ' + domain[0],
        description: 'destination:' + domain[0]
        type: 'Box',
        dimensions: {
            x: 1.5,
            y: domain[1],
            z: 1.5,
        },
        collisionless: true,
        color: {
            red: getRandomInt(0, 255),
            green: getRandomInt(0, 255),
            blue: getRandomInt(0, 255)
        },
        visible: false
    };

    var entry = Entities.addEntity(entryProps);
    return entry;
};

function createSingleClosedStation(position, domain) {
    var stationProps = {
        name: 'Transportation Station: Closed' + domain[0],
        description: 'destination:' + domain[0]

        // type:'Model',
        // url:STATION_MODEL_URL,
            type: 'Sphere',
        dimensions: {
            x: 1,
            y: 0.5,
            z: 1,
        },
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
    var textEntityProps = {
        name: 'Station Sign: ' + domain[0],
        type: 'Text',
        textColor: {
            red: 255,
            green: 255,
            blue: 255
        },
        parentID: parent,
        backgroundColor: {
            red: 255,
            green: 255,
            blue: 255
        },
        faceCamera: true,
        lineHeight: 0.5,
        text: domain[1] + " at " + domain[0],
        dimensions: {
            x: 1,
            y: 1,
            z: 1,
        },
        position: position
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


function registerStationTeleportVolumeHandlers(station) {
    Script.addEventHandler(station, "enterEntity", handleEnterTeleporter);
};


function handleEnterTeleporter(entityID) {
    var properties = Entities.getProperties(entityID);
    var destination = properties.description.split("destination:")[1];
    Window.location = "hifi://" + destination;
};

function clearAllStations() {
    var results = Entities.findEntities(center, 1000);
    results.forEach(function(result) {
        var properties = Entities.getEntityProperties(result);
        if (result.description.indexOf('destination:') > -1) {
            Entities.deleteEntity(result);
        }
    })
};

function createStations() {
    var domains = getDomains();
    var pointsAroundCircle = distributePointsAroundCircle(center, domains.length, SPACER * domains.length, SPACER * domains.length, false)
    domains.forEach(function(domain) {
        if (domain[1] > 0) {
            var position = pointsAroundCircle.shift();
            var parent = createSingleStationEntry(position, domain);
            registerStationTeleportVolumeHandlers(parent);
            createSingleOpenStation(position, parent, domain);
            createTextEntity(position, parent, domain);
        } else {
            createSingleClosedStation(position, domain)


        }
    });
};

function refresh() {
    clearAllStations();
    Script.setTimeout(function() {
        createStations();
    }, 1000);
}


refresh();
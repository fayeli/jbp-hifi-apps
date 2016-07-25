function findNamedEntities(someEntityName) {
    var searchPosition = {
        x: 10,
        y: 0,
        z: 10
    };

    var searchRadius = 20;

    var results = Entities.findEntities(searchPosition, searchRadius);
    var namedEntities = [];
    results.forEach(function(result) {
        var properties = Entities.getEntityProperties(result);
        if (properties.name === someEntityName) {
            namedEntities.push(result);
        }
    });

    // print(JSON.stringify(namedEntities));

    return namedEntities;
}

var myNamedEntities = findNamedEntities('some_entity_name');
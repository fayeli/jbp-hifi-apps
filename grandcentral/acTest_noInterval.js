var center = {
    x: 1000,
    y: 1000,
    z: 1000
};
// isAgent = true;
EntityViewer.setPosition(center);
EntityViewer.setKeyholeRadius(10);
var octreeQueryInterval = Script.setInterval(function() {
    EntityViewer.queryOctree();
}, 200);


var count = 0;

function update() {
    count++;
    print('count is: ' + count);
    if (count > 100) {
        count = 0;
        print('jbp in interval')
        var results = Entities.findEntities(center, 10);
        print('jbp results.length:' + results.length);
        if (results.length === 0) {
            print('jbp no results')
            return
        }
        print('jbp results[0]: ' + results[0])

        Entities.deleteEntity(results[0]);
        print('jbp after delete entity' + results[0]);
    }
}


Script.scriptEnding.connect(function() {
    Script.update.disconnect(update);
})

Script.update.connect(update);
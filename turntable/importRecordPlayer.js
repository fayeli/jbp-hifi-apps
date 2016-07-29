var TURNTABLE_GROUP_URL=Script.resolvePath('turntable_group_2.json');
Turntable = function(spawnLocation, spawnRotation) {
    var created = [];

    function create() {
        var success = Clipboard.imsportEntities(TURNTABLE_GROUP_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

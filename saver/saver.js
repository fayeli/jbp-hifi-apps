    var storedStuff = [];

    var RANGE = 100;

    function storeStuff() {
        print('STORE!');
        storedStuff = [];
        var allStuff = Entities.findEntities(MyAvatar.position, RANGE);
        print('FOUND THIS MANY THINGS: ' + allStuff.length);
        allStuff.forEach(function(stuff) {
            var properties = Entities.getEntityProperties(stuff);
            if (properties.locked === 1) {
                print('dont store it its locked!')

            } else {
                 print('HAVE THING TO STORE!')
                storedStuff.push(properties);
            }

           
        });
    }

    function deleteStuff() {
        print('DELETING!')
        storedStuff.forEach(function(stuff) {
            print('DELETING: ' + stuff)
            Entities.deleteEntity(stuff.id);
        })
    }

    function restoreStuff() {
        print('RESTORING!')
        while (storedStuff.length) {
            print('RESTORING A STUFF')
            Entities.addEntity(storedStuff.pop());
        }
    }


    storeStuff();
    print('STUFF IS STORED: ' + storedStuff.length);
    deleteStuff();
    Script.setTimeout(function() {
        print('SHOULD RESTORE!')
        restoreStuff();
    }, 2000)



    //panel of buttons
    //save as JSON to asset server
    //or local (toggle option?)
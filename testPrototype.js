function MyController(thing) {
    var _this = this;
    this.thing = thing;
    var privateThing = thing + "-private";

    function getPrivateThing() {
        return privateThing;
    }
    this.privelegedService = function() {
        return getPrivateThing();
    };
}

MyController.prototype = {
    updateInternal: function() {
        print('calling update internal')
        try {
            print('test this:' + this.thing)

        } catch (e) {
            print('error getting this')
        }
        try {
            print('service thing? ' + this.privelegedService())

        } catch (e) {
            print('error calling service')
        }
    }
}

var z = new MyController('z');

//if you directly connect an instance's prototype-defined method to a qt 'update' signal, you lose your scope since we don't currently have a bind
//if you connect an external 'update' function that calls the internal prototype-defined method, your scope is correct 
function updateExternal() {
    print('calling update external')
    z.updateInternal();
}

Script.update.connect(updateExternal);
Script.setTimeout(function() {
    Script.update.disconnect(updateExternal);
    Script.update.connect(z.updateInternal);
    Script.setTimeout(function() {
        Script.update.disconnect(z.updateInternal);
    }, 100)
}, 100)
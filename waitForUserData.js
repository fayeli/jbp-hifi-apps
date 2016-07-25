(function() {

    var _this = this;


    this.preload = function(entityId) {
        this.entityId = entityId;
        this.initialize(entityId);
        this.initTimeout = null;
    }

    this.initialize = function(entityId) {
        print('JBP should initialize' + entityId)
        var properties = Entities.getEntityProperties(entityId);
        if (properties.hasOwnProperty('userData') === false) {
            _this.initTimeout = Script.setTimeout(function() {
                print('JBP no user data yet, try again in one second')
                _this.initialize(entityId);
            }, 1000)

        } else if (properties.userData === "") {
            _this.initTimeout = Script.setTimeout(function() {
                print('JBP user data is empty string, try again in one second')
                _this.initialize(entityId);
            }, 1000)
        } else {
            //if you're not expecting an object you probably don't need this section
            print('JBP userdata before parse attempt' + properties.userData)
            _this.userData = null;
            try {
                _this.userData = JSON.parse(properties.userData);
            } catch (err) {
                print('JBP error parsing json');
                print('JBP properties are:' + properties.userData);
                return;
            }

            print('JBP HAS USERDATA OBJECT, DO SOMETHING!')
            //access it at _this.userData
        }
    }

    this.unload = function() {

        if (this.initTimeout !== null) {
            Script.clearTimeout(this.initTimeout);
        }
    }



});
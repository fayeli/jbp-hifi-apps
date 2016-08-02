(function() {
    var SRT_FILE = Script.resolvePath('newhope.srt');

    var _this;

    function TelesyncController() {
        _this = this;
    }

    TelesyncController.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
            _this.data = getData();
        },
        advanceFrame: function() {
            var frame = _this.getCurrentFrame();
            var frame = frame + 1;
            _this.setCurrentFrame(newFrame)

        },
        rewindFrame: function() {
            var frame = _this.getCurrentFrame();
            var newFrame = frame - 1;
            _this.setCurrentFrame(newFrame)
        },
        setCurrentFrame: function(frame) {
            Entities.editEntity(_this.entityID, {
                description: 'telesync-frame:' + frame;
            })
        },
        getCurrentFrame: function() {
            var myProps = Entities.getEntityProperties(_this.entityID);
            if (myProps.description.indexOf('telesync-frame:') > -1) {
                var frame = myProps.description.split('telesync-frame:')[1]
                return frame;
            } else {
                return false
            }
        }
        startOver: function() {
            _this.setCurrentFrame(0);
        },
        changeDisplayText: function() {

        },
        unload: function() {
            _this.webWindow.close();
            _this.webWindow.deleteLater();
        }
    }

    function getData() {
        var request = new XMLHttpRequest();
        request.open("GET", SRT_FILE, false);
        request.send();

        // var response = JSON.parse(request.responseText);
        var response = request.responseText;
        print('got data')
        return response;
    };

    function sendSubtitlesToWebWindow(subtitleText) {

        var message = JSON.stringify({
            text: subtitleText
        });

        _this.webWindow.emitScriptEvent(message);
    }

    function openWebWindow() {
        print("Launching web window");

        var htmlUrl = Script.resolvePath("index.html")
        webWindow = new OverlayWebWindow('Test Event Bridge', htmlUrl, 320, 240, false);
        _this.webWindow = webWindow;
        _this.webWindow.webEventReceived.connect(function(data) {
            print("JS Side event received: " + data);
        });


    }
    return new TelesyncController();
})
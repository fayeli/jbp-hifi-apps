(function() {

    var SUBTITLE_FILE_REMOTE = Script.resolvePath('newhopeSubtitles.json');
    var PICTURE_DIRECTORY = 'http://s3.amazonaws.com/hifi-content/james/telesync';
    var _this;

    function TelesyncController() {
        _this = this;
    }

    TelesyncController.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
            _this.data = getData();
            openWebWindow();
        },
        advanceFrame: function() {
            var frame = _this.getCurrentFrame();
            var frame = frame + 1;
            if (frame > _this.data.length) {
                frame = _this.data.length;
            }
            _this.setCurrentFrame(newFrame);

        },
        rewindFrame: function() {
            var frame = _this.getCurrentFrame();
            var newFrame = frame - 1;
            if (newFrame < 0) {
                newFrame = 0;
            }
            _this.setCurrentFrame(newFrame);
        },
        advanceFrame10: function() {
            var frame = _this.getCurrentFrame();
            var frame = frame + 10;
            if (frame > _this.data.length) {
                frame = _this.data.length;
            }
            _this.setCurrentFrame(newFrame);

        },
        rewindFrame10: function() {
            var frame = _this.getCurrentFrame();
            var newFrame = frame - 10;
            if (newFrame < 0) {
                newFrame = 0;
            }
            _this.setCurrentFrame(newFrame);
        },
        setCurrentFrame: function(frame) {
            Entities.editEntity(_this.entityID, {
                description: 'telesync-frame:' + frame
            });
        },
        getCurrentFrame: function() {
            var myProps = Entities.getEntityProperties(_this.entityID);
            if (myProps.description.indexOf('telesync-frame:') > -1) {
                var frame = myProps.description.split('telesync-frame:')[1];
                return frame;
            } else {
                return false;
            }
        },
        startOver: function() {
            _this.setCurrentFrame(0);
        },
        changeDisplayText: function(frame) {
            sendSubtitlesToWebWindow(_this.data[frame].text);
        },
        changePicture: function(frame) {
            var PICTURE_DIRECTORY = "";
            var PREFIX = "subtitle_";
            var POSTFIX = ".png";
            Entities.editEntity(_this.entityID, {
                textures: JSON.stringify({
                    Picture: PICTURE_DIRECTORY + PREFIX + frame + POSTFIX
                })
            })

        },
        unload: function() {
            _this.webWindow.close();
            _this.webWindow.deleteLater();
        },
        processFrame: function() {
            var frame = _this.getCurrentFrame();
            _this.changePicture(frame);
            _this.changeDisplayText(frame);
        }
    }

    function getData() {
        var request = new XMLHttpRequest();
        request.open("GET", SUBTITLE_FILE_REMOTE, false);
        request.send();
        var response = JSON.parse(request.responseText);
        print('jbp got data' + response.length)
        return response;
    };

    function sendSubtitlesToWebWindow(text) {
        var message = JSON.stringify({
            text: text
        });

        _this.webWindow.emitScriptEvent(message);
    }

    function openWebWindow() {
        print("Launching web window");
        var htmlUrl = Script.resolvePath("index.html")
        var webWindow = new OverlayWebWindow('Telesync Viewer', htmlUrl, 320, 240, false);
        _this.webWindow = webWindow;
        _this.webWindow.webEventReceived.connect(function(data) {
            print("JS Side event received: " + data);
        });
    }

    return new TelesyncController();
})
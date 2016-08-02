print("Launching web window");

var htmlUrl = Script.resolvePath("index.html")
webWindow = new OverlayWebWindow('Test Event Bridge', htmlUrl, 320, 240, false);
webWindow.webEventReceived.connect(function(data) {
    print("JS Side event received: " + data);
});

Script.setInterval(function() {
    MyStats.renderRate = Stats.renderrate;
    MyStats.presentRate = Stats.presentrate;
    MyStats.bufferCPUCount = Render.getConfig("Stats").bufferCPUCount;
    var message = JSON.stringify(MyStats);
    print("JS Side sending: " + message);
    webWindow.emitScriptEvent(message);
}, 1 * 1000);

var MyStats = {};
Script.scriptEnding.connect(function() {
    webWindow.close();
    webWindow.deleteLater();
});
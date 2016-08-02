var ffmpeg = require('fluent-ffmpeg');
var command = new ffmpeg();
var SUBTITLE_FILE = 'newhope2.srt';
var MOVIE_FILE = "starwars1.mp4";
var SNAPSHOT_SIZE = '640x480';
var fs = require('fs');
var parser = require('subtitles-parser');

var srt = fs.readFileSync(SUBTITLE_FILE, 'utf8');

var data = parser.fromSrt(srt);
convertTimestamps(data);

var currentSubtitle = 0;
var maxSubtitles = data.length;

function writeDataToJSON() {
    var jsonfile = require('jsonfile')

    var file = 'newhopeSubtitles.json'

    jsonfile.writeFile(file, data, {
        spaces: 2
    }, function(err) {
        console.error(err)
    })

};


function convertTimestamps(data) {
    data.forEach(function(item) {
        item.startTime = item.startTime.split(",").join(".");
        item.endTime = item.endTime.split(",").join(".");
    })
}

function clearCommand() {
    command = new ffmpeg();
    command.input(MOVIE_FILE);
    command.noAudio();
    command.on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
            console.log('Processing finished !');
            processNextSnapshot();
        })

}

function takeSnapshotAtTime(time) {
    console.log('taking snapshot at ' + time)
    command.seekInput(time)
        .frames(1)
        .run()
}

function processNextSnapshot() {
    if (currentSubtitle >= maxSubtitles) {
        console.log('done here')
        return
    }
    clearCommand();
    command.output('testrun2/subtitle_' + currentSubtitle + ".png");
    takeSnapshotAtTime(data.shift().startTime);
    currentSubtitle++;
}

function startConvertingTelesync() {
    clearCommand();
    command.output('testrun2/subtitle_0.png');
    takeSnapshotAtTime(data[0].startTime);
    currentSubtitle++
}
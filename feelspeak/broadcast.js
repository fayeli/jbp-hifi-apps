function broadcastSoundEnergy() {
    var loudness = MyAvatar.audioAverageLoudness;
    var data = {
        loudness: loudness
    }

    Messages.sendMessage('feelspeak', JSON.stringify(data))
        print('DATA IS' + loudness);
}

Script.update.connect(broadcastSoundEnergy);

Script.scriptEnding.connect(function() {
    Script.update.disconnect(broadcastSoundEnergy);
})
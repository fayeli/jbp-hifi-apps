function broadcastSoundEnergy() {
    var loudness = MyAvatar.audioAverageLoudness;
    var data = {
        loudness: loudness
    }
    print('DATA IS' + loudness);
    Messages.sendMessage('feelspeak', JSON.stringify(data))
}
var messagesReceivedCount = 0;

var loudnessFactor = 0.05;

function handleMessages(channel, message, sender) {
    print('GOT MESSAGE')
        // if (sender === MyAvatar.sessionUUID) {
        //     return
        // }

    if (channel === 'feelspeak') {
        messagesReceivedCount++;
        print('sendIndex/receiveCount::' + message + "/" + messagesReceivedCount);
    }
}

function vibrateControllers(loudness) {
    var strength = scale(loudness, 0, 100, 0, 1)
        //strength, duration, hand
    Controller.triggerHapticPulse(strength, 1, 2)
}

function scale(value, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

Messages.messageReceived.connect(handleMessages);
Messages.subscribe('feelspeak')
print('READY TO RECEIVE')
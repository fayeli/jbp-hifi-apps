var messagesReceivedCount = 0;

function handleMessages(channel, message, sender) {
    if (sender === MyAvatar.sessionUUID) {
        return
    }

    if (channel === 'feelspeak') {
        messagesReceivedCount++;
        // print('sendIndex/receiveCount::' + message + "/" + messagesReceivedCount);
        vibrateControllers(JSON.parse(message).loudness)
    }
}

function vibrateControllers(loudness) {
    var strength = scale(loudness, 0, 2500, 0, 1);
    //strength, duration, hand
    // print('strength is: ' + strength)
    if (strength < 0.1) {
        return
    }
    var vibrated = Controller.triggerHapticPulse(strength, 8, 2);
    //print('vibrated?' + vibrated)
}

function scale(value, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

Messages.messageReceived.connect(handleMessages);
Messages.subscribe('feelspeak')
print('READY TO RECEIVE')
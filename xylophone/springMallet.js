(function() {

    function SpringMallet() {
        _this = this;
    }
    
    SpringMallet.prototype = {

        collisionWithEntity: function(thisEntity, otherEntity, collision) {
            if (collision.type !== 0) {
                //we only want to vibrate on collision start
                return
            }
            var magnitude = Vec3.length(collision.velocityChange)
            var myProps = Entities.getEntityProperties(thisEntity);
            var hand = myProps.description;
            hand = hand === 'left' ? 0 : 1;
            vibrateControllers(magnitude, hand)
        }
    };


    function vibrateControllers(loudness, hand) {
        var strength = scale(loudness, 0, 0.35, 0, 1);
        //strength, duration, hand
        print('hand is:' + hand)
        print('vibe strength is: ' + strength)

        var vibrated = Controller.triggerHapticPulse(strength, 8, hand);
        print('vibrated?' + vibrated)
    }

    function scale(value, min1, max1, min2, max2) {
        return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
    }

    return new SpringMallet();
});
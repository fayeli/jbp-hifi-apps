(function() {

    //add bashers to nearby avatars 


    var _this;

    function Bladerball() {
        _this = this;
    }

    Bladerball.prototype = {
        colorTimeout: null,
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        collisionWithEntity: function(me, other, collision) {

        },
        changeColorToTeam: function(team) {
            var color;

            if (team === 'red') {
                color = {
                    red: 255,
                    green: 0,
                    blue: 0
                }
            }

            if (team === 'blue') {
                color = {
                    red: 0,
                    green: 0,
                    blue: 255
                }
            }

            if (team === 'green') {
                color = {
                    red: 0,
                    green: 255,
                    blue: 0
                }
            }

            if (_this.colorTimeout !== null) {
                Entities.editEntity(me, {
                    color: color
                })
            }

        }
    }

    function findNearbyAvatars(){

    }

    
    return new Bladerball();
});
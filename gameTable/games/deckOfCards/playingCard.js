(function() {

    var _this;

    var CARD_MODEL_URL = "playing_card.fbx";
    var CARD_BACK_IMAGE_URL = "back.jpg";
    var CARD_IMAGE_BASE_URL = "playingcard_old-";

    function PlayingCard() {
        _this = this;
    };

    PlayingCard.prototype = {
        preload: function(id) {
            _this.entityID = id;
        },
        startNearGrab: function() {
            _this.attachCardOverlay();
        },
        releaseGrab: function() {
            _this.detachCardOverlay();
        },
        attachCardOverlay: function() {
            var myProps = Entities.getEntityProperties(_this.entityID);

            _this.cardOverlay = Overlays.addOverlay("Model", {
                url: CARD_MODEL_URL,
                textures: JSON.stringify({
                    front: CARD_IMAGE_BASE_URL + _this.getCard() + ".jpg",
                    back: CARD_BACK_IMAGE_URL,
                }),
                position: myProps.position,
                rotation: myProps.rotation,
                dimensions: myProps.dimensions,
                visible: true,
                drawInFront: true,
                parentID: myProps.id
            });
        },
        detachCardOverlay: function() {
            Overlays.deleteOverlay(_this.cardOverlay);
        },
        getCard: function() {
            return _this.getCurrentUserData().playingCards.card;
        },
        setCurrentUserData: function(data) {
            var userData = getCurrentUserData();
            userData.playingCards = data;
            Entities.editEntity(_this.entityID, {
                userData: userData
            });
        },
        getCurrentUserData: function() {
            var props = Entities.getEntityProperties(_this.entityID);
            var json = null;
            try {
                json = JSON.parse(props.userData);
            } catch (e) {
                return;
            }
            return json;
        },
    }

    return new PlayingCard();
})
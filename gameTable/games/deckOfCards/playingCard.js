(function() {

    var _this;

    var CARD_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/gametable-dev/assets/deckOfCards/playing_card.fbx';
    var CARD_BACK_IMAGE_URL = "http://hifi-content.s3.amazonaws.com/james/gametable-dev/assets/deckOfCards/images/back.jpg";
    var CARD_IMAGE_BASE_URL = "http://hifi-content.s3.amazonaws.com/james/gametable-dev/assets/deckOfCards/images/playingcard_old-";

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
                    file1: CARD_IMAGE_BASE_URL + _this.getCard() + ".jpg",
                    file2: CARD_BACK_IMAGE_URL,
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
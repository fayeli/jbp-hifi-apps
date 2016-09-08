(function() {
    var _this

    var PLAYING_CARD_SCRIPT_URL = 'playingCard.js';
    var PLAYING_CARD_MODEL_URL = 'http://hifi-content.s3.amazonaws.com/james/gametable-dev/assets/deckOfCards/playing_card.fbx';
    var PLAYING_CARD_BACK_IMAGE_URL = "http://hifi-content.s3.amazonaws.com/james/gametable-dev/assets/deckOfCards/back.jpg";
    var PLAYING_CARD_DIMENSIONS = {
        x: 1,
        y: 1,
        z: 1
    };

    var SETUP_DELAY = 2000;
    var NEARBY_CARDS_RANGE = 5;

    function DeckOfCards() {
        _this = this;
    };

    DeckOfCards.prototype = {
        rightOverlayLine: null,
        leftOverlayLine: null,
        targetOverlay: null,
        currentHand: null,
        offHand: null,
        updateConnected: null,
        preload: function(entityID) {
            _this.entityID = entityID;
        },

        checkIfAlreadyHasCards: function() {
            var cards = _this.getCardsFromUserData();
            if (cards === false) {
                //should make a deck the first time
                return
            } else {
                //someone already started a game with this deck
                _this.currentCards = cards;
            }
        },

        resetDeck: function() {

            //finds and delete any nearby cards
            var myProps = Entities.getEntityProperties(_this.entityID);
            var results = Entities.findEntities(myProps.position, NEARBY_CARDS_RANGE);
            results.forEach(function(item) {
                    var itemProps = Entities.getEntityProperties(item);
                    if (itemProps.userData.hasOwnProperty('playingCards') && itemProps.userData.playingCards.hasOwnProperty('card')) {
                        Entities.deleteEntity(item);
                    }
                })
                //resets this deck to a new deck
            _this.makeNewDeck();
        },

        makeNewDeck: function() {
            //make a stack and shuffle it up.
            var stack = new Stack();
            stack.makeDeck();
            stack.shuffle(100);
            _this.currentCards = stack;
        },

        collisionWithEntity: function(me, other, collision) {
            //on the start of a collision with the deck, if its a card, add it back to the deck
            if (collision.type !== 0) {
                //its not the start, so exit early.
                return;
            }

            var otherProps = Entities.getEntityProperties(other);
            if (otherProps.userData.hasOwnProperty('playingCards') && otherProps.userData.playingCards.hasOwnProperty('card')) {
                var value = otherProps.userData.playingCards.card.value;
                _this.addCardToDeck(value);
                Entities.deleteEntity(other);
            }
        },

        addCardToDeck: function(storedData) {
            var card = new Card(storedData.substr(1, storedData.length), storedData[0]);
            _this.currentStack.addCard(card);
        },

        startNearGrab: function(id, paramsArray) {
            _this.checkIfAlreadyHasCards();
            _this.enterDealerMode(paramsArray[0]);
        },

        continueNearGrab: function() {
            scaleHandDistanceToCardIndex();
        },

        releaseGrab: function() {
            _this.exitDealerMode();
        },

        enterDealerMode: function(hand) {
            var offHand;
            if (hand === "left") {
                offHand = "right";
            }
            if (hand === "right") {
                offHand = "left";
            }
            _this.currentHand = hand;
            _this.offHand = offHand;
            Messages.sendLocalMessages('Hifi-Hand-Disabler', _this.offHand);
            Script.update.connect(_this.updateRays);
            _this.updateConnected === true;
        },

        updateRays: function() {
            if (_this.currentHand === 'left') {
                _this.leftRay();
            }
            if (_this.currentHand === 'right') {
                _this.rightRay();
            }
        },

        exitDealerMode: function() {
            //turn grab on 
            //save the cards
            //delete the overlay beam
            if (_this.updateConnected === true) {
                Script.update.disconnect(_this.updateRays);
            }
            _this.turnOffOverlayBeams();
            _this.storeCards();
        },

        storeCards: function() {
            Entities.editEntity(_this.entityID, {
                userData: JSON.stringify({
                    cards: _this.currentStack.export()
                });
            })
        },

        restoreCards: function() {
            _this.currentCards = _this.getCardsFromUserData();

        },

        getCardsFromUserData: function() {
            var props = Entities.getEntityProperties(_this.entityID);
            var data;
            try {
                data = JSON.parse(props.userData);
                return data.cards;
            } catch (e) {
                return false;
            }
        },

        rightRay: function() {
            var pose = Controller.getPoseValue(Controller.Standard.RightHand);
            var rightPosition = pose.valid ? Vec3.sum(Vec3.multiplyQbyV(MyAvatar.orientation, pose.translation), MyAvatar.position) : MyAvatar.getHeadPosition();
            var rightRotation = pose.valid ? Quat.multiply(MyAvatar.orientation, pose.rotation) :
                Quat.multiply(MyAvatar.headOrientation, Quat.angleAxis(-90, {
                    x: 1,
                    y: 0,
                    z: 0
                }));

            var rightPickRay = {
                origin: rightPosition,
                direction: Quat.getUp(rightRotation),
            };

            this.rightPickRay = rightPickRay;

            var location = Vec3.sum(rightPickRay.origin, Vec3.multiply(rightPickRay.direction, 50));

            var rightIntersection = Entities.findRayIntersection(rightPickRay, true, [], [this.targetEntity]);

            if (rightIntersection.intersects) {
                this.rightLineOn(rightPickRay.origin, rightIntersection.intersection, COLORS_CAN_PLACE);

                if (this.targetOverlay !== null) {
                    this.updateTargetOverlay(rightIntersection);
                } else {
                    this.createTargetOverlay();
                }
            } else {
                this.rightLineOn(rightPickRay.origin, location, COLORS_CANNOT_PLACE);
            }

        },

        leftRay: function() {
            var pose = Controller.getPoseValue(Controller.Standard.LeftHand);
            var leftPosition = pose.valid ? Vec3.sum(Vec3.multiplyQbyV(MyAvatar.orientation, pose.translation), MyAvatar.position) : MyAvatar.getHeadPosition();
            var leftRotation = pose.valid ? Quat.multiply(MyAvatar.orientation, pose.rotation) :
                Quat.multiply(MyAvatar.headOrientation, Quat.angleAxis(-90, {
                    x: 1,
                    y: 0,
                    z: 0
                }));

            var leftPickRay = {
                origin: leftPosition,
                direction: Quat.getUp(leftRotation),
            };

            this.leftPickRay = leftPickRay;

            var location = Vec3.sum(MyAvatar.position, Vec3.multiply(leftPickRay.direction, 50));

            var leftIntersection = Entities.findRayIntersection(leftPickRay, true, [], [this.targetEntity]);

            if (leftIntersection.intersects) {
                this.leftLineOn(leftPickRay.origin, leftIntersection.intersection, COLORS_CAN_PLACE);
                if (this.targetOverlay !== null) {
                    this.updateTargetOverlay(leftIntersection);
                } else {
                    this.createTargetOverlay();
                }

            } else {
                this.leftLineOn(leftPickRay.origin, location, COLORS_CANNOT_PLACE);
            }


        },

        rightLineOn: function(closePoint, farPoint, color) {
            if (this.rightOverlayLine === null) {
                var lineProperties = {
                    start: closePoint,
                    end: farPoint,
                    color: color,
                    ignoreRayIntersection: true,
                    visible: true,
                    alpha: 1,
                    solid: true,
                    drawInFront: true,
                    glow: 1.0
                };

                this.rightOverlayLine = Overlays.addOverlay("line3d", lineProperties);

            } else {
                var success = Overlays.editOverlay(this.rightOverlayLine, {
                    start: closePoint,
                    end: farPoint,
                    color: color
                });
            }
        },

        leftLineOn: function(closePoint, farPoint, color) {
            if (this.leftOverlayLine === null) {
                var lineProperties = {
                    ignoreRayIntersection: true,
                    start: closePoint,
                    end: farPoint,
                    color: color,
                    visible: true,
                    alpha: 1,
                    solid: true,
                    glow: 1.0,
                    drawInFront: true
                };

                this.leftOverlayLine = Overlays.addOverlay("line3d", lineProperties);

            } else {
                var success = Overlays.editOverlay(this.leftOverlayLine, {
                    start: closePoint,
                    end: farPoint,
                    color: color
                });
            }
        },

        rightOverlayOff: function() {
            if (this.rightOverlayLine !== null) {
                Overlays.deleteOverlay(this.rightOverlayLine);
                this.rightOverlayLine = null;
            }
        },

        leftOverlayOff: function() {
            if (this.leftOverlayLine !== null) {
                Overlays.deleteOverlay(this.leftOverlayLine);
                this.leftOverlayLine = null;
            }
        },

        turnOffOverlayBeams: function() {
            this.rightOverlayOff();
            this.leftOverlayOff();
        },

        rightOverlayOff: function() {
            if (this.rightOverlayLine !== null) {
                Overlays.deleteOverlay(this.rightOverlayLine);
                this.rightOverlayLine = null;
            }
        },

        leftOverlayOff: function() {
            if (this.leftOverlayLine !== null) {
                Overlays.deleteOverlay(this.leftOverlayLine);
                this.leftOverlayLine = null;
            }
        },

        createTargetOverlay: function(position) {
            var myProps = Entities.getEntityProperties(_this.entityID);

            var rotation = Quat.lookAt(intersection.intersection, MyAvatar.position, Vec3.UP);
            var euler = Quat.safeEulerAngles(rotation);
            var towardUs = Quat.fromPitchYawRollDegrees(0, euler.y, 0);

            _this.targetOverlay = Overlays.addOverlay("Model", {
                url: PLAYING_CARD_MODEL_URL,
                textures: JSON.stringify({
                    front: PLAYING_CARD_BACK_IMAGE_URL,
                    back: PLAYING_CARD_BACK_IMAGE_URL,
                }),
                position: position,
                rotation: towardUs,
                dimensions: PLAYING_CARD_DIMENSIONS,
                visible: true,
                drawInFront: true,
            });
        },

        updateTargetOverlay: function(intersection) {
            _this.intersection = intersection;

            var rotation = Quat.lookAt(intersection.intersection, MyAvatar.position, Vec3.UP);
            var euler = Quat.safeEulerAngles(rotation);
            var position = {
                x: intersection.intersection.x,
                y: intersection.intersection.y + PLAYING_CARD_DIMENSIONS.y / 2,
                z: intersection.intersection.z
            };

            this.tooClose = isTooCloseToTeleport(position);
            var towardUs = Quat.fromPitchYawRollDegrees(0, euler.y, 0);

            Overlays.editOverlay(this.targetOverlay, {
                position: position,
                rotation: towardUs
            });

        },

        deleteCardTargetOverlay: function() {
            Overlays.deleteOverlay(_this.targetOverlay);
        },

        createPlayingCard: function(position, value) {

            var properties = {
                type: 'Model',
                description: 'hifi:gameTable:game:playingCards',
                dimensions: PLAYING_CARD_DIMENSIONS,
                modelURL: PLAYING_CARD_MODEL_URL,
                script: PLAYING_CARD_SCRIPT_URL,
                position: position,
                dynamic: true,
                gravity: {
                    x: 0,
                    y: -9.8,
                    z: 0
                },
                userData: {
                    grabbableKey: {
                        grabbable: true
                    },
                    playingCards: {
                        card: value
                    }
                }
            }
        }

    }

    function scaleHandDistanceToCardIndex(value, min1, max1, min2, max2) {
        return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
    }

    function Card(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    function Stack() {

        // Create an empty array of cards.

        this.cards = new Array();

        this.makeDeck = stackMakeDeck;
        this.shuffle = stackShuffle;
        this.deal = stackDeal;
        this.draw = stackDraw;
        this.addCard = stackAddCard;
        this.combine = stackCombine;
        this.cardCount = stackCardCount;
        this.export = stackExportCards;
        this.import = stackImportCards;
    }

    function stackImportCards(exportedCards) {
        var cards = JSON.parse(exportedCards);
        this.cards = [];
        var cardArray = this.cards;
        cards.forEach(function(card) {
            var newCard = new Card(card.substr(1, card.length), card[0]);
            cardArray.push(newCard)
        })
    }

    function stackExportCards() {
        var _export = [];
        this.cards.forEach(function(item) {
            _export.push(item.suit + item.rank);
        });
        return JSON.stringify(_export);
    }

    function stackAddCard(card) {

        this.cards.push(card);
    }

    function stackMakeDeck(n) {

        var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9",
            "10", "J", "Q", "K");
        var suits = new Array("C", "D", "H", "S");
        var i, j, k;
        var m;

        m = ranks.length * suits.length;

        // Set array of cards.

        this.cards = new Array(n * m);

        // Fill the array with 'n' packs of cards.

        for (i = 0; i < n; i++)
            for (j = 0; j < suits.length; j++)
                for (k = 0; k < ranks.length; k++)
                    this.cards[i * m + j * ranks.length + k] =
                    new Card(ranks[k], suits[j]);
    }

    function stackShuffle(n) {

        var i, j, k;
        var temp;

        // Shuffle the stack 'n' times.

        for (i = 0; i < n; i++)
            for (j = 0; j < this.cards.length; j++) {
                k = Math.floor(Math.random() * this.cards.length);
                temp = this.cards[j];
                this.cards[j] = this.cards[k];
                this.cards[k] = temp;
            }
    }

    function stackDeal() {

        if (this.cards.length > 0)
            return this.cards.shift();
        else
            return null;
    }

    function stackDraw(n) {

        var card;

        if (n >= 0 && n < this.cards.length) {
            card = this.cards[n];
            this.cards.splice(n, 1);
        } else
            card = null;

        return card;
    }

    function stackCardCount() {

        return this.cards.length;
    }

    function stackCombine(stack) {

        this.cards = this.cards.concat(stack.cards);
        stack.cards = new Array();
    }

    return new DeckOfCards();
});
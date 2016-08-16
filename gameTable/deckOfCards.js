(function() {
    var _this

    function DeckOfCards() {
        _this = this;
    };

    DeckOfCards.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        collisionWithEntity: function(me, other, collision) {
            if (collision.type !== 0) {
                return;
            }

            var otherProps = Entities.getEntityProperties(other);
            if (otherProps.description.indexOf('hifi:gameTable:game:playingCards') > -1) {
                var split = description.split(":");
                _this.addCardToDeck(split[4]);
                Entities.deleteEntity(other);
            }
        },
        addCardToDeck(storedData) {
            var card = new Card(storedData.substr(1, storedData.length), storedData[0]);
            _this.currentStack.addCard(card);
        },
        startNearGrab: function() {
            _this.enterDealerMode();
        },
        continueNearGrab: function() {
            scaleHandDistanceToCardIndex();
        },
        releaseGrab: function() {
            _this.exitDealerMode();
        },
        enterDealerMode() {

        },
        exitDealerMode() {

        },
        changeVisibleCard() {

        },
        storeCards() {
            Entities.editEntity(_this.entityID, {
                userData: JSON.stringify({
                    cards: _this.currentStack.export()
                });
            })
        },
        restoreCards() {
            _this.currentCards = _this.getCardsFromUserData();

        },
        getCardsFromUserData() {
            var props = Entities.getEntityProperties(_this.entityID);
            var data;
            try {
                data = JSON.parse(props.userData);
                return data.cards
            } catch (e) {
                return []
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

    return new DeckOfCards()
});
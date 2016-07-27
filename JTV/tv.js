(function() {
    var _this = this;

    function TV() {
        _this = this;
    }

    TV.prototype = {v
        baseURL:'https://youtube.com/embed/',
        afterURL:'?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj&rel=0&autoplay=1',
        URLs: [
            'u31GWn_ChAE',
            '2sXqRTHKzBs',
            '8gZV-Dn_7Ks',
            'bFPhaUod9SM',
            'by1nsM9f-QI',
            'NzgMjFOEEV4',
            '8WxNmNueccQ',
            'IbvdfToPLxA',
            'ju7x2ENy0-g',
        ],
        currentChannel: null,
        preload: function(entityID) {
            this.entityID = entityID;
        },
        changeChannel: function(url,params) {
            var props = Entities.getEntityProperties(_this.entityID);
            var children = Entities.getChildrenIDs(_this.entityID);
            Entities.editEntity(children[0],{
                url:_this.baseURL+url+_this.afterURL
            })
        }
    }

    return new TV();

})
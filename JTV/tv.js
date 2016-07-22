(function() {
    var _this = this;

    function TV() {
        _this = this;
    }

    TV.prototype = {
        URLs: [
            'https://youtu.be/u31GWn_ChAE?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/2sXqRTHKzBs?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/8gZV-Dn_7Ks?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/bFPhaUod9SM?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/by1nsM9f-QI?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/NzgMjFOEEV4?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/8WxNmNueccQ?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/IbvdfToPLxA?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
            'https://youtu.be/ju7x2ENy0-g?list=PLoe9GsfO1mjk7XWQp84fB8nNS3Z_zb9nj',
        ],
        currentChannel: null,
        preload: function(entityID) {
            this.entityID = entityID;
        },
        changeChannel: function(url,params) {
            var props = Entities.getEntityProperties(_this.entityID);
            var children = Entities.getChildrenIDs(_this.entityID);
            Entities.editEntity(children[0],{
                url:url
            })
        }
    }

    return new TV();

})
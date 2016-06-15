//
//  entitiesMenu.js
//  examples
//
//  Created by James  B. Pollack on 2/24/14
//  Copyright 2016 High Fidelity, Inc.
//
//  Adds functions for locking, unlocking, and delete all entities.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


// Script.include('../hifi/examples/libraries/fjs.js');
// var fjs = loadFJS();

// var groupByName = fjs.group(function(item) {
//     return item.name
// });


Script.include('underscore.js');
var _ = loadUnderscore();

function setupMenus() {
    if (!Menu.menuExists("Entities")) {
        Menu.addMenu("Entities");

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Delete All",
            isCheckable: false,
            isChecked: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Unlock All",
            // shortcutKey: "ALT+F",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Lock All",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Count All",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "List All By Type",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Make All Visible",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Visible/Invisible Count",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Dynamic Count",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "List All Named Entities",
            isCheckable: false
        });


        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Delete All With HTTP",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Delete All Without Name",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: " Delete All With Undefined in Script Path",
            isCheckable: false
        });

        Menu.addMenuItem({
            menuName: "Entities",
            menuItemName: "Import Cell Science",
            isCheckable: false
        });

    } else {
        //Window.alert("Menu Foo already exists!");
    }


}

function scriptEnding() {
    print("SCRIPT ENDNG!!!\n");

    Menu.removeMenu("Entities");

}

function menuItemEvent(menuItem) {
    print("menuItemEvent() in JS... menuItem=" + menuItem);
    if (menuItem === "Delete All") {
        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            Entities.deleteEntity(r);
        })
    }
    if (menuItem === "Unlock All") {

        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            Entities.editEntity(r, {
                locked: false
            });
        })
    }
    if (menuItem === "Lock All") {

        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            Entities.editEntity(r, {
                locked: true
            });
        })
    }

    if (menuItem === "Count All") {

        var res = Entities.findEntities(MyAvatar.position, 100000)
        Window.alert('Entity Count: ' + res.length)
    }

    if (menuItem === "List All By Type") {
        var res = Entities.findEntities(MyAvatar.position, 100000)

        var entities = [];

        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            entities.push(props);
        })
        var types = _.countBy(entities, 'type');
        Window.alert('types are:' + JSON.stringify(types))

    }

    if (menuItem === "Visible/Invisible Count") {
        var res = Entities.findEntities(MyAvatar.position, 100000)

        var entities = [];

        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            entities.push(props);
        })
        var types = _.countBy(entities, 'visible');
        Window.alert('visibility is:' + JSON.stringify(types))

    }

    if (menuItem === "Dynamic Count") {
        var res = Entities.findEntities(MyAvatar.position, 100000)

        var entities = [];

        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            entities.push(props);
        })
        var types = _.countBy(entities, 'dynamic');
        Window.alert('dynamic count is:' + JSON.stringify(types))

    }

    if (menuItem === "Make All Visible") {
        var res = Entities.findEntities(MyAvatar.position, 100000)

        res.forEach(function(r) {
            Entities.editEntity(r, {
                visible: true
            })
        });


    }

    if (menuItem === "Delete All With HTTP") {
        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            Object.keys(props).forEach(function(key, index) {
                if (typeof props[key] === 'string') {
                    if (props[key].indexOf('http') > -1) {
                        print('KEY HAS HTTP VALUE' + props.id)
                        Entities.deleteEntity(r);
                        return
                    }
                }

            });


        });

    }


    if (menuItem === "Delete All Without Name") {
        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            if (props.name === "" || props.name===undefined) {
                print('delete an entity because its name is empty' + props.id)
                Entities.deleteEntity(r);
            }
        });

    }

        if (menuItem === "Delete All With Undefined in Script Path") {
        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            if (props.script.indexOf('undefined')>-1) {
                print('delete an entity because script is undefined' + props.id)
                Entities.deleteEntity(r);
            }
        });

    }


    if (menuItem === "List All Named Entities") {
        var res = Entities.findEntities(MyAvatar.position, 100000)
        res.forEach(function(r) {
            var props = Entities.getEntityProperties(r);
            print('NAME IS: ' + props.name);
            print('ID IS: ' + props.id)
        });

    }

    if (menuItem === "Import Cell Science") {
        var url = 'http://hifi-production.s3.amazonaws.com/DomainContent/CellScience/importNow.js?' + Date.now();

        Script.load(url);
        print('url' + url)
    }



}

setupMenus();

// register our scriptEnding callback
Script.scriptEnding.connect(scriptEnding);

Menu.menuItemEvent.connect(menuItemEvent);
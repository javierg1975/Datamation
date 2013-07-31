/*

Stalker Market Tree Module

-Dependencies:

    AngularUI: include 'ui' module.
    See: http://angular-ui.github.io/


-About AngularUI:

    Using 'jQuery Passthrough' to initialize the JQuery plugin

    EX1:

     <a title="Easiest. Binding. Ever!" ui-jq="tooltip">Hover over me for static Tooltip</a>

     <script>
         myModule.value('ui.config', {
         // The ui-jq directive namespace
             jq: {
             // The Tooltip namespace
                 tooltip: {
                     // Tooltip options. This object will be used as the defaults
                     placement: 'right'
                 }
             }
         });
     </script>

     EX2:
     As part of the whole app

     stalker.value('ui.config', {
         // The ui-jq directive namespace
         jq: {
             accordion: { //Plugin namespace
                 collapsible: true, //Plugin options
                 active: false,
                 autoHeight: false
             }
         }
     });
*/

(function(window, angular, undefined) {
    'use strict';

    angular.module('stalker.marketTree', ['ui']).
        value('ui.config', {
            jq: {
                accordion: {
                    collapsible: true,
                    active: false,
                    autoHeight: false
                }
            }
        }).
        factory('$marketTree', function ($http, $auth) {

            var marketsTree = { children:[] };

            function setMarketHierarchy(data){
                var i, hierarchy, businessPos, territoryPos, regionPos;
                hierarchy = data.marketHierarchy;
                for( i=0; i < hierarchy.length; i++ ){
                    businessPos = setBusinessInHierarchy(hierarchy[i].businessName, hierarchy[i].businessUnitId);
                    if(hierarchy[i].territoryName !==  undefined){
                        territoryPos = setTerritoryInHierarchy(hierarchy[i].territoryName, hierarchy[i].kbsTerritoryId, businessPos);
                        if(hierarchy[i].regionName !==  undefined){
                            regionPos = setRegionInHierarchy(hierarchy[i].regionName, hierarchy[i].kbsRegionId, businessPos, territoryPos);
                            marketsTree.children[businessPos].children[territoryPos].children[regionPos].children.push( {"data": hierarchy[i].marketName, "attr":{"id": hierarchy[i].kbsMarketId, "class": "market"}} );
                        }
                        else
                            marketsTree.children[businessPos].children[territoryPos].children.push( {"data": hierarchy[i].marketName, "attr":{"id": hierarchy[i].kbsMarketId, "class": "market"}} );
                    }
                }

                sortMarketTree();

                return marketsTree.children;
            }

            function sortMarketTree(){
                if(marketsTree.hasOwnProperty('children')){
                    if(marketsTree.children.length){
                        marketsTree.children = sortNodes(marketsTree.children);//SBU
                        for(var a = 0; a < marketsTree.children.length; a++){
                            if(marketsTree.children[a].hasOwnProperty('children'))
                                if(marketsTree.children[a].children.length){
                                    marketsTree.children[a].children = sortNodes(marketsTree.children[a].children);//territory
                                    for(var b = 0; b < marketsTree.children[a].children.length; b++){
                                        if(marketsTree.children[a].children[b].hasOwnProperty('children'))
                                            if(marketsTree.children[a].children[b].children.length){
                                                marketsTree.children[a].children[b].children = sortNodes(marketsTree.children[a].children[b].children);//region
                                                for(var c = 0; c < marketsTree.children[a].children[b].children.length; c++){
                                                    if(marketsTree.children[a].children[b].children[c].hasOwnProperty('children'))
                                                        if(marketsTree.children[a].children[b].children[c].children.length)
                                                            marketsTree.children[a].children[b].children[c].children = sortNodes(marketsTree.children[a].children[b].children[c].children)
                                                }
                                            }
                                    }
                                }
                        }
                    }
                }
            }

            function sortNodes(children) {
                return children.sort(function(a, b){
                    var compA = a.data.toUpperCase();
                    var compB = b.data.toUpperCase();
                    return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
                });
            }

            function setBusinessInHierarchy(name, id){
                var position;
                position = isPropertyPresent(name, marketsTree.children);
                if(position === -1){
                    if(!marketsTree.hasOwnProperty('children'))
                        marketsTree.children = [];
                    marketsTree.children.push( {"data": name, "attr": {"id": id, "class" : "sbu"}, "state": "closed", "children": []} );
                    position = marketsTree.children.length - 1;
                }
                return position;
            }

            function setTerritoryInHierarchy(name, id, businessPosition){
                var position;
                position = isPropertyPresent(name, marketsTree.children[businessPosition].children);
                if(position === -1){
                    if(!marketsTree.children[businessPosition].hasOwnProperty('children'))
                        marketsTree.children[businessPosition].children = [];
                    marketsTree.children[businessPosition].children.push( {"data": name, "attr": {"id": id, "class" : "territory"}, "state": "closed", "children": []} );
                    position = marketsTree.children[businessPosition].children.length - 1;
                }
                return position;
            }

            function setRegionInHierarchy(name, id, businessPosition, territoryPosition) {
                var position;
                position = isPropertyPresent(name, marketsTree.children[businessPosition].children[territoryPosition].children);
                if(position === -1){
                    if(!marketsTree.children[businessPosition].children[territoryPosition].hasOwnProperty('children'))
                        marketsTree.children[businessPosition].children[territoryPosition].children = [];
                    marketsTree.children[businessPosition].children[territoryPosition].children.push( {"data": name, "attr": {"id": id, "class" : "region"}, "state": "closed", "children": []} );
                    position = marketsTree.children[businessPosition].children[territoryPosition].children.length - 1;
                }
                return position;
            }

            function isPropertyPresent(name, array){
                var i, current;
                if(typeof array !== 'undefined') {
                    for( i = 0; i < array.length; i++ ) {
                        current = array[i];
                        if( current.data === name )
                            return i;
                    }
                }
                return -1;
            }

            function validateSBUSelection(data,treeObject){ //Only 1 SBU can be selected
                var obj = $(data.rslt.obj);
                var id = obj.attr('id');
                var is_closed = obj.hasClass("jstree-closed");
                var container = treeObject.jstree("get_container_ul");
                var sbu_selected = container.find(">li.jstree-checked").add(container.find(">li.jstree-undetermined"));
                $.each(sbu_selected, function(){
                    if($(this).attr('id') !== id)
                        if(!$(this).find("#" + id).length)
                            treeObject.jstree('uncheck_node', $("#" + $(this).attr('id')))
                });
                var current = $('#' + id);
                treeObject.jstree('open_all', current, false); // do_animation : false
                if(is_closed)
                    treeObject.jstree('close_node', current, true); //skip_animation : true
            }

            function render(centerId){
                var treeObject = $(centerId);

                $http({
                    method: 'GET',
                    url: 'api/markets',
                    data: '',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : $auth.authorization(),
                        "Roles" : $auth.roles()
                    }
                }).success(function(markets) {
                    if(typeof(markets) === 'string')
                        markets = jQuery.parseJSON(markets);

                    treeObject.jstree({
                        "core" : {
                            "animation" : 0
                        },
                        "json_data" : {
                            "data" : setMarketHierarchy(markets),
                            "progressive_render" : true
                        },
                        "themes" : {
                            "theme" : "default",
                            "icons" : false,
                            "url" : "css/screen.css"
                        },
                        "plugins" : [ "themes", "json_data", "checkbox" ]
                    }).bind("check_node.jstree", function (e, data) {
                        return validateSBUSelection(data,treeObject);
                    });

                    $('.treeMsg').hide();

                }).error(function(data, status) {
                    $('.treeMsg').hide();
                    console.log("Code: " + status + ". Message: " + data);
                });
            }

            function reload(centerId){
                var treeObject = $(centerId);
                $('.treeMsg').hide();

                treeObject.jstree({
                    "core" : {
                        "animation" : 0
                    },
                    "json_data" : {
                        "data" : marketsTree.children,
                        "progressive_render" : true
                    },
                    "themes" : {
                        "theme" : "default",
                        "icons" : false,
                        "url" : "css/screen.css"
                    },
                    "plugins" : [ "themes", "json_data", "checkbox" ]
                }).bind("check_node.jstree", function (e, data) {
                        return validateSBUSelection(data,treeObject);
                    });
            }

            function selectMarkets(treeObject, marketsArray){ //Selects the nodes that are in the marketArray
                var nodeName = "";
                var arrayLength = marketsArray.length;

                for ( var i=0; i<arrayLength; i++ ) {
                    // open the nodes
                    nodeName = "#" + marketsArray[i];
                    var node =  treeObject.find(nodeName);
                    var nodeExists = node.length;

                    if ( nodeExists ) {
                        $(node).removeClass('jstree-unchecked').addClass('jstree-checked');
                    }
                }
            }

            function reloadFacultyMarkets(centerId,marketsArray){
                var treeObject = $(centerId);

                treeObject.bind("loaded.jstree", function (event, data) {
                    return selectMarkets($(this),marketsArray);
                });
                treeObject.jstree({
                    "core" : {
                        "animation" : 0
                    },
                    "json_data" : {
                        "data" : marketsTree.children,
                        "progressive_render" : false  //false: need to open the whole tree in order to find the nodes
                    },
                    "themes" : {
                        "theme" : "default",
                        "icons" : false,
                        "url" : "css/screen.css"
                    },
                    "plugins" : [ "themes", "json_data", "checkbox" ]
                });
                $('.treeMsg').hide();
            }

            function renderFacultyMarkets(centerId,marketsArray){
                var treeObject = $(centerId);

                $http({
                    method: 'GET',
                    url: 'api/markets',
                    data: '',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : $auth.authorization(),
                        "Roles" : $auth.roles()
                    }
                }).success(function(markets) {
                    if(typeof(markets) === 'string')
                        markets = jQuery.parseJSON(markets);

                    treeObject.bind("loaded.jstree", function (event, data) {
                        return selectMarkets($(this),marketsArray);
                    });
                    treeObject.jstree({
                        "core" : {
                            "animation" : 0
                        },
                        "json_data" : {
                            "data" : setMarketHierarchy(markets),
                            "progressive_render" : false //false: need to open the whole tree in order to find the nodes
                        },
                        "themes" : {
                            "theme" : "default",
                            "icons" : false,
                            "url" : "css/screen.css"
                        },
                        "plugins" : [ "themes", "json_data", "checkbox" ]
                    });

                    $('.treeMsg').hide();

                }).error(function(data, status) {
                    $('.treeMsg').hide();
                    console.log("Code: " + status + ". Message: " + data);
                });
            }

            function marketName(element){
                var name;
                if(element.length){
                    var elementText = element.find('a').html();
                    name = elementText.substring(elementText.lastIndexOf('>') + 1);
                }
                return name;
            }

            function selectedMarkets(centerId){ //toDo: test: there are markets with no region  Grad->Group Deals->etc
                var selected = new Array();

                $(centerId).find('li.jstree-checked').each(function(i, e){
                    var element = $(e);
                    var name = marketName(element);
                    var sbu = "", territory = "", region = "";

                    if(element.hasClass("market")){
                        region = marketName( element.parents('li.region') );
                        territory = marketName( element.parents('li.territory') );
                        sbu = marketName( element.parents('li.sbu') );

                        var market = {
                            kbsMarketId: parseInt( element.attr('id') ),
                            marketName: name,
                            businessName : sbu,
                            territoryName : territory,
                            regionName : region
                        };
                        selected.push(market);
                    }
                });
                //console.log(selected);
                return selected;
            }

            return {
                reload : function(centerId){
                    return reload(centerId);
                },
                render : function(centerId){
                    return render(centerId);
                },
                getSelectedMarkets : function(centerId){
                    return selectedMarkets(centerId);
                },
                reloadFacultyMarkets : function(centerId,marketsArray){
                    return reloadFacultyMarkets(centerId,marketsArray);
                },
                renderFacultyMarkets : function(centerId,marketsArray){
                    return renderFacultyMarkets(centerId,marketsArray);
                },
                resetMarketTree : function(marketId,centerId){
                    var treeObject = $(centerId);
                    treeObject.jstree("uncheck_all");
                    treeObject.jstree("close_all");
                    $(marketId).accordion("activate", false);
                },
                closeMarketTree : function(marketId){
                    var market = angular.isDefined(marketId) ? marketId : '.marketpicker';
                    $(market).accordion("activate", false);
                },
                closeCenter : function(centerId){
                    var center = angular.isDefined(centerId) ? centerId : '.centertree';
                    $(center).jstree("close_all");
                },
                isLoaded : function(centerId){
                    return $(centerId + ' li').first().length;
                },
                areMarketsLoaded : function(){
                    return angular.isDefined(marketsTree.children[0]);

                }
            }
        });
})(window, window.angular);

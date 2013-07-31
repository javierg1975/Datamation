/*
Search Controller:

-$auth: Custom 'module'
    see: modules/authentication.js

-$marketTree: Custom 'module' for the Market Tree Plugin functionality
    see: modules/marketTree.js

*/

function SearchCtrl($scope,$location,$http,$auth,$common,$marketTree,shared){ //$auth : see authentication.js | shared : see services->services.js
    if(!$auth.isUserLoggedIn()) $location.path("/login");
    if($auth.isAdminUser()) $scope.user = { isAdmin : true };

    $scope.isInvalid = false;
    $scope.facultyList = [];
    $scope.currentFaculty = "";

    $scope.renderMarketsTree = function(id){
        shared.renderMarketsTree(id, $marketTree);
    };

    $scope.openFaculty = function(kbsTeacherId, marketsHierarchy){   //THE function XD! Do not touch or move or try to refactor in any way >.>
        $scope.currentFaculty = kbsTeacherId;
        var buildHTML = "";
        $scope.marketsHTML = '<h1>No Results</h1>'; //default message

        if(marketsHierarchy.length){
            var length = marketsHierarchy.length;

            //--Get SBUs
            var SBUs = [];
            for(var n = 0; n < length; n++){
                SBUs.push(marketsHierarchy[n][0][0])
            }
            var uniqueSBUs = [];
            $.each(SBUs, function(i, e){
                if($.inArray(e, uniqueSBUs) === -1) uniqueSBUs.push(e);
            });
            var columnSize = 12 / uniqueSBUs.length;
            uniqueSBUs.sort(); //sort by name
            //--End

            for(var h = 0; h <uniqueSBUs.length; h++){
                var sbu = uniqueSBUs[h];
                buildHTML += '<div class="large-' + columnSize +  ' columns">';
                buildHTML += '<h1>' + sbu.toUpperCase() + '</h1>'; //SBU title

                //--Get Territories
                var territories = [];
                for(var m = 0; m < length; m++){
                    if(sbu === marketsHierarchy[m][0][0]){ //get the territories for the current SBU
                        territories.push(marketsHierarchy[m][0][1]);
                    }
                }
                var uniqueTerritories = [];
                $.each(territories, function(i, e){
                    if($.inArray(e, uniqueTerritories) === -1) uniqueTerritories.push(e);
                });
                uniqueTerritories.sort(); //sort by name
                //--End

                for(var l = 0; l <uniqueTerritories.length; l++){
                    var territory = uniqueTerritories[l];
                    buildHTML += '<h2>' + territory + '</h2>'; //Territory title

                    //--Get Regions
                    var regions = [];
                    for(var t = 0; t < length; t++){
                        if(sbu === marketsHierarchy[t][0][0] && territory === marketsHierarchy[t][0][1]){ //get the territories for the current SBU
                            regions.push(marketsHierarchy[t][0][2]);
                        }
                    }
                    var uniqueRegions = [];
                    $.each(regions, function(i, e){
                        if($.inArray(e, uniqueRegions) === -1) uniqueRegions.push(e);
                    });
                    uniqueRegions.sort(); //sort by name
                    //--End

                    for(var r = 0; r <uniqueRegions.length; r++){
                        var region = uniqueRegions[r];
                        for(var i = 0; i < length; i++){
                            if(sbu === marketsHierarchy[i][0][0] && territory === marketsHierarchy[i][0][1] && region === marketsHierarchy[i][0][2]){
                                var hierarchy  = marketsHierarchy[i][0];
                                var markets =  marketsHierarchy[i][1];
                                var marketsLength = markets.length;
                                markets.sort($common.sortJsonByProp("marketName")); //sort markets by name

                                if(hierarchy[2])
                                    buildHTML += '<h3>' + hierarchy[2] + '</h3>'; //Region title

                                //--Get Markets
                                buildHTML += '<p>';
                                for(var k = 0; k < marketsLength; k++)
                                    buildHTML += markets[k].marketName + '</br>';
                                buildHTML += '</p>';
                                //--End
                            }
                        }
                    }

                }
                buildHTML += '</div>';
            }

            $scope.marketsHTML = buildHTML;
        }
    };

    $scope.loadFacultyList = function(){
        shared.facultySearch($scope, $auth, $common, $http, $marketTree);
    };

    $scope.resetFacultyList = function() {
        shared.resetFacultySearch($scope, $marketTree);
    };

    //Works only in FF
    $scope.mailTo = function(email){
        return $common.mailTo(email);
    };

    //Checks if is a mobile device to validate the callto (desktop) or tel: (mobile) tags
    $scope.isMobile = $common.isMobile() ? true : false;
}
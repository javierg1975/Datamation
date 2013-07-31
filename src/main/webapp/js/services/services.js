/*

Stalker Services:

-Ref:
 http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
 http://stackoverflow.com/questions/15666048/angular-js-service-vs-provide-vs-factory
 https://groups.google.com/forum/#!msg/angular/56sdORWEoqg/HuZsOsMvKv4J
-Examples:
 http://slides.wesalvaro.com/20121113/#/2/3
 http://plnkr.co/edit/r3K3Qs?p=preview
 http://jsbin.com/ohamub/123/edit

*/
stalker.service('shared', function() { //For the Admin, Search and Profile Controllers Shared Functionality

    //Shared between Admin and Search Controllers
    this.facultySearch = function(scope, $auth, $common, $http, $marketTree) { //scope : controller $scope value
        scope.errorMsg = "";
        scope.errorInSearchMsg = "";
        scope.isInvalid = false;
        scope.currentFaculty = "";
        $marketTree.closeMarketTree('.mp_main');
        scope.facultyList = [];
        scope.searchReady = false; //hides table with results
        var url = "", searchType = "";

        //Validates search type
        var selectedOp = scope.search_select;
        if(selectedOp == "Market"){
            searchType = "market";
            var selectedMarkets = $marketTree.getSelectedMarkets('.ct_main');
            if(scope.search_frm.$pristine || !selectedMarkets.length){
                scope.isInvalid = true;
                scope.errorMsg = "Please select a market.";
                return false;
            }else{
                var marketsIds = [];
                $.each(selectedMarkets, function(i, e){ marketsIds.push(e.kbsMarketId) });
                url = 'api/marketSearch?ids=' + encodeURIComponent(marketsIds.join());
            }
        }else if(selectedOp == "Name or ID"){
            if(scope.search_frm.$pristine || !angular.isDefined(scope.name_txt) || !scope.name_txt.trim().length){
                scope.isInvalid = true;
                scope.errorMsg = "Please type the name or ID.";
                return false;
            }else{
                var nameOrID = scope.name_txt.trim();
                if(isNaN(nameOrID)){
                    nameOrID = $common.removeSpecialChars(nameOrID);
                    scope.name_txt = nameOrID;
                    if(nameOrID.length < 3) return false;
                    searchType = "name";
                    url = 'api/teacher?name=' + encodeURIComponent(nameOrID);
                }else{
                    searchType = "id";
                    url = 'api/teacher/' + parseInt(nameOrID);
                }
            }
        }else if(selectedOp == "SBU + Postal Code"){
            searchType = "postal";
            if(scope.search_frm.$pristine || !angular.isDefined(scope.zip_txt) || !scope.zip_txt.trim().length ||
                !angular.isDefined(scope.sbu_select) || !scope.sbu_select.length)
            {
                scope.isInvalid = true;
                scope.errorMsg = "Please select the SBU and type the postal code.";
                return false;
            }else{
                var code = scope.zip_txt.trim();
                code = $common.removeSpecialChars(code);
                scope.zip_txt = code;
                if(!code.length) return false;
                var sbu = encodeURIComponent(scope.sbu_select.trim());
                url = 'api/postalCodeSearch?code=' + encodeURIComponent(code) + "&sbu=" + sbu;
            }
        }

        $common.showSpinner();

        //Search query
        $http({
            method: 'GET',
            url: url,
            data: '',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : $auth.authorization(),
                "Roles" : $auth.roles()
            }
        }).success(function(data) {
                $common.hideSpinner();

                if(searchType != "id"){
                    data = data.teacher;
                    if(!data.length){
                        scope.errorInSearchMsg = "No results.";
                        return false;
                    }
                }else{ //search by id
                    if(!data.teacher.kbsTeacherId){
                        scope.errorInSearchMsg = "No results.";
                        return false;
                    }
                }

                scope.facultyList = data;

            }).error(function(data, status) {
                if(status == 414) //Request-URI Too Long
                    scope.errorInSearchMsg = "Too many markets selected. Please narrow the market selection";
                else
                    scope.errorInSearchMsg = data; //"There was an unexpected error. Please try again.";
                console.log("Code: " + status + ". Message: " + data);
                $common.hideSpinner();
            });
        //End query

        scope.searchReady = true;
    };

    this.resetFacultySearch = function(scope, $marketTree){
        $marketTree.resetMarketTree('.mp_main','.ct_main');
        scope.errorMsg = "";
        scope.facultyList = [];
        scope.currentFaculty = "";
        scope.searchReady = false; //hides table with results
        scope.name_txt = "";
        scope.zip_txt = "";
        scope.sbu_select = "";
    };

    this.renderMarketsTree = function(id, $marketTree){
        if($marketTree.isLoaded(".ct_" + id)) return false;

        if($marketTree.areMarketsLoaded())
            return $marketTree.reload(".ct_" + id);
        else
            return $marketTree.render(".ct_" + id);
    };

    //Shared between Admin and Profile Controllers
    this.saveFaculty = function(kbsTeacherId, $auth, $http, $marketTree){ //--toDo: Add another spinner ?
        //$common.showSpinner();
        var role = $("#select_" + kbsTeacherId + " option:selected").text();
        var marketsHierarchy = $marketTree.getSelectedMarkets('.ct_' + kbsTeacherId);
        var marketsIds = [];
        $.each(marketsHierarchy, function(i, e){ marketsIds.push(e.kbsMarketId) });

        var facultyMarketObject = {
            'kbsTeacherId': kbsTeacherId,
            'role': role,
            'marketsIds' : marketsIds,
            'marketsHierarchy' : marketsHierarchy
        };

        //Save data query
        $http({
            method: 'POST',
            url: 'api/save/' + parseInt(kbsTeacherId),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : $auth.authorization(),
                "Roles" : $auth.roles()
            },
            data : facultyMarketObject
        }).
            success(function(data) {
                $marketTree.closeMarketTree('.mp_' + kbsTeacherId);
                $("#roleBox_" + kbsTeacherId).text(role);
                alert("Data saved successfully");
                //$common.hideSpinner();
            }).
            error(function(data, status) {
                console.log("Code: " + status + ". Message: " + data);
                //$common.hideSpinner();
            });
        //End query
    };

    this.loadFacultyMarkets = function(kbsTeacherId, marketIds, $marketTree){
        if($marketTree.isLoaded('.ct_' + kbsTeacherId)) return false;

        var ids = marketIds ? marketIds : [];

        if($marketTree.areMarketsLoaded()){
            $marketTree.reloadFacultyMarkets(".ct_" + kbsTeacherId, ids);}
        else
            $marketTree.renderFacultyMarkets(".ct_" + kbsTeacherId, ids);

        return false;
    };

});


function ProfileCtrl($scope,$location,$http,$auth,$common,$marketTree, shared){ //$auth : see authentication.js | shared : see services->services.js
    if(!$auth.isUserLoggedIn()) $location.path("/login");
    if($auth.isAdminUser()) $scope.user = { isAdmin : true };

    $common.showSpinner();
    $scope.facultyList = [];
    $scope.roleList = [];
    $scope.open = false;


    //Roles Query
    //toDo: Async promise instead?. Move to a common file or service, then, wait for the response
    $http({
        method: 'GET',
        url: 'api/roles',
        data: '',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : $auth.authorization(),
            "Roles" : $auth.roles()
        }
    }).success(function(data) {
        var roles = data.roles;
        if(typeof(roles) === 'string')
            roles = jQuery.parseJSON(roles);
        //roles.sort($common.sortJsonByProp("role")); -> now sorting in the back-end
        $scope.roleList = roles;
    }).error(function(data, status) {
        console.log("Code: " + status + ". Message: " + data);
    });
    //End Roles query


    var userId = parseInt($auth.getMyId());
    var url = 'api/user/' + parseInt(userId);

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
            //search by userId
            data = data.teacher;
            if(!data.length){
                $scope.errorInSearchMsg = "No results.";
                return false;
            }
            $scope.facultyList = data;

            $common.hideSpinner();
            $scope.searchReady = true;

        }).error(function(data, status) {
            $scope.errorInSearchMsg = data; //"There was an unexpected error. Please try again.";
            console.log("Code: " + status + ". Message: " + data);
            $common.hideSpinner();
        });
    //End query

    $scope.openFaculty = function(kbsTeacherId, marketIds){
        $scope.open = true;
        $scope.loadFacultyMarkets(kbsTeacherId, marketIds); //Renders market tree: If not, and then click 'Save' (without opening the market tree), the previous selected markets get lost.
        var role = $("#roleBox_" + kbsTeacherId).text().trim();
        $('#select_' + kbsTeacherId + ' option[value="' + role + '"]').attr("selected", "selected"); //select by default the teacher's current role
    };

    $scope.loadFacultyMarkets = function(kbsTeacherId, marketIds){
        shared.loadFacultyMarkets(kbsTeacherId, marketIds, $marketTree);
    };

    $scope.saveFaculty = function(kbsTeacherId){
        shared.saveFaculty(kbsTeacherId, $auth, $http, $marketTree);
    };

}
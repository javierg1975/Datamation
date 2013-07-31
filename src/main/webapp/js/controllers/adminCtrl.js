
function AdminCtrl($scope,$location,$http,$auth,$common,$marketTree, shared){ //$auth : see authentication.js | shared : see services->services.js
    if(!$auth.isUserLoggedIn()) $location.path("/login");
    if($auth.isAdminUser())
        $scope.user = { isAdmin : true };
    else
        $location.path("/login");

    $scope.isInvalid = false;
    $scope.facultyList = [];
    $scope.roleList = [];
    $scope.currentFaculty = "";

    $scope.renderMarketsTree = function(id){
        shared.renderMarketsTree(id, $marketTree);
    };

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

    $scope.openFaculty = function(kbsTeacherId, marketIds){
        $scope.currentFaculty = kbsTeacherId;
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

function LoginCtrl($scope,$location,$http,$auth) {  //$auth : see authentication.js
    $scope.isInvalid = false;
    $scope.errorMsg = "All fields required."; //default message

    $scope.login = function() {
        if($scope.login_frm.$pristine || (!$scope.user_txt.length || !$scope.pass_txt.length)){ // Just 4 Safari >.<
            $scope.isInvalid = true;
            return false;
        }
        else{
            $scope.isInvalid = false;
            var user = $scope.user_txt;
            var pass = $scope.pass_txt;

            $http({
                method: 'POST',
                url: 'auth/login',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data : "user=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(pass)
                }).
                success(function(data) {
                    data = decodeURIComponent(data);
                    console.log("Cookie Data: " + data);
                    $auth.createCookie(data);
                    $location.path("/search");
                }).
                error(function(data, status) {
                    $scope.isInvalid = true;
                    $scope.errorMsg = data;//"Wrong Credentials";
                    console.log("Code: " + status + ". Message: " + data);
                });
        }
    };
}
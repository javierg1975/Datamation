
function LogoutCtrl($location,$auth) {  //$auth : see authentication.js
    $auth.removeCookie();
    $location.path("/login");
}
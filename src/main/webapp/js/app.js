
//Dependencies are included here. To include AngularUI everywhere, add the 'ui' module.
var stalker = angular.module('stalker', ['stalker.auth', 'stalker.common', 'stalker.marketTree'], function ($compileProvider){
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|callto):/);  //Important: Removes the 'unsafe' prefix added in front of the mailto,callto, etc tags.
    }).config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/logout', {templateUrl: 'partials/login.html', controller: 'LogoutCtrl'});
        $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'ProfileCtrl'});
        $routeProvider.when('/search', {templateUrl: 'partials/search.html', controller: 'SearchCtrl'});
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
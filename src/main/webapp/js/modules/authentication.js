/*
 Stalker Authentication Functionality

 --Functions:

 - To make a function available all over the app, one can use a 'factory' or by adding the function to the $rootScope.

 - In order to make this functions available to a Controller, you need to pass the name of the factory '$auth',
 as a parameter, and then call the function.
 - Also, the module 'stalker.auth', most be included in the app config file: app.js

 Ex:
 function myCtrl($auth){
     ...
     $auth.isUserLoggedIn();
     ...
 }
 */

(function(window, angular, undefined) {
    'use strict';

    angular.module('stalker.auth', ['ngCookies']).
        factory('$auth', function ($cookies) {

            var cookie;

            function createCookie(cookieValue){
                $cookies.pf_session = cookieValue; //creates the cookie with the given name and value
                cookie = $cookies['pf_session'];
            }

            function isUserLoggedIn(){
                cookie = $cookies['pf_session']; //just to update the cookie value in case of: refresh or reopen the page
                return angular.isDefined(cookie) ? true : false;
            }

            function isAdminUser(){
               // var cookie = $cookies['pf_session'];
                var flag = false;
                if(angular.isDefined(cookie)){
                    var roles = cookie.substring(cookie.indexOf(':') + 1, cookie.lastIndexOf(':'));
                    var rolesArray =  roles.split(',');
                    for(var i=0; i<rolesArray.length; i++)
                        if (rolesArray[i] == "ROLE_Manage Staff") //toDo: check role
                            flag = true;
                }
                return flag;
            }

            return {
                createCookie : function(cookieValue){
                    return createCookie(cookieValue);
                },
                removeCookie : function(){
                    delete $cookies.pf_session;
                },
                isUserLoggedIn : function(){
                    return isUserLoggedIn();
                },
                isAdminUser : function(){
                    return isAdminUser();
                },
                getMyId : function(){
                    return cookie.substring(cookie.lastIndexOf(":") + 1);
                },
                authorization : function(){ //used for ajax header
                    return cookie.split(":")[0];
                },
                roles : function(){ //used for ajax header
                    return cookie.split(":")[1];
                },
                rolesArray : function(){
                    var roles = cookie.substring(cookie.indexOf(':') + 1, cookie.lastIndexOf(':'));
                    return roles.split(',');
                }
            }
        });
})(window, window.angular);
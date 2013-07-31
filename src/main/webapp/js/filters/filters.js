
/*
Stalker Filters:

-Generic functions to be used in the "views"(html files), to format or change a given value

    Ex:
    <td>{{faculty.phone1 | formatPhone}}</td>

 */

stalker.filter('formatPhone', function(){
    return function(phone){
        if (phone == undefined || phone.length == 0) return "";
        if(isNaN(phone)){
            phone = phone.replace(/-/g, '');
        }
        if (phone.length < 10) return phone;
        phone = phone.toString();
        var formattedPhone = "(" + phone.substr( 0, 3 ) + ") " +
            phone.substr( 3, 6 ) + "-" + phone.substr( 6 );
        return formattedPhone;
    }
});

stalker.filter('callToFormat', function(){
    return function(phone){
        if (phone == undefined || phone.length == 0) return "";
        if(isNaN(phone)){
            phone = phone.replace(/-/g, '');
        }
        if (phone.length < 10) return phone;
        return "+1" + phone.toString();
    }
});

stalker.filter('defaultRole', function(){
    return function(role){
        if (role == undefined || role.length == 0) return "M.I.A.";
        else return role;
    }
});
/*

Stalker Directives:

See: http://docs.angularjs.org/guide/directive

    restrict - String of subset of EACM which restricts the directive to a specific directive declaration style. If omitted directives are allowed on attributes only.

    E - Element name: <my-directive></my-directive>
    A - Attribute: <div my-directive="exp"> </div>
    C - Class: <div class="my-directive: exp;"></div>
    M - Comment: <!-- directive: my-directive exp -->

*/
/*
stalker.directive("marketstree", function(){ //directive name most be lower case?
    return{
        restrict: "E" ,
        template: "<h3 style='cursor:pointer;'><Markets</h3>" +
                  "<div class='centertree' style='z-index:2;'>" +
                    "<div class='treeMsg'>Loading markets ...</div>" +
                  "</div>",
        link: function(element){
            alert("marketstree element: " + element);
            //element.accordion({ collapsible: true, active: false, autoHeight: false });
        }
    }

});
*/
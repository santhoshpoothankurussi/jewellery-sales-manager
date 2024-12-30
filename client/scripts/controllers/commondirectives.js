angular.module('robs',[])
    .directive('tabNext',['$scope','$element','utilities', function ($scope,$element,utilities) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                elem.bind('keyup', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13) {
                        e.preventDefault();
                        var eIDX = -1;
                        for (var i = 0; i < this.form.elements.length; i++) {
                            if (elem.eq(this.form.elements[i])) {
                                eIDX = i;
                                break;
                            }
                        }
                        if (eIDX === -1) {
                            return;
                        }
                        var j = eIDX + 1;
                        var theform = this.form;
                        while (j !== eIDX) {
                            if (j >= theform.elements.length){
                                j = 0;
                            }
                            if ((theform.elements[j].type !== "hidden") && (theform.elements[j].type !== "file")
                                && (theform.elements[j].name !== theform.elements[eIDX].name)
                                && (! theform.elements[j].disabled)
                                && (theform.elements[j].tabIndex >= 0)) {
                                if (theform.elements[j].type === "select-one") {
                                    theform.elements[j].focus();
                                } else if (theform.elements[j].type === "button") {
                                    theform.elements[j].focus();
                                } else {
                                    theform.elements[j].focus();
                                    theform.elements[j].select();
                                }
                                return;
                                break;
                            }
                            j++;
                        }
                    }
                });
            }
        }
}])

    .directive('nextOnEnter', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                console.log("inside link function");
                element.bind('keydown', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13) {
                        e.preventDefault();
                        var pageElems = document.querySelectorAll('input, select, textarea'),
                            element = e.srcElement
                        focusNext = false,
                            len = pageElems.length;
                        for (var i = 0; i < len; i++) {
                            var pe = pageElems[i];
                            if (focusNext) {
                                if (pe.style.display !== 'none') {
                                    pe.focus();
                                    break;
                                }
                            } else if (pe === e.srcElement) {
                                focusNext = true;
                            }
                        }
                    }
                });
            }
        }
    })

    .directive('ngxOnshow', function() {
        return {
            restrict: 'A',
            scope: {
                ngxOnshow: '&'
            },
            link: function(scope, element, attrs){
                console.log("hello world")
            }
        };
    });
// <copyright file="appvariables.js" company="Cronyco">
// Copyright (c) 2014 All Right Reserved, http://www.cronyco.in/
//
// This source is subject to the Cronyco Permissive License.
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// All other rights reserved.
//
// </copyright>
//
// <author>Santhosh Poothankurussi</author>
// <email>santhosh@cronyco.in</email>
// <date>2016-04-12</date>
// <summary>Contains application level variables that can be used inside controllers and services</summary>
angular.module('commonfunction',['ng'])
    .factory('appvariables',function(){
        return{
            appvars:{
                company:null,
                basepuritypercentage:null,
                wholesalerate:null,
                retailrate:null,
                rateupdateddatetime:null,
                username:null,
                loggedinuser:null,
                displaystore:null,
                godownstore:null,
                storeitem:null,
                searchdatefrom:null,
                searchdateto:null,

                listusertypes:null,
                listwholesalecustomer:null,
                listretailcustomer:null,
                listgoldsmithcustomer:null,
                listvalueaddition:null,
                listcategory:null,
                liststore:null,
                listpackage:null,
                listsubmenu:null,
                listcustomer:null,

                currentstock:null,
                transactionsummary:null,
                transactiondetails:null,
                transactiondetailshistory:null,
                transactiondata:null,

                packagecode:[{"puregold":"G1000","gold995":"G9950","oldgold":"G0001","ornamentgold":"G995*","cash":"C1000","bill":"B1000"}],
                productcode:[{"gold":"PW995","makingcharge":"PA202","makingexpense":"PW102","valueaddition":"PW103","stoneweight":"PW105","stonevalue":"PA203","wastage":"PW107",
                    "category":"PC101","oldgold":"PW101","testweight":"PW104","testreturn":"PW106","puregold":"PW100","testpurity":"PC102","cash":"PA100"}],
                addonproductcode:[{"metal":"PW995","oldgold":"PW101","cash":"PA100","bill":"RD100","online":"ES100","order":"RD101"}],
                transactiontype:[{"sales":"1","purchase":"2","salesreturn":"3","ogtest":"4","issue":"5","return":"6","cashpayment":"7","cashreceipt":"8","order":"9"}],
                customertype:[{"wholesale":"1","retail":"2","goldsmith":"3","guest":"4","employee":"5","admin":"6","order":"7","self":"100"}],
                storetype:[{"display":"1","godown":"2"}],
                outstandingtype:[{"weightbalance":"1","cashbalance":"2"}]
            },
            get:function(key){
                return this.appvars[key]
            },
            set:function(key,value){
                this.appvars[key]=value;
            }
        }
    })

    .factory("$store",function($parse){
        /**
         * Global Vars
         */
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage,
            supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');

        var privateMethods = {
            /**
             * Pass any type of a string from the localStorage to be parsed so it returns a usable version (like an Object)
             * @param res - a string that will be parsed for type
             * @returns {*} - whatever the real type of stored value was
             */
            parseValue: function(res) {
                var val;
                try {
                    val = JSON.parse(res);
                    if (typeof val == 'undefined'){
                        val = res;
                    }
                    if (val == 'true'){
                        val = true;
                    }
                    if (val == 'false'){
                        val = false;
                    }
                    if (parseFloat(val) == val && !angular.isObject(val) ){
                        val = parseFloat(val);
                    }
                } catch(e){
                    val = res;
                }
                return val;
            }
        };
        var publicMethods = {
            /**
             * Set - let's you set a new localStorage key pair set
             * @param key - a string that will be used as the accessor for the pair
             * @param value - the value of the localStorage item
             * @returns {*} - will return whatever it is you've stored in the local storage
             */
            set: function(key,value){
                if (!supported){
                    try {
                        $.cookie(key, value);
                        return value;
                    } catch(e){
                        logger.logWarning('failed to load items, please make sure you have $.cookie supported in your browser.');
                    }
                }
                var saver = JSON.stringify(value);
                storage.setItem(key, saver);
                return privateMethods.parseValue(saver);
            },
            /**
             * Get - let's you get the value of any pair you've stored
             * @param key - the string that you set as accessor for the pair
             * @returns {*} - Object,String,Float,Boolean depending on what you stored
             */
            get: function(key){
                if (!supported){
                    try {
                        return privateMethods.parseValue($.cookie(key));
                    } catch(e){
                        return null;
                    }
                }
                var item = storage.getItem(key);
                return privateMethods.parseValue(item);
            },
            /**
             * Remove - let's you nuke a value from localStorage
             * @param key - the accessor value
             * @returns {boolean} - if everything went as planned
             */
            remove: function(key) {
                if (!supported){
                    try {
                        $.cookie(key, null);
                        return true;
                    } catch(e){
                        return false;
                    }
                }
                storage.removeItem(key);
                return true;
            },
            /**
             * Bind - let's you directly bind a localStorage value to a $scope variable
             * @param $scope - the current scope you want the variable available in
             * @param key - the name of the variable you are binding
             * @param def - the default value (OPTIONAL)
             * @returns {*} - returns whatever the stored value is
             * binding sample:  $store.bind($scope, 'test', 'Some Default Text');
             */
            bind: function ($scope, key, def) {
                def = def || '';
                if (!publicMethods.get(key)) {
                    publicMethods.set(key, def);
                }
                $parse(key).assign($scope, publicMethods.get(key));
                $scope.$watch(key, function (val) {
                    publicMethods.set(key, val);
                }, true);
                return publicMethods.get(key);
            }
        };
        return publicMethods;
    })

    .factory('filterfunction',function($rootScope,$http,$store,appvariables){
        var privateMethods = {};
        privateMethods.listpackage  =function(){
            var listpkg = $store.get('pkg');

            if (listpkg == null || listpkg=='undefined' || listpkg==''){
                var formData = {
                    'usercompany':$rootScope.company
                };
                $http.post('/service/listpackage',formData).success(function (data){
                    if (data[0].result == 'NODATA' && data[0].result == 'ERROR') {
                        logger.logError("unable to load items . please contact support");
                    }else{
                        $store.set('pkg',data);
                        listpkg= $store.get('pkg');
                    }
                });
            }
            return listpkg;
        };

        var publicMethods={};
        publicMethods.arrUnique = function(arr) {
            var cleaned = [];
            arr.forEach(function(itm) {
                var unique = true;
                cleaned.forEach(function(itm2) {
                    if (_.isEqual(itm, itm2)) unique = false;
                });
                if (unique)  cleaned.push(itm);
            });
            return cleaned;
        };

        publicMethods.filterarray= function(jsonobject, filtercriteria){ //filtercriteria {website: 'yahoo'}
            var result = [];
            var my_object = JSON.parse(JSON.stringify(jsonobject));
            my_object.filter(function(obj) {
                Object.keys(filtercriteria).every(function(c){
                    if (obj[c] == filtercriteria[c]){
                        result.push(obj);
                    }
                });
            });
            return result;
        }

        publicMethods.getpackagenames = function (packagetype) {
            var pkglist = privateMethods.listpackage();
            $rootScope.packagestemp=pkglist;
            var filteredpackagenames= new Array();
            var strlength=0;
            if (packagetype.length>0){
                strlength= packagetype.length;
                var pkgkeywild='';
                var pkgkeywhole='';
                if (packagetype.substring(strlength - 1, strlength) == '*') {
                    pkgkeywild=packagetype.substring(0,strlength - 1);
                }
                else{
                    pkgkeywhole=packagetype;
                }

                if (pkgkeywhole.length >0 || pkgkeywild.length >0){
                    for (var key in pkglist) {
                        if (pkgkeywhole.length >0){
                            if (pkglist[key].packages_code == pkgkeywhole){
                                filteredpackagenames.push({"packages_id":pkglist[key].packages_id ,"packages_code":pkglist[key].packages_code,"package_name":pkglist[key].package_name,"purity":pkglist[key].products_purity,"productid":pkglist[key].products_id,"productcode":pkglist[key].product_code});
                            }
                        }
                        else if (pkgkeywild.length >0) {
                            if (pkglist[key].packages_code.substring(0, pkglist[key].packages_code.length - 1) == pkgkeywild){
                                filteredpackagenames.push({"packages_id":pkglist[key].packages_id ,"packages_code":pkglist[key].packages_code,"package_name":pkglist[key].package_name,"purity":pkglist[key].products_purity,"productid":pkglist[key].products_id,"productcode":pkglist[key].product_code});
                            }
                        }
                    }
                }
            }
            else{
                filteredpackagenames.push({"packages_id":'0' ,"packages_code":'error',"package_name":'error'});
            }
            filteredpackagenames=publicMethods.arrUnique(filteredpackagenames);
            return filteredpackagenames;
        };
        publicMethods.getpackagedetails = function (packagetype) {
            var pkglist = privateMethods.listpackage();
            var filteredpackagelist= new Array();

            if (packagetype.length>0){
                for (var key in pkglist) {
                    if (pkglist[key].packages_code == packagetype){
                        filteredpackagelist.push(pkglist[key]);
                    }
                }
            }
            return filteredpackagelist;
        };
        return publicMethods;
    })

    .factory('cookieservice', ['$cookies', function($cookies){
        var publicMethods={};
        publicMethods.setCookieData = function(keyname, keyvalue){
            $cookies.put(keyname, keyvalue);
        };
        publicMethods.getCookieData= function(keyname){
            return $cookies.get(keyname);
        };
        publicMethods.clearCookieData = function(keyname){
            $cookies.remove(keyname);
        };
        return publicMethods;
    }])

    .factory('utilities',function(){
        var privateMethods = {};
        privateMethods.s4  =function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        privateMethods.guid  =function(){
            return privateMethods.s4() + privateMethods.s4() + '-' + privateMethods.s4() + '-' + privateMethods.s4() + '-' +
                privateMethods.s4() + '-' + privateMethods.s4() + privateMethods.s4() + privateMethods.s4();
        };

        var publicMethods={};
        publicMethods.date2Format=function(input,format){
            var varDate=new Date(input);
            var month=new Array("01","02","03","04","05","06","07","08","09","10","11","12");
            var customDate=new Array("01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31");
            var dd=customDate[varDate.getDate()-1];
            var mm=month[varDate.getMonth()];
            var yy=varDate.getFullYear();
            switch (format){
                case 'dd/mm/yyyy':
                    return dd+"/"+ mm+"/"+yy;
                    break;
                case 'mm/dd/yyyy':
                    return  mm+"/"+ dd+"/"+yy;
                    break;
                case 'yyyy/mm/dd':
                    return  yy+"/"+ mm+"/"+dd;
                    break;
                case 'dd-mm-yyyy':
                    return  dd+"-"+ mm+"-"+yy;
                    break;
                case 'yyyy-mm-dd':
                    return  yy+"-"+ mm+"-"+dd;
                    break;
                case 'dd-mm-yy':
                    return  dd+"-"+ mm+"-"+yy.substring(yy.length-2,yy.length);
                    break;
                default:
                    return varDate.getFullYear()+"-"+ month[varDate.getMonth()]+"-"+ customDate[varDate.getDate()-1] ;
                    break;
            }
        };
        publicMethods.goBackDays=function(fromdate,daystogoback){
            var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            var goBackDays = daystogoback;
            var today = new Date();
            var daysSorted = [];

            for(var i = 0; i < goBackDays; i++){
                var newDate = new Date(today.setDate(today.getDate() - 1));
                if (days[newDate.getDay()] != 'Sunday'){
                    daysSorted.push(days[newDate.getDay()]);
                }
            }
            return daysSorted.reverse();
        };
        publicMethods.roundtodecimal=function(value,exp){
            if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

            value = +value;
            exp  = +exp;

            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return 0;

            // Shift
            value = value.toString().split('e');
            value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

            // Shift backs
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
        };
        publicMethods.generateguid=function(){
           return privateMethods.guid();
        };
        publicMethods.limitkeypresstolength = function ($event, value, maxLength) {
            if (value != undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
            //place this code in html ng-keypress="limitkeypresstolength($event,modelvariable,maxlength-for-model)"
            //ng-keypress="limitKeypress($event,search.main,4)"
        };
        publicMethods.limitkeypresstonumbers = function($event){
            if(isNaN(String.fromCharCode($event.keyCode))){
                $event.preventDefault();
            }
            //place this code in html ng-keypress="limitkeypresstonumbers($event)"
        };
        publicMethods.limitkeypresstonospecialchars = function($event){
            var k = e.keyCode;
            if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8   || (k >= 48 && k <= 57)){
                $event.preventDefault();
            }
            //alert(k)
            //place this code in html ng-keypress="limitkeypresstonospecialchars($event)"

        };
        publicMethods.randombetween= function(min, max) {
            if (min < 0){
                return min + Math.random() * (Math.abs(min)+max);
            }
            else {
                return min + Math.random() * max;
            }
        }
        return publicMethods;
    })

    .factory('datepickerfunctions',function($rootScope){
        var publicMethods={};
        publicMethods.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return $scope.opened1 = true;
        };
        publicMethods.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return $scope.opened = true;
        };
        publicMethods.opensm = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return $scope.opened1sm = true;
        };
        publicMethods.open1sm = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return $scope.openedsm = true;
        };
        publicMethods.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };
        publicMethods.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        publicMethods.format = $scope.formats[0];
        return publicMethods;
    })

    .directive('ngOnlyNumber', function () {
        // this directive allow only numbers with decimal point.
        // specify the max decimal points using data-max-decimal-points in the dom element.
        // if data-max-decimal-points is not specified, it will allow any number of decimal point.
        // decorate input with below html
        // <input type="text" ng-only-number data-max-length=3> limit length before decimal
        // <input type="text" ng-only-number data-max-decimal-points=1> limit length after decimal
        return {
            restrict: "AE",
            link: function (scope, elem, attr) {
                if (!$(elem).attr("min")) {
                    $(elem).attr("min", 0);
                }
                function toIncreaseMaxLengthBy (elem) {
                    var maxDecimalPoints = elem.data('maxDecimalPoints');
                    return (1 + maxDecimalPoints);
                }
                var el = $(elem)[0];
                el.initMaxLength = elem.data('maxLength');
                el.maxDecimalPoints = elem.data('maxDecimalPoints');
                var checkPositive = function (elem, ev) {
                        try {
                            var el = $(elem)[0];
                            if (el.value.indexOf('.') > -1) {
                                if (ev.charCode >= 48 && ev.charCode <= 57) {
                                    if (el.value.indexOf('.') == el.value.length - toIncreaseMaxLengthBy(elem)) {
                                        if (el.selectionStart > el.value.indexOf('.')) {
                                            return false;
                                        } else {
                                            if (el.value.length == elem.data('maxLength')) {
                                                return false;
                                            } else {
                                                return true;
                                            }
                                        }
                                    } else {
                                        if (el.selectionStart <= el.value.indexOf('.')) {
                                            if (el.value.indexOf('.') == toIncreaseMaxLengthBy(elem)) {
                                                return false;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (el.value.length == elem.data('maxLength')) {
                                    if (ev.charCode == 46) {
                                        if (typeof el.maxDecimalPoints === 'undefined') {
                                            return true;
                                        } else {
                                            if (el.selectionStart < el.value.length - el.maxDecimalPoints) {
                                                return false;
                                            };
                                        }
                                        elem.data('maxLength', el.initMaxLength + toIncreaseMaxLengthBy(elem));
                                        return true;
                                    } else if (ev.charCode >= 48 && ev.charCode <= 57) {
                                        return false;
                                    }
                                }
                                if (ev.charCode == 46) {
                                    if (el.selectionStart < el.value.length - elem.data('maxDecimalPoints')) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                            }
                            if (ev.charCode == 46) {
                                if (el.value.indexOf('.') > -1) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                            if (ev.charCode ==43 || ev.charCode ==45) {
                                return true;
                            }
                            if ((ev.charCode < 48 || ev.charCode > 57) && ev.charCode != 0) {
                                return false;
                            }
                        } catch (err) {}
                    }
                var change_maxlength = function(elem, ev){
                        try {
                            var el = $(elem)[0];
                            if(el.value.indexOf('.')>-1){
                                elem.data('maxLength', el.initMaxLength + toIncreaseMaxLengthBy(elem));
                            }
                            else{
                                if(elem.data('maxLength') == el.initMaxLength + toIncreaseMaxLengthBy(elem)){
                                    var dot_pos_past = el.selectionStart;
                                    el.value = el.value.substring(0, dot_pos_past);
                                }
                                elem.data('maxLength', el.initMaxLength);
                            }
                        } catch (err) {}
                    }
                $(elem).on("keypress", function () {
                    return checkPositive(elem, event);
                })
                $(elem).on("input", function () {
                    return change_maxlength(elem, event);
                })
            }
        }
    })

    .directive('ngOnlyCharacter', function () {
        // this directive allow only characters. removes special characters
        // decorate input with below html
        // <input type="text" ng-only-Character
        return {
            restrict: "AE",
            scope:true,
            link: function (scope, elem, attr) {
                if (!$(elem).attr("min")) {
                    $(elem).attr("min", 0);
                }
                var checkPositive = function (elem, ev) {
                    try {
                        var el = $(elem)[0];
                        if ( (event.charCode > 47 && event.charCode < 58) || (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) ||
                            event.charCode == 8   || event.charCode == 32 || event.charCode == 46 || event.charCode == 44 || event.charCode == 47 ){
                            return true;
                        }
                        else{
                            return false;
                        }

                    } catch (err) {}
                }
                $(elem).on("keypress", function () {
                    return checkPositive(elem, event);
                })
            }
        }
    })

    .directive("limitTo", [function() {
        // restrict input character length
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var limit = parseInt(attrs.limitTo);
                angular.element(elem).on("keypress", function(e) {
                    if (this.value.length == limit) e.preventDefault();
                });
            }
        }
    }])

    .directive('enter',function(){
        // move focus to next control on enter keypress
        return function(scope,element,attrs){
            element.bind("keydown keypress",function(event){
                if(event.which===13){
                    event.preventDefault();
                    var fields=$(this).parents('form:eq(0),body').find('input, textarea, select');
                    var index=fields.index(this);
                    if(index> -1&&(index+1)<fields.length)
                        fields.eq(index+1).focus();
                }
            });
        };
    })

    .factory('focus', function($timeout, $window) {
        return function(id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if(element)
                    element.focus();
            });
        };
    })

    .directive('rfocus',function(){
        return {
            restrict: 'A',
            controller: function($scope, $element, $attrs){
                var fooName = 'setFocus' + $attrs.rfocus;
                $scope[fooName] = function(){
                    $element.focus();
                }
            }
        }
    })

    //.directive('selectOnFocus', function ($timeout) {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, element, attrs) {
    //            var focusedElement = null;
    //
    //            element.on('focus', function () {
    //                var self = this;
    //                if (focusedElement != self) {
    //                    focusedElement = self;
    //                    $timeout(function () {
    //                        self.select();
    //                    }, 10);
    //                }
    //            });
    //
    //            element.on('blur', function () {
    //                focusedElement = null;
    //            });
    //        }
    //    }
    //})

    .directive('selectOnClick', function () {
        // Linker function
        return function (scope, element, attrs) {
            element.bind('click', function () {
                this.select();
            });
            element.bind('focus', function () {
                this.select();
            });
        };
    })

    .directive('select2', function($timeout) {
        return {
            restrict: 'AC',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.show();
                    $(element).select2();
                });
            }
        };
    });
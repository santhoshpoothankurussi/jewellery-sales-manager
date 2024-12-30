var robs=angular.module('robs',['ui.bootstrap','ngCookies','ngRoute','ngDialog','commonfunction',"chart.js"])
robs.config(function($provide,$locationProvider,$routeProvider,$logProvider,ChartJsProvider){
    $provide.decorator( "$route", routeDecorator );
    function routeDecorator( $delegate ){
        var $route = $delegate;
        $route.remove = function( path ){
            path = path.replace( /\/$/i, "" );
            delete( this.routes[ path ] );
            delete( this.routes[ path + "/" ] );
            return( this );
        };
        $route.removeAll = function(){
            for (var path in this.routes){
                this.remove(path);
            }
            return( this );
        };
        // This provides a short-hand to removing the current route without
        // having to access the current route in the calling context.
        $route.removeCurrent = function() {
            return( this.remove( this.current.originalPath ) );
        };
        // I allow routes to be defined after the application has been
        // bootstrapped. These go into a shared "routes" collection.
        $route.when = function( path, route ) {
            $routeProvider.when( path, route );
            return( this );
        };
        $route.otherwise = function(route ) {
            $routeProvider.otherwise(route );
            return( this );
        };
        // Return the decorated service.
//        alert(JSON.stringify($route));
        return( $route );
    }
    $locationProvider.html5Mode('true');

    return $routeProvider.when('/login',{
        templateUrl:'pages/login.html',
        controller:'logincontroller'

    }).when('/changepassword',{
        templateUrl:'pages/changepassword.html',
        controller:'logincontroller'

    }).when('/',        {
        templateUrl: 'pages/menu.html',
        controller: 'logincontroller',
        public: true                        //login:true, set_password=true, verify_email=true
    }).otherwise({
        redirectTo: '/login'
    });

    $logProvider.debugEnabled(true);    // directive error

    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
        datasetFill: true
    });

    // Configure all charts
    ChartJsProvider.setOptions({
        colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
        responsive: true
    });
});

robs.run(function($route,$rootScope,$location,$http,$cookies,base64,logger,appvariables,filterfunction,utilities ) {

    $rootScope.packagecode=appvariables.get('packagecode');
    $rootScope.addonproductcode=appvariables.get('addonproductcode');
    $rootScope.wholesalerate = 0;
    $rootScope.retailrate = 0;

    //$rootScope.$watch('retailrate', function() {
    //    alert('hey, retailrate has changed!');
    //});
    //$rootScope.$watch('wholesalerate', function() {
    //    alert('hey, wholesalerate has changed!');
    //});

    $rootScope.loadmenu=function(){
        var MenuItems;
        if(localStorage.getItem("MenuItems")!=undefined){
            MenuItems=JSON.parse(localStorage.getItem("MenuItems"));
            $rootScope.submenu=MenuItems;
            MenuItems.forEach(function(rows) {
                var currentRoute = rows.tilesize;
                var routeName = rows.link;
                $route.when(routeName, {
                    templateUrl:'pages/' + currentRoute
                });
            });

            $route.when('/login',{
                templateUrl:'pages/login.html',
                controller:'logincontroller'
            }).
                when('/',{
                    templateUrl: 'pages/menu.html',
                    controller: 'logincontroller',
                    public: true                        //login:true, set_password=true, verify_email=true
                }).otherwise({
                    redirectTo: '/login'
                });
        };
        $route.reload();
    };

    $http.post('/product/GetRate').success(function(response){
        $rootScope.rate=response;
        $rootScope.newDate=response[0].date;
        $rootScope.newTime=response[0].time;
        $rootScope.BoardRate=response[0].BoardRate;
        $rootScope.Rate995=response[0].Rate995;
        $rootScope.RateStatusMessage='';
    });
    $rootScope.checkSesssion=function(){
        if ($cookies.jewarSession!=undefined) {
            var cookieData=JSON.parse(base64.decode($cookies.jewarSession));
            $http.post('/SetSession',cookieData).success(function (res){});

            appvariables.set('company',cookieData.companyid);
            appvariables.set('loggedinuser',cookieData.customerid);
            appvariables.set('username',cookieData.username);

            $rootScope.showheader=true;
            $location.path('/');
        }
        else{
            appvariables.set('company','');
            appvariables.set('loggedinuser','');
            appvariables.set('username','');

            appvariables.set('retailrate',0);
            appvariables.set('wholesalerate',0);
            appvariables.set('rateupdateddatetime','');

            $rootScope.showheader=false;
            $location.path('/login');
        }
    };
    $rootScope.checkRate=function(){
        if(typeof(Storage)!=undefined) {
            var metalData={};
            if (localStorage.getItem(base64.encode("metal_rate"))!= undefined) {
                metalData=JSON.parse(base64.decode(localStorage.getItem(base64.encode("metal_rate"))));
            }
            $http.post('/checkRate',metalData).success(function(response){
                if(response.length!=0){
                    if(response[0].Status=='Changed'){
                        logger.logSuccess('metal rate changed')
                        localStorage.removeItem(base64.encode("metal_rate"));
                        localStorage.setItem(base64.encode("metal_rate"),base64.encode(JSON.stringify(response[0])));
                        localStorage.setItem("change_dt",new Date());
                        $rootScope.metalData=response[0];
                        appvariables.set('retailrate',response[0].Rate995);
                        appvariables.set('wholesalerate',response[0].BoardRate);
                        localStorage.removeItem("change_dt");
                    }
                }
            });
        }
        else{
            $http.post('/checkRate',{}).success(function(response){
                if(response.length!=0){
                    if(response[0].Status=='Changed'){
                        logger.logSuccess('Metal rate changed ');
                        $rootScope.metalData=response[0];
                        appvariables.set('retailrate',response[0].Rate995);
                        appvariables.set('wholesalerate',response[0].BoardRate);
                    }
                }
            });
        }
    };
    $rootScope.getRate=function(){
        var formData = {
            'usercompany': $rootScope.company
        };
        $http.post('/enroll/getrate/',formData).success(function(response) {
            $rootScope.metalrate=response;
            if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                $rootScope.wholesalerate = response[0].boardrate;
                $rootScope.retailrate = response[0].rate995;
                $rootScope.rateupdateddatetime = response[0].createddatetime;
                $rootScope.showfooterrate=true;

                appvariables.set('retailrate',response[0].boardrate);
                appvariables.set('wholesalerate',response[0].rate995);
                appvariables.set('rateupdateddatetime',response[0].ChangedDateTime);
            }
            else{
                logger.logError("metal rates not available. please contact support");
            }
        });
    }
    $rootScope.setappdata=function(data,remember){
        if ($cookies.jewarSession == undefined || $cookies.jewarSession == null || $cookies.jewarSession == '' ){
            if(remember){
                var date=new Date();
                date.setTime(date.getTime()+(12*30*24*60*60*1000));
                var sessionData = base64.encode(JSON.stringify(data))+'&expires='+date.toGMTString();
                document.cookie='jewarSession='+base64.encode(JSON.stringify(data))+';expires='+date.toGMTString();
            }
            else{
                document.cookie='jewarSession='+escape(base64.encode(JSON.stringify(data)));
            };

            appvariables.set('company',data[0].companyid);
            appvariables.set('loggedinuser',data[0].customerid);
            appvariables.set('username',data[0].username);

            $rootScope.company  =data[0].companyid;
            $rootScope.loggedinuser  =data[0].customerid;
            $rootScope.username  =data[0].username;
        }
        else{
            var jcookie=$cookies.jewarSession;
            jcookie= JSON.parse(base64.decode($cookies.jewarSession))
            appvariables.set('company',jcookie[0].companyid);
            appvariables.set('loggedinuser',jcookie[0].customerid);
            appvariables.set('username',jcookie[0].username);

            $rootScope.company=jcookie[0].companyid;
            $rootScope.loggedinuser=jcookie[0].customerid;
            $rootScope.username=jcookie[0].username;
        }

        $rootScope.username = appvariables.get('username');
        $rootScope.checkSesssion();
        $rootScope.getRate();
    };

    if ($cookies.jewarSession != undefined)(
        $rootScope.setappdata('','')
    )

    $rootScope.checkSesssion();
    $rootScope.loadmenu();
    $rootScope.checkRate();
    $rootScope.getRate();

    var currentDate;
    currentDate=new Date();
    $rootScope.currentdate= utilities.date2Format(currentDate,'yyyy-mm-dd');
    $rootScope.company=1; // set default company
    appvariables.set('basepuritypercentage','99.5');
    $rootScope.listpackage= filterfunction.getpackagedetails(appvariables.get('packagecode')[0].ornamentgold);

    setInterval(function(){
        $rootScope.checkRate();
    },300000);
    window.addEventListener('storage',function(){
        if (localStorage.getItem(base64.encode("metal_rate"))!=undefined) {
            $rootScope.metalData=JSON.parse(localStorage.getItem(base64.encode("metal_rate")));
            $rootScope.BoardRate=$rootScope.metalData.BoardRate;
            $rootScope.Rate995=$rootScope.metalData.Rate995;
        }
    });
});

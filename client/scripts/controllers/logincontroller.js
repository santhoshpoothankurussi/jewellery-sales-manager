'use strict';
robs.controller('logincontroller', ['$scope','loginService','$rootScope','$location', 'logger','appvariables','$cookies', function ($scope,loginService,$rootScope,$location,logger,appvariables,$cookies) {
    $rootScope.userdata={
        loginid:'',
        loginpassword:'',
        usercompany:$rootScope.company,
        currentdate:$rootScope.currentdate,
        password1:'',
        password2:'',
        customer:$rootScope.loggedinuser,
        selectedappuser:''
    }
    $scope.signin=function(userdata){
        loginService.signin(userdata,function(response){
            if (response!=undefined){
                if (response[0].RESULT == 'ERROR' || response[0].RESULT == 'NODATA' ){
                    logger.logError("invalid credentials");
                    return;
                }
                else{
                    logger.logSuccess("successfully logged in");
                    loginService.opendaystock(userdata,function(response){
                        logger.logSuccess("day stock verified and updated.");
                    });
                    $rootScope.setappdata(response[0],userdata.remember);
                    appvariables.set('retailrate',response[1].boardrate);
                    appvariables.set('wholesalerate',response[1]['995rate']);
                    appvariables.set('rateupdateddatetime',response[1].ChangedDateTime);
                    $rootScope.listsubmenu = response[2];
                    if (($rootScope.listsubmenu + '').length > 0) {
                        localStorage.setItem("MenuItems", JSON.stringify(response[2]));
                        $rootScope.loadmenu();
                    };
                    $rootScope.showheader=true;
                    $rootScope.showfooterrate=true;
                    $location.path('/');
                };
            }
            else{
                logger.logWarning("invalid credentials");
            }
        });
    };
    $scope.signout=function(){
        //loginService.signout($scope);
        loginService.signout(function(data){
            if (data!=undefined){
                $rootScope.showheader=false;
                $rootScope.showfooterrate=false;
                delete $cookies['jewarSession'];
                $rootScope.checkSesssion();
                $location.path('/signin');
            }
            else{
                logger.logWarning('unable to logout');
            }
        });
    };
    $scope.pathChange=function(path){
        $location.path(path.link);
    };
    $scope.gohome=function(){
        $location.path("/");
    };
    $scope.getmetalrate=function(){
        loginService.getrate($rootScope.userdata,function(response){
            $rootScope.metalrate=response;
            if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                $rootScope.wholesalerate = response[0].boardrate;
                $rootScope.retailrate = response[0].rate995;
                $rootScope.rateupdateddatetime = response[0].createddatetime;
            }
            else{
                logger.logError("metal rates not available. please contact support");
            }
        });
    };
    $scope.changepassword=function(){
        $location.path('/changepassword');
    };
    $scope.savepassword=function(){
        if ($rootScope.userdata.password1 != $rootScope.userdata.password2){
            logger.logWarning("password not matching. please re-enter and try again.")
            return;
        }
        loginService.savepassword($rootScope.userdata,function(response){
            if (response!=undefined){
                if (response[0].RESULT == 'ERROR' || response[0].RESULT == 'NODATA' ){
                    logger.logError("failed to save new password");
                    return;
                }
                else{
                    logger.logSuccess("password changed successfully");
                    $rootScope.userdata.password1='';
                    $rootScope.userdata.password2='';
                    $location.path('/');
                };
            }
            else{
                logger.logWarning("invalid credentials");
            }
        });
    };
    $scope.initchangepassword = function(){
        var formdata={
            company:$rootScope.company,
            //customertype:appvariables.get('customertype')[0].employee
            customertype:''
        }
        loginService.loadcustomer(formdata,function(data){
            if (data!=undefined){
                $scope.appusers = data;
            }
            else{
                logger.logWarning('unable to load application users.');
            }
        });
    };
    $scope.onchangecustomer =function(appuser){
        $rootScope.userdata.selectedappuser = appuser.customerid;
    };
}]);
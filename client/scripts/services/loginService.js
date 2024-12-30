'use strict';

robs.factory('loginService',function($http,$location,$rootScope,$route,$cookies,base64,$cookieStore,appvariables,cookieservice) {
    return {
        signin: function (data,doCallback) {
            $http.post('/login', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        signout: function (doCallback) {
            $http.post('/logout')
                .success(function (response) {
                    doCallback(response);
                });
        },
        checkSession: function ($scope,$rootScope){
            $http.post('/user/loginCheck').success(function (response) {
                 if(response.length!=0){
                    $rootScope.CID=response[0].CID;
                    $rootScope.UserID=response[0].UserID;
                    $rootScope.FirstName=response[0].FirstName;
                    $rootScope.LastName=response[0].LastName;
                    $rootScope.AddressID=response[0].AddressID;
                    $rootScope.DesignationID=response[0].DesignationID;
                    $rootScope.AccessTypeID=response[0].AccessTypeID;
                    $rootScope.showLoginControls=false;
                    $rootScope.LoginID=response[0].LoginID;
                    $rootScope.LoginPassword=response[0].LoginPassword;
                    $rootScope.SessionUserID=response[0].SessionUserID;
                    $rootScope.Created_Datetime=response[0].Created_Datetime;
                    $rootScope.status=response[0].status;
                    var input={UserID:$rootScope.UserID};
                    if($rootScope.UserID!=undefined){
                        $http.post('/login/checkAuthenticatedUser',input).success(function (response) {
                            var AccessTypeID=response[0][0].AccessTypeID;
                            if(user.AccessTypeID=="1"){
                                var respData = '';
                                console.log('inside http Post');
                                respData = user.LoginID;
                                console.log('Login result ' + user.LoginID);
                            }
                            if(user.AccessTypeID=="2"){
                                $location.path('/Transactions');
                            }

                            if(response.length<=0){
                                //logger.log(response);
                            }
                        });
                    }
                     $rootScope.showheader=true;
                    $location.path('/menu');
                }
                else{
                    //$rootScope.name='';
                    //$rootScope.serviceproviderName='';
                    //$rootScope.serviceproviderdisplayname='';
                    //$rootScope.showLoginControls=true;
                     $rootScope.showheader=false;
                     $location.path('/');
                }
            }).error(function (data, err) {
                //logger.logWarning('please check your connection');
            });
        },
        getrate: function(data,doCallback){
            $http.post('/enroll/getrate', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        opendaystock: function(data,doCallback) {
            $http.post('/service/opendaystock',data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        savepassword: function (data,doCallback) {
            $http.post('/savepassword', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        loadcustomer: function(data,doCallback){
            $http.post('/service/loadcustomer', data)
                .success(function (response) {
                    doCallback(response);
                });
        }
    }
});
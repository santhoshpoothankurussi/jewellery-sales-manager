// <copyright file="enrollmentcontroller.js" company="Cronyco">
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
// <summary>Contains Javascript methods for Routing enrollmentcontroller Functions </summary>

'use strict';
robs.controller('enrollmentcontroller', ['$http','$scope','$location','$rootScope','logger','enrollmentservice','appvariables','utilities', function ($http,$scope,$location,$rootScope,logger,enrollmentservice,appvariables,utilities){
    $rootScope.enrolldata={
        'company':$rootScope.company,
        'orgname':'',
        'firstname':'',
        'lastname':'',
        'loginid':'',
        'loginpassword':'',
        'loginpassword2':'',
        'title':'',
        'contactname':'',
        'userid':$rootScope.loggedinuser,
        'customer':0,
        'customertype':'1',
        'accesstype':7,
        'house':'',
        'street':'',
        'postoffice':'',
        'district':'palakkad',
        'state':'kerala',
        'country':'india',
        'pin':'',
        'contactno':'',
        'email':'',
        'fax':'',
        'geotag':'',
        'creditlimitweight':0,
        'creditlimitcash':0,
        'openingbalanceweight':0,
        'openingbalancecash':0,
        'wholesalerate': 0,
        'retailrate': 0
    };

    $scope.listuser=function($scope){
        $rootScope.allcustomerlist='';
        enrollmentservice.listuser($rootScope.enrolldata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    $rootScope.allcustomerlist=response;
                }else{
                    logger.logError("unable to load customers. please contact support");
                }
            }
            else{
                logger.logWarning('user list not available');
            }
        });
    };
    $scope.saveuser=function(data){
        if(($rootScope.enrolldata.firstname.length==0 )){
            logger.logWarning('please enter customer name');
            return;
        }
        else if(($rootScope.enrolldata.orgname.length==0 )){
            logger.logWarning('please enter shop name');
            return;
        }
        else if(($rootScope.enrolldata.contactno.length==0 && $rootScope.enrolldata.customertype < 4)){
            logger.logWarning('invalid customer contact number');
            return;
        }
        else if(($rootScope.enrolldata.creditlimitcash==0 || isNaN($rootScope.enrolldata.creditlimitcash)) && $rootScope.enrolldata.customertype==2){ // retail customer
            logger.logWarning('invalid cash credit limit');
            return;
        }
        else if(($rootScope.enrolldata.creditlimitweight==0 || isNaN($rootScope.enrolldata.creditlimitweight))  && $rootScope.enrolldata.customertype == 1){ // wholesale customer
            logger.logWarning('invalid weight credit limit');
            return;
        }
        else if(($rootScope.enrolldata.creditlimitweight==0 || isNaN($rootScope.enrolldata.creditlimitweight))  && $rootScope.enrolldata.customertype == 3){ // smith customer
            logger.logWarning('invalid weight credit limit');
            return;
        }
        //else if(($rootScope.enrolldata.openingbalancecash<0 || isNaN($rootScope.enrolldata.openingbalancecash))  && $rootScope.enrolldata.customertype < 3){
        //    logger.logWarning('invalid cash opening balance');
        //    return;
        //}
        //else if(($rootScope.enrolldata.openingbalanceweight<0 || isNaN($rootScope.enrolldata.openingbalanceweight))  && $rootScope.enrolldata.customertype < 3){
        //    logger.logWarning('invalid weight opening balance');
        //    return;
        //}
        else if($rootScope.enrolldata.loginid.length==0 || $rootScope.enrolldata.loginpassword.length==0){
            if ($rootScope.enrolldata.customertype == appvariables.get('customertype')[0].employee){
                logger.logWarning('please enter operator login id and password (8 characters)');
                return;
            }
            else{
                if ($rootScope.enrolldata.loginid.length == 0){
                    //$rootScope.enrolldata.loginid=utilities.generateguid();
                    $rootScope.enrolldata.loginid= $rootScope.enrolldata.firstname.substring(0,3) + utilities.randombetween(1000,9999);
                    $rootScope.enrolldata.loginpassword="12345678";
                }
                else{

                }
            }
        }
        else if($rootScope.enrolldata.loginpassword != $rootScope.enrolldata.loginpassword2) {
            logger.logWarning('password not matching');
            return;
        }
        enrollmentservice.saveuser($rootScope.enrolldata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess("user details saved successfully");
                    $scope.listuser();
                    $scope.cleardata();
                }else{
                    logger.logError("unable to register user. please contact support");
                }
            }
            else{
                logger.logWarning('user list not available');
            }
        });
    };
    $scope.edituser=function(customer){
        for (var i in $rootScope.allcustomerlist){
            if ($rootScope.allcustomerlist[i].customerid == customer.customerid) {
                $rootScope.enrolldata.customer=customer.customerid;
                $rootScope.enrolldata.orgname=$rootScope.allcustomerlist[i].orgname;
                $rootScope.enrolldata.firstname=$rootScope.allcustomerlist[i].firstname;
                $rootScope.enrolldata.lastname=$rootScope.allcustomerlist[i].lastname;
                $rootScope.enrolldata.contactno=$rootScope.allcustomerlist[i].contactno;
                $rootScope.enrolldata.house=$rootScope.allcustomerlist[i].house;
                $rootScope.enrolldata.street=$rootScope.allcustomerlist[i].street;
                $rootScope.enrolldata.postoffice=$rootScope.allcustomerlist[i].koppam;
                $rootScope.enrolldata.district=$rootScope.allcustomerlist[i].Palakkad;
                $rootScope.enrolldata.pin=$rootScope.allcustomerlist[i].pin;
                $rootScope.enrolldata.creditlimitweight=$rootScope.allcustomerlist[i].creditlimitweight;
                $rootScope.enrolldata.creditlimitcash=$rootScope.allcustomerlist[i].creditlimitcash;
                $rootScope.enrolldata.openingbalanceweight=$rootScope.allcustomerlist[i].opbalanceweight;
                $rootScope.enrolldata.openingbalancecash=$rootScope.allcustomerlist[i].opbalancecash;
                var formdata={
                    'pcode':$rootScope.allcustomerlist[i].loginid
                };
                enrollmentservice.getpass(formdata,function(response){
                    $rootScope.enrolldata.loginid=response[0].pcode;
                });
            }
        }
    };
    $scope.deleteuser=function(customer){
        if (customer!=undefined | customer.length>0){
            $rootScope.enrolldata.customer=customer.customerid;
            enrollmentservice.deleteuser($rootScope.enrolldata,function(response){
                if (response!=undefined){
                    if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                        logger.logSuccess("user removed saved successfully");
                        $scope.listuser();
                    }else{
                        logger.logError("unable to remove user. please contact support");
                    }
                }
                else{
                    logger.logWarning('failed to remove user.');
                }
            });
        }
        else{
            logger.logWarning('please select a user.');
        }
    };
    $scope.setrate=function(){
        if(($rootScope.enrolldata.wholesalerate==0 || isNaN($rootScope.enrolldata.wholesalerate))){
            logger.logWarning('invalid wholesale rate');
            return;
        }
        else if(($rootScope.enrolldata.retailrate==0 || isNaN($rootScope.enrolldata.retailrate))){
            logger.logWarning('invalid retail rate');
            return;
        }
        enrollmentservice.setrate($rootScope.enrolldata,function(response){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    $rootScope.metalrate=response[0];
                    logger.logSuccess("rates change success.");
                    $rootScope.wholesalerate = response[0][0].boardrate;
                    $rootScope.retailrate = response[0][0].rate995;
                    appvariables.set('wholesalerate', $rootScope.wholesalerate);
                    appvariables.set('retailrate', $rootScope.retailrate);
                    $rootScope.rateupdateddatetime = response[0].createddatetime;
                }
                else{
                    logger.logError("failed to update metal rates. please contact support");
                }
        });
    };
    $scope.transactionshowdetails=function(){
        $scope.showtransaction=true;
    };
    $scope.cleardata =function(){
        $rootScope.enrolldata.orgname='';
        $rootScope.enrolldata.firstname='';
        $rootScope.enrolldata.lastname='';
        $rootScope.enrolldata.contactno='';
        $rootScope.enrolldata.house='';
        $rootScope.enrolldata.street='';
        $rootScope.enrolldata.postoffice='';
        $rootScope.enrolldata.district='';
        $rootScope.enrolldata.pin='';
        $rootScope.enrolldata.creditlimitweight=0;
        $rootScope.enrolldata.creditlimitcash=0;
        $rootScope.enrolldata.openingbalanceweight=0;
        $rootScope.enrolldata.openingbalancecash=0;
        $rootScope.enrolldata.wholesalerate= 0;
        $rootScope.enrolldata.retailrate= 0;
    };
    $scope.initcustomer=function(){
        $rootScope.enrolldata.creditlimitweight=0;
        $rootScope.enrolldata.creditlimitcash=0;
        $rootScope.enrolldata.opbalanceweight=0;
        $rootScope.enrolldata.opbalancecash=0;
        $rootScope.enrolldata.customertype=5;
    };
    $scope.listuser();
    $scope.initrate=function(){
        $rootScope.enrolldata.wholesalerate=$rootScope.wholesalerate;
        $rootScope.enrolldata.retailrate=$rootScope.retailrate;
    };
}]);

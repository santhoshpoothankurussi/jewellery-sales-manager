// <copyright file="enrollmentservice.js" company="Cronyco">
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
// <summary>Contains Javascript methods for Routing enrollmentservice Functions </summary>

robs.factory('enrollmentservice',function($rootScope,$http,$location,logger,appvariables) {
    return {
        listuser: function(data,doCallback){
            $http.post('/enroll/listuser', data)
                .success(function (response) {
                    doCallback(response);
                });
        },

        //listusertype: function(){
        //    var formData = {
        //        'usercompany': appvariables.get('company')
        //    };
        //    $http.post('/enroll/listusertype', formData).success(function (response) {
        //        if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
        //            $rootScope.listusertypes=response[0];
        //        }
        //        else{
        //            logger.logError("unable to load usertype. please contact support");
        //        }
        //    });
        //},

        saveuser: function(data,doCallback){
            $http.post('/enroll/saveuser', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        deleteuser: function(data,doCallback){
            $http.post('/enroll/deleteuser', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        setrate: function(data,doCallback){
            $http.post('/setmetalrate', data)
                .success(function (response) {
                        doCallback(response);
                });
        },
        getpass: function(data,doCallback){
            $http.post('/enroll/getpass', data)
                .success(function (response) {
                    doCallback(response);
                });
        }
    }
});
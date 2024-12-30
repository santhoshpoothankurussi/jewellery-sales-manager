// <copyright file="servicesservice.js" company="Cronyco">
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
// <summary>Contains Javascript methods for Routing servicesservice Functions </summary>

robs.factory('servicesservice',function($http,$location,$rootScope,logger) {
    return{
        // methods - billing screen
        liststore: function(data,doCallback){
            $http.post('/service/liststore', data)
                .success(function (response) {
                    doCallback(response);
            });
        },
        loadcustomer: function(data,doCallback){
            $http.post('/service/loadcustomer', data)
                .success(function (response) {
                    doCallback(response);
            });
        },
        listcategory: function(data,doCallback){
            $http.post('/service/listcategory', data)
                .success(function (response) {
                    doCallback(response);
            });
        },
        listtransaction: function(data,doCallback){
            $http.post('/service/listalltransaction', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        listtransactionfortype: function(data,doCallback){
            $http.post('/service/listtransactionfortype', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        listgstransaction: function(data,doCallback){
            $http.post('/service/listalltransaction', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        listhistory: function(data,doCallback){
            $http.post('/service/listtransactionhistory', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        savetransaction: function(data, doCallback){
            $http.post('/service/savetransaction', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        savetransactionwithpromise: function(data){
            var promise=$http.post('/service/savetransaction', data)
                .success(function (response) {
                    return(response);
                })
                .error(function(data){
                    return {"status": false};
                });
            return promise;
        },
        removetransaction: function(data, doCallback){
            $http.post('/service/removetransaction', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        generatebill: function(data,doCallback){
            $http.post('/service/generatebill', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        clearoutstandingforcash: function(data){
            $http.post('/service/clearoutstandingforcash', data)
                .success(function (response) {
                    doCallback(response);
                });
        },

        // methods - stock screen
        liststock: function(data,doCallback){
            $http.post('/service/liststock', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        savestock: function(data,doCallback){
            $http.post('/service/updateopeningstock', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        movestock: function(data,doCallback){
            $http.post('/service/movestock', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        deletecategory: function(data,doCallback){
            $http.post('/service/deletecategory', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        addcategory: function(data,doCallback){
            $http.post('/service/addcategory', data)
                .success(function (response) {
                    doCallback(response);
                });
        },

        listvalueaddition: function(data,doCallback){
            $http.post('/service/listvalueaddition', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        addvalueaddition: function(data,doCallback){
            $http.post('/service/addvalueaddition', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        removevalueaddition: function(data,doCallback){
            $http.post('/service/removevalueaddition', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        saveaddress: function(data,doCallback){
            $http.post('/service/saveaddress', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        listaddress: function(data,doCallback){
            $http.post('/service/listaddress', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        listorder: function(data,doCallback){
            $http.post('/service/listorder', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        updateorderstatus: function(data,doCallback){
            $http.post('/service/updateorderstatus', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        addpackage: function(data){
            var formData={
                package: $scope.package,
                product: $scope.product,
                store: $scope.store,
                quantity : $scope.quantity,
                metalrate : $scope.metalrate,
                purity:$scope.purity,
                weight: $scope.weight,
                category: $scope.category,
                description : $scope.description
            };

            $scope.transactiondata.push(formData);
        },
        addproduct: function(data){
            var formData={
                'company': data.usercompany,
                'customer':data.customer,
                'user':data.loggedinuser,
                'transactiontype':data.transactiontype,
                'packageid': data.packageid,
                'package': $scope.package,
                'product': $scope.product,
                'store': $scope.store,
                'quantity' : $scope.quantity,
                'metalrate' : $scope.metalrate,
                'purity':$scope.purity,
                'weight': $scope.weight,
                'category': $scope.category,
                'description' : $scope.description
            };

            $http.post('/service/addproduct', formData).success(function (response) {
                logger.logSuccess("saved successfully");
            });
        },
        billtransaction: function(data){
            var formData = {
                'usercompany': data.usercompany,
                'item':data.storeitem,
                'itemqty':data.storeitemqty,
                'itemweight':data.storeitemweight,
                'store':data.store,
                'purity':data.purity
            };

            $http.post('/service/billtransaction', formData).success(function (response) {

            });
        },
        assignorder: function(data,doCallback){
            $http.post('/service/assignorder', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        getreceipt: function(data,doCallback){
            $http.post('/service/getreceipt', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        savebilledit: function(data, doCallback){
            $http.post('/service/savebilledit', data)
                .success(function (response) {
                    doCallback(response);
                });
        }
    }
});
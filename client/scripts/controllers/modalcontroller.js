'use strict';
robs.controller('modalcontroller', ['$http','$scope','$rootScope','logger','servicesservice', function ($http,$scope,$rootScope,logger,servicesservice){
    $scope.dialogtransactionhistory = function(){
        //alert('1');
        servicesservice.listhistory($rootScope.billdata,function(data){
            if (data!=undefined){
                //alert(JSON.stringify(data));
                $rootScope.transactiondetailshistory=data;
                    $rootScope.transactionhistoryheaderdetails=data[0];
                    $rootScope.transactionhistorybodydetails=data[1];
                    $rootScope.transactionhistoryheader={
                        'customer':$rootScope.transactionhistoryheaderdetails.orgname,
                        'owner':$rootScope.transactionhistoryheaderdetails.salesowner,
                        'customertype':$rootScope.transactionhistoryheaderdetails.typename,
                        'transactiontype':$rootScope.transactionhistoryheaderdetails.transactiontypename,
                        'transactiondate':$rootScope.transactionhistoryheaderdetails.transactiondate,
                        'receipt':$rootScope.transactionhistoryheaderdetails.receiptno,
                        'contactno':$rootScope.transactionhistoryheaderdetails.contactno,
                        'status':$rootScope.transactionhistoryheaderdetails.status
                    }
            }
            else{
                logger.logError("transaction history not available.");
            }
        });
    };
    $scope.dialogtransactionhistory();
}]);

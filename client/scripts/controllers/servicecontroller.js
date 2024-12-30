// <copyright file="servicecontroller.js" company="Cronyco">
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
// <summary>Contains Javascript methods for Routing servicecontroller Functions </summary>

'use strict';
robs.controller('servicecontroller', ['$http','$scope','$location','$rootScope','logger','servicesservice','printservice','appvariables','filterfunction','utilities','ngDialog','$q','$sce', function ($http,$scope,$location,$rootScope,logger,servicesservice,printservice,appvariables,filterfunction,utilities,ngDialog,$q,$sce){
    // payload - billing, order, goldsmith and stock
    $rootScope.billdata  ={
        // common parameters for any transaction
        'company':$rootScope.company,
        'customer':0,
        'customername':'',
        'customertype':1,
        'customeroutstandingtype':0,
        'customercreditlimit':0,
        'customeroutstanding':0,
        'store':0,
        'package':0,
        'packagecode':'',
        'product':0,
        'productcode':'',
        'category':0,
        'metalrate':0,
        'quantity':0,
        'weight':0,
        'purity':0,
        'makingexpense':0,
        'makingcharge':0,
        'valueaddition':0,
        'wastage':0,
        'stoneweight':0,
        'stonevalue':0,
        'receiptno':0,
        'transactionid':0,
        'transactiondate':$rootScope.currentdate,
        'transactiontype':0,
        'transactiondetail':'',     // line item details
        'duedate':$rootScope.currentdate,

        // parameters for sales approval return (pre-billing scenario)
        'returnquantity':0,
        'returnproductvalue':0,
        'calculatedweight':0,

        // parameters for old gold purchase (purity test scenario)
        'testweight':0,
        'testreturnweight':0,
        'puregoldweight':0,
        'testpurity':0,

        // parameters for goldsmith issue and return
        'goldsmithtransactiontype':5,
        'issueoldgoldweight':0,
        'issueoldgoldpurity':0,
        'issueoldgoldnetweight':0,
        'issue995goldweight':0,
        'issue995goldpurity':0,
        'issue995goldnetweight':0,
        'netgoldsmithissueweight':0,
        'netgoldsmithreturnweight':0,

        // parameters for cash transactions (receipt in sales , issue in gold smith)
        'cashissued':0,
        'cashreceived':0,
        'netcashissueweight':0,

        // parameters for logging
        'user':$rootScope.loggedinuser,
        'comments':'',
        'selecteditemunit':'gm',

        // parameters to control transaction summary
        'updatesummary':0
    };
    $rootScope.stockdata ={
        'company':$rootScope.company,
        'store':0,
        'package':0,
        'packagecode':'',
        'category':0,
        'categoryname':'',
        'metalrate':0,
        'quantity':0,
        'weight':0,
        'purity':0,
        'va':0,
        'vamin':0,
        'vamax':0,
        'vapercentage':0,
        'vacustomertype':1,
        'opstockquantity':0,
        'opstockweight':0,
        'diplaystockquantity':0,
        'diplaystockweight':0,
        'godownstockquantity':0,
        'godownstockweight':0,
        'netstockquantity':0,
        'netstockweight':0,
        'totalpackagequantity':0,
        'totalpackageweight':0,
        'diplaystockquantitytemp':0,
        'diplaystockweighttemp':0,
        'godownstockquantitytemp':0,
        'godownstockweighttemp':0,
        'storedisplay':appvariables.get('storetype')[0].display,
        'storegodown':appvariables.get('storetype')[0].godown,
        'transactiondate':$rootScope.currentdate,
        'user':$rootScope.loggedinuser,
        'movementquantity':0,
        'movementweight':0,
        'newdiplaystockquantity':0,
        'newdiplaystockweight':0,
        'newgodownstockquantity':0,
        'newgodownstockweight':0,
        'movementtype':1,
        'comments':''
    };
    $rootScope.addressdata = {
        'company': $rootScope.company,
        'cname':'',
        'addressline':'',
        'district':'',
        'state':'',
        'contact':0,
        'customertype':appvariables.get('customertype')[0].order
    };
    $rootScope.customertransactionsummary={
        'totalsaleqty':0,
        'totalsaleweight':0,
        'totalpurchaseqty':0,
        'totalpurchaseweight':0,
        'totalcash':0,
        'totalsalesreturnqty':0,
        'totalsalesreturnweight':0
    };  // summary of customer transactions
    $rootScope.editbilldata  ={
        // common parameters for any edit bill
        'company':$rootScope.company,
        'customer':0,
        'customertype':1,
        'store':0,
        'package':0,
        'packagecode':'',
        'packagename':'',
        'product':0,
        'productcode':'',
        'category':0,
        'categoryname':'',
        'newpackage':0,
        'newpackagecode':'',
        'newpackagename':'',
        'newproduct':0,
        'newproductcode':'',
        'newcategory':0,
        'metalrate':0,
        'quantity':0,
        'weight':0,
        'purity':0,
        'makingexpense':0,
        'makingcharge':0,
        'valueaddition':0,
        'wastage':0,
        'stoneweight':0,
        'stonevalue':0,
        'receiptno':0,
        'transactionid':0,
        'transactiondate':$rootScope.currentdate,
        'transactiontype':0,
        'transactiondetail':'',     // line item details
        'duedate':$rootScope.currentdate,

        // parameters for logging
        'user':$rootScope.loggedinuser,
        'comments':'',
        'selecteditemunit':'gm',

        // parameters to control transaction summary
        'updatesummary':1
    };

    // methods - billing screen
    $scope.liststore =function(){
        servicesservice.liststore($rootScope.billdata,function(data){
            if (data!=undefined){
                $rootScope.liststores=data;
            }
            else{
                logger.logWarning('no store available');
            }
        });
        $rootScope.billdata.store=1;
        $rootScope.stockdata.store=1;
    };
    $scope.loadcustomer =function(customertype){
        $scope.closepanel();
        $rootScope.transactiondetails=[];
        $rootScope.transactionsummary=[];
        $rootScope.transactionbilldetails=[];

        $rootScope.billdata.customertype=customertype;
        servicesservice.loadcustomer($rootScope.billdata,function(data){
            $scope.calculation=false;
            $scope.expenselist=false;
            if (data!=undefined){
                $scope.listcustomer=data;
                if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].self){
                    $scope.billcustomer = $scope.listcustomer[0];
                    $scope.onchangecustomer($scope.billcustomer);
                    $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].purchase;
                    $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
                    $rootScope.billdata.metalrate=appvariables.get('wholesalerate');
                }
            }
            else{
                logger.logWarning('unable to load customer.');
            }
        });
    };
    $scope.listitemcategory =function(){
        servicesservice.listcategory($rootScope.billdata,function(data){
            if (data!=undefined){
                $scope.listcategories=data;
            }
            else{
                logger.logWarning('unable to load category.');
            }
        });
    };
    $scope.listtransaction =function(){
        //var deferred = $q.defer();
        if ($rootScope.billdata.customer==0){
            logger.logWarning('please select customer');
            return;
        };
        servicesservice.listtransaction($rootScope.billdata,function(response){
            if (response!=undefined){
                if (response[0].result !='NODATA' && response[0].result != 'ERROR') {
                    $rootScope.transactionsummary=response[0];
                    $rootScope.transactiondetails=response[1];
                    $rootScope.transactionbilldetails=response[2];
                    $rootScope.transactiondetailsfordisplay=response[1];

                    $rootScope.customertransactionsummary.totalsaleqty =0;
                    $rootScope.customertransactionsummary.totalsaleweight =0;
                    $rootScope.customertransactionsummary.totalpurchaseqty =0;
                    $rootScope.customertransactionsummary.totalpurchaseweight =0;
                    $rootScope.customertransactionsummary.totalcash =0;
                    $rootScope.customertransactionsummary.totalsalesreturnqty =0;
                    $rootScope.customertransactionsummary.totalsalesreturnweight =0;

                    var currenttransaction;
                    for(var key in $rootScope.transactiondetailsfordisplay) {
                        currenttransaction = $rootScope.transactiondetailsfordisplay[key];
                        if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].sales && currenttransaction.product_code == appvariables.get('productcode')[0].gold){
                            $rootScope.customertransactionsummary.totalsaleqty += currenttransaction.quantity;
                            $rootScope.customertransactionsummary.totalsaleweight += currenttransaction.productvalue;
                        }
                        else if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].purchase && currenttransaction.product_code == appvariables.get('productcode')[0].oldgold){
                            $rootScope.customertransactionsummary.totalpurchaseqty += currenttransaction.quantity;
                            $rootScope.customertransactionsummary.totalpurchaseweight += currenttransaction.productvalue;
                        }
                        else if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].cashreceipt && currenttransaction.product_code == appvariables.get('productcode')[0].cash){
                            $rootScope.customertransactionsummary.totalcash += currenttransaction.productvalue;
                        }
                        else if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].salesreturn && currenttransaction.product_code == appvariables.get('productcode')[0].gold){
                            $rootScope.customertransactionsummary.totalsalesreturnqty += currenttransaction.quantity;
                            $rootScope.customertransactionsummary.totalsalesreturnweight += currenttransaction.productvalue;
                        }
                    }

                    $rootScope.customertransactionsummary.totalsaleqty =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsaleqty,0);
                    $rootScope.customertransactionsummary.totalsaleweight =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsaleweight,3);
                    $rootScope.customertransactionsummary.totalpurchaseqty =utilities.roundtodecimal($rootScope.customertransactionsummary.totalpurchaseqty,0);
                    $rootScope.customertransactionsummary.totalpurchaseweight =utilities.roundtodecimal($rootScope.customertransactionsummary.totalpurchaseweight,3);
                    $rootScope.customertransactionsummary.totalcash =utilities.roundtodecimal($rootScope.customertransactionsummary.totalcash,2);
                    $rootScope.customertransactionsummary.totalsalesreturnqty =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsalesreturnqty,0);
                    $rootScope.customertransactionsummary.totalsalesreturnweight =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsalesreturnweight,3);

                    if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].wholesale){
                        $rootScope.billdata.customercreditlimit=response[0][0].creditlimitweight;
                        $rootScope.billdata.customeroutstanding=response[0][0].outstandingweight;
                    }
                    else if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].retail){
                        $rootScope.billdata.customercreditlimit=utilities.roundtodecimal(response[0][0].creditlimitcash);
                        $rootScope.billdata.customeroutstanding= utilities.roundtodecimal(response[0][0].outstandingcash);
                    }
                    // generate smith issue and return data
                    if ($rootScope.billdata.customertype == appvariables.get('customertype')[0].goldsmith){
                        //$scope.filtergoldsmithtransaction($rootScope.transactiondetails);
                        $rootScope.issuedetail=[];
                        $rootScope.returndetail=[];

                        $rootScope.billdata.customeroutstanding =0 ;
                        if (response[0][0] != undefined){
                            $rootScope.billdata.customeroutstanding=response[0][0].outstandingweight;
                        }

                        var issuelist=filterfunction.filterarray($rootScope.transactiondetails,{transactiontype:appvariables.get('transactiontype')[0].issue});
                        var returnlist=filterfunction.filterarray($rootScope.transactiondetails,{transactiontype:appvariables.get('transactiontype')[0].return});

                        var transactiongroup  = _.groupBy(issuelist, 'createddatetime');
                        var currenttransaction;
                        var rowdata;
                        var issuesummary, returnsummary;

                        // generate issue list
                        var transactionidlist=[];
                        for(var key in transactiongroup) {
                            var issuedata={
                                'company':$rootScope.billdata.company,
                                'customer':$rootScope.billdata.customer,
                                'store':$rootScope.billdata.store,
                                'transactiondate':'',
                                'olggoldweight':0,
                                'oldgoldpurity':'',
                                'ct995goldweight':'',
                                'cashissued':0,
                                'metalrate':'',
                                'netweightissued':0,
                                'user':0,
                                'comments':''
                            };
                            currenttransaction = transactiongroup[key];
                            for (var row in currenttransaction) {
                                rowdata = currenttransaction[row];
                                if (issuedata.transactiondate == '') {
                                    issuedata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                                }
                                if (issuedata.user == '') {
                                    issuedata.user = rowdata.loginuserfname;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].oldgold) {
                                    issuedata.olggoldweight = +issuedata.olggoldweight + +rowdata.productvalue;
                                    issuedata.oldgoldpurity = rowdata.purity;
                                    transactionidlist.push(rowdata.transactionid);
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].cash) {
                                    issuedata.cashissued = +issuedata.cashissued + +rowdata.productvalue;
                                    issuedata.metalrate = rowdata.rate;
                                    transactionidlist.push(rowdata.transactionid);
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                                    issuedata.ct995goldweight = +issuedata.ct995goldweight + +rowdata.productvalue;
                                    transactionidlist.push(rowdata.transactionid);
                                }
                            }
                            issuedata.netweightissued=0;
                            if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
                                for (var tid in transactionidlist){
                                    var billweight;
                                    billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:transactionidlist[tid]});
                                    if (billweight[0].calculatedweight === '' | billweight[0].calculatedweight==undefined){

                                    }
                                    else{
                                        issuedata.netweightissued = +issuedata.netweightissued + +billweight[0].calculatedweight;
                                    }
                                }
                                issuedata.netweightissued = utilities.roundtodecimal(issuedata.netweightissued,3);
                            }

                            $rootScope.issuedetail.push(issuedata);
                        };

                        // generate return list
                        transactiongroup  = _.groupBy(returnlist, 'transactionid');
                        for(var key in transactiongroup) {
                            var returndata={
                                'company':$rootScope.billdata.company,
                                'customer':$rootScope.billdata.customer,
                                'store':$rootScope.billdata.store,
                                'transactiondate':'',
                                'item':0,
                                'category':'',
                                'quantity':'',
                                'weight':'',
                                'stoneweight':0,
                                'stonevalue':0,
                                'metalrate':'',
                                'valueaddition':0,
                                'wastage':0,
                                'purity':0,
                                'makingexpense':0,
                                'netweightreturned':'',
                                'user':''
                            };
                            var billweight=0;
                            returndata.netweightreturned=0;
                            if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
                                billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:key});
                                returndata.netweightreturned=billweight[0].calculatedweight;
                            }
                            currenttransaction = transactiongroup[key];
                            for (var row in currenttransaction) {
                                rowdata = currenttransaction[row];
                                if (returndata.transactiondate == '') {
                                    returndata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                                }
                                if (returndata.user == '') {
                                    returndata.user = rowdata.loginuserfname;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                                    returndata.item = rowdata.package_name;
                                    returndata.category = rowdata.categoryname;
                                    returndata.metalrate = rowdata.rate;
                                    returndata.quantity = rowdata.quantity;
                                    returndata.weight = rowdata.productvalue;
                                    returndata.purity = rowdata.purity;
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                                    returndata.makingexpense = rowdata.productvalue;
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                                    returndata.valueaddition = rowdata.productvalue;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                                    returndata.stoneweight = rowdata.productvalue;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                                    returndata.stonevalue = rowdata.productvalue;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                                    returndata.wastage = rowdata.productvalue;
                                }
                                if(currenttransaction[+row + +1] == undefined){
                                    $rootScope.returndetail.push(returndata);
                                }
                            }
                        }
                    }
                }
                else if (response[0].result != 'ERROR') {
                    logger.logError("unable to load transactions. please contact support");
                }
            }
            else{
                logger.logWarning('no transaction available');
            }
        });
        //return deferred.promise;
    };
    $scope.listtransactionfortype =function(){
        if ($rootScope.billdata.customer==0){
            logger.logWarning('please select customer');
            return;
        };
        servicesservice.listtransactionfortype($rootScope.billdata,function(response){
            if (response!=undefined){
                if (response[0].result !='NODATA' && response[0].result != 'ERROR') {
                    $rootScope.transactionsummary=response[0];
                    $rootScope.transactiondetails=response[1];
                    $rootScope.transactionbilldetails=response[2];
                    $rootScope.transactiondetailsfordisplay=response[1];

                    $rootScope.customertransactionsummary.totalsaleqty =0;
                    $rootScope.customertransactionsummary.totalsaleweight =0;
                    $rootScope.customertransactionsummary.totalpurchaseqty =0;
                    $rootScope.customertransactionsummary.totalpurchaseweight =0;
                    $rootScope.customertransactionsummary.totalcash =0;
                    $rootScope.customertransactionsummary.totalsalesreturnqty =0;
                    $rootScope.customertransactionsummary.totalsalesreturnweight =0;

                    var currenttransaction;
                    for(var key in $rootScope.transactiondetailsfordisplay) {
                        currenttransaction = $rootScope.transactiondetailsfordisplay[key];
                        if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].sales && currenttransaction.product_code == appvariables.get('productcode')[0].gold){
                            $rootScope.customertransactionsummary.totalsaleqty += currenttransaction.quantity;
                            $rootScope.customertransactionsummary.totalsaleweight += currenttransaction.productvalue;
                        }
                        else if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].purchase && currenttransaction.product_code == appvariables.get('productcode')[0].oldgold){
                            $rootScope.customertransactionsummary.totalpurchaseqty += currenttransaction.quantity;
                            $rootScope.customertransactionsummary.totalpurchaseweight += currenttransaction.productvalue;
                        }
                        else if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].cashreceipt && currenttransaction.product_code == appvariables.get('productcode')[0].cash){
                            $rootScope.customertransactionsummary.totalcash += currenttransaction.productvalue;
                        }
                        else if (currenttransaction.transactiontype == appvariables.get('transactiontype')[0].salesreturn && currenttransaction.product_code == appvariables.get('productcode')[0].gold){
                            $rootScope.customertransactionsummary.totalsalesreturnqty += currenttransaction.quantity;
                            $rootScope.customertransactionsummary.totalsalesreturnweight += currenttransaction.productvalue;
                        }
                    }

                    $rootScope.customertransactionsummary.totalsaleqty =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsaleqty,0);
                    $rootScope.customertransactionsummary.totalsaleweight =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsaleweight,3);
                    $rootScope.customertransactionsummary.totalpurchaseqty =utilities.roundtodecimal($rootScope.customertransactionsummary.totalpurchaseqty,0);
                    $rootScope.customertransactionsummary.totalpurchaseweight =utilities.roundtodecimal($rootScope.customertransactionsummary.totalpurchaseweight,3);
                    $rootScope.customertransactionsummary.totalcash =utilities.roundtodecimal($rootScope.customertransactionsummary.totalcash,2);
                    $rootScope.customertransactionsummary.totalsalesreturnqty =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsalesreturnqty,0);
                    $rootScope.customertransactionsummary.totalsalesreturnweight =utilities.roundtodecimal($rootScope.customertransactionsummary.totalsalesreturnweight,3);

                    if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].wholesale){
                        $rootScope.billdata.customercreditlimit=response[0][0].creditlimitweight;
                        $rootScope.billdata.customeroutstanding=response[0][0].outstandingweight;
                    }
                    else if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].retail){
                        $rootScope.billdata.customercreditlimit=utilities.roundtodecimal(response[0][0].creditlimitcash);
                        $rootScope.billdata.customeroutstanding= utilities.roundtodecimal(response[0][0].outstandingcash);
                    }
                    // generate smith issue and return data
                    if ($rootScope.billdata.customertype == appvariables.get('customertype')[0].goldsmith){
                        //$scope.filtergoldsmithtransaction($rootScope.transactiondetails);
                        $rootScope.issuedetail=[];
                        $rootScope.returndetail=[];

                        $rootScope.billdata.customeroutstanding =0 ;
                        if (response[0][0] != undefined){
                            $rootScope.billdata.customeroutstanding=response[0][0].outstandingweight;
                        }

                        var issuelist=filterfunction.filterarray($rootScope.transactiondetails,{transactiontype:appvariables.get('transactiontype')[0].issue});
                        var returnlist=filterfunction.filterarray($rootScope.transactiondetails,{transactiontype:appvariables.get('transactiontype')[0].return});

                        var transactiongroup  = _.groupBy(issuelist, 'createddatetime');
                        var currenttransaction;
                        var rowdata;
                        var issuesummary, returnsummary;

                        // generate issue list
                        var transactionidlist=[];
                        for(var key in transactiongroup) {
                            var issuedata={
                                'company':$rootScope.billdata.company,
                                'customer':$rootScope.billdata.customer,
                                'store':$rootScope.billdata.store,
                                'transactiondate':'',
                                'olggoldweight':0,
                                'oldgoldpurity':'',
                                'ct995goldweight':'',
                                'cashissued':0,
                                'metalrate':'',
                                'netweightissued':0,
                                'user':0,
                                'comments':''
                            };
                            currenttransaction = transactiongroup[key];
                            for (var row in currenttransaction) {
                                rowdata = currenttransaction[row];
                                if (issuedata.transactiondate == '') {
                                    issuedata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                                }
                                if (issuedata.user == '') {
                                    issuedata.user = rowdata.loginuserfname;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].oldgold) {
                                    issuedata.olggoldweight = +issuedata.olggoldweight + +rowdata.productvalue;
                                    issuedata.oldgoldpurity = rowdata.purity;
                                    transactionidlist.push(rowdata.transactionid);
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].cash) {
                                    issuedata.cashissued = +issuedata.cashissued + +rowdata.productvalue;
                                    issuedata.metalrate = rowdata.rate;
                                    transactionidlist.push(rowdata.transactionid);
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                                    issuedata.ct995goldweight = +issuedata.ct995goldweight + +rowdata.productvalue;
                                    transactionidlist.push(rowdata.transactionid);
                                }
                            }
                            issuedata.netweightissued=0;
                            if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
                                for (var tid in transactionidlist){
                                    var billweight;
                                    billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:transactionidlist[tid]});
                                    if (billweight[0].calculatedweight === '' | billweight[0].calculatedweight==undefined){

                                    }
                                    else{
                                        issuedata.netweightissued = +issuedata.netweightissued + +billweight[0].calculatedweight;
                                    }
                                }
                                issuedata.netweightissued = utilities.roundtodecimal(issuedata.netweightissued,3);
                            }

                            $rootScope.issuedetail.push(issuedata);
                        };

                        // generate return list
                        transactiongroup  = _.groupBy(returnlist, 'transactionid');
                        for(var key in transactiongroup) {
                            var returndata={
                                'company':$rootScope.billdata.company,
                                'customer':$rootScope.billdata.customer,
                                'store':$rootScope.billdata.store,
                                'transactiondate':'',
                                'item':0,
                                'category':'',
                                'quantity':'',
                                'weight':'',
                                'stoneweight':0,
                                'stonevalue':0,
                                'metalrate':'',
                                'valueaddition':0,
                                'wastage':0,
                                'purity':0,
                                'makingexpense':0,
                                'netweightreturned':'',
                                'user':''
                            };
                            var billweight=0;
                            returndata.netweightreturned=0;
                            if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
                                billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:key});
                                returndata.netweightreturned=billweight[0].calculatedweight;
                            }
                            currenttransaction = transactiongroup[key];
                            for (var row in currenttransaction) {
                                rowdata = currenttransaction[row];
                                if (returndata.transactiondate == '') {
                                    returndata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                                }
                                if (returndata.user == '') {
                                    returndata.user = rowdata.loginuserfname;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                                    returndata.item = rowdata.package_name;
                                    returndata.category = rowdata.categoryname;
                                    returndata.metalrate = rowdata.rate;
                                    returndata.quantity = rowdata.quantity;
                                    returndata.weight = rowdata.productvalue;
                                    returndata.purity = rowdata.purity;
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                                    returndata.makingexpense = rowdata.productvalue;
                                }
                                else if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                                    returndata.valueaddition = rowdata.productvalue;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                                    returndata.stoneweight = rowdata.productvalue;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                                    returndata.stonevalue = rowdata.productvalue;
                                }
                                if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                                    returndata.wastage = rowdata.productvalue;
                                }
                                if(currenttransaction[+row + +1] == undefined){
                                    $rootScope.returndetail.push(returndata);
                                }
                            }
                        }
                    }
                }
                else if (response[0].result != 'ERROR') {
                    logger.logError("unable to load transactions. please contact support");
                }
            }
            else{
                logger.logWarning('no transaction available');
            }
        });
    };

    $scope.filltransactionsupplementarydetails =function(tid){
        //clear and fill charges
        $rootScope.billdata.makingexpense=0;
        $rootScope.billdata.makingcharge=0;
        $rootScope.billdata.valueaddition=0;
        $rootScope.billdata.stoneweight=0;
        $rootScope.billdata.stonevalue=0;

        if ($rootScope.billdata.customer==0){
            logger.logWarning('please select customer');
            return;
        }
        if ($rootScope.transactiondetails.length==0){
            $scope.listtransaction();
        }
        if ($rootScope.transactiondetails.length==0){
            logger.logWarning('no transaction for selected customer.');
            return;
        }
        $scope.filteredtransactioncharges=filterfunction.filterarray($rootScope.transactiondetails,{transactionid:tid});

        var transactiongroup  = _.groupBy($scope.filteredtransactioncharges, 'transactionid');
        var currenttransaction;
        var rowdata;

        for(var key in transactiongroup) {
            currenttransaction = transactiongroup[key];
            for (var row in currenttransaction) {
                rowdata = currenttransaction[row];
                $rootScope.billdata.package = rowdata.package;
                $rootScope.billdata.packagecode = rowdata.packagecode;
                $rootScope.billdata.packagename = rowdata.package_name;

                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].sales) {
                    $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].sales;
                    if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                        $rootScope.billdata.category = rowdata.category;
                        $rootScope.billdata.metalrate = rowdata.rate;
                        $rootScope.billdata.quantity = rowdata.quantity;
                        $rootScope.billdata.weight = rowdata.productvalue;
                        $rootScope.billdata.purity = rowdata.purity;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                        $rootScope.billdata.makingexpense = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].makingcharge) {
                        $rootScope.billdata.makingcharge = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                        $rootScope.billdata.valueaddition = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                        $rootScope.billdata.stoneweight = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                        $rootScope.billdata.stonevalue = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                        $rootScope.billdata.wastage = rowdata.productvalue;
                    }
                }
                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].purchase) {
                    $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].purchase;
                    if (rowdata.product_code == appvariables.get('productcode')[0].oldgold) {
                        $rootScope.billdata.category = rowdata.category;
                        $rootScope.billdata.metalrate = rowdata.rate;
                        $rootScope.billdata.quantity = rowdata.quantity;
                        $rootScope.billdata.weight = rowdata.productvalue;
                        $rootScope.billdata.purity = rowdata.purity;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].testweight) {
                        $rootScope.billdata.testweight= rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].testreturn) {
                        $rootScope.billdata.testreturnweight= rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].testpurity) {
                        //$rootScope.billdata.testpurity= rowdata.productvalue;
                        $rootScope.billdata.testpurity= rowdata.purity;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].puregold) {
                        $rootScope.billdata.puregoldweight= rowdata.productvalue;
                    }
                }
                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].cashreceipt) {
                    $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].cashreceipt;
                    if (rowdata.product_code == appvariables.get('productcode')[0].cashreceipt) {
                        $rootScope.billdata.category = rowdata.category;
                        $rootScope.billdata.metalrate = rowdata.rate;
                        $rootScope.billdata.quantity = rowdata.quantity;
                        $rootScope.billdata.cashreceived = rowdata.productvalue;
                    }
                }
                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].salesreturn) {
                    $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].salesreturn;
                    if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                        $rootScope.billdata.category = rowdata.category;
                        $rootScope.billdata.metalrate = rowdata.rate;
                        $rootScope.billdata.quantity = rowdata.quantity;
                        $rootScope.billdata.weight = rowdata.productvalue;
                        $rootScope.billdata.purity = rowdata.purity;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                        $rootScope.billdata.makingexpense = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].makingcharge) {
                        $rootScope.billdata.makingcharge = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                        $rootScope.billdata.valueaddition = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                        $rootScope.billdata.stoneweight = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                        $rootScope.billdata.stonevalue = rowdata.productvalue;
                    }
                    else if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                        $rootScope.billdata.wastage = rowdata.productvalue;
                    }
                }
            }
        }
        //$('#billchargemc').focus();
    };
    $scope.filterlisttransactionforbill =function(rowdata){
        // clear charges for each selection.
        $rootScope.billdata.makingexpense=0;
        $rootScope.billdata.makingcharge=0;
        $rootScope.billdata.valueaddition=0;
        $rootScope.billdata.stoneweight=0;
        $rootScope.billdata.stonevalue=0;

        $rootScope.billdata.transactionid=rowdata.transactionid;
        $rootScope.billdata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');

        if ($rootScope.billdata.transactionid==0 || $rootScope.billdata.transactionid==undefined){
            logger.logWarning('please select transaction item.');
        }
        else{
            $rootScope.listtransactioncharges=filterfunction.filterarray($rootScope.transactiondetails,{transactionid:rowdata.transactionid});
            $scope.filltransactionsupplementarydetails(rowdata.transactionid);
        }
    };
    $scope.filtergoldsmithtransaction =function(gstransactionlist){
        $rootScope.issuedetail=[];
        $rootScope.returndetail=[];

        var issuelist=filterfunction.filterarray(gstransactionlist,{transactiontype:appvariables.get('transactiontype')[0].issue});
        var returnlist=filterfunction.filterarray($rootScope.transactiondetails,{transactiontype:appvariables.get('transactiontype')[0].return});

        var transactiongroup  = _.groupBy(issuelist, 'transactiondate');
        var currenttransaction;
        var rowdata;
        var issuesummary, returnsummary;

        // generate issue list
        var issuedata={
            'company':$rootScope.billdata.company,
            'customer':$rootScope.billdata.customer,
            'store':$rootScope.billdata.store,
            'transactiondate':'',
            'olggoldweight':0,
            'oldgoldpurity':'',
            'ct995goldweight':'',
            'cashissued':0,
            'metalrate':'',
            'netweightissued':0,
            'user':0,
            'comments':''
        };

        //for(var key in transactiongroup) {
        //    var issuedata={
        //        'company':$rootScope.billdata.company,
        //        'customer':$rootScope.billdata.customer,
        //        'store':$rootScope.billdata.store,
        //        'transactiondate':'',
        //        'olggoldweight':0,
        //        'oldgoldpurity':'',
        //        'ct995goldweight':'',
        //        'cashissued':0,
        //        'metalrate':'',
        //        'netweightissued':0,
        //        'user':0,
        //        'comments':''
        //    };
        //    var billweight=0;
        //    issuedata.netweightissued=0;
        //    if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
        //        billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:key});
        //        issuedata.netweightissued=billweight[0].calculatedweight;
        //    }
        //    currenttransaction = transactiongroup[key];
        //    for (var row in currenttransaction) {
        //        rowdata = currenttransaction[row];
        //        if (issuedata.transactiondate == '') {
        //            issuedata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
        //        }
        //        if (issuedata.user == '') {
        //            issuedata.user = rowdata.loginuserfname;
        //        }
        //        if (rowdata.product_code == appvariables.get('productcode')[0].oldgold) {
        //            issuedata.olggoldweight = rowdata.productvalue;
        //            issuedata.oldgoldpurity = rowdata.purity;
        //        }
        //        else if (rowdata.product_code == appvariables.get('productcode')[0].cash) {
        //            issuedata.cashissued = rowdata.productvalue;
        //            issuedata.metalrate = rowdata.rate;
        //        }
        //        else if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
        //            issuedata.ct995goldweight = rowdata.productvalue;
        //        }
        //        if(currenttransaction[+row + +1] == undefined){
        //            $rootScope.issuedetail.push(issuedata);
        //        }
        //    }
        //};

        var transactionidlist=[];
        for(var key in transactiongroup) {
            currenttransaction = transactiongroup[key];
            for (var row in currenttransaction) {
                rowdata = currenttransaction[row];
                if (issuedata.transactiondate == '') {
                    issuedata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                }
                if (issuedata.user == '') {
                    issuedata.user = rowdata.loginuserfname;
                }
                if (rowdata.product_code == appvariables.get('productcode')[0].oldgold) {
                    issuedata.olggoldweight = +issuedata.olggoldweight + +rowdata.productvalue;
                    issuedata.oldgoldpurity = rowdata.purity;
                    transactionidlist.push(rowdata.transactionid);
                }
                else if (rowdata.product_code == appvariables.get('productcode')[0].cash) {
                    issuedata.cashissued = +issuedata.cashissued + +rowdata.productvalue;
                    issuedata.metalrate = rowdata.rate;
                    transactionidlist.push(rowdata.transactionid);
                }
                else if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                    issuedata.ct995goldweight = +issuedata.ct995goldweight + +rowdata.productvalue;
                    transactionidlist.push(rowdata.transactionid);
                }
            }
            issuedata.netweightissued=0;
            if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
                for (var tid in transactionidlist){
                    var billweight;
                    billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:transactionidlist[tid]});
                    if (billweight[0].calculatedweight === '' | billweight[0].calculatedweight==undefined){

                    }
                    else{
                        issuedata.netweightissued = +issuedata.netweightissued + +billweight[0].calculatedweight;
                    }
                }
                issuedata.netweightissued = utilities.roundtodecimal(issuedata.netweightissued,3);
            }
            $rootScope.issuedetail.push(issuedata);
        };

        // generate return list
        transactiongroup  = _.groupBy(returnlist, 'transactionid');
        for(var key in transactiongroup) {
            var returndata={
                'company':$rootScope.billdata.company,
                'customer':$rootScope.billdata.customer,
                'store':$rootScope.billdata.store,
                'transactiondate':'',
                'item':0,
                'category':'',
                'quantity':'',
                'weight':'',
                'stoneweight':0,
                'stonevalue':0,
                'metalrate':'',
                'valueaddition':0,
                'wastage':0,
                'purity':0,
                'makingexpense':0,
                'netweightreturned':'',
                'user':''
            };
            var billweight=0;
            returndata.netweightreturned=0;
            if ($rootScope.transactionbilldetails != '' || $rootScope.transactionbilldetails != undefined){
                billweight=filterfunction.filterarray($rootScope.transactionbilldetails,{transactionid:key});
                returndata.netweightreturned=billweight[0].calculatedweight;
            }
            currenttransaction = transactiongroup[key];
            for (var row in currenttransaction) {
                rowdata = currenttransaction[row];
                if (returndata.transactiondate == '') {
                    returndata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                }
                if (returndata.user == '') {
                    returndata.user = rowdata.loginuserfname;
                }
                if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                    returndata.item = rowdata.package_name;
                    returndata.category = rowdata.categoryname;
                    returndata.metalrate = rowdata.rate;
                    returndata.quantity = rowdata.quantity;
                    returndata.weight = rowdata.productvalue;
                    returndata.purity = rowdata.purity;
                }
                else if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                    returndata.makingexpense = rowdata.productvalue;
                }
                else if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                    returndata.valueaddition = rowdata.productvalue;
                }
                if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                    returndata.stoneweight = rowdata.productvalue;
                }
                if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                    returndata.stonevalue = rowdata.productvalue;
                }
                if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                    returndata.wastage = rowdata.productvalue;
                }
                if(currenttransaction[+row + +1] == undefined){
                    $rootScope.returndetail.push(returndata);
                }
            }
        }
    };
    $scope.excludetransactionfrombill =function(event,rowdata){
        if (rowdata != undefined){
            for(var key in $rootScope.transactionalcharges) {
                if ($rootScope.transactionalcharges[key].transactionid == rowdata.transactionid){
                    $rootScope.transactionalcharges[key].excludetransaction=event.currentTarget.value;
                }
            }
        }
    }
    $scope.listbillcharges =function(){
        var billcharges=[];
        $rootScope.transactionalcharges='';
        // validation
        if ($rootScope.billdata.customer==0){
            logger.logWarning('please select customer');
            return;
        }
        if ($rootScope.transactiondetails.length==0){
            $scope.listtransaction();
        }
        if ($rootScope.transactiondetails.length==0){
            logger.logWarning('no transaction for selected customer.');
            return;
        }

        var transactiongroup  = _.groupBy($rootScope.transactiondetails, 'transactionid');
        var currenttransaction;
        var rowdata;

        for(var key in transactiongroup) {
            var billchargedata={
                'company':$rootScope.billdata.company,
                'customer':$rootScope.billdata.customer,
                'store':$rootScope.billdata.store,
                'package':0,
                'packagecode':'',
                'packagename':'',
                'product':0,
                'productcode':'',
                'category':0,
                'metalrate':0,
                'quantity':0,
                'weight':0,
                'purity':0,
                'transactionid':0,
                'transactiondate':'',
                'transactiontype':0,
                'customertype':$rootScope.billdata.customertype,
                'customeroutstandingtype':$rootScope.billdata.customeroutstandingtype,
                'wastage':'-',
                'makingexpense':'-',
                'makingcharge':'-',
                'valueaddition':'-',
                'stoneweight':'-',
                'stonevalue':'-',
                'user':$rootScope.loggedinuser,
                'comments':'bill charges',
                'updatesummary':0,
                'excludetransaction':0,
                'purchaseweight':0,
                'testweight':0,
                'testreturnweight':0,
                'puregoldweight':0,
                'cashreceived':0
            };

            currenttransaction = transactiongroup[key];
            for (var row in currenttransaction) {
                rowdata = currenttransaction[row];

                if (billchargedata.customer == 0) {
                    billchargedata.customer = rowdata.customer;
                }
                if (billchargedata.transactionid == 0) {
                    billchargedata.transactionid = rowdata.transactionid;
                }
                if (billchargedata.transactiondate == '') {
                    billchargedata.transactiondate = utilities.date2Format(rowdata.transactiondate,'yyyy/mm/dd');
                }
                if (billchargedata.package == 0) {
                    billchargedata.package = rowdata.package;
                }
                if (billchargedata.packagename == 0) {
                    billchargedata.packagename = rowdata.package_name;
                }
                if (billchargedata.packagecode == 0) {
                    billchargedata.packagecode = rowdata.packagecode;
                }

                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].sales) {
                    billchargedata.transactiontype=appvariables.get('transactiontype')[0].sales;
                    if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                        billchargedata.category = rowdata.category;
                        billchargedata.metalrate = rowdata.rate;
                        billchargedata.quantity = rowdata.quantity;
                        billchargedata.weight = rowdata.productvalue;
                        billchargedata.purity = rowdata.purity;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                        billchargedata.makingexpense = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].makingcharge) {
                        billchargedata.makingcharge = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                        billchargedata.valueaddition = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                        billchargedata.stoneweight = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                        billchargedata.stonevalue = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                        billchargedata.wastage = rowdata.productvalue;
                    }
                }
                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].purchase) {
                    billchargedata.transactiontype=appvariables.get('transactiontype')[0].purchase;
                    if (rowdata.product_code == appvariables.get('productcode')[0].oldgold |
                        rowdata.product_code == appvariables.get('productcode')[0].gold) {
                        billchargedata.category = rowdata.category;
                        billchargedata.metalrate = rowdata.rate;
                        billchargedata.quantity = rowdata.quantity;
                        billchargedata.weight = rowdata.productvalue;
                        billchargedata.purity = rowdata.purity;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].testweight) {
                        billchargedata.testweight= rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].testreturn) {
                        billchargedata.testreturnweight= rowdata.productvalue;
                    }
                }
                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].cashreceipt) {
                    billchargedata.transactiontype=appvariables.get('transactiontype')[0].cashreceipt;
                    if (rowdata.product_code == appvariables.get('productcode')[0].cash) {
                        billchargedata.category = rowdata.category;
                        billchargedata.metalrate = rowdata.rate;
                        billchargedata.quantity = rowdata.quantity;
                        billchargedata.weight = rowdata.productvalue;
                    }
                }
                if (rowdata.transactiontype == appvariables.get('transactiontype')[0].salesreturn) {
                    billchargedata.transactiontype=appvariables.get('transactiontype')[0].salesreturn;
                    if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                        billchargedata.category = rowdata.category;
                        billchargedata.metalrate = rowdata.rate;
                        billchargedata.quantity = rowdata.quantity;
                        billchargedata.weight = rowdata.productvalue;
                        billchargedata.purity = rowdata.purity;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].makingexpense) {
                        billchargedata.makingexpense = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].makingcharge) {
                        billchargedata.makingcharge = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                        billchargedata.valueaddition = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                        billchargedata.stoneweight = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].stonevalue) {
                        billchargedata.stonevalue = rowdata.productvalue;
                    }
                    if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                        billchargedata.wastage = rowdata.productvalue;
                    }
                }

                if(currenttransaction[+row + +1] == undefined){
                    billcharges.push(billchargedata);
                }
            }
        }
        $rootScope.transactionalcharges = billcharges;
    };
    $scope.listhistory =function(transaction){
        var formdata=$rootScope.billdata;
        $rootScope.billdata.transactionid=transaction.transactionid;
        if ($rootScope.billdata.customer==undefined || $rootScope.billdata.customer==0){
            logger.logWarning("please select customer.");
            return;
        }
        else{
            servicesservice.listhistory(formdata,function(responsedata){
                if (responsedata!=undefined){
                    $rootScope.transactionhistoryheader=responsedata[0];
                    $rootScope.transactionhistorybody=responsedata[1];
                    ngDialog.open({
                        template: 'modelhistory',
                        className: 'ngdialog-theme-default custom-width',
                        closeByDocument: false
                    });
                }
                else{
                    logger.logError("transaction history not available.");
                }
            });
        }
    };
    $scope.onchangecustomer =function(billcustomer){
        $rootScope.issuedetail=[];
        $rootScope.returndetail=[];
        $scope.closepanel();
        if (billcustomer != null){
            $rootScope.billdata.customer=billcustomer.customerid;
            $rootScope.billdata.customername=billcustomer.orgname;
            $rootScope.billdata.customeroutstandingtype=billcustomer.outstandingtype;
            if (billcustomer.customertype == appvariables.get('customertype')[0].wholesale || billcustomer.customertype == appvariables.get('customertype')[0].goldsmith
                 || billcustomer.customertype == appvariables.get('customertype')[0].self){
                $rootScope.billdata.metalrate=appvariables.get('wholesalerate');
            }
            else{
                $rootScope.billdata.metalrate=appvariables.get('retailrate');
            }
            $scope.listtransaction();
        }
        else{
            $rootScope.billdata.customer=0;
            $rootScope.billdata.package=0;
            $rootScope.billdata.packagecode='';
            $rootScope.billdata.product=0;
            $rootScope.billdata.productcode='';
            $rootScope.billdata.category=0;
            $rootScope.billdata.quantity=0;
            $rootScope.billdata.weight=0;
            $rootScope.billdata.purity=0;
            $rootScope.billdata.transactionid=0;
            $rootScope.billdata.comments='';
        }
    };
    $scope.onchangeitem =function(billpackage){
        if (billpackage != null){
            $rootScope.billdata.purity=billpackage.purity;
            $rootScope.billdata.package=billpackage.packages_id;
            $rootScope.billdata.product=billpackage.productid;
            $rootScope.billdata.packagecode=billpackage.packages_code;
            $rootScope.billdata.productcode=billpackage.productcode;

            $rootScope.editbilldata.newpurity=billpackage.purity;
            $rootScope.editbilldata.newpackage=billpackage.packages_id;
            $rootScope.editbilldata.newproduct=billpackage.productid;
            $rootScope.editbilldata.newpackagecode=billpackage.packages_code;
            $rootScope.editbilldata.newproductcode=billpackage.productcode;
            $rootScope.billdata.store=appvariables.get('storetype')[0].display;
        }
        else{
            $rootScope.billdata.package=0;
            $rootScope.billdata.packagecode='';
            $rootScope.billdata.product=0;
            $rootScope.billdata.productcode='';
            $rootScope.billdata.category=0;
            $rootScope.billdata.quantity=0;
            $rootScope.billdata.weight=0;
            $rootScope.billdata.purity=0;
            $rootScope.billdata.transactionid=0;
            $rootScope.billdata.comments='';
        }
    };
    $scope.onchangecategoryitem =function(stockpackage){
        if (stockpackage != null){
            $rootScope.stockdata.package=stockpackage.packages_id;
        }
    };
    $scope.onchangecategory =function(billcategory){
        if (billcategory != null){
            $rootScope.billdata.category=billcategory.categoryid;
            $rootScope.editbilldata.newcategory=billcategory.categoryid;
        }
    };
    $scope.onchangetransactiontype =function(selectedtabcontrol){
        // validate transaction for self
        $scope.closepanel();
        $rootScope.selectedtabcontrol =selectedtabcontrol;
        $rootScope.disablepurity=true;
        $scope.expenselist=false;
        $scope.cashflow=false;
        $scope.cashflowexpense=false;
        if (selectedtabcontrol=='cash'){
            $scope.cashflow=true;
        }
        if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].self){
            $scope.calculation=false;
            $scope.cashflow=true;
            $scope.cashflowexpense=true;
            if (selectedtabcontrol=='sales' | selectedtabcontrol=='sales return' | selectedtabcontrol=='pre-bill'){
                logger.logWarning("transaction not valid for selected customer type.")
                $scope.collapsepanel=false; // close all panel when self customer select unallowed transaction types.
                $scope.collapsebill=false;
                $rootScope.calculatedamount=0;
                return;
            }
            else{
                $rootScope.billdata.customer=$scope.billcustomer.customerid;
                $rootScope.billdata.valueaddition=0;
                $rootScope.calculatedamount=0;
                if (selectedtabcontrol=='cash'){
                    $scope.expenselist=true;
                }
            }
        }

        $scope.selectedtab=selectedtabcontrol;
        $scope.collapsepanel=false;
        $scope.collapsebill=false;
        $rootScope.calculatedamount=0;
        if (selectedtabcontrol=='sales' | selectedtabcontrol=='sales return'){
            $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].metal;
            $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].ornamentgold); // get all sellable packages
            $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: $rootScope.billdata.productcode}); // filter metal products for display
            //$scope.listpackage.splice(0,1); // remove 995 from sales or approval. uncommented as per request from business owner
            if (selectedtabcontrol=='sales'){
                $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].sales;
                $rootScope.billdata.store=appvariables.get('storetype')[0].display;    // set store to display store
                $rootScope.billdata.comments='approval ';
            }
            else if (selectedtabcontrol=='sales return'){
                $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].salesreturn;
                $rootScope.billdata.store=appvariables.get('storetype')[0].godown;    // set store to display store
                $rootScope.billdata.comments='sales return ';
            }
            $scope.collapsepanel=true;
            $scope.item=true;
            $scope.quantity=true;
            $scope.weight=true;
            $scope.rates=true;
            $scope.purity=true;
            $scope.category=true;
            $scope.comments=true;
            $scope.hidebutton=true;
            $scope.showsalesdetails=false;
            $scope.showpurchasedetails=false;
            $scope.amount=false;
            $scope.quantitylabel=true;
            $scope.weightlabel=true;
            $scope.approvals=true;

            $scope.calculation=false;
            $rootScope.billdata.updatesummary=1;
        }
        else if (selectedtabcontrol=='purchase'){
            $rootScope.billdata.comments='old gold purchase ';
            $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].oldgold;
            $rootScope.billdata.selecteditemunit='gm';
            $scope.listpackage = filterfunction.getpackagenames(appvariables.get('packagecode')[0].oldgold); // get all oldgold packages
            $scope.listpackage = filterfunction.filterarray($scope.listpackage,{productcode: $rootScope.billdata.productcode}); // filter metal products for display

            $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].metal;
            var billingpurchasepackagelist = filterfunction.getpackagenames(appvariables.get('packagecode')[0].gold995); // get all oldgold packages
            billingpurchasepackagelist = filterfunction.filterarray(billingpurchasepackagelist,{productcode: $rootScope.billdata.productcode}); // filter metal products for display
            $scope.listpackage = $scope.listpackage.concat(billingpurchasepackagelist)

            $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].purchase;
            $rootScope.billdata.rate=appvariables.get('wholesalerate');
            $rootScope.billdata.store=appvariables.get('storetype')[0].godown;    // set store to godown store
            $rootScope.billdata.quantity=1;
            $scope.collapsepanel=true;
            $scope.item=true;
            $scope.quantity=false;
            $scope.quantitylabel=false;
            $scope.weightlabel=true;
            $scope.weight=true;
            $scope.rates=true;
            $scope.purity=true;
            $scope.category=false;
            $scope.comments=true;
            $scope.hidebutton=true;
            $scope.showsalesdetails=false;
            $scope.showpurchasedetails=false;
            $scope.amount=false;
            $rootScope.disablepurity=false;
            $scope.calculation=true;
            if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].self){
                $scope.calculation=true;
            }
            $rootScope.billdata.updatesummary=1;
        }
        else if (selectedtabcontrol=='cash'){
            $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].cash;
            $rootScope.billdata.comments='cash received from ';
            $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].cashreceipt;
            $rootScope.billdata.selecteditemunit='rs';
            $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].cash); // get all sellable packages
            $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: appvariables.get('addonproductcode')[0].cash}); // filter metal products for display
            // set item cash default selected
            if ($scope.listpackage.length > 0){
                $scope.billpackage=$scope.listpackage[0];
                $rootScope.billdata.package=$scope.billpackage.packages_id;
            }
            $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
            $rootScope.billdata.quantity=1;
            $rootScope.billdata.purity=1;
            $rootScope.billdata.rate=1;
            $scope.collapsepanel=true;
            $scope.item=true;
            $scope.quantitylabel=false;
            $scope.quantity=false;
            $scope.weight=true;
            $scope.rates=false;
            $scope.purity=false;
            $scope.category=false;
            $scope.comments=true;
            $scope.hidebutton=true;
            $scope.showsalesdetails=false;
            $scope.showpurchasedetails=false;
            $scope.amount=true;
            $scope.weightlabel=false;
            $scope.approvals=false;

            $scope.cashtransactiontype=$rootScope.billdata.transactiontype;

            if ($rootScope.billdata.customertype==appvariables.get('customertype')[0].self){
                $scope.calculation=false;
            }
            else{
                $scope.calculation=true;
            }
            $rootScope.billdata.updatesummary=1;
        }
        else if (selectedtabcontrol=='pre-bill'){
            $rootScope.billdata.store=appvariables.get('storetype')[0].display;
            $scope.collapsepanel=false;
            $scope.collapsebill=true;
            $scope.showreturn=false;
            $scope.showcash=false;
            $scope.showbill=true;
            $scope.hidebutton=false;
            $scope.amount=false;
            $scope.quantitylabel=true;
            $scope.showsalesdetails=false;
            $scope.showpurchasedetails=false;
            $scope.approvals=false;
            $scope.showreturn=false;
            $scope.showbill=true;
            $scope.showcash=false;

            $scope.calculation=false;
            $scope.listbillcharges();
            $rootScope.billdata.updatesummary=1;
        }
        $scope.listtransaction();
    };
    $scope.cashflowchange =function(cashflowtype){
        if (cashflowtype==8){
            $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].cash;
            $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].cashreceipt;
            $rootScope.billdata.comments='cash received from ';

            $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].cash); // get all sellable packages
            $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: appvariables.get('addonproductcode')[0].cash}); // filter metal products for display
            // set item cash default selected
            if ($scope.listpackage.length > 0){
                $scope.billpackage=$scope.listpackage[0];
                $scope.onchangeitem($scope.billpackage);
            }
            $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
            $rootScope.billdata.quantity=1;
            $rootScope.billdata.purity=1;
            $rootScope.billdata.rate=1;
        }
        else{
            $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].cash;
            $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].cashpayment;
            $rootScope.billdata.comments='cash paid to ';
            $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].cash); // get all sellable packages
            $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: appvariables.get('addonproductcode')[0].cash}); // filter metal products for display
            // set item cash default selected
            if ($scope.listpackage.length > 0){
                $scope.billpackage=$scope.listpackage[0];
                $scope.onchangeitem($scope.billpackage);
            }
            $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
            $rootScope.billdata.quantity=1;
            $rootScope.billdata.purity=1;
            $rootScope.billdata.rate=1;
        }
        $scope.cashtransactiontype=$rootScope.billdata.transactiontype;
    };

    $scope.validateinput =function(){
        var validationsuccess=true;
        var verifycustomer=true, verifypackage=true, verifycategory=true, verifypurity=true, verifyquantity=true, verifyweight=true, verifycomments=true, verifyoutstanding=true;

        switch (+$rootScope.billdata.transactiontype) {
            case 1: // sales
                break;
            case 2: // purchase
                verifycategory=false;
                verifycomments=false;
                verifyoutstanding=false;
                verifypurity=false;
                break;
            case 3: // salesreturn
                verifycomments=false;
                verifyoutstanding=false;
                break;
            case 4: // old gold test
                verifycategory=false;
                verifyquantity=false;
                verifycomments=false;
                verifyoutstanding=false;
                break;
            case 5: // goldsmith issue
                verifycategory=false;
                verifyquantity=false;
                verifycomments=false;
                verifypackage=false;
                verifypurity=false;
                verifyweight=false;
                break;
            case 6: // goldsmith return
                verifycomments=false;
                verifyoutstanding=false;
                break;
            case 7: // cashpayment
                verifycategory=false;
                verifypurity=false;
                verifyquantity=false;
                verifycomments=false;
                verifyoutstanding=false;
                break;
            case 8: // cashreceipt
                verifycategory=false;
                verifypurity=false;
                verifyquantity=false;
                verifycomments=false;
                verifyoutstanding=false;
                break;
            case 9: // order
                verifycustomer=false;
                verifyoutstanding=false;
                break;
            default:
                logger.logWarning('invalid transaction type. aborting save');
                return;
        }

        // verify input values
        if ($rootScope.billdata.customer==0 && verifycustomer){
            logger.logWarning('please select customer');
            validationsuccess=false;
        }
        //else if(verifyoutstanding){
        //    if ($rootScope.billdata.customeroutstandingtype=appvariables.get('outstandingtype')[0].weightbalance){
        //        if (transactionsummary[0].creditlimitweight < +transactionsummary[0].outstandingweight+ +$rootScope.billdata.weight){
        //            logger.logWarning('transaction exceeds customer weight credit limit.');
        //            validationsuccess=false;
        //        }
        //    }
        //    else if ($rootScope.billdata.customeroutstandingtype=appvariables.get('outstandingtype')[0].cashbalance){
        //        if (transactionsummary[0].creditlimitweight < +transactionsummary[0].outstandingweight+ +$rootScope.billdata.weight){
        //            logger.logWarning('transaction exceeds customer cash credit limit.');
        //            validationsuccess=false;
        //        }
        //    }
        //}
        else if($rootScope.billdata.package==0 && verifypackage){
            logger.logWarning('please select item');
            validationsuccess=false;
        }
        else if($rootScope.billdata.category==0 && verifycategory){
            logger.logWarning('please select category');
            validationsuccess=false;
        }
        else if(($rootScope.billdata.purity==0 || isNaN($rootScope.billdata.purity)) && verifypurity){
            logger.logWarning('invalid purity');
            validationsuccess=false;
        }
        else if(isNaN($rootScope.billdata.quantity) && verifyquantity){
            logger.logWarning('invalid quantity');
            validationsuccess=false;

            if (+$rootScope.billdata.quantity < +0){
                logger.logWarning('quantity cannot be negative');
            }
        }
        else if(($rootScope.billdata.weight==0 || isNaN($rootScope.billdata.weight)) && verifyweight){
            logger.logWarning('invalid metal weight or value');
            validationsuccess=false;
        }
        if ($rootScope.billdata.comments=='' && verifycomments){
            logger.logWarning('please enter order description');
            validationsuccess=false;
        }

        return validationsuccess;
    };
    $scope.savereturn =function(row){
        $rootScope.billdata.transactionid=row.transactionid;
        $rootScope.billdata.transactiontype=row.transactiontype;
        $rootScope.billdata.package=row.packageid;
        $rootScope.billdata.quantity= - +$rootScope.billdata.returnquantity;
        $rootScope.billdata.weight= - +$rootScope.billdata.returnproductvalue;
        $rootScope.billdata.category=row.category;
        $rootScope.billdata.product=row.productid;
        $rootScope.billdata.rate=row.rate;
        $rootScope.billdata.purity=row.purity;
        $rootScope.billdata.comments='approval return';
        $rootScope.billdata.updatesummary=1;
        this.savetransaction();
    };
    $scope.savetransaction =function(){
        $rootScope.billdata.duedate= utilities.date2Format($rootScope.billdata.duedate,'yyyy/mm/dd');
        $rootScope.billdata.transactiondate= utilities.date2Format($rootScope.billdata.transactiondate,'yyyy/mm/dd');
        if($rootScope.billdata.quantity==undefined){$rootScope.billdata.quantity=1;}              // set default quantity
        if($rootScope.billdata.transactionid==undefined){$rootScope.billdata.transactionid=0;}    // set no transaction id for new transaction
        if($rootScope.billdata.transactiontype == appvariables.get('transactiontype')[0].cashreceipt) { // input control for cash received & weight is same
            $rootScope.billdata.cashreceived=$rootScope.billdata.weight;
        }
        else{
            $rootScope.billdata.cashreceived=0;
        }

        //value addition

        var row;

        if ($rootScope.billdata.valueaddition == 0){
            for (var key in $rootScope.listallvalueaddition){
                row=$rootScope.listallvalueaddition[key];
                if (+row.customertype == +$rootScope.billdata.customertype && +row.packageid == +$rootScope.billdata.package
                        && +$rootScope.billdata.weight >= +row.minvalue && +$rootScope.billdata.weight <= +row.maxvalue){
                    $rootScope.billdata.valueaddition=row.va;
                    break;
                }
            }
        }

        // validate payload values
        if ($scope.validateinput()){
            // generate payload JSON format for order submission
            //var datapkgdetails = {
            //    'storeid':$rootScope.billdata.store,
            //    'package'	: $rootScope.billdata.package,
            //    'packagecode':$rootScope.billdata.packagecode,
            //    'product':$rootScope.billdata.product,
            //    'productcode': $rootScope.billdata.productcode,
            //    'category':$rootScope.billdata.category,
            //    'price':$rootScope.billdata.metalrate,
            //    'quantity': $rootScope.billdata.quantity,
            //    'weight':$rootScope.billdata.weight,
            //    'purity':$rootScope.billdata.purity
            //};

            var datapkgdetails = [];
            datapkgdetails.push({
                'storeid':$rootScope.billdata.store,
                    'package'	: $rootScope.billdata.package,
                    'packagecode':$rootScope.billdata.packagecode,
                    'product':$rootScope.billdata.product,
                    'productcode': $rootScope.billdata.productcode,
                    'category':$rootScope.billdata.category,
                    'price':$rootScope.billdata.metalrate,
                    'quantity': $rootScope.billdata.quantity,
                    'weight':$rootScope.billdata.weight,
                    'purity':$rootScope.billdata.purity
            });

            // add value addition dynamically for sales
            if ($rootScope.billdata.valueaddition>0){
                datapkgdetails.push({
                    "storeid": $rootScope.billdata.store,
                    "package": $rootScope.billdata.package,
                    "packagecode": $rootScope.billdata.packagecode,
                    "product": $rootScope.billdata.product,
                    "productcode": appvariables.get('productcode')[0].valueaddition,
                    "category": $rootScope.billdata.category,
                    "price": $rootScope.billdata.metalrate,
                    "quantity": "1",
                    "weight": $rootScope.billdata.valueaddition,
                    "purity": $rootScope.billdata.purity
                });
            }

            var pkgdata ={data:datapkgdetails};
            var x2js=new X2JS();
            var transactionData="<root>"+x2js.json2xml_str(pkgdata)+"</root>";
            $rootScope.billdata.transactiondetail=transactionData;
            servicesservice.savetransaction($rootScope.billdata,function(response){
                if (response!=undefined){
                    if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                        //$('#billingcustomer').focus();
                        $('#btnsales').focus();

                        // for transactiontype=purchase and customertype=self. post cash transaction on success of purchase
                        if (($rootScope.billdata.transactiontype == appvariables.get('transactiontype')[0].purchase) &&
                            ($rootScope.billdata.customertype == appvariables.get('customertype')[0].self)){

                            // prepare request for cash transaction
                            var listcashpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].cash); // get all sellable packages

                            var basepurity=appvariables.get('basepuritypercentage');
                            var retailrate=appvariables.get('retailrate');
                            var wholesalerate=appvariables.get('wholesalerate');
                            var calculatedpurchasedweight = utilities.roundtodecimal( ((+$rootScope.billdata.weight * +$rootScope.billdata.purity) / +basepurity),3);
                            var cashtobepaidagainstpurchase = calculatedpurchasedweight * retailrate;

                            $rootScope.billdata.transactiontype = appvariables.get('transactiontype')[0].cashpayment;
                            $rootScope.billdata.quantity = 1;
                            $rootScope.billdata.weight = cashtobepaidagainstpurchase;

                            var cashdatapkgdetails = [];
                            cashdatapkgdetails.push({
                                "storeid": $rootScope.billdata.store,
                                "package": listcashpackage[0].packages_id,
                                "packagecode": appvariables.get('packagecode')[0].cash,
                                "product": 0,
                                "productcode": appvariables.get('productcode')[0].cash,
                                "category": 0,
                                "price": $rootScope.billdata.metalrate,
                                "quantity": "1",
                                "weight": $rootScope.billdata.weight,
                                "purity": basepurity
                            });

                            var cashpkgdata ={data:cashdatapkgdetails};
                            var x2js=new X2JS();
                            var cashtransactionData="<root>"+x2js.json2xml_str(cashpkgdata)+"</root>";
                            $rootScope.billdata.transactiondetail=cashtransactionData;
                            servicesservice.savetransaction($rootScope.billdata,function(response) {
                                if (response != undefined) {
                                    if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                                        // show success message for transaction type self purchase
                                        logger.logSuccess('transaction saved.')
                                        $scope.closepanel();
                                        $scope.listtransaction();
                                        $scope.clearbilldata();
                                    }
                                }
                            });
                        }
                        else{
                            // show success message for transaction type other than self purchase
                            logger.logSuccess('transaction saved.')
                            $scope.closepanel();
                            $scope.listtransaction();
                            $scope.clearbilldata();
                        }
                        if ($rootScope.billdata.transactiontype == appvariables.get('transactiontype')[0].order){
                            $scope.listorder();
                        }
                    }
                    else{
                        logger.logError("unable to save transaction. please contact support.");
                    }
                }
                else{
                    logger.logWarning('transaction not added.');
                }
            });
        }
    };
    $scope.savebillcharges=function(rowdata){
        $rootScope.billdata.transactionid=rowdata.transactionid;
        $rootScope.billdata.transactiontype=rowdata.transactiontype;
        $rootScope.billdata.package=rowdata.packageid;
        $rootScope.billdata.packagecode=rowdata.packagecode;
        $rootScope.billdata.product=rowdata.productid;
        $rootScope.billdata.productcode=rowdata.product_code;
        $rootScope.billdata.category=rowdata.category;
        $rootScope.billdata.quantity=0;                             // set default quantity
        $rootScope.billdata.rate=rowdata.rate;
        $rootScope.billdata.purity=rowdata.purity;
        $rootScope.billdata.updatesummary=1;

        $rootScope.billdata.comments = 'transaction bill charges';

        var datapkgdetails = [];
        datapkgdetails.splice(0,datapkgdetails.length);

        // push Value Addition as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": rowdata.packageid,
            "packagecode": rowdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].valueaddition,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.valueaddition,
            "purity": $rootScope.billdata.purity
        });

        // push wastage as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].wastage,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.wastage,
            "purity": $rootScope.billdata.purity
        });

        // push stone weight issued as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].stoneweight,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.stoneweight,
            "purity": $rootScope.billdata.purity
        });

        // push Making Expense as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].makingexpense,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.makingexpense,
            "purity": $rootScope.billdata.purity
        });

        // push Making Charge as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].makingcharge,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.makingcharge,
            "purity": $rootScope.billdata.purity
        });

        // push Making Expense as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].makingexpense,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.makingexpense,
            "purity": $rootScope.billdata.purity
        });

        // push Stone Value as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].stonevalue,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.stonevalue,
            "purity": $rootScope.billdata.purity
        });

        var pkgdata = {data: datapkgdetails};
        var x2js = new X2JS();
        var transactionData = "<root>" + x2js.json2xml_str(pkgdata) + "</root>";
        $rootScope.billdata.transactiondetail = transactionData;

        $rootScope.billdata.updatesummary=1;
        servicesservice.savetransaction($rootScope.billdata, function (response) {
                if (response != undefined) {
                    if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                        $scope.listtransaction();
                        logger.logSuccess('transaction saved.')
                        $scope.clearbilldata();
                        $scope.closepanel();
                    }
                    else {
                        logger.logError("unable to save transaction. please contact support.");
                    }
                }
                else {
                    logger.logWarning('transaction not added.');
                }
            });
    };
    $scope.savetransactionpurchasetest=function(rowdata){
        $rootScope.billdata.transactionid=rowdata.transactionid;
        $rootScope.billdata.transactiontype=rowdata.transactiontype;
        $rootScope.billdata.package=rowdata.packageid;
        $rootScope.billdata.packagecode=rowdata.packagecode;
        $rootScope.billdata.product=rowdata.productid;
        $rootScope.billdata.productcode=rowdata.product_code;
        $rootScope.billdata.category=rowdata.category;
        $rootScope.billdata.quantity=0;                             // set default quantity
        $rootScope.billdata.rate=rowdata.rate;
        $rootScope.billdata.purity=rowdata.purity;
        $rootScope.billdata.updatesummary=1;

        $rootScope.billdata.comments = 'transaction bill charges';

        var datapkgdetails = [];
        datapkgdetails.splice(0,datapkgdetails.length);

        // push test purity as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": rowdata.packageid,
            "packagecode": rowdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].testpurity,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.testpurity,
            "purity": $rootScope.billdata.testpurity
        });

        // push test weight as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].testweight,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.testweight,
            "purity": $rootScope.billdata.purity
        });

        // push testreturnweight issued as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].testreturn,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.testreturnweight,
            "purity": $rootScope.billdata.purity
        });

        // push puregold as line item
        datapkgdetails.push({
            "storeid": rowdata.storeid,
            "package": $rootScope.billdata.package,
            "packagecode": $rootScope.billdata.packages_code,
            "product": $rootScope.billdata.product,
            "productcode": appvariables.get('productcode')[0].puregold,
            "category": $rootScope.billdata.category,
            "price": $rootScope.billdata.metalrate,
            "quantity": "1",
            "weight": $rootScope.billdata.puregoldweight,
            "purity": 100
        });

        var pkgdata = {data: datapkgdetails};
        var x2js = new X2JS();
        var transactionData = "<root>" + x2js.json2xml_str(pkgdata) + "</root>";
        $rootScope.billdata.transactiondetail = transactionData;

        $rootScope.billdata.updatesummary=1;
        servicesservice.savetransaction($rootScope.billdata, function (response) {
            if (response != undefined) {
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    $scope.listtransaction();
                    logger.logSuccess('transaction saved.')
                    $scope.clearbilldata();
                    $scope.closepanel();
                }
                else {
                    logger.logError("unable to save transaction. please contact support.");
                }
            }
            else {
                logger.logWarning('transaction not added.');
            }
        });
    };
    $scope.removetransaction =function(rowdata){
        $rootScope.billdata.comments='approval delete';
        $rootScope.billdata.transactiontype=rowdata.transactiontype;
        $rootScope.billdata.transactionid=rowdata.transactionid;
        $rootScope.billdata.package=rowdata.packageid;
        $rootScope.billdata.quantity= - +rowdata.quantity;
        $rootScope.billdata.weight= - +rowdata.productvalue;
        $rootScope.billdata.store=appvariables.get('storetype')[0].display;
        $rootScope.billdata.updatesummary=1;

        servicesservice.removetransaction($rootScope.billdata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR'){
                    logger.logSuccess('transaction removed.')
                    $scope.closepanel();
                    $scope.listtransaction();
                }
                else{
                    logger.logError("unable to complete your request. please contact support.");
                }
            }
            else{
                logger.logWarning('transaction not added.');
            }
        });
    };
    $scope.generatebill =function(billcharges,useraction){
        var uniquebilldates='';
        var uniquetransactionid='';
        var uniquetransactionidlist='';

        for(var key in $rootScope.transactionalcharges) {
            if ($rootScope.transactionalcharges[key].excludetransaction == 0){
                uniquebilldates=uniquebilldates+utilities.date2Format(billcharges[key].transactiondate,'yyyy/mm/dd');
                uniquetransactionid=uniquetransactionid+billcharges[key].transactionid;

                if (key < billcharges.length -1){
                    uniquebilldates=uniquebilldates+",";
                    uniquetransactionid=uniquetransactionid+",";
                }
            }
        }
        uniquetransactionidlist=uniquetransactionid;
        var uniquebilldates="<root><data><ddata>"+ uniquebilldates +"</ddata></data></root>";
        var uniquetransactionid="<root><data><tdata>"+ uniquetransactionid +"</tdata></data></root>"

        var formdata={
            'company':$rootScope.company,
            'customer':$rootScope.billdata.customer,
            'customertype':$rootScope.billdata.customertype,
            'customername':$rootScope.billdata.customername,
            'customeroutstandingtype':$rootScope.billdata.customeroutstandingtype,
            'billdates':uniquebilldates,
            'transactionidlist':uniquetransactionid,
            'actiontype':useraction
        }

        $rootScope.base64encodedpdf = '';
        var printoptions={
            'company':$rootScope.billdata.company,
            'customer':$rootScope.billdata.customer,
            'customertype':$rootScope.billdata.customertype,
            'transactionlist':uniquetransactionidlist,
            'billtype':'salesbill',
            'receiptno':0,
            'fromdate':'',
            'todate':'',
            'billdatafromclient':$rootScope.transactionalcharges,
            'action':useraction
        };
        printservice.salesbill(printoptions,function(response){
            $rootScope.base64encodedpdf = $sce.trustAsResourceUrl(response);
        });
        ngDialog.open({
            template: 'modelcustomerbill',
            className: 'ngdialog-theme-default custom-width',
            closeByDocument: false
        });

        //if($rootScope.billdata.customername == 'cash' && $rootScope.billdata.customertype == appvariables.get('customertype')[0].retail){
        //if($rootScope.billdata.customername.indexOf('cash') !== -1){
        //    servicesservice.clearoutstandingforcash(formdata,function(response){
        //        $rootScope.billdata.customeroutstanding=0;
        //    });
        //}
    };

    // methods - stock screen
    $scope.onchangestock =function(data){
        // move to display
        $rootScope.stockdata.movementtype=data;
        if ($rootScope.stockdata.movementtype==1){
            $rootScope.stockdata.diplaystockquantitytemp = $rootScope.stockdata.diplaystockquantity + +$rootScope.stockdata.movementquantity;
            $rootScope.stockdata.diplaystockweighttemp = +$rootScope.stockdata.diplaystockweight + +$rootScope.stockdata.movementweight;
            $rootScope.stockdata.godownstockquantitytemp = +$rootScope.stockdata.totalpackagequantity - +$rootScope.stockdata.diplaystockquantitytemp;
            $rootScope.stockdata.godownstockweighttemp = +$rootScope.stockdata.totalpackageweight - +$rootScope.stockdata.diplaystockweighttemp;
        }
        // move to standby
        if ($rootScope.stockdata.movementtype==2){
            $rootScope.stockdata.godownstockquantitytemp = +$rootScope.stockdata.godownstockquantity + +$rootScope.stockdata.movementquantity;
            $rootScope.stockdata.godownstockweighttemp = +$rootScope.stockdata.godownstockweight + +$rootScope.stockdata.movementweight;
            $rootScope.stockdata.diplaystockquantitytemp = +$rootScope.stockdata.totalpackagequantity - +$rootScope.stockdata.godownstockquantitytemp;
            $rootScope.stockdata.diplaystockweighttemp = +$rootScope.stockdata.totalpackageweight - +$rootScope.stockdata.godownstockweighttemp;
        }
    };
    $scope.onselectstockitem =function(data){
        $rootScope.stockdata.diplaystockquantitytemp=0;
        $rootScope.stockdata.diplaystockweighttemp=0;
        $rootScope.stockdata.godownstockquantitytemp=0;
        $rootScope.stockdata.godownstockweighttemp=0;
        $rootScope.stockdata.diplaystockquantity=0;
        $rootScope.stockdata.diplaystockweight=0;
        $rootScope.stockdata.godownstockquantity=0;
        $rootScope.stockdata.godownstockweight=0;
        $rootScope.stockdata.netstockquantity=0;
        $rootScope.stockdata.netstockweight=0;
        $rootScope.stockdata.totalpackagequantity=0;
        $rootScope.stockdata.totalpackageweight=0;
        $rootScope.stockdata.movementquantity=0;
        $rootScope.stockdata.movementweight=0;

        $rootScope.stockdata.package=data.packageid;

        var selecteditemnetstock = filterfunction.filterarray($rootScope.netstock,{package: $rootScope.stockdata.package}); // filter net stock details for selected package
        var rowdata;

        for(var key in selecteditemnetstock){
            rowdata = selecteditemnetstock[key];
            if (rowdata.store == appvariables.get('storetype')[0].display){
                $rootScope.stockdata.diplaystockquantity = rowdata.quantity;
                $rootScope.stockdata.diplaystockweight=utilities.roundtodecimal(rowdata.weight,3);
            }
            else if (rowdata.store == appvariables.get('storetype')[0].godown){
                $rootScope.stockdata.godownstockquantity=rowdata.quantity;
                $rootScope.stockdata.godownstockweight=utilities.roundtodecimal(rowdata.weight,3);
            }
            else{
                $rootScope.stockdata.netstockquantity=rowdata.quantity;
                $rootScope.stockdata.netstockweight=utilities.roundtodecimal(rowdata.weight,3);
            }
        }
        $rootScope.stockdata.totalpackagequantity= utilities.roundtodecimal(+$rootScope.stockdata.diplaystockquantity + +$rootScope.stockdata.godownstockquantity,3);
        $rootScope.stockdata.totalpackageweight = utilities.roundtodecimal(+$rootScope.stockdata.diplaystockweight + +$rootScope.stockdata.godownstockweight,3);
        $rootScope.stockdata.diplaystockquantitytemp = utilities.roundtodecimal($rootScope.stockdata.diplaystockquantity,3);
        $rootScope.stockdata.diplaystockweighttemp = utilities.roundtodecimal($rootScope.stockdata.diplaystockweight,3);
        $rootScope.stockdata.godownstockquantitytemp = utilities.roundtodecimal($rootScope.stockdata.godownstockquantity,3);
        $rootScope.stockdata.godownstockweighttemp = utilities.roundtodecimal($rootScope.stockdata.godownstockweight,3);
    };

    $scope.liststock =function(data){
        servicesservice.liststock($rootScope.stockdata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    $rootScope.currentstockallstore=response;
                    $rootScope.currentstock = filterfunction.filterarray($rootScope.currentstockallstore,{storeid: $rootScope.stockdata.store}); // filter stock for selected store

                    // generate net weight seleted store
                    $rootScope.netstock=[];
                    var mypackage, rowdata;
                    var netquantity=0, netweight= 0, itemnetquantity=0, itemnetweight=0;
                    var packagegroup  = _.groupBy($rootScope.currentstock, 'packageid');
                    for(var key in packagegroup) {
                        mypackage = packagegroup[key];
                        for (var row in mypackage){
                            rowdata = mypackage[row];

                            netquantity= +netquantity + +rowdata.opbalquantity + +rowdata.returnquantity + +rowdata.salesreturnquantity - +rowdata.salequantity - +rowdata.issuequantity +rowdata.movementquantity;
                            netweight= +netweight + +rowdata.opbalweight + +rowdata.purchaseweight + +rowdata.returnweight + +rowdata.salesreturnweight - +rowdata.saleweight - +rowdata.issueweight + +rowdata.movementweight;
                        }
                    }
                    $rootScope.liststocknetquantity = netquantity;
                    $rootScope.liststocknetweight = utilities.roundtodecimal(netweight,3);

                    // generate net stock (godown + store)
                    $rootScope.netstock=[];
                    var mypackage, rowdata;
                    var netquantity=0, netweight= 0, itemnetquantity=0, itemnetweight=0;
                    var packagegroup  = _.groupBy($rootScope.currentstockallstore, 'packageid');
                    for(var key in packagegroup) {
                        mypackage = packagegroup[key];
                        for (var row in mypackage){
                            rowdata = mypackage[row];

                            itemnetquantity = +rowdata.opbalquantity + +rowdata.returnquantity + +rowdata.salesreturnquantity - +rowdata.salequantity - +rowdata.issuequantity + +rowdata.movementquantity;
                            itemnetweight = +rowdata.opbalweight + +rowdata.purchaseweight + +rowdata.returnweight + +rowdata.salesreturnweight - +rowdata.saleweight - +rowdata.issueweight + +rowdata.movementweight;
                            netquantity= +netquantity + +rowdata.opbalquantity + +rowdata.returnquantity + +rowdata.salesreturnquantity - +rowdata.salequantity - +rowdata.issuequantity +rowdata.movementquantity;
                            netweight= +netweight + +rowdata.opbalweight + +rowdata.purchaseweight + +rowdata.returnweight + +rowdata.salesreturnweight - +rowdata.saleweight - +rowdata.issueweight + +rowdata.movementweight;
                            $rootScope.netstock.push({"store":rowdata.storeid,"package":rowdata.packageid,"quantity":itemnetquantity,"weight":itemnetweight});
                        }
                        // add net stock quantity for selected package
                        $rootScope.netstock.push({"store":0,"package":+key[0],"quantity":netquantity,"weight":netweight});
                    }
                }
                else{
                    logger.logError("unable to load stock. please contact support");
                }
            }
            else{
                logger.logWarning('stock not available');
            }
        });
    };
    $scope.savestock =function(){
        //validation
        if ($rootScope.stockdata.company==undefined || $rootScope.billdata.company==0){
            logger.logWarning("missing company information. please re-login to continue.");
            return;
        };
        if ($rootScope.stockdata.package==undefined || $rootScope.stockdata.package==0){
            logger.logWarning("stock item not selected. please refresh");
            return;
        };
        if ($rootScope.stockdata.opstockquantity==undefined || $rootScope.stockdata.opstockquantity < 0){
            logger.logWarning("invalid stock quantity.");
            return;
        };
        if ($rootScope.stockdata.opstockweight==undefined || $rootScope.stockdata.opstockweight < 0){
            logger.logWarning("invalid stock weight.");
            return;
        };
        if ($rootScope.stockdata.comments==undefined || $rootScope.stockdata.comments==''){
            logger.logWarning("please enter comments.");
            return;
        };

        $rootScope.stockdata.comments='Adjust Stock: '+$rootScope.stockdata.comments;

        // submit request
        servicesservice.savestock($rootScope.stockdata,function(response){
            if (response!=undefined) {
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess("Opening stock update complete.");
                    $scope.liststock($rootScope.stockdata);
                    $scope.clearstockdata();
                }
                else{
                    logger.logError("unable to edit opening stock. please contact support");
                }
            }
            else{
                logger.logError("unable to edit opening stock. please contact support");
            }
        });
    };
    $scope.movestock =function()    {
        //validation
        if(($rootScope.stockdata.movementquantity < 0 ) || $rootScope.stockdata.movementquantity==undefined ||
            $rootScope.stockdata.movementweight==0 || $rootScope.stockdata.movementweight==undefined){
            logger.logWarning("please enter quantity and weight to be moved.");
            return;
        }
        if ($rootScope.stockdata.company==undefined || $rootScope.billdata.company==0){
            logger.logWarning("missing company information. please re-login to continue.");
            return;
        };
        if ($rootScope.stockdata.package==undefined || $rootScope.stockdata.package==0){
            logger.logWarning("stock item not selected. please refresh");
            return;
        };
        if ($rootScope.stockdata.diplaystockquantity==undefined ){ //|| $rootScope.stockdata.diplaystockweight==0
            logger.logWarning("information missing, display stock.");
            return;
        };
        if ($rootScope.stockdata.godownstockquantity==undefined ){ // || $rootScope.stockdata.godownstockweight==0
            logger.logWarning("information missing, godown stock.");
            return;
        };
        if ($rootScope.stockdata.comments==undefined || $rootScope.stockdata.comments==''){
            logger.logWarning("please enter comments.");
            return;
        };
        //if(($rootScope.stockdata.diplaystockquantity==$rootScope.stockdata.diplaystockquantitytemp) ||
        //    $rootScope.stockdata.diplaystockweight==$rootScope.stockdata.diplaystockweighttemp ||
        //    $rootScope.stockdata.godownstockquantity==$rootScope.stockdata.godownstockquantitytemp ||
        //    $rootScope.stockdata.godownstockweight==$rootScope.stockdata.godownstockweighttemp){
        //    logger.logWarning("no change in stock data. nothing to update");
        //    return;
        //}

        if ($rootScope.stockdata.movementtype == 1){ // move to display
            $rootScope.stockdata.newdiplaystockquantity = utilities.roundtodecimal((+$rootScope.stockdata.diplaystockquantity + +$rootScope.stockdata.movementquantity),3);
            $rootScope.stockdata.newdiplaystockweight = utilities.roundtodecimal((+$rootScope.stockdata.diplaystockweight + +$rootScope.stockdata.movementweight),3);
            $rootScope.stockdata.newgodownstockquantity= utilities.roundtodecimal((+$rootScope.stockdata.godownstockquantity - +$rootScope.stockdata.movementquantity),3);
            $rootScope.stockdata.newgodownstockweight= utilities.roundtodecimal((+$rootScope.stockdata.godownstockweight - +$rootScope.stockdata.movementweight),3);
        }
        else if ($rootScope.stockdata.movementtype == 2){ // move to standby
            $rootScope.stockdata.newdiplaystockquantity = utilities.roundtodecimal((+$rootScope.stockdata.diplaystockquantity - +$rootScope.stockdata.movementquantity),3);
            $rootScope.stockdata.newdiplaystockweight = utilities.roundtodecimal((+$rootScope.stockdata.diplaystockweight - +$rootScope.stockdata.movementweight),3);
            $rootScope.stockdata.newgodownstockquantity= utilities.roundtodecimal((+$rootScope.stockdata.godownstockquantity + +$rootScope.stockdata.movementquantity),3);
            $rootScope.stockdata.newgodownstockweight= utilities.roundtodecimal((+$rootScope.stockdata.godownstockweight + +$rootScope.stockdata.movementweight),3);
        }

        $rootScope.stockdata.comments='Move Stock: '+$rootScope.stockdata.comments;

        // submit request
        servicesservice.movestock($rootScope.stockdata,function(response){
            if (response!=undefined) {
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess("stock updated.");
                    $scope.liststock($rootScope.stockdata);
                    $scope.clearstockdata();
                }
                else{
                    logger.logError("unable to move stock. please contact support");
                }
            }
            else{
                logger.logError("unable to move stock. please contact support");
            }
        });
    };
    $scope.cancelstockchanges=function(){
        $rootScope.stockdata.diplaystockquantitytemp=$rootScope.stockdata.diplaystockquantity;
        $rootScope.stockdata.diplaystockweighttemp=$rootScope.stockdata.diplaystockweight;
        $rootScope.stockdata.godownstockquantitytemp=$rootScope.stockdata.godownstockquantity;
        $rootScope.stockdata.godownstockweighttemp=$rootScope.stockdata.godownstockweight;
        $rootScope.stockdata.movementquantity=0;
        $rootScope.stockdata.movementweight=0;
    };
    $scope.listvalueaddition   =function(){
        if ($rootScope.billdata.company==undefined || $rootScope.billdata.company==0){
            logger.logWarning("missing company information. please re-login to continue.");
            return;
        };
        servicesservice.listvalueaddition($rootScope.billdata,function(response){
            if (response!=undefined) {
                $rootScope.listallvalueaddition = response;
            }
            else{
                logger.logError("unable to load VA. please contact support");
            }
        });
    };
    $scope.removevalueaddition =function(data){
        $rootScope.stockdata.va=data.vaid;
        servicesservice.removevalueaddition($rootScope.stockdata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess("VA removed successfully.");
                    $scope.listvalueaddition();
                    $scope.liststock($rootScope.stockdata);
                }
                else{
                    logger.logError("failed to remove VA.");
                }
            }
            else{
                logger.logWarning('transaction failed. please contact support.');
            }
        });
    };
    $scope.addvalueaddition    =function(){
        //validate input
        if ($rootScope.stockdata.company==undefined || $rootScope.billdata.company==0){
            logger.logWarning("missing company information. please re-login to continue.");
            return;
        };
        if ($rootScope.stockdata.package==undefined || $rootScope.stockdata.package==0){
            logger.logWarning("stock item not selected. please refresh");
            return;
        };
        if ($rootScope.stockdata.vamax==undefined || $rootScope.stockdata.vamax==0){
            logger.logWarning("missing value VA maximum.");
            return;
        };
        if ($rootScope.stockdata.vamin==undefined || $rootScope.stockdata.vamin==0){
            logger.logWarning("missing value VA minimum.");
            return;
        };
        if ($rootScope.stockdata.vapercentage==undefined || $rootScope.stockdata.vapercentage==0){
            logger.logWarning("missing value for VA percentage.");
            return;
        };

        // submit request
        servicesservice.addvalueaddition($rootScope.stockdata,function(response){
            if (response!=undefined) {
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess("VA added successfully.");
                    $scope.listvalueaddition();
                    $scope.liststock($rootScope.stockdata);
                    $scope.clearstockdata();
                }
                else{
                    logger.logError("unable to add VA. please contact support");
                }
            }
            else{
                logger.logError("unable to load VA. please contact support");
            }
        });
    };
    $scope.packagefilter = function (item) {
        if (item.storeid == 1){
            return (item.package_title != 'cash' && item.package_title != '995' && item.package_title != 'oldgold' && item.package_title != 'puregold');
        }
        else{
            return true;
        }
    };

    $scope.addcategory=function(){
        if ($rootScope.stockdata.categoryname=='' || $rootScope.stockdata.categoryname==undefined){
            logger.logWarning('enter category name.');
            return;
        }
        if ($rootScope.stockdata.package==0 || $rootScope.stockdata.package==undefined){
            logger.logWarning('select item.');
            return;
        }
        servicesservice.addcategory($rootScope.stockdata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess("new category added.");
                    $scope.listcategoryforstock();
                }
                else{
                    logger.logError("unable to add category. please contact support.");
                }
            }
            else{
                logger.logWarning('category not added.');
            }
        });
    };
    $scope.listcategory=function(){
        var formdata=$rootScope.billdata;
        if ($rootScope.billdata.store==undefined || $rootScope.billdata.store==0){
            logger.logWarning("please select store.");
            return;
        }
        else{
            servicesservice.listcategory(formdata,function(responsedata){
                if (responsedata!=undefined){
                    $rootScope.listcategory=responsedata;
                }
                else{
                    logger.logError("category details not available.");
                }
            });
        }
    };
    $scope.listcategoryforstock = function(){
        // this method is common for stock.
        $scope.listcategory();
        $scope.listcategorymaster =$rootScope.listcategory;
    };
    $scope.deletecategory=function(data){
        $rootScope.stockdata.category=data.categoryid;
        servicesservice.deletecategory($rootScope.stockdata,function(response){
            if (response!=undefined){
                if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                    logger.logSuccess('removed category.')
                    $scope.listcategoryforstock();
                }
                else{
                    logger.logError("unable to delete category. please contact support");
                }
            }
            else{
                logger.logWarning('failed to remove category.');
            }
        });
    };

    // methods - smith screen
    $scope.calculateresult=function(goldsmithtransactiontype){
        var basepurity=appvariables.get('basepuritypercentage');
        var retailrate=appvariables.get('retailrate');
        var wholesalerate=appvariables.get('wholesalerate');
        if (goldsmithtransactiontype=='issue'){
            $rootScope.billdata.issueoldgoldnetweight= utilities.roundtodecimal( ((+$rootScope.billdata.issueoldgoldweight * +$rootScope.billdata.issueoldgoldpurity) / +basepurity),3);

            //if ($rootScope.billdata.issue995goldpurity ==  basepurity){
            //    $rootScope.billdata.issue995goldnetweight= utilities.roundtodecimal( ((+$rootScope.billdata.issue995goldweight * +$rootScope.billdata.issue995goldpurity) / +basepurity),3);
            //}
            //else{
            //    $rootScope.billdata.issue995goldnetweight= utilities.roundtodecimal( ((+$rootScope.billdata.issue995goldweight * +$rootScope.billdata.issue995goldpurity) / +100),3);
            //}

            if ($rootScope.billdata.issue995goldpurity <  +92){
                $rootScope.billdata.issue995goldnetweight= utilities.roundtodecimal( ((+$rootScope.billdata.issue995goldweight * +$rootScope.billdata.issue995goldpurity) / +100),3);
            }
            else{
                $rootScope.billdata.issue995goldnetweight= utilities.roundtodecimal( ((+$rootScope.billdata.issue995goldweight * +$rootScope.billdata.issue995goldpurity ) / +basepurity),3);
            }

            $rootScope.billdata.netcashissueweight= utilities.roundtodecimal( (+$rootScope.billdata.cashissued / +wholesalerate),3);
            $rootScope.billdata.netgoldsmithissueweight = utilities.roundtodecimal( +$rootScope.billdata.issueoldgoldnetweight + +$rootScope.billdata.issue995goldnetweight + +$rootScope.billdata.netcashissueweight,3);
        }
        else if(goldsmithtransactiontype=='return'){
            var netweight= (+$rootScope.billdata.weight - +$rootScope.billdata.stoneweight);

            if (+$rootScope.billdata.valueaddition == 0){
                var grossvalue = ((+netweight + +$rootScope.billdata.wastage) * (+$rootScope.billdata.purity / +basepurity));
            }
            else if (+$rootScope.billdata.wastage == 0){
                var grossvalue = (+netweight * (+$rootScope.billdata.purity + +$rootScope.billdata.valueaddition) / +basepurity);
            }
            else {
                var grossvalue = ((+netweight + +$rootScope.billdata.wastage) * (+$rootScope.billdata.purity + +$rootScope.billdata.valueaddition) / +basepurity);
            }

            var netvalue=  +grossvalue;
            if (isNaN(netvalue)){netvalue=0}
            var netvalueinweight= utilities.roundtodecimal((+netvalue),3);
            $rootScope.billdata.netgoldsmithreturnweight=netvalueinweight;
        }
        else if (goldsmithtransactiontype=='selfpurchase'){
            //$rootScope.calculatedamount=utilities.roundtodecimal((((+$rootScope.billdata.weight * +$rootScope.billdata.purity) / +basepurity)*$rootScope.billdata.metalrate),2);
            $rootScope.calculatedamount=utilities.roundtodecimal((+$rootScope.billdata.weight  /  $rootScope.billdata.metalrate),2);
        }
        else if (goldsmithtransactiontype=='cashreceipt'){
            $rootScope.calculatedamount=utilities.roundtodecimal((+$rootScope.billdata.weight / +$rootScope.billdata.metalrate),3);
        }
    };

    $scope.calculateconversion=function(){
        if ($rootScope.selectedtabcontrol=='purchase'){
            $rootScope.calculatedamount = utilities.roundtodecimal(((+$rootScope.billdata.purity * +$rootScope.billdata.weight / +100) * +$rootScope.billdata.metalrate),2);
        }
    };

    $scope.savetransactiongoldsmith =function(){
        if ($rootScope.billdata.goldsmithtransactiontype == appvariables.get('transactiontype')[0].issue) {
            $rootScope.billdata.comments = 'gold smith issue';

            // generate payload JSON format for order submission
            var datapkgdetails = [];
            var transactionData1;
            var transactionData2;
            var transactionData3;

            if ($scope.validateinput()) {
                // order submission
                $rootScope.billdata.updatesummary = 0;

                // push old gold as line item
                if (+$rootScope.billdata.issueoldgoldweight > 0) {
                    $rootScope.billdata.packagecode=appvariables.get('packagecode')[0].oldgold;
                    $rootScope.billdata.quantity=0;
                    $rootScope.billdata.weight=$rootScope.billdata.issueoldgoldweight;
                    if ($rootScope.billdata.weight > 0){
                        $rootScope.billdata.quantity=1;
                        $rootScope.billdata.updatesummary = 1;
                    }
                    $rootScope.billdata.purity=$rootScope.billdata.issueoldgoldpurity;
                    //$rootScope.billdata.productcode=appvariables.get('productcode')[0].oldgold;
                    var datapkgdetails1 = [];
                    datapkgdetails1.push({
                        "storeid": appvariables.get('storetype')[0].godown,
                        "package": $rootScope.billdata.package,
                        "packagecode": appvariables.get('packagecode')[0].oldgold,
                        "product": $rootScope.billdata.product,
                        "productcode": appvariables.get('productcode')[0].oldgold,
                        "category": $rootScope.billdata.category,
                        "price": $rootScope.billdata.metalrate,
                        "quantity": $rootScope.billdata.quantity,
                        "weight": $rootScope.billdata.issueoldgoldweight,
                        "purity": $rootScope.billdata.issueoldgoldpurity
                    });
                    //alert(JSON.stringify(datapkgdetails1))
                    var pkgdata1 = {data: datapkgdetails1};
                    var x2js = new X2JS();
                    var transactionData1 = "<root>" + x2js.json2xml_str(pkgdata1) + "</root>";
                };
                $rootScope.billdata.updatesummary = 0;
                // push 995 as line item
                if (+$rootScope.billdata.issue995goldweight > 0) {
                    $rootScope.billdata.packagecode=appvariables.get('packagecode')[0].gold995;
                    $rootScope.billdata.quantity=0;
                    $rootScope.billdata.weight=$rootScope.billdata.issue995goldweight;
                    if ($rootScope.billdata.weight > 0){
                        $rootScope.billdata.quantity=1;
                        $rootScope.billdata.updatesummary = 1;
                    }
                    $rootScope.billdata.purity=$rootScope.billdata.issue995goldpurity;
                    var datapkgdetails2 = [];
                    datapkgdetails2.push({
                        "storeid": appvariables.get('storetype')[0].godown,
                        "package": $rootScope.billdata.package,
                        "packagecode": appvariables.get('packagecode')[0].gold995,
                        "product": $rootScope.billdata.product,
                        "productcode": appvariables.get('productcode')[0].gold,
                        "category": $rootScope.billdata.category,
                        "price": $rootScope.billdata.metalrate,
                        "quantity": $rootScope.billdata.quantity,
                        "weight": $rootScope.billdata.issue995goldweight,
                        "purity": $rootScope.billdata.issue995goldpurity
                    });
                    //alert(JSON.stringify(datapkgdetails2))
                    var pkgdata2 = {data: datapkgdetails2};
                    var x2js = new X2JS();
                    var transactionData2 = "<root>" + x2js.json2xml_str(pkgdata2) + "</root>";
                };
                $rootScope.billdata.updatesummary = 0;
                // push cash issued as line item
                if (+$rootScope.billdata.cashissued > 0) {
                    $rootScope.billdata.packagecode=appvariables.get('packagecode')[0].cash;
                    $rootScope.billdata.quantity=1;
                    $rootScope.billdata.updatesummary = 1;
                    var datapkgdetails3 = [];
                    datapkgdetails3.push({
                        "storeid": appvariables.get('storetype')[0].godown,
                        "package": $rootScope.billdata.package,
                        "packagecode": appvariables.get('packagecode')[0].cash,
                        "product": $rootScope.billdata.product,
                        "productcode": appvariables.get('productcode')[0].cash,
                        "category": $rootScope.billdata.category,
                        "price": $rootScope.billdata.metalrate,
                        "quantity": $rootScope.billdata.quantity,
                        "weight": $rootScope.billdata.cashissued,
                        "purity": appvariables.get('basepuritypercentage')
                    });
                    //alert(JSON.stringify(datapkgdetails3))
                    var pkgdata3 = {data: datapkgdetails3};
                    var x2js = new X2JS();
                    var transactionData3 = "<root>" + x2js.json2xml_str(pkgdata3) + "</root>";
                };

                $rootScope.billdata.transactiondetail = transactionData1;
                $rootScope.billdata.updatesummary=0;
                if ($rootScope.billdata.transactiondetail != undefined){$rootScope.billdata.updatesummary=1;}
                servicesservice.savetransactionwithpromise($rootScope.billdata).then(function(response1){
                    $rootScope.billdata.transactiondetail ="<root>"+ "</root>";
                    $rootScope.billdata.transactiondetail = transactionData2;
                    $rootScope.billdata.updatesummary=0;
                    if ($rootScope.billdata.transactiondetail != undefined){$rootScope.billdata.updatesummary=1;}
                    servicesservice.savetransactionwithpromise($rootScope.billdata).then(function(response2){
                        $rootScope.billdata.transactiondetail ="<root>"+ "</root>";
                        $rootScope.billdata.transactiondetail = transactionData3;
                        $rootScope.billdata.updatesummary=0;
                        if ($rootScope.billdata.transactiondetail != undefined){$rootScope.billdata.updatesummary=1;}
                        servicesservice.savetransactionwithpromise($rootScope.billdata).then(function(response3){
                            logger.logSuccess('transaction saved.')
                            $rootScope.billdata.customertype = appvariables.get('customertype')[0].goldsmith;
                            $scope.showissue=!$scope.showissue;
                            $scope.listgoldsmithtransaction('issue');
                            $scope.closepanel();
                        });

                    });
                });
            }
        }
        else if ($rootScope.billdata.goldsmithtransactiontype == appvariables.get('transactiontype')[0].return) {
            $rootScope.billdata.comments = 'gold smith return';
            $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
            var datapkgdetails = [];

            // push package details
            datapkgdetails.push({
                'storeid':appvariables.get('storetype')[0].godown,
                'package'	: $rootScope.billdata.package,
                'packagecode':$rootScope.billdata.packagecode,
                'product':$rootScope.billdata.product,
                'productcode': $rootScope.billdata.productcode,
                'category':$rootScope.billdata.category,
                'price':$rootScope.billdata.metalrate,
                'quantity': $rootScope.billdata.quantity,
                'weight':$rootScope.billdata.weight,
                'purity':$rootScope.billdata.purity
            });

            // push Value Addition as line item
            datapkgdetails.push({
                "storeid": appvariables.get('storetype')[0].godown,
                "package": $rootScope.billdata.package,
                "packagecode": $rootScope.billdata.packagecode,
                "product": $rootScope.billdata.product,
                "productcode": appvariables.get('productcode')[0].valueaddition,
                "category": $rootScope.billdata.category,
                "price": $rootScope.billdata.metalrate,
                "quantity": "1",
                "weight": $rootScope.billdata.valueaddition,
                "purity": appvariables.get('basepuritypercentage')
            });

            // push wastage as line item
            datapkgdetails.push({
                "storeid": appvariables.get('storetype')[0].godown,
                "package": $rootScope.billdata.package,
                "packagecode": $rootScope.billdata.packagecode,
                "product": $rootScope.billdata.product,
                "productcode": appvariables.get('productcode')[0].wastage,
                "category": $rootScope.billdata.category,
                "price": $rootScope.billdata.metalrate,
                "quantity": "1",
                "weight": $rootScope.billdata.wastage,
                "purity": appvariables.get('basepuritypercentage')
            });

            // push stone weight issued as line item
            datapkgdetails.push({
                "storeid": appvariables.get('storetype')[0].godown,
                "package": $rootScope.billdata.package,
                "packagecode": $rootScope.billdata.packagecode,
                "product": $rootScope.billdata.product,
                "productcode": appvariables.get('productcode')[0].stoneweight,
                "category": $rootScope.billdata.category,
                "price": $rootScope.billdata.metalrate,
                "quantity": "1",
                "weight": $rootScope.billdata.stoneweight,
                "purity": appvariables.get('basepuritypercentage')
            });

            var pkgdata = {data: datapkgdetails};
            var x2js = new X2JS();
            var transactionData = "<root>" + x2js.json2xml_str(pkgdata) + "</root>";
            $rootScope.billdata.transactiondetail = transactionData;

            if ($scope.validateinput()) {
                // order submission
                $rootScope.billdata.updatesummary=1;
                servicesservice.savetransaction($rootScope.billdata, function (response) {
                    if (response != undefined) {
                        if (response[0].result != 'NODATA' && response[0].result != 'ERROR') {
                            logger.logSuccess('transaction saved.')
                            //$scope.closepanel(); on request from premdeep as on 01-feb-2017
                            $scope.clearbilldata();
                            $rootScope.billdata.customertype = appvariables.get('customertype')[0].goldsmith;
                            if ($rootScope.billdata.goldsmithtransactiontype == appvariables.get('transactiontype')[0].issue) {
                                $scope.listgoldsmithtransaction('issue');
                            }
                            else{
                                $scope.listgoldsmithtransaction('return');
                                if ($scope.listpackage.length > 0){
                                    $scope.billpackage=0;
                                }
                            }
                            $("#packageitem").focus();
                        }
                        else {
                            logger.logError("unable to save transaction. please contact support.");
                        }
                    }
                    else {
                        logger.logWarning('transaction not added.');
                    }
                });
            }
        }
    };
    $scope.listgoldsmithtransaction=function(goldsmithtransactiontype){
        if (goldsmithtransactiontype=='issue'){
            $scope.clearbilldata();
            $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].issue;
            $rootScope.billdata.goldsmithtransactiontype=appvariables.get('transactiontype')[0].issue;
            $("#smitholdgoldweight").focus();
        }
        else if(goldsmithtransactiontype=='return'){
            $scope.clearbilldata();
            $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].return;
            $rootScope.billdata.goldsmithtransactiontype=appvariables.get('transactiontype')[0].return;
            $("#packageitem").focus();
        }
        $rootScope.billdata.customertype = appvariables.get('customertype')[0].goldsmith;
        $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
        $scope.listtransaction();
    };
    $scope.assignorder=function(order,selectedsmith,duedate){
        if (selectedsmith == null | selectedsmith == undefined){
            logger.logWarning("please select goldsmith");
            return;
        }
        else if (duedate == null | duedate == undefined){
            logger.logWarning("please select due date");
            return;
        }

        var formdata={
            company:$rootScope.company,
            order:order.transactionid,
            duedate: utilities.date2Format(duedate,'yyyy-mm-dd'),
            assignedto:selectedsmith.customerid
        }
        servicesservice.assignorder(formdata,function(responsedata){
            logger.logSuccess('order updated successfully.');
            $scope.listorder();
        });
    };

    // methods - order screen
    $scope.showordercustomeraddress = function(){
            ngDialog.open({
                template: 'modelnewcustomer',
                className: 'ngdialog-theme-default custom-width',
                closeByDocument: false
            });
    };
    $scope.saveaddress =function(){
        var formdata=$rootScope.addressdata;
        if ($rootScope.addressdata.cname==undefined || $rootScope.addressdata.cname==0){
            logger.logWarning("please enter customer.");
            return;
        }
        else{
            servicesservice.saveaddress(formdata,function(responsedata){
                if (responsedata[0].result == 'SUCCESS'){
                    logger.logSuccess("address saved successfully.");
                    $scope.listaddress();
                    $scope.selectaddress($rootScope.addressdata);
                }
                else{
                    logger.logError("failed to save address.");
                }
            });
        }
    };
    $scope.listaddress =function(){
        var formdata=$rootScope.addressdata;
        if ($rootScope.addressdata.company==undefined || $rootScope.addressdata.company==0){
            logger.logWarning("please re-login to continue.");
            return;
        }
        else{
            servicesservice.listaddress(formdata,function(responsedata){
                if (responsedata!=undefined) {
                    if (responsedata[0].result != 'NODATA' && responsedata[0].result != 'ERROR') {
                        $scope.listaddress = responsedata;
                    }
                    else {
                        logger.logError("failed to list address.");
                    }
                }
            });
        }
    };
    $scope.listorder =function(){
        var formdata=$rootScope.billdata;
        if ($rootScope.billdata.company==undefined || $rootScope.billdata.company==0){
            logger.logWarning("please re-login to continue.");
            return;
        }
        else{
            servicesservice.listorder(formdata,function(responsedata){
                if (responsedata!=undefined) {
                    if (responsedata[0].result != 'NODATA' && responsedata[0].result != 'ERROR') {
                        $scope.listpendingorder = responsedata;
                    }
                    else {
                        logger.logWarning("no orders found.");
                    }
                }
            });
        }
    };
    $scope.filteraddress =function(filtervalue){
        if (filtervalue==undefined || filtervalue==''){
            logger.logWarning("enter name to search.");
            return;
        }
        else{
            $scope.listaddressfiltered = filterfunction.filterarray($scope.listaddress,{cname:filtervalue}); // filter name based on user input
            if ($scope.listaddressfiltered == undefined || $scope.listaddressfiltered == ''){
                logger.logWarning("no match found.");
            }
        }
    };
    $scope.selectaddress =function(rowdata){
        $rootScope.billdata.customer=rowdata.customerid;

        for (var key in $scope.listcustomer){
            if ($scope.listcustomer[key].cname.trim() ==rowdata.cname.trim()){
                $rootScope.billcustomer=$scope.listcustomer[key];
                $scope.shownewaddress=false;
                return;
            }
        }
    };
    $scope.updateorderstatus =function(row,status){
        var formdata ={
            'company':row.companyid,
            'order':row.transactionid,
            'status':status
        }
        servicesservice.updateorderstatus(formdata,function(responsedata){
            if (responsedata[0].result == 'SUCCESS'){
                logger.logSuccess("order status updated successfully.");
                $scope.listorder();
            }
            else{
                logger.logError("failed to update order status.");
            }
        });
    };

    //clear data block post transaction
    $scope.clearstockdata = function(){
        $rootScope.stockdata.package=0;
        $rootScope.stockdata.packagecode=0;
        $rootScope.stockdata.category=0;
        $rootScope.stockdata.categoryname=0;
        $rootScope.stockdata.metalrate=0;
        $rootScope.stockdata.quantity=0;
        $rootScope.stockdata.weight=0;
        $rootScope.stockdata.purity=0;
        $rootScope.stockdata.va=0;
        $rootScope.stockdata.vamin=0;
        $rootScope.stockdata.vamax=0;
        $rootScope.stockdata.vapercentage=0;
        $rootScope.stockdata.vacustomertype=1;
        $rootScope.stockdata.opstockquantity=0;
        $rootScope.stockdata.opstockweight=0;
        $rootScope.stockdata.diplaystockquantity=0;
        $rootScope.stockdata.diplaystockweight=0;
        $rootScope.stockdata.godownstockquantity=0;
        $rootScope.stockdata.godownstockweight=0;
        $rootScope.stockdata.netstockquantity=0;
        $rootScope.stockdata.netstockweight=0;
        $rootScope.stockdata.comments='';
    };
    $scope.clearbilldata  = function(){
        $rootScope.billdata.package=0;
        $rootScope.billdata.packagecode=0;
        $rootScope.billdata.product=0;
        $rootScope.billdata.productcode=0;
        $rootScope.billdata.category=0;
        $rootScope.billdata.quantity=0;
        $rootScope.billdata.weight=0;

        $rootScope.billdata.returnquantity=0;
        $rootScope.billdata.returnproductvalue=0;
        $rootScope.billdata.cashreceived=0;
        $rootScope.billdata.calculatedweight=0;
        $rootScope.billdata.transactionid=0;
        $rootScope.billdata.transactiondate=$rootScope.currentdate;

        $rootScope.billdata.receiptno=0;
        $rootScope.billdata.makingexpense=0;
        $rootScope.billdata.makingcharge=0;
        $rootScope.billdata.valueaddition=0;
        $rootScope.billdata.wastage=0;
        $rootScope.billdata.stoneweight=0;
        $rootScope.billdata.stonevalue=0;
        $rootScope.billdata.testweight=0;
        $rootScope.billdata.testreturnweight=0;
        $rootScope.billdata.puregoldweight=0;
        $rootScope.billdata.testpurity=0;
        $rootScope.billdata.transactiondetail='';
        $rootScope.billdata.comments='';
        $rootScope.billdata.updatesummary=1;
        $rootScope.calculatedamount=0;
        $scope.billcategory=0;

        $rootScope.billdata.issueoldgoldweight=0;
        $rootScope.billdata.issueoldgoldpurity=0;
        $rootScope.billdata.issueoldgoldnetweight=0;
        $rootScope.billdata.issue995goldweight=0;
        $rootScope.billdata.issue995goldpurity=appvariables.get('basepuritypercentage');
        $rootScope.billdata.issue995goldnetweight=0;
        $rootScope.billdata.netgoldsmithissueweight=0;
        $rootScope.billdata.netgoldsmithreturnweight=0;
        $rootScope.billdata.cashissued=0;
        $rootScope.billdata.cashreceived=0;
        $rootScope.billdata.netcashissueweight=0;
    };
    $scope.closepanel=function(){
        // clear data
        $rootScope.billdata.product=0;
        $rootScope.billdata.productcode='';
        $rootScope.billdata.quantity=0;
        $rootScope.billdata.weight=0;
        $rootScope.billdata.purity=0;
        $rootScope.billdata.returnquantity=0;
        $rootScope.billdata.returnproductvalue=0;
        $rootScope.billdata.cashreceived=0;
        $rootScope.billdata.calculatedweight=0;
        $rootScope.billdata.transactionid=0;
        $rootScope.billdata.transactiondate=$rootScope.currentdate;
        $rootScope.billdata.receiptno=0;
        $rootScope.billdata.comments='';

        $rootScope.billdata.makingexpense=0;
        $rootScope.billdata.makingcharge=0;
        $rootScope.billdata.valueaddition=0;
        $rootScope.billdata.wastage=0;
        $rootScope.billdata.stoneweight=0;
        $rootScope.billdata.stonevalue=0;
        $rootScope.billdata.testweight=0;
        $rootScope.billdata.testreturnweight=0;
        $rootScope.billdata.puregoldweight=0;
        $rootScope.billdata.testpurity=0;
        $rootScope.billdata.transactiondetail='';

        $rootScope.billdata.goldsmithtransactiontype=0;
        $rootScope.billdata.issueoldgoldweight=0;
        $rootScope.billdata.issueoldgoldpurity=0;
        $rootScope.billdata.issueoldgoldnetweight=0;
        $rootScope.billdata.issue995goldweight=0;
        $rootScope.billdata.issue995goldpurity=appvariables.get('basepuritypercentage');
        $rootScope.billdata.issue995goldnetweight=0;
        $rootScope.billdata.netgoldsmithissueweight=0;
        $rootScope.billdata.netgoldsmithreturnweight=0;
        $rootScope.billdata.cashissued=0;
        $rootScope.billdata.cashreceived=0;
        $rootScope.billdata.netcashissueweight=0;

        //display block hide/view settings
        $scope.collapsepanel=false;
        $scope.collapsebill=false;
        $scope.showsalesdetails=true;
        $scope.showpurchasedetails=true;

        $scope.hidereturn=true;
        $scope.hidebillsettings=true;
        $scope.hidestockdetails=true;
        $scope.hidevadetails=true;
        $scope.hidestockedit=true;
    };

    // methods - bill edit
    $scope.onchangeedittransaction = function(data){
        $rootScope.editbilldata.transactiondate=utilities.date2Format(data.transactiondate,"yyyy-mm-dd") ;
        $scope.selectedtransactiontoedit = filterfunction.filterarray($scope.transactionitemlist,{transactionid:data.transactionid});
        var currentitem;
        for (var row in $scope.selectedtransactiontoedit ){
            currentitem = $scope.selectedtransactiontoedit[row];
            $rootScope.editbilldata.package=currentitem.packageid;
            $rootScope.editbilldata.packagecode=currentitem.packages_code;
            $rootScope.editbilldata.packagename = currentitem.package_name;
            $rootScope.editbilldata.productcode=currentitem.product_code;
            $rootScope.editbilldata.categoryname = currentitem.categoryname;
            $rootScope.editbilldata.transactionid = currentitem.transactionid;
            $rootScope.editbilldata.transactiontype = currentitem.transactiontype;
            $rootScope.editbilldata.store = currentitem.storeid;
        }
        $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: $rootScope.editbilldata.productcode}); // filter metal products for display
    };
    $scope.savebilledit=function(){

        if ($rootScope.editbilldata.user != 1 && $rootScope.editbilldata.transactiontype != 2){
            logger.logWarning("you are not authorized to edit this transaction. please contact admin");
            return;
        }
        if ($rootScope.editbilldata.transactiondate != $rootScope.currentdate && $rootScope.editbilldata.transactiontype != 2){
            logger.logWarning("you are allowed to edit only todays transaction.");
            return;
        }
        $rootScope.editbilldata.transactiondetail = JSON.stringify($scope.selectedtransactiontoedit);
        //alert(JSON.stringify($scope.selectedtransactiontoedit));
        servicesservice.savebilledit($rootScope.editbilldata,function(data){
            if (data!=undefined){
                logger.logSuccess('bill saved successfully.');
                $scope.selectedtransactiontoedit ='';
                servicesservice.getreceipt($rootScope.editbilldata,function(data){
                    if (data!=undefined){
                        $scope.edittransactionlist=data[0];
                        $scope.transactionitemlist=data[1];
                    }
                    else{
                        logger.logWarning('receipt details not available');
                    }
                });
            }
            else{
                logger.logWarning('error while processing bill edit request. please contact support');
            }
        });
    };

    // common methods required for all html pages
    $scope.liststore();
    $scope.listitemcategory();
    $scope.purchasefilter= function (row) {
        return ((row.transactiontype == '2' && row.product_code == 'PW101') || (row.transactiontype == '2' && row.product_code == 'PW995'));
    };
    // form load
    $scope.initstock = function(){
        // methods to be invoked on stock.html page load
        $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].metal;
        $rootScope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].ornamentgold); // get all sellable packages
        $rootScope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: $rootScope.billdata.productcode}); // filter metal products for display
        $rootScope.listpackage.splice(0,1); // remove 995 from sales or approval. uncommented as per request from business owner
        $scope.listvalueaddition();
        $scope.listcategory();

        //display block hide/view settings
        $scope.hidereturn=true;
        $scope.hidebillsettings=true;
        $scope.hidestockdetails=true;
        $scope.hidevadetails=true;
        $scope.hidestockedit=true;
        $scope.hidestockmovement=true;
        $scope.hidestockgrid=false;
        $scope.hidecategorygrid=true;
    };
    $scope.initorder = function(){
        // methods to be invoked on Order.html page load
        $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].metal;
        $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].ornamentgold); // get all sellable packages
        $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: $rootScope.billdata.productcode}); // filter metal products for display
        $scope.listpackage.splice(0,1); // remove 995 from sales or approval

        $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].order;
        $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
        $rootScope.billdata.customertype=appvariables.get('customertype')[0].retail;
        $scope.loadcustomer(appvariables.get('customertype')[0].retail);
        $rootScope.billdata.metalrate=appvariables.get('wholesalerate');
        $scope.shownewaddress=false;
        $scope.showorderstatus=false;
        $scope.listaddress();
        $scope.listorder();

        // load goldsmith list for order assignment
        var formdata={
            company:$rootScope.company,
            customertype:appvariables.get('customertype')[0].goldsmith
        }
        servicesservice.loadcustomer(formdata,function(data){
            $scope.calculation=false;
            $scope.expenselist=false;
            if (data!=undefined){
                $scope.goldsmithcustomer = data;
            }
            else{
                logger.logWarning('unable to load goldsmith.');
            }
        });
    };
    $scope.initsmith = function(){
        $rootScope.billdata.transactiondate=$rootScope.currentdate;
        $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].metal;
        $rootScope.billdata.metalrate=appvariables.get('wholesalerate');
        $rootScope.billdata.issue995goldpurity=appvariables.get('basepuritypercentage');
        $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].ornamentgold); // get all sellable packages
        $scope.listpackage= filterfunction.filterarray($scope.listpackage,{productcode: $rootScope.billdata.productcode}); // filter metal products for display
        //$scope.listpackage.splice(0,1); // remove 995 from sales or approval

        $rootScope.billdata.transactiontype=appvariables.get('transactiontype')[0].issue;
        $rootScope.billdata.goldsmithtransactiontype=appvariables.get('transactiontype')[0].issue;
        $rootScope.billdata.store=appvariables.get('storetype')[0].godown;
        $rootScope.billdata.customertype=appvariables.get('customertype')[0].goldsmith;
        $scope.loadcustomer(appvariables.get('customertype')[0].goldsmith);

        // display controls
        //$scope.showissue=true;
        $scope.showreturns=false;
        $scope.showissuetable=true;
        $scope.showreturnstable=false;
    };
    $scope.initbill  = function(){
        // methods to be invoked on Billing.html page load
        $rootScope.billdata.productcode=appvariables.get('addonproductcode')[0].metal;
        $scope.loadcustomer(appvariables.get('customertype')[0].wholesale);
        $scope.listvalueaddition();
        $scope.item=true;
        $scope.rate=true;
        $scope.category=true;
        $scope.comments=true;
        $scope.customertype=1;

        //display block hide/view settings
        $scope.hidereturn=true;
        $scope.hidebillsettings=true;
        $scope.hidestockdetails=true;
        $scope.hidevadetails=true;
        $scope.hidestockedit=true;
        $scope.hidestockmovement=true;
        $scope.hidestockgrid=true;
        $scope.hidecategorygrid=true;
        $rootScope.transactiondetails=[];
        $rootScope.transactionsummary=[];
        $rootScope.transactionbilldetails=[];
        $rootScope.metalbasepurity=appvariables.get('basepuritypercentage');
        $rootScope.billdata.transactiontype=0;
    };
    $scope.initbilledit = function(){
        $rootScope.editbilldata.receiptno = $rootScope.editbillreceiptno;
        $rootScope.editbilldata.customer = $rootScope.editbillcustomer;
        $rootScope.editbilldata.customertype= $rootScope.editbillcustomertype;
        $rootScope.editbilldata.transactiondate = $rootScope.editbilltransactiondate;

        $scope.listpackage= filterfunction.getpackagenames(appvariables.get('packagecode')[0].ornamentgold); // get all sellable packages
        servicesservice.getreceipt($rootScope.editbilldata,function(data){
            if (data!=undefined){
                $scope.edittransactionlist=data[0];
                $scope.transactionitemlist=data[1];
            }
            else{
                logger.logWarning('receipt details not available');
            }
        });
    };

    // date picker functions
    $scope.open = function($event,index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened=new Array();
        return $scope.opened[index] = true;
    };
    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };
}]);
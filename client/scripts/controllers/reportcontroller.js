// <copyright file="reportcontroller.js" company="Cronyco">
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
// <summary>Contains Javascript methods for Routing reportcontroller Functions </summary>

'use strict';

robs.controller('reportcontroller', ['$http','$scope','$location','$rootScope','logger','reportservice','printservice','appvariables','filterfunction','utilities','ngDialog','$q','$sce', function ($http,$scope,$location,$rootScope,logger,reportservice,printservice,appvariables,filterfunction,utilities,ngDialog,$q,$sce){
    $rootScope.reportdata  ={
        // common parameters for any report
        'company':$rootScope.company,
        'customer':0,
        'customertype':0,
        'customeroutstandingtype':0,
        'store':0,
        'package':0,
        'packagecode':'',
        'product':0,
        'productcode':'',
        'category':0,
        'fromdate': $rootScope.currentdate,
        'todate':$rootScope.currentdate,
        'user':$rootScope.loggedinuser,
        'transactiondate':$rootScope.currentdate,
        'billnumber':0
    };

    function transactiontypesales(){return 1;}
    function transactiontypepurchase(){return 2;}
    function transactiontypesalesreturn(){return 3;}
    function transactiontypeogtest(){return 4;}
    function transactiontypeissue(){return 5;}
    function transactiontypereturn(){return 6;}
    function transactiontypecashpayment(){return 7;}
    function transactiontypecashreceipt(){return 8;}
    function transactiontypeorder(){return 9;}

    $scope.stock=function(){
        reportservice.stock($rootScope.reportdata,function(data){
            if (data!=undefined){
                $scope.listcurrentstock=data[0];
                $scope.listcurrentstocktransaction=data[1];
                $scope.listcurrentstocktransactiondetails=data[2];
                $scope.listcurrentstockdisplay=filterfunction.filterarray($scope.listcurrentstock,{storeid: appvariables.get('storetype')[0].display});
                $scope.listcurrentstockgodown=filterfunction.filterarray($scope.listcurrentstock,{storeid: appvariables.get('storetype')[0].godown});
            }
            else{
                logger.logWarning('stock data not available');
            }
        });
    };
    $scope.liststock=function(){
        $rootScope.reportdata.fromdate = utilities.date2Format($rootScope.reportdata.fromdate,'yyyy-mm-dd');
        reportservice.liststock($rootScope.reportdata,function(data){
            if (data!=undefined){
                $scope.liststocksummary=data[0];
                $scope.liststocktransaction=data[1];
            }
            else{
                logger.logWarning('stock data not available for selected date.');
            }
        });
    };
    $scope.stockhistory=function(data){
        reportservice.stockhistory($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.liststockhistory=data;
            }
            else{
                logger.logWarning('stock history data not available');
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

    $scope.smith=function(){
        var smithissue=[];
        var smithreturn=[];

        reportservice.smith($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.smithoutstanding=data[0];
                $rootScope.smithopeningstock=data[1];
                $rootScope.smithreport=data[2];
                $rootScope.smithreportdetails=data[3];

                var issuedetails= filterfunction.filterarray($rootScope.smithreportdetails,{transactiontype: appvariables.get('transactiontype')[0].issue});
                var returndetails= filterfunction.filterarray($rootScope.smithreportdetails,{transactiontype: appvariables.get('transactiontype')[0].return});

                var issuegroup  = _.groupBy(issuedetails, 'transactiondate');
                var returngroup  = _.groupBy(returndetails, 'transactionid');

                // smith issue
                for(var key in issuegroup){
                    var currenttransaction;
                    var rowdata;
                    var issuedata={
                        'transactiontype':0,
                        'transactiondate':'',
                        'og':'',
                        'ogpurity':0,
                        'weight995':0,
                        'purity995':995,
                        'cash':0,
                        'rate':0,
                        'item':'',
                        'quantity':0,
                        'weight':0,
                        'netweight':0
                    };

                    currenttransaction = issuegroup[key];
                    for (var row in currenttransaction){
                        rowdata = currenttransaction[row];
                        issuedata.transactiondate = rowdata.transactiondate;
                        issuedata.transactiontype=appvariables.get('transactiontype')[0].issue;

                        if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                            //issuedata.item = rowdata.package_name;
                            //issuedata.quantity = rowdata.quantity;
                            //issuedata.weight = rowdata.productvalue;
                            issuedata.weight995 =rowdata.productvalue;
                            issuedata.purity995 =rowdata.purity;
                        }
                        if (rowdata.product_code == appvariables.get('productcode')[0].oldgold) {
                            issuedata.og = rowdata.productvalue;
                            issuedata.ogpurity = rowdata.purity;
                        }
                        if (rowdata.product_code == appvariables.get('productcode')[0].cash) {
                            issuedata.cash = rowdata.productvalue;
                            issuedata.rate = rowdata.rate;
                        }

                        if(currenttransaction[+row + +1] == undefined){
                            var issuelistgroupbytransactionid= filterfunction.filterarray($rootScope.smithreport,{billingdate: key});
                            issuelistgroupbytransactionid= filterfunction.filterarray(issuelistgroupbytransactionid,{transactiontype: appvariables.get('transactiontype')[0].issue});
                            for(var billitem in issuelistgroupbytransactionid){
                                var billdata = issuelistgroupbytransactionid[billitem];
                                issuedata.netweight += billdata.calculatedweight;
                            }
                            issuedata.netweight = utilities.roundtodecimal(issuedata.netweight,3);
                            smithissue.push(issuedata);
                        }
                    }
                }
                // smith return
                for(var key in returngroup){
                    var currenttransaction;
                    var rowdata;
                    var returndata={
                        'transactiontype':0,
                        'transactiondate':'',
                        'item':'',
                        'quantity':0,
                        'weight':0,
                        'purity':0,
                        'stoneweight':0,
                        'valueaddition':0,
                        'wastage':0,
                        'netweight':0
                    };

                    currenttransaction = returngroup[key];
                    for (var row in currenttransaction){
                        rowdata = currenttransaction[row];
                        returndata.transactiondate = rowdata.transactiondate;
                        returndata.transactiontype=appvariables.get('transactiontype')[0].return;

                        if (rowdata.product_code == appvariables.get('productcode')[0].gold) {
                            returndata.item = rowdata.package_name;
                            returndata.quantity = rowdata.quantity;
                            returndata.weight = rowdata.productvalue;
                            returndata.purity = rowdata.purity;
                        }
                        else if (rowdata.product_code == appvariables.get('productcode')[0].stoneweight) {
                            returndata.stoneweight= rowdata.productvalue;
                        }
                        else if (rowdata.product_code == appvariables.get('productcode')[0].wastage) {
                            returndata.wastage= rowdata.productvalue;
                        }
                        else if (rowdata.product_code == appvariables.get('productcode')[0].valueaddition) {
                            returndata.valueaddition= rowdata.productvalue;
                        }

                        if(currenttransaction[+row + +1] == undefined){
                            var netreturnweight= filterfunction.filterarray($rootScope.smithreport,{transactionid: rowdata.transactionid});
                            returndata.netweight = netreturnweight[0].calculatedweight;
                            smithreturn.push(returndata);
                        }
                    }
                }
                $rootScope.smithissuelist= smithissue;
                $rootScope.smithreturnlist= smithreturn;
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };
    $scope.cash=function(){
        reportservice.cash($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.cashbooksummary=data[0];
                $rootScope.cashbookreport=data[1];
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };
    $scope.bill=function(){
        reportservice.bill($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.customeroutstanding=data[0];
                $rootScope.billsummary=data[1];
                $rootScope.billdetailsreport=data[2];
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };  // bill method is not used. need to cross check and remove
    $scope.viewbill=function(){
        reportservice.viewbill($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.customeroutstanding=data[0];
                $rootScope.billsummary=data[1];
            }
            else{
                logger.logWarning('bill data not available');
            }
        });
    };
    $scope.editbill = function(data){
        $rootScope.editbillreceiptno=data.receiptno;
        $rootScope.editbillcustomer=data.customerid;
        $rootScope.editbillcustomertype=data.customertype;
        $rootScope.editbilltransactiondate= utilities.date2Format(data.transactiondate,'yyyy/mm/dd');
        $location.path('/editbill');
    };
    $scope.generatebill =function(billrow){
        $rootScope.base64encodedpdf = '';
        var printoptions={
            'company':$rootScope.company,
            'customer':billrow.customerid,
            'customertype':billrow.customertype,
            'transactionlist':0,
            'billtype':'salesbill',
            'receiptno':billrow.receiptno,
            'fromdate':$rootScope.reportdata.fromdate,
            'todate':$rootScope.reportdata.todate,
            'billdatafromclient':$rootScope.transactionalcharges,
            'action':'view'
        };
        printservice.salesbill(printoptions,function(response){
            $rootScope.base64encodedpdf = $sce.trustAsResourceUrl(response);
        });
        ngDialog.open({
            template: 'modelcustomerbill',
            className: 'ngdialog-theme-default custom-width',
            closeByDocument: false
        });
    };

    $scope.salesreturn=function(){
        reportservice.salesreturn($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.customeroutstanding=data[0];
                //$rootScope.billsummary=data[1];
                //$rootScope.billdetailsreport=data[2];
                $rootScope.billsummary= filterfunction.filterarray(data[1],{transactiontype: appvariables.get('transactiontype')[0].salesreturn});
                $rootScope.billdetailsreport= filterfunction.filterarray(data[2],{transactiontype: appvariables.get('transactiontype')[0].salesreturn});
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };

    $scope.cumilativereport=function(){
        if ($rootScope.reportdata.customer == 0){
            logger.logWarning('Please select customer');
            return;
        }
        reportservice.cumilativereport($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.customeroutstanding=data[0];
                $rootScope.customeropbalance=data[2];
                $rootScope.billsummary= data[1];
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };

    $scope.order=function(){
        reportservice.order($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.customeroutstanding=data[0];
                $rootScope.billsummary= filterfunction.filterarray(data[3],{transactiontype: appvariables.get('transactiontype')[0].order});
                $rootScope.billdetailsreport= filterfunction.filterarray(data[2],{transactiontype: appvariables.get('transactiontype')[0].order});
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };
    $scope.daybook=function(){
        reportservice.daybook($rootScope.reportdata,function(data){
            if (data!=undefined){
                $scope.daybookdata=data[0];
                $scope.daybookreceiptdata=data[1];
                $scope.daybookdatadetails=data[2];

                $scope.billcount = $scope.daybookreceiptdata.totalreceiptno;
                $scope.salescount = 0, $scope.salesweight= 0,$scope.purchasecount = 0,$scope.purchaseweight= 0,$scope.salesreturncount = 0,$scope.salesreturnweight= 0,
                    $scope.smithissuecount = 0,$scope.smithissueweight= 0,$scope.smithreturncount = 0,$scope.smithreturnweight= 0,$scope.cashissuecount = 0,$scope.cashissueweight= 0,
                    $scope.cashreceiptcount = 0,$scope.cashreceiptweight= 0,$scope.ordercount = 0,$scope.orderweight= 0,$scope.billcount=0;
                var item;

                for (var row in $scope.daybookdata){
                    item=$scope.daybookdata[row];
                    switch (+item.transactiontype){
                        case 1: // sales
                            $scope.salescount = item.totalquantity;
                            $scope.salesweight= item.totalvalue;
                            break;
                        case 2: // purchase
                            $scope.purchasecount = item.totalquantity;
                            $scope.purchaseweight= item.totalvalue;
                            break;
                        case 3: // salesreturn
                            $scope.salesreturncount = item.totalquantity;
                            $scope.salesreturnweight= item.totalvalue;
                            break;
                        case 4: // og test
                            break;
                        case 5: // issue
                            $scope.smithissuecount = item.totalquantity;
                            $scope.smithissueweight= item.totalvalue;
                            break;
                        case 6: // return
                            $scope.smithreturncount = item.totalquantity;
                            $scope.smithreturnweight= item.totalvalue;
                            break;
                        case 7: // cashpayment
                            $scope.cashissuecount = item.totalquantity;
                            $scope.cashissueweight= item.totalvalue;
                            break;
                        case 8: // cashreceipt
                            $scope.cashreceiptcount = item.totalquantity;
                            $scope.cashreceiptweight= item.totalvalue;
                            break;
                        case 9: // order
                            $scope.ordercount = item.totalquantity;
                            $scope.orderweight= item.totalvalue;
                            break;
                    }
                }
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };
    $scope.dashboard=function(){
        reportservice.dashboard($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.transactioncustomertrend=data[0];
                $rootScope.metalpositiontrend=data[1];
                $rootScope.oustanderstrend=data[2];
                $rootScope.ordertrend=data[3];
                $rootScope.ordersnearingdelivery=data[4];

                var today = new Date();
                var last7days=[];

                var days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                var tdate=today;
                for(var i = 0; i < 7; i++){
                    tdate = new Date(tdate.setDate(today.getDate() - i));
                    if (days[tdate.getDay()] != 'Sunday') {
                        last7days.push(utilities.date2Format(tdate, 'dd-mm-yyyy'))
                    }
                }
                last7days = last7days.reverse();

                $scope.last7days = utilities.goBackDays(today,7);

                var transactiontrendbody=[];
                var transactionsmithbody=[];
                var metalpositionbody=[];
                var topoustanderswithsalesbody=[];
                var orderdata=[];
                var ratebody=[];
                var orderbody=[];
                var ratefluctuationbody=[];

                var data = $rootScope.transactioncustomertrend;
                var dataRowsales = [];
                var dataRowpurchase = [];
                var dataRoworder = [];
                var dataRowsalesreturn = [];
                var dataGsissue= [];
                var dataGsreturn = [];
                var datametalposition = [];
                var datatopoutstander = [];
                var datatopoutstanderbalancedata = [];
                var datatopoutstandersalesdata = [];

                data.forEach(function(row){
                    if (row.transactiontype == transactiontypesales()){
                        dataRowsales.push(row.amount == null ? '0' : row.amount.toString());
                    }
                    if (row.transactiontype == transactiontypepurchase()){
                        dataRowpurchase.push(row.amount == null ? '0' : row.amount.toString());
                    }
                    if (row.transactiontype == transactiontypeorder()){
                        dataRoworder.push(row.amount == null ? '0' : row.amount.toString());
                    }
                    if (row.transactiontype == transactiontypesalesreturn()){
                        dataRowsalesreturn.push(row.amount == null ? '0' : row.amount.toString());
                    }
                    if (row.transactiontype == transactiontypeissue()){
                        dataGsissue.push(row.amount == null ? '0' : row.amount.toString());
                    }
                    if (row.transactiontype == transactiontypereturn()){
                        dataGsreturn.push(row.amount == null ? '0' : row.amount.toString());
                    }
                    if (row.transactiontype == transactiontypeorder()){
                        dataRoworder.push(row.amount == null ? '0' : row.amount.toString());
                    }
                });

                // transaction trend graph data
                transactiontrendbody.push(dataRowsales);
                transactiontrendbody.push(dataRowpurchase);
                transactiontrendbody.push(dataRoworder);
                transactiontrendbody.push(dataRowsalesreturn);
                // smith trend graph data
                transactionsmithbody.push(dataGsissue);
                transactionsmithbody.push(dataGsreturn);
                // order trend graph data
                orderbody.push(dataGsissue);

                // metal position data
                var trend = $rootScope.metalpositiontrend;
                var outstanding, golddsmith, instock, display;
                trend.forEach(function(row){
                    if (row.outstandingweight == 'outstandingweight'){
                        outstanding = (row.Sum_outstandingweight == null ? '0' : row.Sum_outstandingweight.toString());
                    }
                    else if (row.outstandingweight == 'goldsmithoutstandingweight'){
                        golddsmith = (row.Sum_outstandingweight == null ? '0' : row.Sum_outstandingweight.toString());
                    }
                    else if (row.outstandingweight == 'stockweight'){
                        instock = (row.Sum_outstandingweight == null ? '0' : row.Sum_outstandingweight.toString());
                    }
                    else if (row.outstandingweight == 'displayweight'){
                        display = (row.Sum_outstandingweight == null ? '0' : row.Sum_outstandingweight.toString());
                    }
                });
                datametalposition.push(outstanding);
                datametalposition.push(golddsmith);
                datametalposition.push(instock);
                metalpositionbody.push(datametalposition);
                // metal position data

                // top outstanders last week
                var topoutstander = $rootScope.oustanderstrend;
                topoutstander.forEach(function(row){
                    datatopoutstander.push(row.orgname);
                    datatopoutstanderbalancedata.push(row.avgoutstandingweight);
                    datatopoutstandersalesdata.push(row.avgsaleweight);
                });

                topoustanderswithsalesbody.push(datatopoutstanderbalancedata);
                topoustanderswithsalesbody.push(datatopoutstandersalesdata);

                // chart on orders for last 7 days
                var orderlist = $rootScope.ordertrend;
                var outstanding, golddsmith, instock, display,rowproductvalue;
                var orderdays=[];
                var neworderdata=[];
                var newDate=today;
                for(var i = 0; i < 7; i++){
                    newDate = new Date(newDate.setDate(today.getDate() - i));
                    var newDatevalue =utilities.date2Format(newDate,'yyyy-mm-dd');
                    if (days[newDate.getDay()] != 'Sunday'){
                        orderdays.push(utilities.date2Format(newDatevalue,'dd-mm-yyyy'));
                        rowproductvalue=0;
                        orderlist.forEach(function(row){
                            if (utilities.date2Format(row.transactiondate,'yyyy-mm-dd') == newDatevalue){
                                rowproductvalue = row.Sum_productvalue;
                            }
                        });
                        neworderdata.push(rowproductvalue);
                    }
                }
                neworderdata= neworderdata.reverse();
                orderdata.push(neworderdata)
                orderdays = orderdays.reverse();

                // chart on transaction for last 7 days
                $rootScope.transactiontrendchartData = {
                    labels: last7days,
                    series: ['sales','purchase','order','salesreturn'],
                    data: transactiontrendbody
                };
                $rootScope.transactiontrendchartdatasetOverride = [{
                    label: "Line chart",
                    fill: false,
                    legend:true
                }];
                $rootScope.transactiontrendchartoptions = {
                    label: "Line chart"
                };
                // chart on transaction for last 7 days

                // chart on smith for last 7 days
                $rootScope.transactionsmithchartData = {
                    labels: last7days,
                    series: ['issue', 'return'],
                    data: transactionsmithbody
                };
                $rootScope.transactionsmithchartdatasetOverride = [{
                    label: "Line chart",
                    borderWidth: 3,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    type: 'line',
                    datasetFill:true,
                    legend:true
                }];
                $rootScope.transactionsmithchartoptions = {
                    scales: {
                        yAxes: [{
                            id: 'y-axis-1',
                            type: 'line',
                            display: true,
                            position: 'left'
                        }]
                    }
                };
                // chart on smith for last 7 days

                // Net metal position as of today
                $rootScope.metalpositionchartoptions = {
                    "labels": true,
                    legend : {
                        display : true,
                        position : "right"
                    }
                };
                $rootScope.metalpositionchartData = {
                    labels: ["outStanding","goldSmith","stock"],
                    data: datametalposition
                };
                // Net metal position as of today

                // chart on top outstanding customers for last 7 days
                $rootScope.topoustanderswithsaleschartData = {
                    labels: datatopoutstander, //$scope.last7days,
                    series: ['outstanding', 'sales'],
                    data: topoustanderswithsalesbody
                };
                // chart on top outstanding customers for last 7 days

                $rootScope.orderchartData = {
                    labels: orderdays,
                    series: ['weight'],
                    data: orderdata
                };
                $rootScope.orderchartdatasetOverride = [{
                    label: "Line chart",
                    fill: false,
                    legend:true
                }];
                $rootScope.orderchartoptions = {
                    label: "Line chart"
                };
                // chart on smith for last 7 days

                // chart on rate fluctuation for last quarter
                $rootScope.ratechartData = {
                    labels: $scope.last7days,
                    series: ['board rate'],
                    data: ratebody
                };
                $rootScope.ratechartdatasetOverride = [{
                    label: "Line chart",
                    borderWidth: 3,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    type: 'line',
                    datasetFill:true,
                    legend:true
                }];
                $rootScope.ratechartoptions = {
                    scales: {
                        yAxes: [{
                            id: 'y-axis-1',
                            type: 'line',
                            display: true,
                            position: 'left'
                        }]
                    }
                };
                // chart on rate fluctuation for last quarter
            }
            else{
                logger.logWarning('data not available');
            }
        });
    };

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
    $scope.loadcustomer =function(customertype){
        $rootScope.reportdata.customertype=customertype;
        reportservice.loadcustomer($rootScope.reportdata,function(data){
            if (data!=undefined){
                $rootScope.listcustomer=data;
                //$rootScope.reportdata.customer=data[0].customerid;
            }
            else{
                logger.logWarning('unable to load smith.');
            }
        });
    };
    $scope.onchangecustomer=function(customer){
        $rootScope.reportdata.customer=customer.customerid;
    };
    $scope.calculategns=function(){
        //var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        $rootScope.reportdata.fromdate = utilities.date2Format($rootScope.reportdata.fromdate,'yyyy-mm-dd');
        $rootScope.reportdata.todate = utilities.date2Format($rootScope.reportdata.todate,'yyyy-mm-dd');
        reportservice.calculategns($rootScope.reportdata,function(data){
            if (data!=undefined){
                var netsale=0, netsalestone=0, netsalesreturn=0, netsalesreturnstone=0;
                var rowdata;

                $rootScope.netgns=0;
                for (var row in data[0]){
                    rowdata = data[0][row];
                    if (rowdata.transactiontype == appvariables.get('transactiontype')[0].sales && rowdata.productid ==1 ){
                        netsale =rowdata.netweight;
                    }
                    else if (rowdata.transactiontype == appvariables.get('transactiontype')[0].sales && rowdata.productid ==8 ){
                        netsalestone =rowdata.netweight;
                    }
                    else if (rowdata.transactiontype == appvariables.get('transactiontype')[0].salesreturn && rowdata.productid ==1 ){
                        netsalesreturn =rowdata.netweight;
                    }
                    else if (rowdata.transactiontype == appvariables.get('transactiontype')[0].salesreturn && rowdata.productid ==8 ){
                        netsalesreturnstone =rowdata.netweight;
                    }
                }
                $rootScope.netgns = utilities.roundtodecimal((+netsale - +netsalestone) - (+netsalesreturn - +netsalesreturnstone),3);
            }
            else{
                logger.logWarning('gns retrievel failes.');
            }
        });
    };

    // form load
    $scope.initstockreport = function(){
        // methods to be invoked on stock report.html page load
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.showstockhistory=false;
        $scope.stock();
        $scope.stocktransactionexpanded=false;
        $scope.stocktransactiondetailsexpanded=false;
    };
    $scope.initliststockreport = function(){
        // methods to be invoked on stock report.html page load
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.liststock();
    };
    $scope.initcashreport = function(){
        // methods to be invoked on cash report.html page load
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $rootScope.reportdata.package=appvariables.get('packagecode')[0].cash;
        $scope.cash();
    };
    $scope.initsmithreport = function(){
        // methods to be invoked on smith report.html page load
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.loadcustomer(appvariables.get('customertype')[0].goldsmith);
        $scope.smith();
    };
    $scope.initbillreport = function(){
        // methods to be invoked on bill report.html page load
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.loadcustomer('');
        $scope.viewbill();
    };
    $scope.initsalesreturnreport = function(){
        // methods to be invoked on bill report.html page load

        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.loadcustomer('');
        $scope.salesreturn();
    };
    $scope.initcumilationreport = function (){
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;

        $scope.loadcustomer('');
    };
    $scope.initdaybookreport = function(){
        // methods to be invoked on bill daychartreport.html page load

        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.daybook();
    };
    $scope.initorderreport = function(){
        // methods to be invoked on bill report.html page load

        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.loadcustomer('');
        $scope.order();
    };
    $scope.initdashboard = function(){
        // methods to be invoked on bill initdashboardreport.html page load
        $rootScope.reportdata.fromdate=$rootScope.currentdate;
        $rootScope.reportdata.todate=$rootScope.currentdate;
        $scope.dashboard();
        $scope.calculategns();
    };
    $scope.transactions=function(data){
        $scope.transactionshow=true;
        reportservice.transactions(data,$scope);
    };
    $scope.sales=function(){
        reportservice.sales();
    };
}]);

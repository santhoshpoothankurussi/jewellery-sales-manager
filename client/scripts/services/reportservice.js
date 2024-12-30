// <copyright file="reportservice.js" company="Cronyco">
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

robs.factory('reportservice',function($http,$location) {
    return {
        loadcustomer: function(data,doCallback){
            $http.post('/service/loadcustomer', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        stock: function(data,doCallback){
            $http.post('/report/stock', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        liststock: function(data,doCallback){
            $http.post('/report/liststock', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        stockhistory: function(data,doCallback){
            $http.post('/report/stock', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        // bill method is not used. need to cross check and remove
        bill: function(data,doCallback){
            $http.post('/report/transactions', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        viewbill: function(data,doCallback){
            $http.post('/report/bill', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        salesreturn: function(data,doCallback){
            $http.post('/report/transactions', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        cumilativereport: function(data,doCallback){
            $http.post('/report/cumilative', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        smith: function(data,doCallback){
            $http.post('/report/smith', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        cash: function(data,doCallback){
            $http.post('/report/cash', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        order: function(data,doCallback){
            $http.post('/report/transactions', data)
                .success(function (response) {
                    doCallback(response);
                })
        },
        daybook: function(data,doCallback){
            $http.post('/report/daybook', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        transactions: function(data,doCallback){
            $http.post('/report/transactions', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        sales: function(data,doCallback){
            $http.post('/report/sales', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        dashboard: function(data,doCallback){
            $http.post('/report/dashboard', data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        calculategns: function(data,doCallback){
            $http.post('/report/calculategns', data)
                .success(function (response) {
                    doCallback(response);
                });
        }
        //dashboard

        //Load:function($scope) {
        //    //$http.post('/DashBoard/GetRate').success(
        //    //    function(response) {
        //    //        $rootScope.Rate995=response[0].Rate995;
        //    //        $rootScope.BoardRate=response[0].BoardRate;
        //    //
        //    //
        //    //    });
        //    $http.post('/DashBoard/ApproachingDueDatesLoad').success(
        //        function(response) {
        //
        //            var ApproachingDueDatesCount=0;
        //            $scope.ApproachingDueDatesCount=ApproachingDueDatesCount;
        //            response.forEach(function(Data)
        //            {
        //                ApproachingDueDatesCount++;
        //                Data.CustomerDueDate=Data.CustomerDueDate.substring(0,10);
        //                var CustomerDueDate=new Date(Data.CustomerDueDate);
        //                CustomerDueDate.setDate(CustomerDueDate.getDate()+1);
        //                Data.CustomerDueDate=CustomerDueDate.getFullYear()+"-"+(+CustomerDueDate.getMonth()+1)+"-"+(CustomerDueDate.getDate());
        //                $scope.ApproachingDueDates=response;
        //                $scope.ApproachingDueDatesCount=ApproachingDueDatesCount;
        //
        //            });
        //        });
        //    $http.post('/DashBoard/SkippedDueDatesLoad').success(
        //        function(response) {
        //
        //            var SkippedDueDatesCount=0;
        //            $scope.SkippedDueDatesCount=SkippedDueDatesCount;
        //            response.forEach(function(Data)
        //            {
        //                SkippedDueDatesCount++;
        //                Data.CustomerDueDate=Data.CustomerDueDate.substring(0,10);
        //                var CustomerDueDate=new Date(Data.CustomerDueDate);
        //                CustomerDueDate.setDate(CustomerDueDate.getDate()+1);
        //                Data.CustomerDueDate=CustomerDueDate.getFullYear()+"-"+(+CustomerDueDate.getMonth()+1)+"-"+(CustomerDueDate.getDate());
        //                $scope.SkippedDueDates=response;
        //                $scope.SkippedDueDatesCount=SkippedDueDatesCount;
        //
        //
        //            });
        //        });
        //},
        //StockLoad:function(){
        //    $http.post('/DashBoard/Stock').success(
        //        function(response) {
        //
        //            var str='[';
        //            str+='{"type": "bar", "showInLegend": true ,"legendText":"Display","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "y": '+rows.DisplayQty+',  "indexLabel": "'+rows.DisplayQty+'", "label": "Display Quantity '+rows.CategoryName+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar", "showInLegend": true ,"legendText":"GoDown", "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "y": '+rows.GoDownQty+',  "indexLabel": "'+rows.GoDownQty+'","label": "GoDown Quantity '+rows.CategoryName+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "label": "'+rows.CategoryName+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var StockQuantity=JSON.parse(str);
        //            str='[';
        //            str+='{"type": "bar","showInLegend": true ,"legendText":"Display","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "y": '+rows.DisplayWt+', "indexLabel": "'+rows.DisplayWt+'","label": "Display Weight '+rows.CategoryName+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar","showInLegend": true ,"legendText":"GoDown","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "y": '+rows.GoDownWt+',"indexLabel": "'+rows.GoDownWt+'","label": "GoDown Weight '+rows.CategoryName+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "label": "'+rows.CategoryName+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var StockWeight=JSON.parse(str);
        //            str='[';
        //            str+='{"type": "pie" , "showInLegend": true , "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                str+='{ "y": '+(+rows.DisplayWt + +rows.GoDownWt)+', "legendText":"'+rows.CategoryName+'","indexLabel": "'+(+rows.DisplayWt + +rows.GoDownWt)+"("+rows.CategoryName+")"+'"},'
        //            });
        //
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var pieStock=JSON.parse(str);
        //            var chartStockQuantity = new CanvasJS.Chart("barStockQuantity",
        //                {
        //                    title:{text: "Stock Quantity (Display vs GoDown)",fontSize:18},data:StockQuantity
        //                });
        //            var chartStockDisplay = new CanvasJS.Chart("barStockWeight",
        //                {
        //                    title:{text: "Stock Weight (Display vs GoDown)",fontSize:18},data:StockWeight
        //                });
        //            var chartStockWeight = new CanvasJS.Chart("pieStockWeight",
        //                {
        //                    title:{text: "Stock Weight",fontSize:18},data:pieStock
        //                });
        //
        //            chartStockQuantity.render();
        //            chartStockDisplay.render();
        //
        //
        //            chartStockWeight.render();
        //
        //        });
        //
        //},
        //SalesLoad:function() {
        //    $http.post('/DashBoard/Sales').success(
        //        function(response) {
        //
        //
        //            var date;
        //            var str='{"type": "line" , "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                date=new Date(rows.ApprovedDate);
        //                str+='{"x": '+date.getDate()+' , "y":'+rows.ApprovedWeight+'},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            var lineSales=JSON.parse(str);
        //
        //            var chartSales = new CanvasJS.Chart("lineSales",
        //                {
        //                    title:{text: "Sales",fontSize:22},
        //                    axisY:{title:"Grams",titleFontSize:15,titleFontStyle:"Italic"},
        //                    axisX:{title:"Dates",titleFontSize:15,titleFontStyle:"Italic"},data:[lineSales]
        //                });
        //
        //            chartSales.render();
        //        });
        //},
        //OutstandingBalanceLoad:function(){
        //    $http.post('/DashBoard/OutstandingBalance').success(
        //        function(response) {
        //
        //            var str='[';
        //            str+='{"type": "pie" , "showInLegend": true , "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                var CustomerType=rows.CustCode.substring(0,1);
        //                if(CustomerType == 'R'){CustomerType='Retailer';}
        //                else if(CustomerType == 'W'){CustomerType='Wholesaler';}
        //                else if(CustomerType == 'G'){CustomerType='GoldSmith';}
        //                rows.CustomerBalance=''+rows.CustomerBalance;
        //                var dotPosition = rows.CustomerBalance.indexOf('.');
        //                if(dotPosition!=-1)
        //                {
        //                    rows.CustomerBalance=''+rows.CustomerBalance.substring(0, dotPosition+4);
        //                }
        //                str+='{"y": '+rows.CustomerBalance+', "legendText":"'+CustomerType+'","indexLabel": "'+rows.CustomerBalance+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var OutstandingBalance=JSON.parse(str);
        //            var chartOutstandingBalance = new CanvasJS.Chart("pieOutstandingBalance",
        //                {
        //                    title:{text: "Outstanding Balance",fontSize:22},data:OutstandingBalance
        //                });
        //            chartOutstandingBalance.render();
        //        });
        //},
        //CustomerBalanceLoad:function(){
        //    $http.post('/DashBoard/CustomerBalanceWholesaler').success(
        //        function(response) {
        //
        //
        //            var str='[';
        //            str+='{"type": "column", "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                rows.OutstandingWeight=''+rows.OutstandingWeight;
        //                var dotPosition = rows.OutstandingWeight.indexOf('.');
        //                if(dotPosition!=-1)
        //                {
        //                    rows.OutstandingWeight=roundNumber(+rows.OutstandingWeight,3);
        //                }
        //                str+='{ "y": '+rows.OutstandingWeight+', "indexLabel": "'+rows.OutstandingWeight+'", "label": "Outstanding Balance of '+rows.BusinessName+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                rows.BusinessName=rows.BusinessName.substring(0,10);
        //                str+='{ "label": "'+rows.BusinessName+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var CustomerBalance=JSON.parse(str);
        //            var chartCustomerBalance = new CanvasJS.Chart("barCustomerBalanceWholesaler",
        //                {
        //                    title:{text: "OutstandingBalance Wholesaler",fontSize:22},
        //                    axisY:{title:"Grams",titleFontSize:15,titleFontStyle:"Italic"},
        //                    axisX:{title:"Customers",titleFontSize:15, labelFontSize:13,labelAngle:135,titleFontStyle:"Italic"},data:CustomerBalance
        //                });
        //            chartCustomerBalance.render();
        //        });
        //    $http.post('/DashBoard/CustomerBalanceRetailer').success(
        //        function(response) {
        //
        //            var str='[';
        //            str+='{"type": "column", "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                rows.OutstandingWeight=''+rows.OutstandingWeight;
        //                var dotPosition = rows.OutstandingWeight.indexOf('.');
        //                if(dotPosition!=-1)
        //                {
        //                    rows.OutstandingWeight=roundNumber(+rows.OutstandingWeight,3);
        //                }
        //                str+='{ "y": '+rows.OutstandingWeight+', "indexLabel": "'+rows.OutstandingWeight+'", "label": "Outstanding Balance of '+rows.BusinessName+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                rows.BusinessName=rows.BusinessName.substring(0,10);
        //                str+='{ "label": "'+rows.BusinessName+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var CustomerBalance=JSON.parse(str);
        //            var chartCustomerBalance = new CanvasJS.Chart("barCustomerBalanceRetailer",
        //                {
        //                    title:{text: "OutstandingBalance Retailer",fontSize:22},
        //                    axisY:{title:"Grams",titleFontSize:15,titleFontStyle:"Italic"},
        //                    axisX:{title:"Customers",titleFontSize:15, labelFontSize:13,labelAngle:135,titleFontStyle:"Italic"},data:CustomerBalance
        //                });
        //            chartCustomerBalance.render();
        //        });
        //},
        //GoldSmithBalanceLoad:function(){
        //    $http.post('/DashBoard/GoldSmithBalance').success(
        //        function(response) {
        //
        //            var str='[';
        //            str+='{"type": "column", "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                rows.OutstandingWeight=''+rows.OutstandingWeight;
        //                var dotPosition = rows.OutstandingWeight.indexOf('.');
        //                if(dotPosition!=-1)
        //                {
        //                    rows.OutstandingWeight=roundNumber(+rows.OutstandingWeight,3);
        //                }
        //                str+='{ "y": '+rows.OutstandingWeight+', "indexLabel": "'+rows.OutstandingWeight+'", "label": "Outstanding Balance of '+rows.BusinessName+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']},';
        //            str+='{"type": "bar","dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                rows.BusinessName=rows.BusinessName.substring(0,10);
        //                str+='{ "label": "'+rows.BusinessName+'"},'
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var GoldSmithBalance=JSON.parse(str);
        //            var chartGoldSmithBalance = new CanvasJS.Chart("barGoldSmithBalance",
        //                {
        //                    title:{text: "GoldSmith Balance",fontSize:22},
        //                    axisY:{title:"Grams",titleFontSize:15,titleFontStyle:"Italic"},
        //                    axisX:{title:"GoldSmith",titleFontSize:15,labelFontSize:13,labelAngle:135,titleFontStyle:"Italic"},data:GoldSmithBalance
        //                });
        //            chartGoldSmithBalance.render();
        //        });
        //},
        //CashBookLoad:function() {
        //    $http.post('/DashBoard/CashBook').success(
        //
        //        function(response) {
        //
        //
        //            var today= new Date();
        //            var PreviousWeek=today;
        //            today=(today.getDate())+"-"+(+today.getMonth()+1)+"-"+today.getFullYear();
        //            PreviousWeek.setDate(PreviousWeek.getDate()-6);
        //            PreviousWeek=PreviousWeek.getDate()+"-"+(+PreviousWeek.getMonth()+1)+"-"+PreviousWeek.getFullYear();
        //            var indexLabel=PreviousWeek+" To "+today;
        //            var str='[';
        //            str+='{"type": "pie" , "showInLegend": true , "dataPoints": [';
        //            response.forEach(function(rows)
        //            {
        //                if(rows.CashFlow==48)  //binary type 0 = 48.
        //                {
        //                    str+='{ "y": '+rows.Amount+', "legendText":"Receipt","indexLabel": "'+indexLabel+'"},'
        //                }
        //                else
        //                {
        //                    str+='{ "y": '+rows.Amount+', "legendText":"Payment","indexLabel": "'+indexLabel+'"},'
        //                }
        //            });
        //            str=str.substring(0,str.length-1);
        //            str+=']}';
        //            str+=']';
        //            var CashBookData=JSON.parse(str);
        //            var pieCashBook = new CanvasJS.Chart("pieCashBook",
        //                {
        //                    title:{text: "CashBook",fontSize:22},
        //                    data:CashBookData
        //                });
        //            pieCashBook.render();
        //
        //        });
        //}
    }
});

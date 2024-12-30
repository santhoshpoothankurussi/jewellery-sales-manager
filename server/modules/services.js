// <copyright file="services.js" company="Cronyco">
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
// <date>2016-06-10</date>

'use strict';
var db=require('../appconfig/db').pool;
var logger=require('../utilities/logger.js');
var formulae=require('./formulae.js');
var math=require('../utilities/math.js');
var async = require('async');

function basepurity(){var basepurity=99.5; return basepurity;}

function transactiontypesales(){return 1;}
function transactiontypepurchase(){return 2;}
function transactiontypesalesreturn(){return 3;}
function transactiontypeogtest(){return 4;}
function transactiontypeissue(){return 5;}
function transactiontypereturn(){return 6;}
function transactiontypecashpayment(){return 7;}
function transactiontypecashreceipt(){return 8;}
function transactiontypeorder(){return 9;}

function outstandingtypeweightbalance(){return 1;}
function outstandingtypecashbalance(){return 2;}
function outstandingtypeboth(){return 3;}

function customertypewholesale(){return 1;}
function customertyperetail(){return 2;}
function customertypegoldsmith(){return 3;}

function productcodepuregold(){return "PW100";}
function productcodegold (){return "PW995";}
function productcodeoldgold (){return "PW101";}
function productcode995gold (){return "PW995";}

function productcodemakingcharge (){return "PA202";}
function productcodemakingexpense (){return "PW102";}
function productcodevalueaddition (){return "PW103";}
function productcodestoneweight (){return "PW105";}
function productcodestonevalue (){return "PA203";}
function productcodewastage (){return "PW107";}
function productcodecategory (){return "PC101";}
function productcodetestweight (){return "PW104";}
function productcodetestreturn (){return "PW106";}
function productcodecashreceipt (){return "PA100";}
function productcodecashpayment (){return "PA100";}

function packagecodeoldgold (){return "G0001";}
function packagecode995 (){return "G9950";}
function packagecodecash (){return "C1000";}

exports.liststore = function (req, res) {
    var sql="SELECT * FROM store where companyid='"+req.body.company+"'";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/liststore ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','liststore Success !!',req.session.sessionID,'liststore');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','liststore !!',req.session.sessionID,'savestock');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'savestock');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listcategory = function (req, res) {
    var sql="Select  packagedescription.package_title,  category.categoryid,  category.categoryname,  packagedescription.packages_id "+
    "From  category Inner Join  packagedescription    On category.packageid = packagedescription.packages_id "+
    "Where  category.companyid ='"+req.body.company+"' Order By  category.categoryid";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/listcategory ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listcategory Success !!',1,'listcategory');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','listcategory !!',1,'listcategory');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'listcategory');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.liststock = function (req, res) {
    var sql="select packagedescription.package_title,curstock.* from " +
        "(SELECT o.* FROM `stock` o  LEFT JOIN `stock` b  ON o.packageid = b.packageid And b.storeid = o.storeid AND o.stockdate < b.stockdate " +
        "WHERE b.stockdate is NULL ) curstock " +
        "Inner Join  packagedescription  On curstock.packageid = packagedescription.packages_id " +
        "Where curstock.companyid ="+req.body.company+";";
    //console.log((sql));
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/liststock ');
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','liststock Success !!',1,'liststock');
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','liststock !!',1,'liststock');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'liststock');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.loadcustomer = function (req, res) {
    var sql='';
    //console.log(req.body.customertype);
    if (req.body.customertype == '' | req.body.customertype==undefined){
        sql="Select  customer.customerid, customer.customertype,customer.orgname, Concat(customer.firstname, ' ', customer.lastname) As cname,Concat(customer.orgname, ' (', customertype.typename,')') As cshop , customerdetails.outstandingtype, customerdetails.creditlimitweight, customerdetails.creditlimitcash, customer.status,customertype.typename From  customer Inner Join  customerdetails  On customer.companyid = customerdetails.companyid And customer.customerid = customerdetails.customerid Inner Join  customertype  On customer.customertype = customertype.customertype " +
        "Where customer.status = 1 And customer.companyid ='"+req.body.company+"';";

        //sql= "Select customer.customerid, customer.customertype,customer.orgname,Concat(customer.firstname, ' ', customer.lastname) As cname, customerdetails.outstandingtype, customerdetails.creditlimitweight,customerdetails.creditlimitcash,customer.status  From  customer Inner Join  customerdetails  On customer.companyid = customerdetails.companyid And customer.customerid =  customerdetails.customerid  " +
        //    "Where customer.status = 1 And customer.companyid ='"+req.body.company+"';";
    }
    else{
        sql="Select  customer.customerid, customer.customertype,customer.orgname, Concat(customer.firstname, ' ', customer.lastname) As cname, Concat(customer.orgname, ' (', customertype.typename,')') As cshop ,customerdetails.outstandingtype, customerdetails.creditlimitweight, customerdetails.creditlimitcash, customer.status,customertype.typename From  customer Inner Join  customerdetails  On customer.companyid = customerdetails.companyid And customer.customerid = customerdetails.customerid Inner Join  customertype  On customer.customertype = customertype.customertype " +
            "Where customer.status = 1 And customer.customertype ='"+ req.body.customertype +"' And customer.companyid ='"+req.body.company+"';";
        //sql= "Select customer.customerid, customer.customertype,customer.orgname,Concat(customer.firstname, ' ', customer.lastname) As cname, customerdetails.outstandingtype, customerdetails.creditlimitweight,customerdetails.creditlimitcash,customer.status  From  customer Inner Join  customerdetails  On customer.companyid = customerdetails.companyid And customer.customerid =  customerdetails.customerid  " +
        //    "Where customer.status = 1 And customer.customertype ='"+ req.body.customertype +"' And customer.companyid ='"+req.body.company+"';";
    }
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/loadcustomer ');
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','loadcustomer Success',1,'loadcustomer');
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','loadcustomer',1,'loadcustomer');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query',req.session.sessionID,'loadcustomer');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listtransaction = function (req, res) {
    var company=req.body.company;
    var sql="call listtransaction ('"+company +"','"+ req.body.customer +"','"+ req.body.transactionid +"','"+ req.body.transactiondate.substring(0,10)+"','"+
        req.body.transactiondate.substring(0,10)+"');";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/listtransaction ');
        con.query(sql, function (err, rows){
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listtransaction Success !!',req.session.sessionID,'listtransaction');
                    results = JSON.stringify(rows);
                    //console.log(results);
                    res.end(results);
                }
                else{
                    logger.log('warn','listtransaction !!',req.session.sessionID,'listtransaction');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listtransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listtransactionfortype = function (req, res) {
    var company=req.body.company;
    var sql="call listtransactionfortype ('"+company +"','"+ req.body.customer +"','"+ req.body.transactiontype +"','"+ req.body.transactiondate.substring(0,10)+"','"+
        req.body.transactiondate.substring(0,10)+"');";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/listtransaction ');
        con.query(sql, function (err, rows){
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listtransaction Success !!',req.session.sessionID,'listtransaction');
                    results = JSON.stringify(rows);
                    //console.log(results);
                    res.end(results);
                }
                else{
                    logger.log('warn','listtransaction !!',req.session.sessionID,'listtransaction');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listtransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listtransactionwithindates = function (req, res) {
    var company=req.body.company;
    var sql="call apklistservier ('" + company + "','" + req.body.customer +"','" + req.body.calltype + "','"+ req.body.transactiontype +"','"+ req.body.fromdate.substring(0,10)+"','"+
        req.body.todate.substring(0,10)+"');";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/listtransaction ');
        con.query(sql, function (err, rows){
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listtransaction Success !!',req.session.sessionID,'listtransaction');
                    results = JSON.stringify(rows);
                    //console.log(results);
                    res.end(results);
                }
                else{
                    logger.log('warn','listtransaction !!',req.session.sessionID,'listtransaction');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listtransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listtransactionhistory=function(req,res){
    var company=req.body.company;
    var user= req.body.user;

    db.getConnection(function(err, con){
        var sql="call listtransactionhistory ('"+company +"','"+ req.body.customer +"','"+ req.body.transactionid +"');";

        logger.log('info',sql,user,'/listtransactionhistory');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listtransactionhistory Success !!',req.session.sessionID,'listtransactionhistory');
                    res.end(JSON.stringify(rows));
                }else{
                    logger.log('warn','listtransactionhistory !!',req.session.sessionID,'listtransactionhistory');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listtransactionhistory');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.updatetransactionbill = function (req,res,callback) {
    var transactiontype=req.body.transactiontype;
    var outstandingtype=req.body.customeroutstandingtype;
    var summarysql='';
    var rows;
    //console.log('updatetransactionbill ' + req.body)
    //console.log('updatetransactionbill transactiontype ' + transactiontype)
    // get transaction details
    var sql="call listtransaction ('"+req.body.company +"','"+ req.body.customer +"','"+ req.body.transactionid +"','"+
        req.body.transactiondate.substring(0,10)+"','"+    req.body.transactiondate.substring(0,10)+"');";

    //console.log(sql);
    //console.log('updatetransactionbill list query ' + sql);
    //console.log('updatetransactionbill   ' + JSON.stringify(req.body));
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/listtransaction ');
        con.query(sql, function (err, returndata) {
            con.release();
            var results;
            if(!err){
                rows=JSON.stringify(returndata);
                rows=JSON.parse(rows);

                // process transaction details

                // summary for sales transactions
                if (transactiontype==transactiontypesales()){
                    var quantity=0, weight=0, purity=0, metalrate=0, valueaddition=0, makingexpense=0, makingcharge=0, stonevalue=0, stoneweight=0, wastage=0;
                    var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;

                    for (var i = 0; i < rows[1].length; i++) {
                        //console.log(JSON.stringify((rows[1][i])));
                        if (rows[1][i].product_code == productcodegold()){
                            quantity=rows[1][i].quantity;
                            weight=rows[1][i].productvalue;
                            purity=rows[1][i].purity;
                            metalrate=rows[1][i].rate;
                        }
                        else if (rows[1][i].product_code == productcodemakingcharge()){
                            makingcharge=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodemakingexpense()){
                            makingexpense=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodevalueaddition()){
                            valueaddition=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodestonevalue()){
                            stonevalue=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodestoneweight()){
                            stoneweight=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodewastage()){
                            wastage=rows[1][i].productvalue;
                        }
                    }
                    if (req.body.customertype == customertypewholesale()){
                        calculatedweight=formulae.WholesaleCalculation(weight,stoneweight,purity,wastage,valueaddition,makingcharge,stonevalue,metalrate);
                        calculatedamount=formulae.ConvertTo995ToCash(calculatedweight,purity,metalrate);
                    }
                    if (req.body.customertype == customertyperetail()){
                        calculatedamount=formulae.RetailCalculation(weight,stoneweight,purity,wastage,valueaddition,makingcharge,stonevalue,metalrate);
                        calculatedweight=formulae.ConvertCashTo995(calculatedamount,metalrate);
                        //console.log(calculatedweight);
                        //console.log(calculatedamount);
                    }
                    grossvalue= +grossvalue + +weight;
                    netweight= +netweight + +calculatedweight;
                    netamount= +netamount + +calculatedamount;
                    netquantity= +netquantity + +quantity;

                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    transactiontype +"','"+netweight+"','"+ netamount+"','"+grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                // summary for purchase transactions
                else if(transactiontype==transactiontypepurchase()){
                    var quantity=0, weight=0, purity=0, metalrate=0, testweight=0, testreturnweight=0, puregoldweight=0;
                    var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;

                    for (var i = 0; i < rows[1].length; i++){
                        if (rows[1][i].product_code == productcodeoldgold() || rows[1][i].product_code == productcode995gold()){
                            quantity=rows[1][i].quantity;
                            weight=rows[1][i].productvalue;
                            purity=rows[1][i].purity;
                            metalrate=rows[1][i].rate;
                        }
                        else if (rows[1][i].product_code == productcodetestweight()){
                            testweight=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodetestreturn()){
                            testreturnweight=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodepuregold()){
                            puregoldweight=rows[1][i].productvalue;
                        }
                    }
                    calculatedweight=formulae.ConvertTo995(weight,purity);
                    calculatedamount=formulae.ConvertTo995ToCash(weight,purity,metalrate);
                    grossvalue= +grossvalue + +weight;
                    netweight= +netweight + +calculatedweight;
                    netamount= +netamount + +calculatedamount;
                    netquantity= +netquantity + +quantity;

                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    req.body.transactiontype +"','"+netweight+"','"+ netamount+"','"+grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                // summary for cash receipt transactions
                else if(transactiontype==transactiontypecashreceipt()){
                    for (var i = 0; i < rows[1].length; i++) {
                        var quantity=1, amount=0, purity=1, metalrate=0;
                        var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;

                        for (var i = 0; i < rows[1].length; i++) {
                            if (rows[1][i].product_code == productcodecashreceipt()){
                                quantity=rows[1][i].quantity;
                                amount=rows[1][i].productvalue;
                                metalrate=rows[1][i].rate;
                            }
                        }
                        calculatedweight=formulae.ConvertCashTo995(amount,metalrate);
                        netweight= +netweight + +calculatedweight;
                        netamount= +netamount + +amount;
                        netquantity= +netquantity + +quantity;
                        grossvalue= +grossvalue + +amount;
                    }
                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    req.body.transactiontype +"','"+netweight+"','"+ netamount+"','"+ grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                // summary for cash payment transactions
                else if(transactiontype==transactiontypecashpayment()){
                    for (var i = 0; i < rows[1].length; i++) {
                        var quantity=1, amount=0, purity=1, metalrate=0;
                        var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;

                        for (var i = 0; i < rows[1].length; i++) {
                            if (rows[1][i].product_code == productcodecashpayment()){
                                quantity=rows[1][i].quantity;
                                amount=rows[1][i].productvalue;
                                metalrate=rows[1][i].rate;
                            }
                        }
                        calculatedweight=formulae.ConvertCashTo995(amount,metalrate);
                        netweight= +netweight + +calculatedweight;
                        netamount= +netamount + +amount;
                        netquantity= +netquantity + +quantity;
                        grossvalue= +grossvalue + +amount;
                    }
                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    req.body.transactiontype +"','"+netweight+"','"+ netamount+"','"+ grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                // summary for sales return transactions
                else if(transactiontype==transactiontypesalesreturn()){
                    var quantity=0, weight=0, purity=0, metalrate=0, valueaddition=0, makingexpense=0, makingcharge=0, stonevalue=0, stoneweight=0, wastage=0;
                    var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;

                    //console.log(JSON.stringify(rows))

                    for (var i = 0; i < rows[1].length; i++) {
                        if (rows[1][i].product_code == productcodegold()){
                            quantity=rows[1][i].quantity;
                            weight=rows[1][i].productvalue;
                            purity=rows[1][i].purity;
                            metalrate=rows[1][i].rate;
                        }
                        else if (rows[1][i].product_code == productcodemakingcharge()){
                            makingcharge=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodemakingexpense()){
                            makingexpense=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodevalueaddition()){
                            valueaddition=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodestonevalue()){
                            stonevalue=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodestoneweight()){
                            stoneweight=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodewastage()){
                            wastage=rows[1][i].productvalue;
                        }
                    }
                    //console.log(weight+','+stoneweight+','+purity+','+wastage+','+makingexpense+','+makingcharge+','+stonevalue+','+metalrate)
                    if (req.body.customertype == customertypewholesale()){
                        calculatedweight=formulae.WholesaleCalculation(weight,stoneweight,purity,wastage,valueaddition,makingcharge,stonevalue,metalrate);
                        calculatedamount=formulae.ConvertTo995ToCash(calculatedweight,purity,metalrate);
                    }
                    //console.log(req.body.customertype + ', ' + calculatedweight +' , ' +calculatedamount);
                    if (req.body.customertype == customertyperetail()){
                        calculatedamount=formulae.RetailCalculation(weight,stoneweight,purity,wastage,valueaddition,makingcharge,stonevalue,metalrate);
                        calculatedweight=formulae.ConvertCashTo995(calculatedamount,metalrate);
                    }
                    //console.log(req.body.customertype + ', ' + calculatedweight +' , ' +calculatedamount);
                    //console.log(req.body.customertype + ',' +weight+ ',' +stoneweight+ ',' +purity+ ',' +wastage+ ',' +makingexpense+ ',' +makingcharge+ ',' +stonevalue+ ',' +metalrate)
                    //console.log(calculatedweight + '  ' +calculatedamount);

                    grossvalue= +grossvalue + +weight;
                    netweight= +netweight + +calculatedweight;
                    netamount= +netamount + +calculatedamount;
                    netquantity= +netquantity + +quantity;

                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    transactiontype +"','"+netweight+"','"+ netamount+"','"+grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                // summary for gold smith issue transactions
                else if(transactiontype==transactiontypeissue()){
                    var quantity, weight, purity, metalrate, testweight=0, testreturnweight=0, puregoldweight=0;
                    var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;
                    var packagecode='';
                    var getpackageid='';

                    for (var i = 0; i < rows[1].length; i++){
                        if (packagecode==''){
                            packagecode=rows[1][i].packages_code;
                            getpackageid=rows[1][i].packageid;
                            //console.log(packagecode);
                        }
                        if (rows[1][i].product_code == productcodegold() || rows[1][i].product_code == productcodeoldgold()){
                            //console.log('inside gold ' + rows[1][i].product_code);
                            quantity=rows[1][i].quantity;
                            weight=rows[1][i].productvalue;
                            purity=rows[1][i].purity;
                            metalrate=rows[1][i].rate;
                        }
                        else if (rows[1][i].product_code == productcodecashpayment()){
                            //console.log('inside cash')
                            quantity=rows[1][i].quantity;
                            amount=rows[1][i].productvalue;
                            metalrate=rows[1][i].rate;
                        }
                    }

                    if (packagecode == packagecodeoldgold()){       // old gold
                        //console.log('inside calculate og')
                        calculatedweight=formulae.ConvertTo995smith(weight,purity);
                        calculatedamount=formulae.ConvertTo995ToCash(weight,purity,metalrate);
                        grossvalue= +grossvalue + +weight;
                        netweight= +netweight + +calculatedweight;
                        netamount= +netamount + +calculatedamount;
                        netquantity= +netquantity + +quantity;
                        req.body.package=getpackageid;
                        req.body.weight=calculatedweight;
                    }
                    else if(packagecode==packagecode995()){         // 995 gold
                        //console.log('inside calculate 995')
                        calculatedweight=formulae.ConvertTo995smith(weight,purity);
                        calculatedamount=formulae.ConvertTo995ToCash(weight,purity,metalrate);
                        grossvalue= +grossvalue + +weight;
                        netweight= +netweight + +calculatedweight;
                        netamount= +netamount + +calculatedamount;
                        netquantity= +netquantity + +quantity;
                        req.body.package=getpackageid;
                        req.body.weight=calculatedweight;
                    }
                    else if (packagecode==packagecodecash()){       // cash issue
                        //console.log('inside calculate cash')
                        calculatedweight=formulae.ConvertCashTo995(amount,metalrate);
                        calculatedamount=amount;
                        netweight= +netweight + +calculatedweight;
                        netamount= +netamount + +amount;
                        netquantity= +netquantity + +quantity;
                        grossvalue= +grossvalue + +amount;
                        req.body.package=0;
                        req.body.weight=calculatedweight;
                    }


                    //console.log(getpackageid +' for package calculated values '  + calculatedweight +' , '+calculatedamount+' , '+grossvalue+' , '+netweight+' , '+netamount+' , '+netquantity);

                    //for (var i = 0; i < rows[1].length; i++){
                    //    if (rows[1][i].product_code == productcodegold()){
                    //        quantity=rows[1][i].quantity;
                    //        weight=rows[1][i].productvalue;
                    //        purity=basepurity();
                    //        metalrate=rows[1][i].rate;
                    //    }
                    //}
                    //grossvalue= +grossvalue + +weight;
                    //netweight= +netweight + +calculatedweight;
                    //netamount= +netamount + +calculatedamount;
                    //netquantity= +netquantity + +quantity;
                    //
                    //
                    //for (var i = 0; i < rows[1].length; i++){
                    //    if (rows[1][i].product_code == productcodecashreceipt()){
                    //        quantity=rows[1][i].quantity;
                    //        weight=rows[1][i].productvalue;
                    //        purity=basepurity();
                    //        metalrate=rows[1][i].rate;
                    //    }
                    //}
                    //grossvalue= +grossvalue + +weight;
                    //netweight= +netweight + +calculatedweight;
                    //netamount= +netamount + +calculatedamount;
                    //netquantity= +netquantity + +quantity;

                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    req.body.transactiontype +"','"+netweight+"','"+ netamount+"','"+grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                // summary for gold smith receipt transactions
                else if(transactiontype==transactiontypereturn()){
                    //var quantity=0, weight=0, purity=0, metalrate=0, valueaddition=0, makingexpense=0, makingcharge=0, stonevalue=0, stoneweight=0, wastage=0;
                    //var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;
                    //
                    //for (var i = 0; i < rows[1].length; i++) {
                    //    if (rows[1][i].product_code == productcodegold()){
                    //        quantity=rows[1][i].quantity;
                    //        weight=rows[1][i].productvalue;
                    //        purity=rows[1][i].purity;
                    //        metalrate=rows[1][i].rate;
                    //    }
                    //    else if (rows[1][i].product_code == productcodemakingcharge()){
                    //        makingcharge=rows[1][i].productvalue;
                    //    }
                    //    else if (rows[1][i].product_code == productcodemakingexpense()){
                    //        makingexpense=rows[1][i].productvalue;
                    //    }
                    //    else if (rows[1][i].product_code == productcodevalueaddition()){
                    //        valueaddition=rows[1][i].productvalue;
                    //    }
                    //    else if (rows[1][i].product_code == productcodestonevalue()){
                    //        stonevalue=rows[1][i].productvalue;
                    //    }
                    //    else if (rows[1][i].product_code == productcodestoneweight()){
                    //        stoneweight=rows[1][i].productvalue;
                    //    }
                    //    else if (rows[1][i].product_code == productcodewastage()){
                    //        wastage=rows[1][i].productvalue;
                    //    }
                    //}
                    //calculatedweight=formulae.WholesaleCalculation(weight,stoneweight,purity,wastage,makingexpense,makingcharge,stonevalue,metalrate);
                    //calculatedamount=formulae.ConvertTo995ToCash(calculatedweight,purity,metalrate);
                    //
                    //grossvalue= +grossvalue + +weight;
                    //netweight= +netweight + +calculatedweight;
                    //netamount= +netamount + +calculatedamount;
                    //netquantity= +netquantity + +quantity;
                    //
                    //summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    //transactiontype +"','"+netweight+"','"+ netamount+"','"+grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";

                    var quantity=0, weight=0, purity=0, metalrate=0, valueaddition=0, makingexpense=0, makingcharge=0, stonevalue=0, stoneweight=0, wastage=0;
                    var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount= 0, grossvalue= 0, grossquantity=0;

                    for (var i = 0; i < rows[1].length; i++) {
                        if (rows[1][i].product_code == productcodegold()){
                            quantity=rows[1][i].quantity;
                            weight=rows[1][i].productvalue;
                            purity=rows[1][i].purity;
                            metalrate=rows[1][i].rate;
                        }
                        else if (rows[1][i].product_code == productcodemakingcharge()){
                            makingcharge=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodemakingexpense()){
                            makingexpense=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodevalueaddition()){
                            valueaddition=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodestonevalue()){
                            stonevalue=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodestoneweight()){
                            stoneweight=rows[1][i].productvalue;
                        }
                        else if (rows[1][i].product_code == productcodewastage()){
                            wastage=rows[1][i].productvalue;
                        }
                    }
                    //console.log(weight+','+stoneweight+','+purity+','+wastage+','+makingexpense+','+makingcharge+','+stonevalue+','+metalrate)
                    calculatedweight=formulae.WholesaleCalculation(weight,stoneweight,purity,wastage,valueaddition,makingcharge,stonevalue,metalrate);
                    calculatedamount=formulae.ConvertTo995ToCash(calculatedweight,purity,metalrate);
                    //console.log(req.body.customertype + ', ' + calculatedweight +' , ' +calculatedamount);
                    grossvalue= +grossvalue + +weight;
                    netweight= +netweight + +calculatedweight;
                    netamount= +netamount + +calculatedamount;
                    netquantity= +netquantity + +quantity;

                    summarysql="call savetransactionbill ('"+ req.body.company +"','"+ req.body.customer +"','"+req.body.transactionid +"','"+ req.body.transactiondate +"','"+
                    transactiontype +"','"+netweight+"','"+ netamount+"','"+grossvalue+"','"+ 0 +"','"+ netquantity+"','"+ req.body.user+"');";
                }

                //console.log((summarysql));
                db.getConnection(function (err, con) {
                    con.query(summarysql, function (err, summarysql) {
                        con.release();
                        if(!err){
                            //console.log(summarysql.affectedRows);
                            if(summarysql.affectedRows != 0 || summarysql.tid != undefined){
                                logger.log('data','updatetransactionbill Success !!',1,'updatetransactionbill');
                                callback('[{"result":"SUCCESS","usermessage":"summary updated","systemmessage":"summary updated"}]');
                                //return('[{"result":"SUCCESS","usermessage":"summary updated","systemmessage":"summary updated"}]');
                            }
                            else{
                                logger.log('warn','updatetransactionbill !!',1,'updatetransactionbill');
                                return('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                            }
                        }
                        else{
                            //console.log(err);
                            logger.log('error','Invalid Query !!',1,'updatetransactionbill');
                            return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                        }
                    });
                });
            }
            else{
                logger.log('error','Invalid Query !!',1,'updatetransactionbill');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.updatetransactionsummary = function (req,res) {
    var transactiontype=req.body.transactiontype;
    var outstandingtype=req.body.customeroutstandingtype;
    var parameters="'"+req.body.company+"','"+req.body.customer+"','"+req.body.transactiontype+"','"+req.body.todate+"'";
    var sql="call gettransactionsummary ("+parameters+");";
    //console.log((sql));
    var summarysql='';

    db.getConnection(function (err, con) {
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows.affectedRows != 0 ){
                    var jnetcashissued=0,jnetcashreceived=0,jnetissuequantity=0,jnetissueweight=0,jnetpurchasequantity=0,jnetpurchaseweight=0,jnetreceiptquantity=0,
                        jnetreceiptweight=0,jnetreturnquantity=0,jnetreturnweight=0,jnetsalequantity=0,jnetsaleweight=0,joutstandingcash=0,joutstandingweight=0,
                        sumtoadd=0, sumtosubtract=0;
                    var jnetpurchasecash=0,jnetcashreceivedweight=0;
                    var netoutstandingweight=0,netoutstandingcash=0;


                    // extract summary values
                    if (rows[0].length != 0){
                       jnetcashissued=rows[0][0].netcashissued;
                       jnetcashreceived=rows[0][0].netcashreceived;
                       jnetissuequantity=rows[0][0].netissuequantity;
                       jnetissueweight=rows[0][0].netissueweight;
                       jnetpurchasequantity=rows[0][0].netpurchasequantity;
                       jnetpurchaseweight=rows[0][0].netpurchaseweight;
                       jnetreceiptquantity=rows[0][0].netreceiptquantity;
                       jnetreceiptweight=rows[0][0].netreceiptweight;
                       jnetreturnquantity=rows[0][0].netreturnquantity;
                       jnetreturnweight=rows[0][0].netreturnweight;
                       jnetsalequantity=rows[0][0].netsalequantity;
                       jnetsaleweight=rows[0][0].netsaleweight;
                       joutstandingcash=rows[0][0].creditcash;
                       joutstandingweight=rows[0][0].creditweight;
                    }

                    // process transaction details
                    // summary for sales transactions
                    if (transactiontype==transactiontypesales()){
                        for (var i = 0; i < rows[1].length; i++) {
                            //console.log(rows[1][i]);
                        }
                    }

                    // summary for purchase transactions
                    else if(transactiontype==transactiontypepurchase()){
                        var quantity, weight, purity, metalrate;
                        var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount=0;

                        for (var i = 0; i < rows[1].length; i++){
                            quantity=0;weight=0;purity=0;metalrate=0;calculatedweight=0;calculatedamount=0;
                            quantity=rows[1][i].quantity;
                            weight=rows[1][i].productvalue;
                            purity=rows[1][i].purity;
                            metalrate=rows[1][i].rate;
                            calculatedweight=formulae.ConvertTo995(weight,purity);
                            calculatedamount=formulae.ConvertTo995ToCash(weight,purity,metalrate);
                            netweight= +netweight + +calculatedweight;
                            netamount= +netamount + +calculatedamount;
                            netquantity= +netquantity + +quantity;
                        }
                        jnetpurchaseweight = netweight;
                        jnetpurchasequantity = netquantity;
                        jnetpurchasecash=netamount;
                        summarysql="update transactionsummary set netcashissued ='"+ jnetcashissued +"', netcashreceived ='"+ jnetcashreceived+"', " +
                        " netissuequantity='"+ jnetissuequantity+"', netissueweight='"+ jnetissueweight+"', netpurchasequantity='"+ jnetpurchasequantity+"', " +
                        " netpurchaseweight='"+ jnetpurchasecash+"', netreceiptquantity='"+ jnetreceiptquantity+"', netreceiptweight='"+ jnetreceiptweight+"', " +
                        " netreturnquantity='"+ jnetreturnquantity+"', netreturnweight='"+ jnetreturnweight+"', netsalequantity='"+ jnetsalequantity+"', " +
                        " netsaleweight='"+ jnetsaleweight+"', outstandingcash='"+ netoutstandingcash+"', outstandingweight='"+ netoutstandingweight+"' " +
                        " where `companyid`='"+req.body.company +"' and `customerid`='"+req.body.customer +"' and `transactiondate` ='"+req.body.todate+"';";
                    }

                    // summary for cash transactions
                    else if(transactiontype==transactiontypecashreceipt()){
                        for (var i = 0; i < rows[1].length; i++) {
                            var quantity, amount, purity, metalrate;
                            var calculatedweight=0, calculatedamount=0, netquantity=0, netweight=0, netamount=0;

                            for (var i = 0; i < rows[1].length; i++) {
                                quantity=0;amount=0;purity=1;metalrate=0;calculatedweight=0;calculatedamount=0;
                                quantity=rows[1][i].quantity;
                                amount=rows[1][i].productvalue;
                                metalrate=rows[1][i].rate;
                                calculatedweight=formulae.ConvertCashTo995(amount,metalrate);
                                netweight= +netweight + +calculatedweight;
                                netamount= +netamount + +amount;
                                netquantity= +netquantity + +quantity;
                            }
                            jnetcashreceivedweight= netweight;
                            jnetcashreceived=netamount;
                        }
                    }

                    // summary for gold smith issue transactions
                    else if(transactiontype==transactiontypeissue()){
                        for (var i = 0; i < rows[1].length; i++) {
                            //console.log(rows[1][i]);
                        }
                    }

                    // summary for gold smith receipt transactions
                    else if(transactiontype==transactiontypereturn()){
                        for (var i = 0; i < rows[1].length; i++) {
                            //console.log(rows[1][i]);
                        }
                    }

                    // summary for sales return transactions
                    else if(transactiontype==transactiontypesalesreturn()){
                        for (var i = 0; i < rows[1].length; i++) {
                            //console.log(rows[1][i]);
                        }
                    }

                    // calculate outstanding
                    if (outstandingtype==outstandingtypeweightbalance()){
                        sumtoadd = +joutstandingweight;
                        sumtosubtract = +jnetpurchaseweight + +jnetcashreceivedweight;
                        netoutstandingweight= +sumtoadd - +sumtosubtract;

                        summarysql="update transactionsummary set netcashissued ='"+ jnetcashissued +"', netcashreceived ='"+ jnetcashreceivedweight+"', " +
                        " netissuequantity='"+ jnetissuequantity+"', netissueweight='"+ jnetissueweight+"', netpurchasequantity='"+ jnetpurchasequantity+"', " +
                        " netpurchaseweight='"+ jnetpurchaseweight+"', netreceiptquantity='"+ jnetreceiptquantity+"', netreceiptweight='"+ jnetreceiptweight+"', " +
                        " netreturnquantity='"+ jnetreturnquantity+"', netreturnweight='"+ jnetreturnweight+"', netsalequantity='"+ jnetsalequantity+"', " +
                        " netsaleweight='"+ jnetsaleweight+"', outstandingcash='"+ netoutstandingcash+"', outstandingweight='"+ netoutstandingweight+"' " +
                        " where companyid ='"+req.body.company +"' and customerid ='"+req.body.customer +"' and transactiondate ='"+req.body.todate+"';";
                    }
                    else if (outstandingtype==outstandingtypecashbalance()){
                        sumtoadd = +joutstandingcash;
                        sumtosubtract = +jnetpurchasecash + +jnetcashreceived;
                        netoutstandingcash= +sumtoadd - +sumtosubtract;

                        summarysql="update transactionsummary set netcashissued ='"+ jnetcashissued +"', netcashreceived ='"+ jnetcashreceived+"', " +
                        " netissuequantity='"+ jnetissuequantity+"', netissueweight='"+ jnetissueweight+"', netpurchasequantity='"+ jnetpurchasequantity+"', " +
                        " netpurchaseweight='"+ jnetpurchasecash+"', netreceiptquantity='"+ jnetreceiptquantity+"', netreceiptweight='"+ jnetreceiptweight+"', " +
                        " netreturnquantity='"+ jnetreturnquantity+"', netreturnweight='"+ jnetreturnweight+"', netsalequantity='"+ jnetsalequantity+"', " +
                        " netsaleweight='"+ jnetsaleweight+"', outstandingcash='"+ netoutstandingcash+"', outstandingweight='"+ netoutstandingweight+"' " +
                        " where `companyid`='"+req.body.company +"' and `customerid`='"+req.body.customer +"' and `transactiondate` ='"+req.body.todate+"';";
                    }

                    //console.log(netoutstandingcash + '  ' +netoutstandingweight );
                    //console.log(summarysql);
                    db.getConnection(function (err, con) {
                        //console.log(summarysql);
                        con.query(summarysql, function (err, summarysql) {
                            con.release();
                            if(!err){
                                if(summarysql.affectedRows != 0 ){
                                    logger.log('data','update summary Success !!',1,'update summary');
                                    return('[{"result":"SUCCESS","usermessage":"summary updated","systemmessage":"summary updated"}]');
                                }
                                else{
                                    logger.log('warn','update summary !!',1,'update summary');
                                    return('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                                }
                            }
                            else{
                                //console.log(err);
                                logger.log('error','Invalid Query !!',1,'update summary');
                                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                            }
                        });
                    });
                }
            }
        });
    });
};

exports.updateopeningstock = function (req,res) {
    var parameters="'"+req.body.company+"','"+req.body.store+"','"+req.body.package+"','"+req.body.opstockquantity+"','"+req.body.opstockweight+"','"
                        +req.body.user+"','"+req.body.comments+"'";
    var sql="call updateopeningstock ("+parameters+");";
    //console.log((sql));
    db.getConnection(function (err, con) {
        con.query(sql, function (err, rows) {
            con.release();
            if(!err) {
                if (rows.affectedRows != 0) {
                    logger.log('data', 'update stock Success !!', 1, 'updateopeningstock');
                    res.end('[{"result":"SUCCESS","usermessage":"stock updated","systemmessage":"stock updated"}]');
                }
                else {
                    logger.log('warn', 'update stock !!', 1, 'updateopeningstock');
                    return ('[{"result":"NODATA","usermessage":"no stock update","systemmessage":"no data available"}]');
                }
            }
            else{
                //console.log(err);
                logger.log('error','Invalid Query !!',1,'updateopeningstock');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.movestock = function (req,res) {
    var parameters="'"+req.body.company+"','"+req.body.transactiondate+"','"+req.body.package+"','"+
                        req.body.storegodown+"','"+req.body.newgodownstockquantity+"','"+req.body.newgodownstockweight+"','"+
                        req.body.storedisplay+"','"+req.body.newdiplaystockquantity+"','"+req.body.newdiplaystockweight+"','"+
                        req.body.comments+"','"+req.body.user+"','"+req.body.movementtype+"','"+req.body.movementquantity+"','"+req.body.movementweight+"'";
    var sql="call movestock ("+parameters+");";

    //var parameters="'"+req.body.company+"','"+req.body.transactiondate+"','"+req.body.package+"','"+
    //    req.body.storedisplay+"','"+req.body.storegodown+"','"+req.body.movementtype+"','"+req.body.movementquantity+"','"+
    //    req.body.movementweight+"','"+req.body.comments+"','"+req.body.user+"'";
    //var sql="call movestock ("+parameters+");";

    //console.log('move stock query ' + sql);
    db.getConnection(function (err, con) {
        con.query(sql, function (err, rows) {
            con.release();
            if(!err) {
                if (rows.affectedRows != 0) {
                    logger.log('data', 'stock movement Success !!', 1, 'movestock');
                    res.end('[{"result":"SUCCESS","usermessage":"stock updated","systemmessage":"stock updated"}]');
                }
                else {
                    logger.log('warn', 'move stock !!', 1, 'movestock');
                    return ('[{"result":"NODATA","usermessage":"no stock update","systemmessage":"no data available"}]');
                }
            }
            else{
                //console.log(err);
                logger.log('error','Invalid Query !!',1,'movestock');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.updatestock = function (req,res) {
    var stockquantity=req.body.quantity;
    var stockweight=req.body.weight;
    var transactiontype=req.body.transactiontype;
    var parameters="'"+req.body.company+"','"+req.body.store+"','"+req.body.transactiondate+"','"+req.body.package+"','"+stockquantity+"','"+stockweight+"','"
                        +req.body.transactiontype+"','"+req.body.user+"','"+req.body.comments+"','"+req.body.user+"'";
    var sql="call savestock ("+parameters+");";

    //console.log(sql);
    if (transactiontype==transactiontypesales() || transactiontype==transactiontypeissue()){
        stockquantity = -Math.abs(stockquantity);
        stockweight = -Math.abs(stockweight);
    }
    else if (transactiontype==transactiontypepurchase() || transactiontype==transactiontypereturn() || transactiontype==transactiontypesalesreturn()){
        stockquantity = Math.abs(stockquantity);
        stockweight = Math.abs(stockweight);
    }

    db.getConnection(function (err, con) {
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if (rows.affectedRows != 0) {
                    logger.log('data', 'update stock Success !!', 1, 'update stock');
                    return ('[{"result":"SUCCESS","usermessage":"summary updated","systemmessage":"stock updated"}]');
                }
                else {
                    logger.log('warn', 'update stock !!', 1, 'update stock');
                    return ('[{"result":"NODATA","usermessage":"no stock update","systemmessage":"no data available"}]');
                }
            }
            else{
                //console.log(err);
                logger.log('error','Invalid Query !!',1,'update stock');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.updatestockwithcallback = function (req,res,callback) {
    var stockquantity=req.body.quantity;
    var stockweight=req.body.weight;
    var transactiontype=req.body.transactiontype;
    var parameters="'"+req.body.company+"','"+req.body.store+"','"+req.body.transactiondate+"','"+req.body.package+"','"+stockquantity+"','"+stockweight+"','"
        +req.body.transactiontype+"','"+req.body.user+"','"+req.body.comments+"','"+req.body.user+"'";
    //console.log(parameters);

    if (transactiontype==transactiontypesales() || transactiontype==transactiontypeissue()){
        stockquantity = -Math.abs(stockquantity);
        stockweight = -Math.abs(stockweight);
    }
    else if (transactiontype==transactiontypepurchase() || transactiontype==transactiontypereturn() || transactiontype==transactiontypesalesreturn()){
        stockquantity = Math.abs(stockquantity);
        stockweight = Math.abs(stockweight);
    }

    var sql="call savestock ("+parameters+");";

    //console.log(sql);
    db.getConnection(function (err, con) {
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if (rows.affectedRows != 0) {
                    logger.log('data', 'update stock Success !!', 1, 'update stock');
                    callback('[{"result":"SUCCESS","usermessage":"summary updated","systemmessage":"stock updated"}]')
                }
                else {
                    logger.log('warn', 'update stock !!', 1, 'update stock');
                    return ('[{"result":"NODATA","usermessage":"no stock update","systemmessage":"no data available"}]');
                }
            }
            else{
                //console.log(err);
                logger.log('error','Invalid Query !!',1,'update stock with call back');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.savetransaction = function (req, res) {
    var company=req.body.company;
    var user= req.body.user;
    var customer= req.body.customer;
    var transactionid= req.body.transactionid;
    var transactiontype= req.body.transactiontype;
    var packageid= req.body.package;
    var comments=req.body.comments;
    var todate = req.body.transactiondate;
    var quantity= req.body.quantity;
    var weight= req.body.weight;
    var purity=req.body.purity;
    var metalrate=req.body.price;
    var duedate=req.body.duedate;
    var transactiondetails=req.body.transactiondetail;
    var cashreceived = req.body.cashreceived;
    var outstandingtype= req.body.outstandingtype;
    var updatesummary=req.body.updatesummary;
    var calculatedvalue= 0;

    var parameters="'"+company+"','"+transactionid+"','"+user+"','"+customer+"','"+transactiontype+"','"+todate+"','"+duedate+"','"+packageid+"','"+calculatedvalue+"','"+comments+"','"+transactiondetails+"'";

    //db.connect(function(err) {
    //    if (err) {
    //        logger.log('error', 'error connecting database connection open ' + err.stack, 1, 'services.js/savetransaction ');
    //        //console.error('error connecting: ' + err.stack);
    //        res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"server down please contact support"}]');
    //        return;
    //    }
    //    logger.log('info', 'connected as id ' + db.threadId, 1, 'services.js/savetransaction ');
    //    //console.log('connected as id ' + db.threadId);
    //});

    var sql="call savetransaction ("+parameters+");";
    //console.log(sql);

    /* Begin transaction */
    //db.beginTransaction(function(err) {
    //    if (err) { throw err; }
    //
    //    db.getConnection(function (err, con) {
    //        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/savetransaction ');
    //        con.query(sql, function (err, rows){
    //            if (err) {
    //                db.rollback(function () {
    //                    throw err;
    //                });
    //            }
    //
    //            con.release();
    //            var results;
    //            if(!err){
    //                if(rows.affectedRows != 0 ){
    //                    results=JSON.stringify(rows[0]);
    //                    results=JSON.parse(results);
    //                    req.body.transactionid = results[0].jtransactionid;
    //                    req.body.transactiondate=todate;
    //                    if (updatesummary==1){
    //                        async.series([
    //                            function(callback){
    //                                module.exports.updatetransactionbill(req,res, function(response){
    //                                    callback();
    //                                });
    //                            },
    //                            function(callback){
    //                                module.exports.updatestock(req,res);
    //                            },
    //                        ]);
    //
    //                        res.end('[{"result":"SUCCESS","usermessage":"transaction saved","systemmessage":"item saved"}]');
    //                    }
    //                    else{
    //                        res.end('[{"result":"SUCCESS","usermessage":"transaction saved","systemmessage":"item saved"}]');
    //                    }
    //                }
    //                else{
    //                    logger.log('warn','savetransaction !!',req.session.sessionID,'savestock');
    //                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
    //                }
    //            }
    //            else{
    //                logger.log('error','Invalid Query !!',req.session.sessionID,'savetransaction');
    //                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
    //            }
    //        });
    //    });
    //});
    /* End transaction */

    db.getConnection(function (err, con) {
        if (err) {
            //db.rollback(function() {throw err;});
            res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"server down please contact support"}]');
        }
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/savetransaction ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0 ){
                    results=JSON.stringify(rows[0]);
                    results=JSON.parse(results);
                    req.body.transactionid = results[0].jtransactionid;
                    req.body.transactiondate=todate;
                    if (updatesummary==1){
                        async.series([
                            function(callback){
                                //console.log('tran bill updated')
                                module.exports.updatetransactionbill(req,res, function(response){
                                    callback();
                                });
                            },
                            function(callback){
                                module.exports.updatestock(req,res);
                            },
                        ]);
                        res.end('[{"result":"SUCCESS","usermessage":"transaction saved","systemmessage":"item saved"}]');
                    }
                    else{
                        res.end('[{"result":"SUCCESS","usermessage":"transaction saved","systemmessage":"item saved"}]');
                    }
                }
                else{
                    logger.log('warn','savetransaction !!',req.session.sessionID,'savestock');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'savetransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.removetransaction=function(req,res){
    db.getConnection(function(err, con){
        var updatesummary=req.body.updatesummary;
        var sql="call removetransaction ('"+req.body.company +"','"+ req.body.customer +"','"+ req.body.transactionid +"','"+ req.body.user +"');";

        logger.log('info',sql,1,'/removetransaction');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows.affectedRows != 0 ){
                    if (updatesummary==1){
                        //module.exports.updatetransactionbill(req,res);
                        //module.exports.updatestock(req,res);
                        //res.end('[{"result":"SUCCESS","usermessage":"transaction removed","systemmessage":"item removed"}]');
                        async.series([
                            function(callback){
                                module.exports.updatetransactionbill(req,res, function(response){
                                    callback();
                                });
                            },
                            function(callback){
                                module.exports.updatestock(req,res);
                            },
                        ]);

                        res.end('[{"result":"SUCCESS","usermessage":"transaction saved","systemmessage":"item saved"}]');
                    }
                }
                else{
                    logger.log('warn','removetransaction !!',req.session.sessionID,'removetransaction');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'removetransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.removetransactionwithcallback=function(req,res,callback){
    db.getConnection(function(err, con){
        var updatesummary=req.body.updatesummary;
        var sql="call removetransaction ('"+req.body.company +"','"+ req.body.customer +"','"+ req.body.transactionid +"','"+ req.body.user +"');";

        logger.log('info',sql,1,'/removetransaction');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows.affectedRows != 0 ){
                    if (updatesummary==1){
                        async.series([
                            function(callback){
                                module.exports.updatetransactionbill(req,res, function(response){
                                    callback();
                                });
                            },
                            function(callback){
                                module.exports.updatestock(req,res);
                            },
                        ]);
                        callback('[{"result":"SUCCESS","usermessage":"transaction removed","systemmessage":"transaction removed"}]');
                    }
                }
                else{
                    logger.log('warn','removetransaction !!',req.session.sessionID,'removetransaction');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'removetransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.savebilledit = function (req, res) {
    var company=req.body.company;
    var user= req.body.user;
    var customer= req.body.customer;
    var transactionid= req.body.transactionid;
    var transactiontype= req.body.transactiontype;
    var receiptno= req.body.receiptno;
    var packageid= req.body.package;
    var comments=req.body.comments;
    var todate = req.body.transactiondate;
    var quantity= req.body.quantity;
    var weight= req.body.weight;
    var purity=req.body.purity;
    var metalrate=req.body.metalrate;
    var duedate=req.body.duedate;
    var updatesummary=req.body.updatesummary;
    var calculatedvalue= 0;
    var newpackageid= req.body.newpackage;
    var newcategoryid= req.body.newcategory;
    var transactiondetails= JSON.parse(req.body.transactiondetail);

    var rowitem;
    var sql;

    var packagechanged = false;
    var stockquantity=0,stockweight=0;

    if (newpackageid != 0 && newpackageid != packageid) {
        packagechanged = true;
    }

    async.series([
        // copy old transaction
        function(callback){
            db.getConnection(function (err, con) {
                sql = "call copytransaction ('"+ company +"','"+ customer +"','"+ transactionid +"');";
                //console.log(sql);
                con.query(sql, function (err, rows) {
                    con.release();
                    callback();
                });
            });
        },

        // update stock if package changed
        function(callback){
            if (packagechanged){
                //console.log('inside package change stock update');
                for (var row in transactiondetails) {
                    rowitem = transactiondetails[row];
                    if (rowitem.product_code == 'PW995' || rowitem.product_code == 'PW101'){
                        stockquantity=rowitem.quantity;
                        stockweight=rowitem.productvalue;
                    }
                }
                if (transactiontype==transactiontypesales() || transactiontype==transactiontypeissue()){
                    stockquantity = Math.abs(stockquantity);
                    stockweight = Math.abs(stockweight);
                }
                else if (transactiontype==transactiontypepurchase() || transactiontype==transactiontypereturn() || transactiontype==transactiontypesalesreturn()){
                    stockquantity = -Math.abs(stockquantity);
                    stockweight = -Math.abs(stockweight);
                }
                callback();

                //req.body.quantity=stockquantity;
                //req.body.weight=stockweight;
                //req.body.package = packageid;
                //module.exports.updatestockwithcallback(req,res, function(response){
                //    //console.log('stock updated for package change');
                //    callback();
                //});
            }
            else{
                callback();
            }
        },

        // remove old transaction
        function(callback){
            //console.log('inside transaction remove with callback');
            module.exports.removetransactionwithcallback(req,res, function(response){
                //console.log('transaction removed with callback');
                    if (packagechanged){
                        req.body.quantity=stockquantity;
                        req.body.weight=stockweight;
                        req.body.package = packageid;

                        module.exports.updatestockwithcallback(req,res, function(response){
                            //console.log('stock updated for package change');
                            callback();
                        });
                    }
                    else{
                        callback();
                    }
            });
        },

        // manage bill changes
        function(callback){
            db.getConnection(function (err, con) {
                //var labelWithTime = "label " + new Date().getTime();
                //console.log('0 ' +labelWithTime);
                if (err) {
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"server down please contact support"}]');
                }

                //console.log('1 ' + labelWithTime);
                // if package changed then update transaction details with new package
                if (packagechanged){
                    req.body.package = newpackageid;
                    sql = "update transactiondetails set packageid='" + newpackageid + "', category='"+ newcategoryid +"' where companyid='"+company+"' and transactionid ='"+transactionid+"';";
                    //console.log(sql);
                    con.query(sql, function (err, rows) {});
                }
                //console.log('2 ' + labelWithTime);
                for (var row in transactiondetails){
                    rowitem = transactiondetails[row];
                    // assign metal quantity and weight
                    //console.log('product code ' + rowitem.product_code);
                    if (rowitem.product_code == 'PW995' || rowitem.product_code == 'PW101' || rowitem.product_code == 'PW102' || rowitem.product_code == 'PW103' || rowitem.product_code == 'PW104' || rowitem.product_code == 'PW106' || rowitem.product_code == 'PC102' || rowitem.product_code == 'PW100' ){
                        //console.log('inside qty and weight assignment');
                        req.body.quantity=rowitem.newquantity;
                        req.body.weight=rowitem.newvalue;
                        if (packagechanged) {
                            sql = "update transactiondetails set quantity='"+rowitem.newquantity +"', productvalue ='"+rowitem.newvalue+"' where companyid='"+company+"' and transactionid ='"+transactionid+"' and packageid='"+newpackageid+"' and productid='"+ rowitem.productid +"';";
                        }
                        else{
                            sql = "update transactiondetails set quantity='"+rowitem.newquantity +"', productvalue ='"+rowitem.newvalue+"' where companyid='"+company+"' and transactionid ='"+transactionid+"' and packageid='"+rowitem.packageid+"' and productid='"+ rowitem.productid +"';";
                        }
                        //console.log(sql);
                        con.query(sql, function (err, rows) {});
                        //console.log('3 ' + labelWithTime);
                        con.release();
                    }
                }

                // change transaction status from cancelled to active
                sql = "update transaction set status=1 where companyid='"+company+"' and transactionid ='"+transactionid+"';";
                //console.log(sql);
                con.query(sql, function (err, rows) {
                    callback();
                });

                //console.log('4 ' + labelWithTime);
                //setTimeout(callback(), 2000);

            });
        },

        // update transaction bill for editted bill
        function(callback){
            //console.log('update transaaction bill call after transaction update');
            //var labelWithTime = "label " + new Date().getTime();
            //console.log('5 ' + labelWithTime);
            module.exports.updatetransactionbill(req,res, function(response){
                //console.log('transaaction bill updated');
                callback();
            });
            //console.log('6 ' + labelWithTime);
        },

        // update stock
        function(callback){
            if (packagechanged){
                req.body.package =newpackageid;
            }
            module.exports.updatestockwithcallback(req,res, function(response){
                //console.log('stock updated');
                callback();
            });
        },
    ]);
    res.end('[{"result":"SUCCESS","usermessage":"billedit saved","systemmessage":"bill edit success"}]');
};

exports.generatebill = function (req, res) {
    var parameters="'"+req.body.company+"','"+req.body.customer+"','"+req.body.customertype+"','"+req.body.customeroutstandingtype+"','"
        +req.body.actiontype+"','"+req.body.billdates+"','"+req.body.transactionidlist+"'";
    var sql="call generatebill ("+parameters+");";
    //console.log(sql);
    db.getConnection(function (err, con) {
        con.query(sql, function (err, rows) {
            con.release();
            if(!err) {
                if (rows.affectedRows != 0) {
                    logger.log('data', 'update stock Success !!', 1, 'update stock');
                    res.end(JSON.stringify(rows));
                }
                else {
                    logger.log('warn', 'update stock !!', 1, 'update stock');
                    return ('[{"result":"NODATA","usermessage":"no stock update","systemmessage":"no data available"}]');
                }
            }
            else{
                //console.log(err);
                logger.log('error','Invalid Query !!',1,'update stock');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.billtransaction = function(req, res){
    db.getConnection(function(err, con){
        var sql="call generatebill ('"+company +"','"+ req.body.customer +"','"+ req.body.transactionid +"','"+ req.body.user +"');";

        logger.log('info',sql,1,'/billtransaction');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows.affectedRows != 0 ){
                    if (updatesummary==1){
                        module.exports.updatetransactionbill(req,res);
                    }
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"item saved"}]');
                }
                else{
                    logger.log('warn','removetransaction !!',req.session.sessionID,'removetransaction');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'removetransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.savestock = function (req, res) {
    var sql="call savestock ('"+ req.body.company +"','"+ req.body.store +"',now(),'"+ req.body.jpackageid+"','"+req.body.jopbalanceqty+"','"+req.body.jopbalanceweight+"','"+req.body.jsalesqty+"','"+req.body.jsalesweight+"','"+req.body.jsalesreturnqty+"','"+       req.body.jsalesreturnweight+"','"+req.body.jpurchaseqty+"','"+req.body.jpurchaseweight+"','"+req.body.jissueqty+"','"+req.body.jissueweight+"','"+        req.body.jgsreturnqty+"','"+req.body.jgsreturnweight+"','"+req.body.jcashissue+"','"+req.body.jcashreceipt+"','"+req.body.jcreatedby+"','"+req.body.jcomments+"')";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/savestock ');
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows.affectedRows != 0 ){
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"item saved"}]');
                }
                else{
                    logger.log('warn','savestock !!',req.session.sessionID,'savestock');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'savestock');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.opendaystock = function (req, res) {
    var sql="call opendaystock ('"+ req.body.usercompany +"','"+ req.body.currentdate +"')";
    //console.log((sql));
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/opendaystock ');
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','opendaystock Success !!',1,'liststock');
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','opendaystock !!',1,'liststock');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'opendaystock');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.addcategory = function (req, res) {
    var sql= "call addcategory('"+ req.body.company+"','"+ req.body.categoryname+"','"+ req.body.package+"')";

    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/addcategory ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0 ){
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"new category saved"}]');
                }
                else{
                    logger.log('warn','addcategory !!',req.session.sessionID,'addcategory');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'removetransaction');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listvalueaddition = function (req, res) {
    var sql="SELECT * FROM va where companyid='"+req.body.company+"';";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/listvalueaddition ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0 ){
                    results = JSON.stringify(rows);
                    //console.log('va ' +results);
                    res.end(results);
                }
                else{
                    logger.log('warn','listvalueaddition !!',1,'listvalueaddition');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'listvalueaddition');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.addvalueaddition = function (req, res) {
    var sql="call saveva ('"+req.body.company +"','"+ req.body.vacustomertype +"','"+ req.body.vamax +"','"+ req.body.vamin+"','"+ req.body.package+"','"+req.body.vapercentage+"');";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/addvalueaddition ');
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows.affectedRows != 0){
                    logger.log('warn','addvalueaddition !!',1,'addvalueaddition');
                    res.end('[{"result":"SUCCESS","usermessage":"va added","systemmessage":"va saved"}]');
                }
                else{
                    logger.log('warn','addvalueaddition !!',1,'addvalueaddition');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'addvalueaddition');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.removevalueaddition=function(req,res){
    db.getConnection(function(err, con){
        var sql="DELETE FROM va where companyid='"+req.body.company+"' and vaid='"+req.body.va+"';";
        logger.log('info',sql,1,'/removevalueaddition');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows.affectedRows != 0){
                    logger.log('data','removevalueaddition Success !!',1,'removevalueaddition');
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"va removed"}]');
                }
                else{
                    logger.log('warn','removevalueaddition !!',1,'removevalueaddition');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }else{
                logger.log('error','Invalid Query !!',1,'removevalueaddition');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.addproduct=function(req,res){
    var company=req.body.company;
    var user= req.body.user;
    var customer= req.body.customer;
    var transactionno= req.body.transactionno;
    var packageid= req.body.package;
    var product=req.body.product;
    var category=req.body.category;
    var store=req.body.store;
    var transactiontype= req.body.transactiontype;
    var quantity= req.body.quantity;
    var metalrate= req.body.metalrate;
    var weight= req.body.weight;
    var purity= req.body.purity;

    var parameters="'"+company+"','"+user+"','"+customer+"','"+transactionno+"','"+packageid+"','"+product+
        "','"+category+"','"+store+"','"+transactiontype+"','"+quantity+"','"+metalrate+"','"+weight+"','"+purity+"'";

    db.getConnection(function(err, con){
        var sql="call addproduct ("+parameters+");";
        logger.log('info',sql,1,'/addproduct');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','addproduct Success !!',req.session.sessionID,'addproduct');
                    res.end(JSON.stringify(rows));
                }else{
                    logger.log('warn','addproduct !!',req.session.sessionID,'addproduct');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'addproduct');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listpackage = function (req, res) {
    var company=req.body.usercompany;

        var sql="Select productcatalog.packages_id,packages.packages_code,packagedescription.package_name,packagedescription.package_title,"+
        "packagedescription.package_image_url,productcatalog.products_id,products.product_code,productdescription.products_name,"+        "productdescription.products_title,productdescription.product_image_url,productcatalog.products_price,"+
        "productcatalog.products_value,productcatalog.products_purity,productcatalog.opbalancequantity,productcatalog.opbalanceweight "+
        "From productcatalog Inner Join  packages   On productcatalog.packages_id = packages.packages_id Inner Join "+ "packagedescription  On packages.packages_id = packagedescription.packages_id Inner Join   products "+
        "On productcatalog.products_id = products.products_id Inner Join   productdescription "+ "On products.products_id = productdescription.products_id "+
        "Where productcatalog.companyid ="+ company +" And productcatalog.status = 1 And  packagedescription.language_id = 1 And  productdescription.language_id = 1 "+
        "Group by productcatalog.packages_id,packages.packages_code,packagedescription.package_name,packagedescription.package_title,"+
        "packagedescription.package_image_url,productcatalog.products_id,products.product_code,productdescription.products_name,"+
        "productdescription.products_title,productdescription.product_image_url,productcatalog.products_price,"+
        "productcatalog.products_value,productcatalog.products_purity,productcatalog.opbalancequantity,productcatalog.opbalanceweight";

    //console.log('list package  : ' + sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/listpackage ');
        con.query(sql, function (err, rows) {
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listpackage Success !!',req.session.sessionID,'listpackage');
                    //console.log('listpackage result : ' +JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','listpackage !!',req.session.sessionID,'listpackage');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listpackage');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.loadcategory = function (req, res) {
    var sql= "SELECT * FROM `jerawnew`.`category`;";
//    console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/loadcategory ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if (err) {
                res.end('[]');
                logger.log('error', err, req.session.sessionID, 'services.js/loadcategory ');
                return;
            }
            if (rows.length == 0) {
                res.end('[]');
                logger.log('info', 'No match found for query', req.session.sessionID, 'services.js/loadcategory ');
            }
            else {
                results = JSON.stringify(rows);
                res.end(results);
                logger.log('data', results, req.session.sessionID, 'services.js/loadcategory ');
            }
        });
    });
};

exports.deletecategory = function (req, res) {
    var sql="DELETE FROM `jerawnew`.`category` WHERE categoryid='"+ req.body.category+"'";

    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/deletecategory ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0){
                    logger.log('data','deletecategory Success !!',1,'deletecategory');
                    res.end('[{"result":"SUCCESS","usermessage":"category removed","systemmessage":"category removed"}]');
                }
                else{
                    logger.log('warn','deletecategory !!',1,'deletecategory');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }else{
                logger.log('error','Invalid Query !!',1,'deletecategory');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.saveaddress = function (req, res) {
    var sql="call saveaddress('"+ req.body.company+"','"+ req.body.customer+"','"+ req.body.addressline+"','"+ req.body.district+"','"+ req.body.state+"','"+ req.body.contact+"','" + req.body.customertype+"');";

    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'services.js/addcategory ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0 ){
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"new category saved"}]');
                }
                else{
                    logger.log('warn','saveaddress !!',req.session.sessionID,'saveaddress');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'saveaddress');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listaddress = function (req, res) {
    var sql="Select  customer.firstname  as cname,  customer.orgname,  address.house,  address.street,  address.postoffice,  address.district,  address.state, " +
    "address.country,  address.pin,  address.contact,  customertype.typename,  customer.contact As contact1,  customer.contactno,  customer.email, customer.customerid " +
    "From  customer Inner Join  address    On customer.companyid = address.companyid And customer.addressid = " +
    "    address.addressid Inner Join  customertype    On customertype.customertype = customer.customertype " +
    "Where  customer.status = 1 And customer.customertype in (1,2,7) And  customer.companyid ='"+ req.body.company+"';";
//console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/listaddress ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listaddress Success !!',1,'listaddress');
                    //console.log('listaddress result : ' +JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','listaddress !!',1,'listaddress');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listaddress');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.listorder = function (req, res) {
    var sql="Select transaction.companyid,  customer.customerid, transaction.transactionid, transaction.transactiondate, transaction.duedate, " +
        "customer.firstname,customer.orgname,  customer.contactno,  address.house,  address.street, " +
        "address.postoffice,  address.district,  address.state,  address.country, " +
        "address.contact,  customer.contact As contact1,  packagedescription.package_title, " +
        "transactiondetails.quantity,  transactiondetails.productvalue,  transactiondetails.description, " +
        "transaction.transactiontype,  transaction.status,  transactionstatus.statusname, customer1.orgname As assignedto    " +
        "From    transaction Inner Join  customer    On customer.companyid = transaction.companyid And customer.customerid =  " +
        "transaction.customerid Inner Join  address    On address.companyid = customer.companyid And customer.addressid = " +
        "address.addressid Inner Join  transactiondetails    On transaction.companyid = transactiondetails.companyid And " +
        "transaction.transactionid = transactiondetails.transactionid Inner Join  packagedescription " +
        "On transactiondetails.packageid = packagedescription.packages_id Inner Join  transactionstatus " +
        "On transaction.status = transactionstatus.statusid Inner Join  customer customer1  On transactiondetails.companyid = customer1.companyid And  transactiondetails.createduser = customer1.customerid " +
        "Where transaction.transactiontype = 9 And  transaction.status <> 4 And  transactiondetails.productvalue >0 And transactiondetails.productid = 1 And transaction.companyid ='"+ req.body.company+"';";

//console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/listorder ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','listorder Success !!',1,'listorder');
                    //console.log('listorder result : ' +JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','listorder !!',1,'listorder');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'listaddress');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.vieworder = function (req, res) {
    var sql="Select transaction.companyid,  customer.customerid, transaction.transactionid, transaction.transactiondate, transaction.duedate, " +
        "customer.firstname,customer.orgname,  customer.contactno,  address.house,  address.street, " +
        "address.postoffice,  address.district,  address.state,  address.country, " +
        "address.contact,  customer.contact As contact1,  packagedescription.package_title, " +
        "transactiondetails.quantity,  transactiondetails.productvalue,  transactiondetails.description, " +
        "transaction.transactiontype,  transaction.status,  transactionstatus.statusname, customer1.orgname As assignedto    " +
        "From    transaction Inner Join  customer    On customer.companyid = transaction.companyid And customer.customerid =  " +
        "transaction.customerid Inner Join  address    On address.companyid = customer.companyid And customer.addressid = " +
        "address.addressid Inner Join  transactiondetails    On transaction.companyid = transactiondetails.companyid And " +
        "transaction.transactionid = transactiondetails.transactionid Inner Join  packagedescription " +
        "On transactiondetails.packageid = packagedescription.packages_id Inner Join  transactionstatus " +
        "On transaction.status = transactionstatus.statusid Inner Join  customer customer1  On transactiondetails.companyid = customer1.companyid And  transactiondetails.createduser = customer1.customerid " +
        "Where transaction.transactiontype = 9 And  transactiondetails.productvalue >0 And transactiondetails.productid = 1 And transaction.companyid ='"+ req.body.company+ "' And transaction.customerid ='"+  req.body.customer + "' And transaction.transactionid='" + req.body.receiptno + "';";

    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/vieworder ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','vieworder Success !!',1,'vieworder');
                    //console.log('listorder result : ' +JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','vieworder !!',1,'vieworder');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'vieworder');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.updateorderstatus = function (req, res) {
    var sql="UPDATE  transaction set transaction.status ='" + req.body.status+ "' Where transaction.transactionid  ='" + req.body.order+ "' And  transaction.companyid ='"+ req.body.company+"';";

    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/updateorderstatus ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0){
                    logger.log('data','updateorderstatus Success !!',1,'updateorderstatus');
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"order status changed"}]');
                }
                else{
                    logger.log('warn','updateorderstatus !!',1,'updateorderstatus');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'updateorderstatus');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.clearoutstandingforcash = function (req, res) {
    if (req.body.customername == 'cash'){
        var sql="UPDATE  transactionsummary set outstandingweight=0, outstandingcash =0 Where transactionsummary.companyid  ='" + req.body.company+ "' And  transactionsummary.customerid ='"+ req.body.customer+"';";
        //console.log(sql);
        db.getConnection(function (err, con) {
            logger.log('info', 'Database connection open', 1, 'services.js/clearoutstandingforcash ');
            con.query(sql, function (err, rows) {
                con.release();
                var results;
                if(!err){
                    if(rows.affectedRows != 0){
                        logger.log('data','clearoutstandingforcash Success !!',1,'clearoutstandingforcash');
                        res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"order status changed"}]');
                    }
                    else{
                        logger.log('warn','clearoutstandingforcash !!',1,'updateorderstatus');
                        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                }
                else{
                    logger.log('error','Invalid Query !!',1,'clearoutstandingforcash');
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        });
    }
    else{
        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
    }
};

exports.assignorder = function (req, res) {
    var sql="call updateorder ('" + req.body.company+ "','"+ req.body.order + "','"+ req.body.duedate+ "','"+ req.body.assignedto+"');";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/assignorder ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows.affectedRows != 0){
                    logger.log('data','assignorder Success !!',1,'assignorder');
                    res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"order status changed"}]');
                }
                else{
                    logger.log('warn','assignorder !!',1,'assignorder');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'assignorder');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};

exports.getreceipt = function (req, res) {
    var sql="call getreceipt ('" + req.body.company+ "','"+ req.body.customer + "','"+ req.body.receiptno +"');";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'services.js/getreceipt ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','getreceipt Success !!',req.session.sessionID,'getreceipt');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','getreceipt !!',req.session.sessionID,'getreceipt');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'getreceipt');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
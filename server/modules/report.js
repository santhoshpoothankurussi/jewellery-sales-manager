// <copyright file="report.js" company="Cronyco">
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

exports.stock = function (req, res) {
    var sql= "call stockreport('"+req.body.company+"','"+req.body.fromdate+"','"+req.body.todate+"');";
    //console.log(sql);

    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open',1, 'report.js/stock ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','stockreport Success !!',req.session.sessionID,'stockreport');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','stockreport !!',req.session.sessionID,'stockreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'stockreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.liststock = function (req, res) {
    var sql= "call liststockreport('"+req.body.company+"','"+req.body.fromdate+"');";
    //console.log(sql);

    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open',1, 'report.js/stock ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','liststock Success !!',req.session.sessionID,'liststock');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','stockreport !!',req.session.sessionID,'stockreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'stockreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.stockhistory = function (req, res) {
    var sql="Select    stockhistory.stockdate,        stockhistory.companyid,        stockhistory.storeid,   " +
        "     stockhistory.packageid,        stockhistory.opbalquantity,        stockhistory.opbalweight,   " +
        "     stockhistory.salequantity,        stockhistory.saleweight,        stockhistory.salesreturnquantity,  " +
        "      stockhistory.salesreturnweight,        stockhistory.purchasequantity,        stockhistory.purchaseweight,   " +
        "     stockhistory.issuequantity,        stockhistory.issueweight,        stockhistory.returnquantity,     " +
        "   stockhistory.returnweight,        stockhistory.cashissue,        stockhistory.cashreceipt,      " +
        "  stockhistory.comments,        stockhistory.createdby,        stockhistory.createddatetime,        customer.customertype,   " +
        "     customer.orgname,        customer.firstname,        customer.lastname    From    stockhistory Inner Join  " +
        "  customer On stockhistory.createdby = customer.customerid  where stockhistory.companyid='"+ req.body.company+"'    Group By    " +
        "stockhistory.stockdate, stockhistory.companyid, stockhistory.storeid,        stockhistory.packageid, stockhistory.opbalquantity," +
        " stockhistory.opbalweight,        stockhistory.salequantity, stockhistory.saleweight,        stockhistory.salesreturnquantity," +
        " stockhistory.salesreturnweight,        stockhistory.purchasequantity, stockhistory.purchaseweight,      " +
        "  stockhistory.issuequantity, stockhistory.issueweight,        stockhistory.returnquantity, stockhistory.returnweight,  " +
        "      stockhistory.cashissue, stockhistory.cashreceipt, stockhistory.comments,        " +
        "stockhistory.createdby, stockhistory.createddatetime, customer.customertype,       customer.orgname, customer.firstname, " +
        "customer.lastname;";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/stockhistory ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if (err) {
                res.end('[]');
                logger.log('error', err, req.session.sessionID, 'Search.js/stockhistory ');
                return;
            }
            if (rows.length == 0) {
                res.end('[]');
                logger.log('info', 'No match found for query', req.session.sessionID, 'Search.js/stockhistory ');
            }
            else {
                results = JSON.stringify(rows);
                res.end(results);
                logger.log('data', results, req.session.sessionID, 'Search.js/stockhistory ');
            }
        });
    });
};
exports.bill = function (req, res) {
    var sql= "call billreport('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"','"+ req.body.customer+"','"+ req.body.billnumber+"');";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/bill ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','billreport Success !!',req.session.sessionID,'smithreport');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','billreport !!',req.session.sessionID,'billreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'billreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.smith = function (req, res) {
    var sql= "call smithreport('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"','"+ req.body.package+"','"+ req.body.customer+"');";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/bill ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','smithreport Success !!',req.session.sessionID,'smithreport');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','smithreport !!',req.session.sessionID,'smithreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'smithreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.cash = function (req, res) {
    var sql= "call cashreport('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"','"+ req.body.package+"')";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/cash ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','cashreport Success !!',req.session.sessionID,'cashreport');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','cashreport !!',req.session.sessionID,'cashreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'cashreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.salesreturn = function (req, res) {
    var sql= "call transactionreport('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"','"+ req.body.customer+"');";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/bill ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','salesreturnreport Success !!',req.session.sessionID,'salesreturnreport');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','salesreturnreport !!',req.session.sessionID,'salesreturnreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'salesreturnreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.daybook = function (req, res) {
    var sql= "call daybookreport ('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"')";
    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/cash ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','daybook Success !!',req.session.sessionID,'daybook');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','daybook !!',req.session.sessionID,'daybook');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'daybook');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.transactions = function (req, res) {
    var sql= "call transactionreport('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"','"+ req.body.customer+"');";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/bill ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','salesreturnreport Success !!',req.session.sessionID,'salesreturnreport');
                    results = JSON.stringify(rows);
                    res.end(results);
                }else{
                    logger.log('warn','salesreturnreport !!',req.session.sessionID,'salesreturnreport');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',req.session.sessionID,'salesreturnreport');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.sales=function(req,res){};

exports.cumilative=function(req,res){
    var sql= "call loadcumilative('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"','"+ req.body.customer+"')";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'report.js/cumilative ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if (err) {
                res.end('[]');
                logger.log('error', err, req.session.sessionID, 'report.js/cumilative ');
                return;
            }
            if (rows.length == 0) {
                res.end('[]');
                logger.log('info', 'No match found for query', req.session.sessionID, 'report.js/cumilative ');
            }
            else {
                results = JSON.stringify(rows);
                res.end(results);
                logger.log('data', results, req.session.sessionID, 'report.js/cumilative ');
            }
        });
    });
};
exports.order = function (req, res) {
    var sql= "call loadreport('"+ req.body.company+"','"+ req.body.fromdate.substring(0,10)+"','"+ req.body.todate.substring(0,10)+"')";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', req.session.sessionID, 'Search.js/order ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if (err) {
                res.end('[]');
                logger.log('error', err, req.session.sessionID, 'Search.js/order ');
                return;
            }
            if (rows.length == 0) {
                res.end('[]');
                logger.log('info', 'No match found for query', req.session.sessionID, 'Search.js/order ');
            }
            else {
                results = JSON.stringify(rows);
                res.end(results);
                logger.log('data', results, req.session.sessionID, 'Search.js/order ');
            }
        });
    });
};
exports.dashboard=function(req,res){
    var sql= "call dashboard('"+ req.body.company+"')";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'Search.js/order ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','dashboard Success !!',1,'dashboard');
                    results = JSON.stringify(rows);
                    //console.log(results);
                    res.end(results);
                }else{
                    logger.log('warn','dashboard !!',1,'dashboard');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'dashboard');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.calculategns=function(req,res){
    var sql= "call calculategns('"+ req.body.company+"','"+ req.body.fromdate+"','"+ req.body.todate+"')";
    //console.log(sql)
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'Search.js/order ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','calculategns Success !!',1,'calculategns');
                    results = JSON.stringify(rows);
                    //console.log(results);
                    res.end(results);
                }else{
                    logger.log('warn','calculategns !!',1,'calculategns');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'calculategns');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
'use strict';
var db=require('../appconfig/db').pool;
var logger=require('../utilities/logger.js');
var service=require('../modules/services');
var report=require('../modules/report');
var print = require('../modules/printing');
var crypto = require('../utilities/cryptography');
var async = require('async');

function transactiontypesales(){return 1;}
function transactiontypeorder(){return 9;}
function basepurity(){var basepurity=99.5; return basepurity;}

function getcustomerdetails (formdata, callbackcustomerdata) {
    var token;

    if (formdata.calltype == 'register'){
        token = Math.floor((Math.random()*1000000)+1);
        token = crypto.EncryptString(token.toString());
    }
    else{
        token=formdata.jtoken;
    }
    var sql= "call registerapk('"+formdata.btn+"','"+token+"','"+formdata.calltype+"');";
    //console.log(sql);

    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open',1, 'apkwrapper.js/registerapk ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','registerapk Success !!','apksession','registerapk');
                    results = JSON.stringify(rows);
                    //console.log(results)
                    callbackcustomerdata(rows);
                }
                else{
                    logger.log('warn','registerapk !!','apksession','registerapk');
                    return('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!','apksession','registerapk');
                return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
}

exports.register = function (req, res) {
    var customerid, companyid,customertype,otp;

    var formdata={
        'btn':req.body.btn,
        'calltype':req.body.calltype,
        'jtoken':req.body.jtoken
    }
    async.series([
        function(callback){
            getcustomerdetails (formdata, function(customerdata){
                var data=customerdata[0];
                customerid = data[0].customerid;
                companyid = data[0].companyid;
                customertype = data[0].customertype;
                otp = data[0].otp;
                res.send(customerdata);
                callback();
            });
        }
    ]);
};

exports.listtransactions = function (req, res) {
    var customerid, companyid,customertype,otp;

    var formdata={
        'btn':req.body.btn,
        'jtoken':req.body.jtoken,
        'calltype':req.body.calltype,
        'fromdate':req.body.fromdate,
        'todate':req.body.todate,
        'company':0,
        'customer':0
    }
    async.series([
        function(callback){
            getcustomerdetails (formdata, function(customerdata){
                var data=customerdata[0];
                customerid = data[0].customerid;
                companyid = data[0].companyid;
                customertype = data[0].customertype;
                callback();
            });
        },
        function(callback){
            formdata.company=companyid;
            formdata.customer=customerid;
            req.body.company=companyid;
            req.body.fromdate=formdata.fromdate;
            req.body.todate=formdata.todate;
            req.body.customer=customerid;
            req.body.billnumber=0;
            req.body.billnumber=0;
            callback();
        },
        function(callback){
            if (formdata.calltype == 'bill'){
                report.bill(req,res);
            }
            else if (formdata.calltype == 'order'){
                report.transactions(req,res);
            }
            callback();
        }
    ]);
};

exports.viewtransaction = function (req, res) {
    var customerid, companyid,customertype,otp;

    var formdata={
        'btn':req.body.btn,
        'jtoken':req.body.jtoken,
        'calltype':req.body.calltype,
        'fromdate':req.body.fromdate,
        'todate':req.body.todate,
        'receiptno':req.body.receiptno,
        'company':0,
        'customer':0
    }
    async.series([
        function(callback){
            getcustomerdetails (formdata, function(customerdata){
                var data=customerdata[0];
                customerid = data[0].customerid;
                companyid = data[0].companyid;
                customertype = data[0].customertype;
                callback();
            });
        },
        function(callback){
            formdata.company=companyid;
            formdata.customer=customerid;
            req.body.company=companyid;
            req.body.fromdate=formdata.fromdate;
            req.body.todate=formdata.todate;
            req.body.customer=customerid;
            req.body.receiptno=formdata.receiptno;
            callback();
        },
        function(callback){
            if (formdata.calltype == 'approval'){
                req.body.calltype= 'approval';
                req.body.transactiontype= transactiontypesales();
                service.listtransactionwithindates(req,res);
            }
            else if (formdata.calltype == 'order'){
                req.body.calltype= 'order';
                req.body.transactiontype= transactiontypeorder();
                service.listtransactionwithindates(req,res);
            }
        }
    ]);
};

exports.savetransaction = function (req, res) {
    var customerid, companyid,customertype,otp,boardrate,retailrate;
    var currentDate;
    currentDate=new Date();
    currentDate=currentDate.getFullYear() +"/"+ (+currentDate.getMonth() + +1) +"/"+currentDate.getDate();
    var dueDate = new Date();
    var numberOfDaysToAdd = 5;
    dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd);
    dueDate=dueDate.getFullYear() +"/"+ (+dueDate.getMonth() + +1) +"/"+dueDate.getDate();

    var formdata={
        'btn':req.body.btn,
        'jtoken':req.body.jtoken,
        'calltype':req.body.calltype,
        'receiptno':req.body.receiptno,
        'comments':req.body.comments,
        'company':1,
        'customer':0
    }
    async.series([
        function(callback){
            getcustomerdetails (formdata, function(customerdata){
                var data=customerdata[0];
                customerid = data[0].customerid;
                companyid = data[0].companyid;
                customertype = data[0].customertype;
                callback();
            });
        },
        function(callback){
            db.getConnection(function(err, con){
                logger.log('info',sql,1,'/getrate');
                var sql="SELECT boardrate, 995rate as rate995, createddatetime FROM metalrate where companyid='"+ companyid +"' order by createddatetime desc limit 1;";
                try{
                    con.query(sql,function(err,rows){
                        con.release();
                        if(!err){
                            if(rows.length>0){
                                logger.log('data','getrate Success !!',1,'getrate');
                                //res.end(JSON.stringify(rows));
                                boardrate = rows[0].boardrate;
                                retailrate= rows[0].rate995;
                                callback();
                            }else{
                                logger.log('warn','getrate !!',1,'getrate');
                                res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                            }
                        }else{
                            logger.log('error','Invalid Query !!',1,'getrate');
                            res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                        }
                    });
                }
                catch (e){
                    throw e;
                }
            });
        },
        function(callback){
            formdata.company=companyid;
            formdata.customer=customerid;
            var transactionData="<root><data><storeid>2</storeid><package>"+req.body.package+"</package><packagecode>"+req.body.packagecode+"</packagecode><product>1</product><productcode>PW995</productcode><category>"+req.body.category+"</category><price>"+boardrate+"</price><quantity>"+req.body.quantity+"</quantity><weight>"+req.body.weight+"</weight><purity>"+basepurity()+"</purity></data></root>";
            req.body.company=companyid;
            req.body.customer=customerid;
            req.body.receiptno=formdata.receiptno;
            req.body.transactiontype=transactiontypeorder();
            req.body.transactiondate=currentDate;
            req.body.comments = formdata.comments;
            req.body.duedate=dueDate;
            req.body.transactionid=0;
            req.body.user=0;
            req.body.transactiondetail=transactionData;
            callback();
        },
        function(callback){
            service.savetransaction(req,res);
            //res.send('SUCCESS');
            res.send('[{"status":"success","usermessage":"order saved","systemmessage":"transaction success"}]');
            callback();
        }
    ]);
};

exports.listpackage = function (req, res) {
    var customerid, companyid,customertype,otp;

    var formdata={
        'btn':req.body.btn,
        'calltype':req.body.calltype,
        'jtoken':req.body.jtoken
    }
    async.series([
        function(callback){
            getcustomerdetails (formdata, function(customerdata){
                var data=customerdata[0];
                customerid = data[0].customerid;
                companyid = data[0].companyid;
                customertype = data[0].customertype;
                callback();
            });
        },
        function(callback){
            formdata.company=companyid;
            formdata.customer=customerid;
            req.body.usercompany=companyid;
            req.body.customer=customerid;
            callback();
        },
        function(callback){
            service.listpackage(req,res);
            callback();
        }
    ]);
};
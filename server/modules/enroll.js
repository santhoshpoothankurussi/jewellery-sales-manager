'use strict';

var db=require('../appconfig/db').pool;
var logger=require('../utilities/logger.js');
var crypto = require('../utilities/cryptography');

exports.login=function(req,res) {
    var company=req.body.company;
    var user=req.body.user;
    var username=req.body.username;
    var userpass=req.body.userpass;

    db.getConnection(function(err, con){
        var sql="select distinct companyid,customerid, firstname, lastname from customer where loginid='"+username+"' and loginpassword ='"+userpass+"' and companyid ='"+ company +"' and status=1;";
        logger.log('info',sql,user,'/login');
        try{
            con.query(sql,function(err,rows){
                con.release();
                if(!err){
                    if(rows[0]!=undefined){
                        logger.log('data','getpujalist Success !!',1,'getpujalist');
                        res.end(JSON.stringify(rows));
                    }else{
                        logger.log('warn','getpujalist !!',1,'getpujalist');
                        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                }else{
                    logger.log('error','Invalid Query !!',1,'getpujalist');
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        }
        catch (e){
            throw e;
        }
    });
};
exports.logout=function(req,res) {
    res.end('[{"result":"SUCCESS","usermessage":"successfully loggedout" "systemmessage":"successfully loggedout"}]');
};
exports.listusertypes=function(req,res) {
    db.getConnection(function(err, con){
        var sql="select * from customertype;";
        logger.log('info',sql,1,'/listusertypes');
        con.query(sql,function(err,rows){
            con.release();
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','getrate Success !!',1,'listusertypes');
                    //console.log(JSON.stringify(rows));
                    res.end(JSON.stringify(rows));
                }else{
                    logger.log('warn','listusertypes !!',1,'listusertypes');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }else{
                logger.log('error','Invalid Query !!',1,'listusertypes');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.listuser=function(req,res) {
    try{
        db.getConnection(function(err, con){
            //var sql="select customerid, customertype, firstname,lastname from customer where status=1 and companyid="&company &";";
            var sql="Select   customer.customerid,  customer.firstname,  customer.lastname,  customer.contactno,  customertype.typename,  customer.orgname, "+
                "address.house,  address.street,  address.postoffice,  address.district,  address.pin,  customerdetails.creditlimitweight, "+
                "customerdetails.creditlimitcash,  customerdetails.opbalanceweight,  customerdetails.opbalancecash,  customer.createddatetime, customer.loginid "+
                "From  customer Inner Join  customerdetails    On customer.companyid = customerdetails.companyid And customer.customerid = "+
                "customerdetails.customerid Inner Join  address    On customer.addressid = address.addressid And customer.companyid = "+
                "address.companyid Inner Join  customertype    On customer.customertype = customertype.customertype " +
                "Where customer.status=1 And  customer.companyid ="+req.body.company +";"
            //console.log(sql);
            con.query(sql,function(err,rows){
                con.release();
                if(!err){
                    if(rows[0]!=undefined){
                        logger.log('data','getrate Success !!',1,'getrate');
                        res.end(JSON.stringify(rows));
                    }else{
                        logger.log('warn','getrate !!',1,'getrate');
                        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                }else{
                    logger.log('error','Invalid Query !!',1,'getrate');
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        });
    }
    catch (e){
        throw e;
    }
};
exports.saveuser=function(req,res) {
    db.getConnection(function(err, con){
        var encryptedPassword=crypto.EncryptString(req.body.loginpassword);
        var encryptedLoginID=crypto.EncryptString(req.body.loginid);

        var sql="call savecustomer ('"+req.body.company +"','"+ req.body.orgname +"','"+ req.body.firstname +"','"+ req.body.lastname+"','"+
            encryptedLoginID+"','"+encryptedPassword+"','"+req.body.title+"','"+req.body.contactname+"','"+req.body.userid+"','"+
            req.body.customertype+"','"+req.body.house+"','"+req.body.street+"','"+req.body.postoffice+"','"+req.body.district+"','"+
            req.body.state+"','"+req.body.country+"','"+req.body.pin+"','"+req.body.contactno+"','"+req.body.email+"','"+req.body.fax+"','"+  req.body.geotag+"','"+
            req.body.creditlimitcash+"','"+req.body.creditlimitweight+"','"+req.body.openingbalancecash+"','"+req.body.openingbalanceweight+"','"+req.body.customer+"');";

        logger.log('info',sql,1,'/saveuser');
        try {
            con.query(sql,function(err,rows){
                con.release();
                if(!err){
                    if(rows.affectedRows != 0 ){
                        logger.log('data','saveuser Success !!',1,'saveuser');
                        res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"user removed"}]');
                    }else{
                        logger.log('warn','saveuser !!',1,'saveuser');
                        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                }else{
                    logger.log('error','Invalid Query !!',1,'saveuser');
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        }
        catch (e){
            throw e;
        }
    });
};
exports.deleteuser=function(req,res) {
    db.getConnection(function(err, con){
        var sql="update customer set status=0 where companyid="+req.body.company +" and customerid="+ req.body.customer +";";
        //console.log(sql);
        try{
            con.query(sql,function(err,rows){
                con.release();
                if(!err){
                    if(rows.affectedRows==0){
                        logger.log('warn','deleteuser !!',1,'deleteuser');
                        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                    else{
                        logger.log('data','deleteuser Success !!',1,'deleteuser');
                        res.end('[{"result":"SUCCESS","usermessage":"user remove","systemmessage":"user removed"}]');
                    }
                }
                else{
                    logger.log('error','Invalid Query !!',1,'deleteuser');
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        }
        catch (e){
            throw e;
        }
    });
};
exports.getrate=function(req,res) {
    var company=req.body.usercompany;

    db.getConnection(function(err, con){
        //if(err){console.log(err);}
        logger.log('info',sql,1,'/getrate');
        var sql="SELECT boardrate, 995rate as rate995, createddatetime FROM metalrate where companyid='"+company +"' order by createddatetime desc limit 1;";
        try{
            con.query(sql,function(err,rows){
                con.release();
                if(!err){
                    if(rows.length>0){
                        logger.log('data','getrate Success !!',1,'getrate');
                        res.end(JSON.stringify(rows));
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
};
exports.setrate = function (req, res) {
    var sql="call `setmetalrate`('"+req.body.company+"','"+req.body.wholesalerate+"','"+req.body.retailrate+"','"+req.body.userid+"');";

    //console.log(sql);
    db.getConnection(function (err, con) {
        logger.log('info', 'Database connection open', 1, 'Search.js/setrate ');
        con.query(sql, function (err, rows) {
            con.release();
            var results;
            if(!err){
                if(rows[0]!=undefined){
                    logger.log('data','setrate Success !!',1,'setrate');
                    res.end(JSON.stringify(rows));
                }
                else{
                    logger.log('warn','setrate !!',1,'setrate');
                    res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                }
            }
            else{
                logger.log('error','Invalid Query !!',1,'setrate');
                res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
            }
        });
    });
};
exports.getpass=function(req,res){
    var decryptedPassword=crypto.DecryptString(req.body.pcode);
    res.end('[{"pcode":"' + decryptedPassword + '"}]');
};
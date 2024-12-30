var db = require('../appconfig/db').pool;
var crypto = require('../utilities/cryptography');
var logger=require('../utilities/logger.js');
var file='user.js';

exports.SetSession=function(req,res){
    var method='SetSession';
    logger.log('data','session Received :'+JSON.stringify(req.body),req.body.UserID,file+'/'+method);
    req.session.AuthenticatedLoginID = req.body.LoginID;
    req.session.AuthenticatedFirstName = req.body.FirstName;
    req.session.AuthenticatedLastName = req.body.LastName;
    req.session.AuthenticatedCID=req.body.CID;
    req.session.AuthenticatedUserID=req.body.UserID;
    req.session.AuthenticatedUserTypeID= req.body.AccessTypeID;
    res.end('session received');
};
exports.authenticate=function(req,res){
    var method='authenticate';
    var encryptedPassword=crypto.EncryptString(req.body.loginpassword);
    var encryptedLoginID=crypto.EncryptString(req.body.loginid);
    var sql="call authenticateuser ('"+ encryptedLoginID +"','"+ encryptedPassword +"');";
    logger.log('data','query :'+sql,0,file+'/'+method);

    db.getConnection(function(err, con){
        con.query(sql,function(err, rows) {
            con.release();
            //console.log((JSON.stringify(rows)));
            if (err){
                logger.log('error','error on query :'+err,0,file+'/'+method);
                res.send( '[{"RESULT" : "ERROR"}]');
                return;
            }
            if (rows.fieldCount == 0){
                logger.log('data','no match found ',0,file+'/'+method);
                res.send( '[{"RESULT" : "NODATA"}]');
            }
            else{
                var results;
                results = JSON.stringify(rows);
                req.session.AuthenticatedLoginID =rows[0].loginid;
                req.session.AuthenticatedCID=rows[0].companyid;
                req.session.AuthenticatedUserID=rows[0].customerid;
                req.session.AuthenticatedUserTypeID= rows[0].customertype;
                req.session.FirstName= rows[0].firstname +' '+rows[0].lastname;
                var username=rows[0].firstname +' '+rows[0].lastname;
                res.end(results);
                logger.log('data','login success :'+JSON.stringify(rows),0,file+'/'+method);
            }
        });
    });
};
exports.logout = function(req, res){
    var method='logout';
    var ID=req.session.AuthenticatedLoginID;
    req.session.AuthenticatedLoginID = null;
    req.session.AuthenticatedFirstName = null;
    req.session.AuthenticatedLastName = null;
    req.session.AuthenticatedCID=null;
    req.session.AuthenticatedUserID=null;
    req.session.AuthenticatedUserTypeID= null;
    res.end('[{"User":"api user logout"}]');
    logger.log('data','logout :'+ID,0,file+'/'+method);
};
exports.checkAuthenticatedUser=function checkAuthenticatedUser(req, res, next) {
    if (req.session.AuthenticatedLoginID==null) {
        res.end('[{"Message":"AuthenticationFailed"}]');
    }
    else{
        var sql="SELECT * FROM metalrate where companyid ='"+req.session.AuthenticatedCID+ "' order by createddatetime desc limit 1;";
        db.getConnection(function(err, con){
            con.query(sql,function(err, rows) {
                con.release();
                if((!err) && (rows.length!=0)){
                        retailrate= rows[0].boardrate;
                        wholesalerate= rows[0]['995rate'];
                }
             var loginid=req.session.AuthenticatedLoginID;
             var companyid=req.session.AuthenticatedCID=rows[0].companyid;
                req.session.AuthenticatedUserID=rows[0].customerid;
                req.session.AuthenticatedUserTypeID= rows[0].customertype;
                res.end('[{"Message":"AuthenticationSuccess","UserType":"'+req.session.AuthenticatedUserTypeID+'","BoardRate":"'+
                retailrate+'","Rate995":"'+wholesalerate+'"}]');
            });
        });
    }
};
exports.savepassword=function(req, res) {
    var encryptedPassword=crypto.EncryptString(req.body.password1);
    var sql="UPDATE customer set loginpassword ='"+ encryptedPassword + "' where companyid='" + req.body.usercompany + "' And customerid='"+ req.body.selectedappuser +"';";
    //console.log(sql);
    db.getConnection(function(err, con){
        con.query(sql,function(err, rows) {
            con.release();
            if((!err)){
                res.end('[{"Status":"SUCCESS"}]');
            }
            else{
                res.end('[{"Status":"FAILED"}]');
            }
        });
    });
};

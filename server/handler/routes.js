'use strict';
// new
var enroll=require('../modules/enroll');
var service=require('../modules/services');
var report=require('../modules/report');
var user = require('../modules/user');
var print = require('../modules/printing');
var apkwrapper = require('../modules/apkwrapper');

module.exports = function(app){
    app.post('/enroll/login',enroll.login);
    app.post('/enroll/logout',enroll.logout);
    app.post('/enroll/listuser',enroll.listuser);
    app.post('/enroll/listusertype',enroll.listusertypes);
    app.post('/enroll/saveuser',enroll.saveuser);
    app.post('/enroll/deleteuser',enroll.deleteuser);
    app.post('/enroll/getrate',enroll.getrate);
    app.post('/enroll/setrate',enroll.setrate);
    app.post('/enroll/getpass',enroll.getpass);

    app.post('/service/liststore',service.liststore);
    app.post('/service/listcategory',service.listcategory);
    app.post('/service/liststock',service.liststock);
    app.post('/service/savestock',service.savestock);
    app.post('/service/opendaystock', service.opendaystock);
    app.post('/service/updateopeningstock',service.updateopeningstock);
    app.post('/service/movestock',service.movestock);
    app.post('/service/listvalueaddition',service.listvalueaddition);
    app.post('/service/addvalueaddition',service.addvalueaddition);
    app.post('/service/removevalueaddition',service.removevalueaddition);
    app.post('/service/listalltransaction',service.listtransaction);
    app.post('/service/listtransactionfortype',service.listtransactionfortype);
    app.post('/service/savetransaction',service.savetransaction);
    app.post('/service/removetransaction',service.removetransaction);
    app.post('/service/billtransaction',service.billtransaction);
    app.post('/service/listtransactionhistory',service.listtransactionhistory);
    app.post('/service/addproduct',service.addproduct);
    app.post('/service/listpackage',service.listpackage);
    app.post('/service/loadcustomer', service.loadcustomer);
    app.post('/service/loadcategory', service.loadcategory);
    app.post('/service/generatebill', service.generatebill);
    app.post('/service/addcategory', service.addcategory);
    app.post('/service/deletecategory', service.deletecategory);
    app.post('/service/saveaddress', service.saveaddress);
    app.post('/service/listaddress', service.listaddress);
    app.post('/service/listorder', service.listorder);
    app.post('/service/vieworder', service.vieworder);
    app.post('/service/updateorderstatus', service.updateorderstatus);
    app.post('/service/clearoutstandingforcash', service.clearoutstandingforcash);
    app.post('/service/assignorder', service.assignorder);
    app.post('/service/getreceipt', service.getreceipt);
    app.post('/service/savebilledit', service.savebilledit);

    app.post('/report/stock',report.stock);
    app.post('/report/liststock',report.liststock);
    app.post('/report/stockhistory',report.stockhistory);
    app.post('/report/bill',report.bill);
    app.post('/report/transactions',report.transactions);
    app.post('/report/sales',report.sales);
    app.post('/report/salesreturn',report.salesreturn);
    app.post('/report/smith',report.smith);
    app.post('/report/cash',report.cash);
    app.post('/report/dashboard',report.dashboard);
    app.post('/report/calculategns',report.calculategns);
    app.post('/report/daybook',report.daybook);
    app.post('/report/order',report.order);
    app.post('/report/cumilative',report.cumilative);

    app.post('/bill/sales',print.salesbill);

    app.post('/login/checkAuthenticatedUser',user.checkAuthenticatedUser);
    app.post('/login',user.authenticate);
    app.post('/logout',user.logout);
    app.post('/SetSession',user.SetSession);
    app.post('/savepassword',user.savepassword);

    app.post('/apkwrapper/register',apkwrapper.register);
    app.post('/apkwrapper/list',apkwrapper.listtransactions);
    app.post('/apkwrapper/view',apkwrapper.viewtransaction);
    app.post('/apkwrapper/save',apkwrapper.savetransaction);
    app.post('/apkwrapper/package',apkwrapper.listpackage);
}
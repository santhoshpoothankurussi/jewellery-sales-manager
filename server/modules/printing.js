'use strict';
var db =require('../appconfig/db').pool;
var logger =require('../utilities/logger.js');
var async = require('async');
var PdfPrinter = require('pdfmake/src/printer');
var fs = require('fs');
var _ = require('lodash');
var formulae=require('./formulae.js');

function printsalesbill(){return "salesbill";}
function printcashbill (){return "cashbill";}
function productcodegold (){return "PW995";}
function productcodeoldgold (){return "PW101";}
function productcodeva (){return "PW103";}
function productcodestoneweight (){return "PW105";}
function productcodestonevalue (){return "PA203";}

var fonts = {
    Roboto: {
        normal: './client/fonts/Roboto-Regular.ttf',
        bold: './fonts/Roboto-Medium.ttf',
        italics: './fonts/Roboto-Italic.ttf',
        bolditalics: './fonts/Roboto-Italic.ttf'
    },
    Arial: {
        normal: 'client/fonts/arial.ttf',
        bold: 'client/fonts/arialbold.ttf',
        italics: 'client/fonts/arialitalic.ttf',
        bolditalics: 'client/fonts/arialitalic.ttf'
    }
};
var fontDescriptors = {
    Roboto: {
        normal: 'client/fonts/Roboto-Regular.ttf',
        bold: 'client/fonts/Roboto-Medium.ttf',
        italics: 'client/fonts/Roboto-Italic.ttf',
        bolditalics: 'client/fonts/Roboto-Italic.ttf'
    },
    Arial: {
        normal: 'client/fonts/arial.ttf',
        bold: 'client/fonts/arialbold.ttf',
        italics: 'client/fonts/arialitalic.ttf',
        bolditalics: 'client/fonts/arialitalic.ttf'
    }
};

var tablerowcount=0, summaryrowcount=0;

function createPdfBinary(pdfDoc, callback){
    var printer = new PdfPrinter(fontDescriptors);
    var doc = printer.createPdfKitDocument(pdfDoc);
    var chunks = [];
    var result;

    doc.on('data', function (chunk) {
        chunks.push(chunk);
    });
    doc.on('end', function () {
        result = Buffer.concat(chunks);
        callback('data:application/pdf;base64,' + result.toString('base64'));
    });
    doc.end();
};

function generatepdfdata (formdata, callbackpdfdata) {
    if (formdata.billtype == printsalesbill()){
        var sql;
        sql="call generatepdfdata ('"+formdata.company+"','"+formdata.customer+"','"+formdata.transactionlist+"','"+formdata.customertype+"','"+formdata.billtype+"','"+formdata.receiptno+"',null,null,'"+formdata.action+"');";
        //console.log(sql);
        logger.log('info',sql,1,'generatepdfdata');
        db.getConnection(function (err, con) {
            logger.log('info', 'Database connection open', 1, 'printing.js/generatepdfdata ');
            con.query(sql, function (err, rows) {
                con.release();
                var results;
                if(!err){
                    if(rows[0]!=undefined){
                        logger.log('data','generatepdfdata Success !!',1,'generatepdfdata');
                        results = rows;
                        //results=JSON.stringify(results);
                        //return(results);
                        callbackpdfdata(results);
                    }else{
                        logger.log('warn','generatepdfdata !!',1,'generatepdfdata');
                        return('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                }
                else{
                    logger.log('error','Invalid Query !!',1,'generatepdfdata');
                    return('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        });
    }
};

// generate pdf body dynamically
function generatetabletransaction(itemdata, customertype, columns, callbackgeneratetable) {
    var tablebody = [];
    tablerowcount = +tablerowcount + 1;

    if (customertype ==1){  // wholesale bill format
        // adding header
        tablebody.push([{text:'date',style:'tableHeader2'},{text:'qty',style:'tableHeader2'}, {text:'item',style:'tableHeader2'}, {text:'%',style:'tableHeader2'}, {text:'weight',style:'tableHeader2'},
            {text:'stone',style:'tableHeader2'}, {text:'gross',style:'tableHeader2'},  {text:'calcwt',style:'tableHeader2'}]);
//{text:'stchrg',style:'tableHeader2'},

        // adding data
        var data = itemdata;
        if (data == undefined){
            tablebody.push(['','','','','','','','','']);
            tablerowcount = +tablerowcount + 1;
        }
        else{
            var mypackage, rowdata;
            var tdate,qty,item,purity,weight,stone,gross,stoneval,va,netweight;

            var packagegroup  = _.groupBy(itemdata, 'transactionid');
            //console.log(JSON.stringify(packagegroup));
            //['tdate','qty','item','purity','weight','stone','gross','stoneval','va','netweight']
            for(var key in packagegroup) {
                var dataRow = [];

                mypackage = packagegroup[key];
                for (var row in mypackage){
                    rowdata = mypackage[row];
                    //console.log(JSON.stringify(rowdata));
                    if (rowdata.product_code == productcodegold()){
                        tdate=(rowdata.tdate== null ? '0' : rowdata.tdate.toString());
                        qty=(rowdata.qty== null ? '0' : rowdata.qty.toString());
                        //item=(rowdata.item== null ? '' : rowdata.item.toString());
                        item=(rowdata.categoryname== null ? '' : rowdata.categoryname.toString());
                        purity=(rowdata.purity== null ? '0' : rowdata.purity);
                        weight=(rowdata.weight== null ? '0' : formulae.roundNumber(rowdata.weight,3).toString());
                        netweight=(rowdata.netweight== null ? '0' : formulae.roundNumber(rowdata.netweight,3).toString());
                    }
                    if (rowdata.product_code == productcodestoneweight()){
                        stone=(rowdata.weight== null ? '0' : formulae.roundNumber(rowdata.weight,3).toString());
                    }
                    if (rowdata.product_code == productcodestonevalue()){
                        stoneval=(rowdata.weight== null ? '' : rowdata.weight.toString());
                    }
                    if (rowdata.product_code == productcodeva()){
                        va=(rowdata.weight== null ? '0' : rowdata.weight);
                    }
                }
                purity= +purity + +va;  // add va to purity for printing
                purity =purity.toString();
                gross = +weight - +stone;
                gross=formulae.roundNumber(gross,3);
                dataRow.push(tdate);
                dataRow.push(qty);
                dataRow.push(item);
                dataRow.push(purity);
                dataRow.push(weight);
                dataRow.push(stone);
                dataRow.push(gross== null ? '0' : gross.toString());
                //dataRow.push(stoneval);
                //dataRow.push(va);
                dataRow.push(netweight);
                tablebody.push(dataRow);
                tablerowcount = +tablerowcount + 1;
            }
        }
    }
    else if (customertype==2){  // retail bill format
        // adding header
        tablebody.push([{text:'date',style:'tableHeader2'},{text:'qty',style:'tableHeader2'}, {text:'item',style:'tableHeader2'}, {text:'va',style:'tableHeader2'}, {text:'weight',style:'tableHeader2'},
            {text:'stone',style:'tableHeader2'}, {text:'gross',style:'tableHeader2'}, {text:'amount',style:'tableHeader2'}]);
 // {text:'stcharge',style:'tableHeader2'},

        // adding data
        var data = itemdata;
        if (data == undefined){
            tablebody.push(['','','','','','','','','','']);
            tablerowcount = +tablerowcount + 1;
        }
        else{
            var mypackage, rowdata;
            var tdate,qty,item,purity,weight,stone,gross,stoneval,va,netweight;

            var packagegroup  = _.groupBy(itemdata, 'transactionid');
            for(var key in packagegroup) {
                var dataRow = [];
                mypackage = packagegroup[key];
                for (var row in mypackage){
                    rowdata = mypackage[row];
                    if (rowdata.product_code == productcodegold()){
                        tdate=(rowdata.tdate== null ? '0' : rowdata.tdate.toString());
                        qty=(rowdata.qty== null ? '0' : rowdata.qty.toString());
                        //item=(rowdata.item== null ? '' : rowdata.item.toString());
                        item=(rowdata.categoryname== null ? '' : rowdata.categoryname.toString());
                        purity=(rowdata.purity== null ? '0' : rowdata.purity);
                        weight=(rowdata.weight== null ? '0' : formulae.roundNumber(rowdata.weight,3).toString());
                        netweight=(rowdata.netamount== null ? '0' : formulae.roundNumber(rowdata.netamount,0).toString());
                    }
                    if (rowdata.product_code == productcodestoneweight()){
                        stone=(rowdata.weight== null ? '0' : formulae.roundNumber(rowdata.weight,3).toString());
                    }
                    if (rowdata.product_code == productcodestonevalue()){
                        stoneval=(rowdata.weight== null ? '' : rowdata.weight.toString());
                    }
                    if (rowdata.product_code == productcodeva()){
                        va=(rowdata.weight== null ? '0' : rowdata.weight);
                    }
                }
                //purity= +purity + +va;  // add va to purity for printing
                purity= +va;  // add va to purity for printing
                purity =purity.toString();
                gross = +weight - +stone;
                dataRow.push(tdate);
                dataRow.push(qty);
                dataRow.push(item);
                dataRow.push(purity);
                dataRow.push(weight);
                dataRow.push(stone);
                dataRow.push(gross== null ? '0' : gross.toString());
                //dataRow.push(stoneval);
                //dataRow.push(va);
                dataRow.push(netweight);
                tablebody.push(dataRow);
                tablerowcount = +tablerowcount + 1;
            }
        }
    }

    callbackgeneratetable (tablebody);
};
function generatetablesummary(itemdata, customertype, orgname, callbackgeneratesummary) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    //console.log(day);
    month =  month < 10 ? "0" + (month) : month;
    day =  day < 10 ? "0" + (day) : day;
    var referencedate = day + "/" + month;

    var tablebody = [];
    summaryrowcount = +summaryrowcount + 1;

    // adding header
    tablebody.push([{ text: 'Summary', style: 'tableHeader2' }, { text: ''}]);
    tablebody.push(['','']);
    // adding data
    if (itemdata.length == 0 || itemdata == undefined){
        tablebody.push(['','']);
        summaryrowcount = +summaryrowcount + 1;
    }

    if (customertype ==1){ // wholesale customer

        // sales
        var data = itemdata[5];
        var transactiondate,transactionrate, netproductvalue=0, netcalculatedweight=0;
        data.forEach(function(row){
            transactiondate=row.tdate;
            transactionrate=row.rate;
            netproductvalue= +netproductvalue + +row.productvalue;
            netcalculatedweight = +netcalculatedweight + +row.calculatedweight;
        });
        if (data.length >0){
            var dataRow = [];
            dataRow.push('sales');
            //console.log('transactiondate ' + transactiondate )
            //console.log('referencedate ' + referencedate )
            dataRow.push(transactiondate+", "+formulae.roundNumber(netproductvalue,3)+' gm at '+transactionrate+' rs/gm. = '+formulae.roundNumber(netcalculatedweight,3)+' gm.'+ (transactiondate === referencedate ? "" : " (only for ref)"));
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
        }

        // purchase
        var data = itemdata[1];
        data.forEach(function(row){
            var dataRow = [];
            if (row.product_code == productcodeoldgold()){
                dataRow.push('old gold (-)');
                //dataRow.push(row.lineitem);
                if (row.tdate != referencedate){}
                dataRow.push(row.tdate+", "+formulae.roundNumber(row.productvalue,3)+' gm at '+row.purity+' % = '+formulae.roundNumber(row.calculatedweight,3)+' gm.' + (row.tdate === referencedate ? "" : " (only for ref)"));
            }
            else if (row.product_code == productcodegold()){
                dataRow.push('995 (-)');
                //dataRow.push(row.lineitem);
                dataRow.push(row.tdate+", "+formulae.roundNumber(row.productvalue,3)+' gm at '+row.purity+' % = '+formulae.roundNumber(row.calculatedweight,3)+' gm.' + (row.tdate === referencedate ? "" : " (only for ref)"));
            }
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
        });

        // cash
        var data = itemdata[3];
        data.forEach(function(row){
            var dataRow = [];
            dataRow.push('cash (-)');
            //dataRow.push(row.lineitem);
            dataRow.push(row.tdate+", "+row.productvalue+' rs at '+row.rate+' rs/gm. = '+formulae.roundNumber(row.calculatedweight,3)+' gm.' + (row.tdate === referencedate ? "" : " (only for ref)"));
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
        });

        // salesreturn
        var data = itemdata[2];
        data.forEach(function(row){
            var dataRow = [];
            dataRow.push('return (-)');
            //dataRow.push(row.lineitem);
            dataRow.push(row.tdate+", "+ row.quantity +" "+ row.package_name + " in " +formulae.roundNumber(row.productvalue,3)+' gm at '+row.purity+' % = '+formulae.roundNumber(row.calculatedweight,3)+' gm.' + (row.tdate === referencedate ? "" : " (only for ref)"));
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
        });

        // outstandingdata
        var data = itemdata[4];
        data.forEach(function(row){
            var dataRow = [];
            //dataRow.push('outstanding');
            //dataRow.push(row.lineitem)
            //[{ text: 'net outstanding', style: 'user_bold' }, { text: '' + '{o/s data}', style: 'user_bold', alignment: 'right' }]
            dataRow.push({ text: 'outstanding', style: 'user_bold'});
            dataRow.push({ text: ' as on ' + row.tdate +', is '+ formulae.roundNumber(row.outstandingvalue,3)+' gm.', style: 'user_bold', alignment: 'left' });
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
        });
    }
    else if (customertype==2){ //retail customer
        var amountsales=0, amountpurchase=0, amountreturn=0, amountcash= 0, amountbillvalueforretailcash=0;

        // sales
        var data = itemdata[5];
        var transactiondate,transactionrate, netproductvalue=0, netcalculatedweight=0;
        data.forEach(function(row){
            transactiondate=row.tdate;
            transactionrate=row.rate;
            netproductvalue= +netproductvalue + +row.productvalue;
            netcalculatedweight = +netcalculatedweight + +row.calculatedamount;
        });
        if (data.length >0){
            var dataRow = [];
            dataRow.push('sales');
            dataRow.push(transactiondate+", "+formulae.roundNumber(netproductvalue,3)+' gm at '+transactionrate+' rs/gm. = '+formulae.roundNumber(netcalculatedweight,0)+' rs.'+ (transactiondate === referencedate ? "" : " (only for ref)"));
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
            amountsales += +formulae.roundNumber(netcalculatedweight,0);
        }

        // purchase
        var data = itemdata[1];
        data.forEach(function(row){
            var dataRow = [];
            if (row.product_code == productcodeoldgold()){
                dataRow.push('old gold (-)');
                //dataRow.push(row.lineitem);
                dataRow.push(row.tdate+", "+formulae.roundNumber(row.productvalue,3)+' gm at '+row.purity+' % = '+row.calculatedamount+' rs.'+ (row.tdate === referencedate ? "" : " (only for ref)"));
            }
            else if (row.product_code == productcodegold()){
                dataRow.push('995 (-)');
                //dataRow.push(row.lineitem);
                dataRow.push(row.tdate+", "+formulae.roundNumber(row.productvalue,3)+' gm at '+row.purity+' % = '+row.calculatedamount+' rs.'+ (row.tdate === referencedate ? "" : " (only for ref)"));
            }
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
            amountpurchase += +formulae.roundNumber(row.calculatedamount,0);
        });

        // cash
        var data = itemdata[3];
        data.forEach(function(row){
            var dataRow = [];
            dataRow.push('cash (-)');
            //dataRow.push(row.lineitem);
            dataRow.push(row.tdate+", "+row.productvalue+' rs at '+row.rate+' rs/gm. = '+row.calculatedamount+' rs.'+ (row.tdate === referencedate ? "" : " (only for ref)"));
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
            amountcash += +formulae.roundNumber(row.calculatedamount,0);
        });

        // salesreturn
        var data = itemdata[2];
        data.forEach(function(row){
            var dataRow = [];
            dataRow.push('return (-)');
            //dataRow.push(row.lineitem);
            dataRow.push(row.tdate+", "+ row.quantity +" "+ row.package_name + " in " +formulae.roundNumber(row.productvalue,3)+' gm at '+row.purity+' % = '+formulae.roundNumber(row.calculatedamount,2)+' rs.'+ (row.tdate === referencedate ? "" : " (only for ref)"));
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
            amountreturn += +formulae.roundNumber(row.calculatedamount,0);
        });

        amountbillvalueforretailcash = +amountsales - (+amountpurchase + +amountcash + +amountreturn);
        //console.log(amountsales + ' ' + amountpurchase + '  ' + amountcash + ' ' + amountreturn + '  = ' + amountbillvalueforretailcash);
        //console.log(orgname + '  ' + orgname.indexOf("cash"))

        // outstandingdata
        var data = itemdata[4];
        data.forEach(function(row){
            var dataRow = [];
            //dataRow.push('outstanding');
            //dataRow.push(row.lineitem)
            //[{ text: 'net outstanding', style: 'user_bold' }, { text: '' + '{o/s data}', style: 'user_bold', alignment: 'right' }]
            dataRow.push({ text: 'outstanding', style: 'user_bold'});
            if (orgname.indexOf("cash") == -1){
                dataRow.push({ text: ' as on ' + row.tdate +', is '+ formulae.roundNumber(row.outstandingvalue,2)+' rs.', style: 'user_bold', alignment: 'left' });
            }
            else{
                dataRow.push({ text: ' as on ' + row.tdate +', is '+ formulae.roundNumber(amountbillvalueforretailcash,2)+' rs.', style: 'user_bold', alignment: 'left' });
            }
            tablebody.push(dataRow);
            summaryrowcount = +summaryrowcount + 1;
        });
    }

    callbackgeneratesummary (tablebody);
};

exports.salesbill = function (req, res) {
    var resultdata, salesdata,salesparameterdata,purchasedata,salesreturndata,cashdata,outstandingdata,previousoutstandingdata,customerdata;
    var salesbillbody;
    var salessummarybody;
    var docDefinition;
    var receiptno='';
    var oldbalance='0';
    var oldbalancedate='';
    var customertype=0;
    var transactiondate;
    var outstandingontransactiondate;
    var oldbalanceontransactiondate;

    // generate data
    var formdata={
        company:req.body.company,
        customer:req.body.customer,
        transactionlist:req.body.transactionlist,
        customertype:req.body.customertype,
        billtype:req.body.billtype,
        clientdata:req.body.billdatafromclient,
        uniqueidlist:req.body.transactionidlist,
        action:req.body.action,
        receiptno:req.body.receiptno
    };

    async.series([
        function(callback){
             generatepdfdata(formdata, function(reportdata){
                 resultdata=reportdata;
                 salesdata = reportdata[0];
                 salesparameterdata = reportdata[1];
                 purchasedata = reportdata[1];
                 salesreturndata = reportdata[2];
                 cashdata = reportdata[3];
                 outstandingdata = reportdata[4];
                 customerdata = reportdata[6];
                 customertype=customerdata[0].customertype;
                 previousoutstandingdata= reportdata[7];
                 if (previousoutstandingdata.length >0){
                     if (previousoutstandingdata[0].outstandingvalue != null | previousoutstandingdata[0].outstandingvalue != undefined){
                         oldbalance = previousoutstandingdata[0].outstandingvalue;
                     }
                     if (previousoutstandingdata[0].tdate != null | previousoutstandingdata[0].tdate != undefined){
                         oldbalancedate = previousoutstandingdata[0].tdate;
                     }
                 }
                 if (customertype==1){
                     oldbalance = formulae.roundNumber(oldbalance,3)+' gm.';
                 }
                 else if (customertype==2){
                     oldbalance = formulae.roundNumber(oldbalance,2)+' rs.';
                     if (customerdata[0].orgname.indexOf("cash") > 0){
                         oldbalance = '0 rs.';
                     }
                 }
                 if (formdata.action=='view'){
                     transactiondate = reportdata[8][0].jtransactiondate;
                 }
                 callback();
             });
        },
        function(callback){
            tablerowcount=0
            generatetabletransaction(salesdata,customertype,['tdate','qty','item','purity','weight','stone','gross','stoneval','va','netweight'], function(tablebody){
                salesbillbody = tablebody;
                callback();
            }); // second parameter is table column headers
        },
        function(callback){
            summaryrowcount=0;
            generatetablesummary(resultdata, customertype,customerdata[0].orgname, function(summarybody){
                salessummarybody = summarybody;
                callback();
            });
        },
        function(callback){
            var curdate = new Date();
            curdate=curdate.getDate() +"/"+ (+curdate.getMonth() + +1) +"/"+curdate.getFullYear();
            var hours= new Date().getHours();
            var period = hours < 12 ? " am" : " pm";
            hours= hours - ((hours == 0)? -12 : (hours <= 12)? 0 : 12);
            var minutes = new Date().getMinutes();
            var curtime= hours +":"+minutes+ period;
            // for view duplicate bill
            if (formdata.action == 'view'){
                curdate=transactiondate;
            }
            var docpageWidth=432;   // 6 inches is 6*72 in points
            var docpagesize = 200 + ((+tablerowcount * 10) + (+summaryrowcount * 10));
            docDefinition = {
                //header: function(currentPage, pageCount) {
                //    return {
                //        //columns: [
                //        //    {width:90, text: 'bill no: '+customerdata[0].newreceiptid },
                //        //    {width:100, text: 'estimate', alignment: 'center' },
                //        //    {width:90, text: ''+curdate+' '+curtime+'\n' }
                //        //],
                //        //columnGap: 0,           // optional space between columns
                //        //style: 'header'
                //        columns: [
                //            { text: '' },
                //            { text: '' },
                //            { text: '' }
                //        ]
                //    };
                //},
                content: [
                    {columns:[
                        [
                            {style: 'user_table5',
                                table:{
                                    headerRows: 1,
                                    widths: [52,100,100],
                                    body:
                                    [
                                        [{text: 'bill no: '+customerdata[0].newreceiptid, alignment: 'left'}, {text: 'estimate', alignment: 'center'}, {text: ''+curdate+' '+curtime, alignment: 'left'}],
                                    ]
                                },
                                layout: 'headerLineOnly'
                            },
                            {text: '\n'},

                            {text: customerdata[0].orgname+', '+ customerdata[0].district + '   ', style: 'user_table5_bold', alignment: 'right'},{text: 'old balance = '+ (customerdata[0].orgname.indexOf("cash") === -1 ? oldbalance :'')  + '   ', style: 'user_table5_bold', alignment: 'right'},

                            {text: '\n'},
                            {style: 'user_table5',
                                columnGap: 0,
                                table:{
                                    headerRows: 1,
                                    widths: [32,10,40,20,40,30,30,45], // 252 of 430 page width
                                    body: salesbillbody
                                },
                                layout: 'headerLineOnly'
                            },
                            {text: '\n'},
                            {style: 'user_table5',
                                table:{
                                    headerRows: 1,
                                    widths: [50,300],
                                    body: salessummarybody
                                },
                                layout: 'headerLineOnly'
                                //pageBreak: 'after'
                            },
                        ],
                    ]},
                ],
                footer: {
                    columns: [
                    { text: '' },
                    //{ text: 'get bills online @ www.premdeep.com' },
                    { text: '' },
                    { text: '' }
                ]
                    //columnGap: 5,           // optional space between columns
                    //style: 'user_not_bold2'
                },
                styles: {
                    header: {
                        fontSize: 10,
                        bold: false,
                        //margin: [5, 5, 2, 5],
                        height: 100
                    },
                    tableHeader2: {
                        bold: false,
                        fontSize: 10,
                        color: 'black'
                    },
                    user_table5:{
                        fontSize: 9,
                        bold: false,
                        margin: [0,5,0,0]
                    },
                    user_table5_bold:{
                        fontSize: 9,
                        bold: true,
                        margin: [0,0,20,0]
                    },
                    user_bold: {
                        color: 'black',
                        bold: true
                    }
                },
                pageSize: 'A5',
                //pageSize: {width:docpageWidth, height:docpagesize,orientation: 'portrait'},
                pageMargins: [45, 5, 0, 0],
                defaultStyle: {
                    font: 'Arial'
                }
            };
            createPdfBinary(docDefinition, function(binary) {
                //console.log('bill print')
                res.contentType('application/pdf');
                res.send(binary);
            }, function(error) {
                res.send('ERROR:' + error);
            });
        },
    ]);
};

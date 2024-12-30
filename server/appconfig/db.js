//<copyright file="db.js" company="CronyCo">
// Copyright (c) 2014 All Right Reserved, http://cronyco.in/
//
// This source is subject to the CronyCo Permissive License.
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// All other rights reserved.
//
// </copyright>
//
// <author>Santhosh Poothankurussi</author>
// <email>santhosh.poothankurussi@cronyco.in</email>
// <date>2014-06-22</date>
// <summary>Contains Javascript methods for Configuring Database</summary>

var mysql = require('mysql');
var express = require('express');
var cryptojs=require('../utilities/cryptography.js');
var app = express();
var env = app.get('env') == 'development' ? 'configuration' : app.get('env');

var db =  null;

// db config
var fs = require('fs');
var dbConfigFile = __dirname + '/appconfig.json';
var data = fs.readFileSync(dbConfigFile, 'utf8');
var dbConfig = JSON.parse(data)[env];
var decryptedPassword=cryptojs.DecryptString(dbConfig.password);
var decryptedUsername=cryptojs.DecryptString(dbConfig.user);



// Using MySQL CreatePool method
var Pool = mysql.createPool({
    host: dbConfig.host,
    user: decryptedUsername,
    password:decryptedPassword,
    database: dbConfig.database
});
exports.pool = Pool;

// Using MySQL CreateConnection method

//module.exports = {
//    connect: function ()
//    {
//        if(!db) {
//            console.log('inside create connection');
//            console.log(dbConfig.host.toString() + " " + dbConfig.user.toString() +"" +dbConfig.password.toString() +""+dbConfig.database.toString() );
//            db = mysql.createConnection({
//                host: dbConfig.host,
//                user: dbConfig.user,
//                password: dbConfig.password,
//                database: dbConfig.database
//            });
//        }
//        return db;
//    },
//
//    end: function()
//    {
//        db.end(function(err)
//        {
//            if(!err){
//                console.log("Mysql connection is terminated.")
//            }
//            else{
//                throw err;
//            }
//        })
//    }
//}



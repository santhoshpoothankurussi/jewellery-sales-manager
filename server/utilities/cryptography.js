// <copyright file="Cryptography.js" company="CronyCo">
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
// <summary>Contains Javascript methods for Encryption & Decryption </summary>

var logger=require('../utilities/logger.js');
exports.EncryptString=function(normalText){
    var crypto=require('crypto');
    var algorithm='aes256';  //or any other algorithm .
    var key='JeWARSessionID';
    var cipher=crypto.createCipher(algorithm,key);
    var encryptedText=cipher.update(normalText,'utf8','binary')+cipher.final('binary');
    encryptedText=new Buffer(encryptedText,'binary').toString('base64');
    logger.log("data","Encrypted Text:"+encryptedText,0,"EncryptString");
    return encryptedText;

};

exports.DecryptString=function(encryptedText){
    var crypto=require('crypto');
    var algorithm='aes256';  //or any other algorithm .
    var key='JeWARSessionID';
    var decipher=crypto.createDecipher(algorithm,key);
    encryptedText=new Buffer(encryptedText,'base64').toString('binary');
    var decryptedText=decipher.update(encryptedText,'binary')+decipher.final('binary');
    decryptedText=new Buffer(decryptedText,'binary').toString('utf8');
//    logger.log("data","Decrypted Text:"+decryptedText,0,"DecryptString");
    return decryptedText;
};

exports.EncryptStringToHex=function(normalText)
{
    var crypto=require('crypto');
    var algorithm='aes256';  //or any other algorithm .
    var key='JeWARSessionID';
    var cipher=crypto.createCipher(algorithm,key);
    var encryptedText=cipher.update(normalText,'utf8','binary')+cipher.final('binary');
    encryptedText=new Buffer(encryptedText,'binary').toString('hex');
//    logger.log("data","Encrypted Text:"+encryptedText,0,"EncryptString");
    return encryptedText;

};

exports.DecryptHexToString=function(encryptedText)
{
    var crypto=require('crypto');
    var algorithm='aes256';  //or any other algorithm .
    var key='JeWARSessionID';
    var decipher=crypto.createDecipher(algorithm,key);
    encryptedText=new Buffer(encryptedText,'hex').toString('binary');
    var decryptedText=decipher.update(encryptedText,'binary')+decipher.final('binary');
    decryptedText=new Buffer(decryptedText,'binary').toString('utf8');
    logger.log("data","Decrypted Text:"+decryptedText,0,"DecryptString");
    return decryptedText;
};

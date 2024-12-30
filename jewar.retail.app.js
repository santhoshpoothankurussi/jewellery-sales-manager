var express = require('express')
    , http = require('http')
    , db = require('./server/appconfig/db.js')
    , session = require('express-session')
    , SessionStore = require('express-mysql-session')
    , bodyParser     = require('body-parser')
    , config = require('./server/appconfig/appconfig.json')
    , cryptojs=require('./server/utilities/cryptography.js')
    , fs = require('fs')
    , path = require('path')
    , errorHandler = require('errorhandler')
    , methodOverride = require('method-override')
    , cookieParser = require('cookie-parser')
    , enrollrate = require('./server/modules/enroll.js')
;

var minify =require('./server/utilities/minify');
var app = exports.app = express();
appBoardRate=0;
appRate995=0;
var env = app.get('env') == 'development' ? 'configuration' : app.get('env');  //var env = process.env.NODE_ENV || 'development';

var dbConfigFile = __dirname + '/server/appconfig/appconfig.json';
var data = fs.readFileSync(dbConfigFile, 'utf8');
var dbConfig = JSON.parse(data)[env];
var portno=dbConfig.portno;

app.use(express.static(path.join(__dirname, 'client')));
app.set('port', process.env.PORT || portno);
app.use(errorHandler());
app.use(bodyParser({limit:'1000mb'})); 		// pull information from html in POST
app.use(methodOverride());  // simulate DELETE and PUT
app.use(express.json());

//var encrypteduserid=cryptojs.EncryptString('MCFwrgqTn8tniXoIL1ddiQ==');
//console.log(encrypteduserid);
var dc= cryptojs.DecryptString('8oMASr/Cc42GLHyPFRfrkQ==');
console.log(dc);

// MySQL sessions Store   - START
var decryptedPassword=cryptojs.DecryptString(dbConfig.password);
var decryptedUsername=cryptojs.DecryptString(dbConfig.user);
var options = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: decryptedUsername,
    password: decryptedPassword,
    database: dbConfig.database,
    debug: false,// Whether or not to output debug messages to the console.
    checkExpirationInterval: 90000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    autoReconnect: true,// Whether or not to re-establish a database connection after a disconnect.
    reconnectDelay: 200,// Time between reconnection attempts; milliseconds
    maxReconnectAttempts: 25// Maximum number of reconnection attempts. Set to 0 for unlimited.
};

app.use(cookieParser());
app.use(session({
    key: 'robskey',
    secret: 'robskey',
    store: new SessionStore(options)
    // store: new SessionStore(config[env])
}));
// MySQL sessions Store   - END

app.use(app.router);
require('./server/handler/routes')(app);

app.post('/setmetalrate',function(req,res,next){
    console.log('rate change post detected!');
    enrollrate.setrate(req,res);
    io.emit('ratechange', {content: 'metal rate changed!', importance: '1'});
});


// PDF Print - START

//var _ = require('lodash');  // for pdfmake
//var pdfMakePrinter = require('./server/utilities/printer.js');
//
//function createPdfBinary(pdfDoc, callback) {
//    var fontDescriptors = {
//        Roboto: {
//            normal: 'client/fonts/Roboto-Regular.ttf',
//            bold: 'client/fonts/Roboto-Medium.ttf',
//            italics: 'client/fonts/Roboto-Italic.ttf',
//            bolditalics: 'client/fonts/Roboto-Italic.ttf'
//        }
//    };
//
//    var printer = new pdfMakePrinter(fontDescriptors);
//    var doc = printer.createPdfKitDocument(pdfDoc);
//    var chunks = [];
//    var result;
//
//    doc.on('data', function (chunk) {
//        chunks.push(chunk);
//    });
//    doc.on('end', function () {
//        result = Buffer.concat(chunks);
//        callback('data:application/pdf;base64,' + result.toString('base64'));
//    });
//    doc.end();
//}
//app.post('/pdf', function (req, res) {
//    createPdfBinary(req.body, function(binary) {
//        res.contentType('application/pdf');
//        res.send(binary);
//    }, function(error) {
//        res.send('ERROR:' + error);
//    });
//
//});

// PDF Print - END

app.all('/*',function(req,res,next){
    res.sendfile('client/index.html',{route: __dirname});
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

// socket connection to update clients about rate
// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    //console.log('A client is connected!');
    socket.emit('notify', 'You are connected!');

    // When the server receives a “message” type signal from the client
    //socket.on('message', function (message) {
    //    console.log('A client is speaking to me! They’re saying: ' + message);
    //});
    //https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time
});


winston = require('../../node_modules/winston-master/lib/winston');


var prevDirName=__dirname;
prevDirName=prevDirName.substring(0,prevDirName.lastIndexOf('utilities'));
var dbConfigFile = prevDirName + 'appconfig/appconfig.json';
fs = require('fs');
var env='configuration';
var data = fs.readFileSync(dbConfigFile, 'utf8');
var dbConfig = JSON.parse(data)[env];
var loggeroptions=dbConfig.logger;
//var loggeroptions='on'

//console.log('logger status : '+loggeroptions);

var logger_config = {
    levels: {
        silly: 0,
        verbose: 1,
        info: 2,
        data: 3,
        warn: 4,
        debug: 5,
        error: 6
    },
    colors: {
        silly: 'magenta',
        verbose: 'cyan',
        info: 'green',
        data: 'grey',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    }
};

var Logger =  new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.File)
        ({
            filename: 'jewar.log',
//            handleExceptions: true ,
            colorize: true,
            timestamp:true,
            json: true

        })
    ],
    exitOnError: false,
    levels: logger_config.levels,
    colors: logger_config.colors
});
exports.logger = Logger;   // exports the logger instance.. can be used to log directly without using below function from other rest API.
exports.log=function(logType,msg,sessionID,method)    //function to log
{
    try
    {
        var msg=JSON.parse(msg);
    }
    catch(e)  {  }
  if(loggeroptions=='on'){

      switch(logType)
      {
          case 'data':
              Logger.data(msg,{ sessionID: sessionID , method:method});
              break;
          case 'error':
              Logger.error(msg,{ sessionID: sessionID , method:method});
              break;
          case 'warn':
              Logger.warn(msg,{ sessionID: sessionID , method:method});
              break;
          case 'info':
              Logger.info(msg,{ sessionID: sessionID , method:method});
              break;
          case 'debug':
              Logger.debug(msg,{ sessionID: sessionID , method:method});
              break;
          case 'verbose':
              Logger.verbose(msg,{ sessionID: sessionID , method:method});
              break;
          case 'silly':
              Logger.silly(msg,{ sessionID: sessionID , method:method});
              break;
          default :
              Logger.error(msg,{ sessionID: sessionID , method:method});
              break;
      }

  }
  else if(loggeroptions=='off'){

  }
  else
  {
      switch(loggeroptions)
      {
          case logType:
              Logger[logType](msg,{ sessionID: sessionID , method:method});
              break;
          default :
              break;
      }


  }


}





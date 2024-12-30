var fs = require('fs');
var compressor = require('./../../node_modules/node-minify/lib/node-minify');

var project_root = __dirname.substring(0,__dirname.length-('server\\utilities').length);

var jsPath=project_root+'/client/scripts/controllers/',
    jsMinPath=project_root+'/client/scripts/min/';


var minPath=[jsMinPath+'jservice.min1.js',jsMinPath+'jservice.min.js',jsMinPath+'jcontroller.min1.js',jsMinPath+'jcontroller.min.js'];

minPath.forEach(function(row){
    if(fs.existsSync(row)){
        fs.unlinkSync(row);
        console.log('file deleted '+row);
    }
});

var jsFiles=[
    jsPath+'commonfunction.js',
    jsPath+'logincontroller.js',
    jsPath+'enrollmentcontroller.js',
    jsPath+'modalcontroller.js',
    jsPath+'reportcontroller.js',
    jsPath+'servicecontroller.js'
];

new compressor.minify({
    type: 'no-compress',
    fileIn: jsFiles,
    fileOut: jsMinPath+'jcontroller.min1.js',
    callback: function(err, min){
        if (err) console.log(err); else{console.log("Controllers Minified")
            new compressor.minify({
                type: 'uglifyjs',
                fileIn: jsMinPath+'jcontroller.min1.js',
                fileOut: jsMinPath+'jcontroller.min.js',
                callback: function(err, min){
                    if (err) console.log(err); else console.log("Controllers Minified");
                    fs.unlinkSync(jsMinPath+'jcontroller.min1.js');
                }
            });
        };
    }
});
jsPath=project_root+'/client/scripts/services/';

var jsFiles1=[
    jsPath+'loginService.js',
    jsPath+'enrollmentservice.js',
    jsPath+'servicesservice.js',
    jsPath+'reportservice.js',
    jsPath+'printservice.js'

];
new compressor.minify({
    type: 'no-compress',
    fileIn: jsFiles1,
    fileOut: jsMinPath+'jservice.min1.js',
    callback: function(err, min){
        if (err) console.log(err); else {
            console.log("Services Minified");
            new compressor.minify({
                type: 'uglifyjs',
                fileIn: jsMinPath + 'jservice.min1.js',
                fileOut: jsMinPath + 'jservice.min.js',
                callback: function (err, min) {
                    if (err) console.log(err); else console.log("Services Minified");
                    fs.unlinkSync(jsMinPath+'jservice.min1.js');
                }
            });
        }
        }
});



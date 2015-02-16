'use strict';

var gutil       = require('gulp-util'),
    map         = require('map-stream'),
    Helpers     = require('./helpers')(gutil),

    PLUGIN_NAME = 'gulp-angular-architecture-graph';

var gulpAngularGraph = function(options) {
    options = options || {};

    gutil.log('arguments: ', arguments);

    // 1. Parse Files
    //var parsedFiles = Helpers.parseSrcFiles(f);

    // 2. Get codebase graph using angular-architecture graph
    //var codebaseArchitecture = Helpers.analyseFiles(parsedFiles, options);

    // 3. Generate .dot files
    //Helpers.generateGraphFiles(codebaseArchitecture, f);

    // 4. Generate diagram files
    //Helpers.renderDotFiles(f);

    return map(function(file, cb) {
        
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        var parsedFile = Helpers.parseSrcFile(file);
        
        gutil.log('parsedFile: ', parsedFile);
        
        cb(null, file);
    });
}


module.exports = gulpAngularGraph;

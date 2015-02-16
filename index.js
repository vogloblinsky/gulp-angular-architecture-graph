'use strict';

var through     = require('through2'),
    gutil       = require('gulp-util'),
    map         = require('map-stream'),
    Helpers     = require('./helpers')(gutil),
    _           = require('lodash'),

    PLUGIN_NAME = 'gulp-angular-architecture-graph';

var gulpAngularGraph = function(options) {
    var _options = {
        hideAngularServices: true,
        shapeModules: 'component',
        shapeFactories: 'ellipse',
        shapeDirectives: 'cds',
        colorScheme: 'paired12'
    };

    _.merge(_options, options);

    gutil.log('arguments: ', arguments, _options);

    // 1. Parse Files
    //var parsedFiles = Helpers.parseSrcFiles(f);

    // 2. Get codebase graph using angular-architecture graph
    //var codebaseArchitecture = Helpers.analyseFiles(parsedFiles, options);

    // 3. Generate .dot files
    //Helpers.generateGraphFiles(codebaseArchitecture, f);

    // 4. Generate diagram files
    //Helpers.renderDotFiles(f);
    
    var _files = [];

    Helpers.preprocessTemplates(_options);

    return through.obj(function (file, enc, cb) {
        _files.push(Helpers.parseSrcFile(file));
        cb();
    }, function (cb) {
        var codebaseArchitecture = Helpers.analyseFiles(_files, _options);

        Helpers.generateGraphFiles(codebaseArchitecture, _options);

        cb();
    });
}


module.exports = gulpAngularGraph;

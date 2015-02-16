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

    var _files = [];

    Helpers.preprocessTemplates(_options);

    return through.obj(function (file, enc, cb) {
        _files.push(Helpers.parseSrcFile(file));
        cb();
    }, function (cb) {
        var codebaseArchitecture = Helpers.analyseFiles(_files, _options);

        Helpers.generateGraphFiles(codebaseArchitecture, _options);

        Helpers.renderDotFiles(_files, _options);

        cb();
    });
}


module.exports = gulpAngularGraph;

'use strict';

var architectureGraph = require('angular-architecture-graph'),
    dot               = require('dot'),
    os                = require('os'),
    path              = require('path'),
    fs                = require('fs-extra'),
    Q                 = require('q'),
    file              = require('file'),
    process           = require('child_process');

dot.templateSettings.strip = false;

module.exports = function(gutil) {

    var basePath = 'node_modules/gulp-angular-architecture-graph/';

    if (!fs.existsSync(basePath)) {
        basePath = '';
    }

    var templateFiles = {
        legend:  '',
        all:     '',
        modules: '',
        module:  ''
    },

    readFile = function(file) {
        var deferred = Q.defer();
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    },

    writeToFile = function(filename, data) {
        var deferred = Q.defer();
        fs.outputFile(filename, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    },

    readTemplateFiles = function() {
        return Q.all([
            readFile(basePath + 'templates/legend.def'),
            readFile(basePath + 'templates/all.def'),
            readFile(basePath + 'templates/modules.def'),
            readFile(basePath + 'templates/module.def')
        ]);
    },

    cleanPath = function(pathParam) {
        return (os.platform() === 'win32' || os.platform() === 'win64') ? pathParam.replace('/', '\\') : pathParam;
    },

    templates = {
        legendTemplate:  {},
        allTemplate:     {},
        modulesTemplate: {},
        moduleTemplate:  {}
    },

    preprocessTemplates = function(options) {
        var deferred = Q.defer();
        readTemplateFiles().then(function(datas) {

            templateFiles.legend = datas[0];
            templateFiles.all = datas[1];
            templateFiles.modules = datas[2];
            templateFiles.module = datas[3];

            // Replace placeholders.
            [
                'legend',
                'all',
                'modules',
                'module'
            ].forEach(function(file) {
                templateFiles[file] = templateFiles[file]
                              .replace(/\{1\}/g, options.shapeModules)
                              .replace(/\{2\}/g, options.shapeFactories)
                              .replace(/\{3\}/g, options.shapeDirectives)
                              .replace(/\{4\}/g, options.shapeComponents)
                              .replace(/\{5\}/g, options.shapeFilters)
                              .replace(/\{scheme\}/g, options.colorScheme);
            });

            // Prime the templates object.
            templates.legendTemplate  = dot.template(templateFiles.legend);
            templates.allTemplate     = dot.template(templateFiles.all);
            templates.modulesTemplate = dot.template(templateFiles.modules);
            templates.moduleTemplate  = dot.template(templateFiles.module);

            deferred.resolve();
        });
        return deferred.promise;
    },

    preprocessOutputDirs = function(options) {
        var deferred = Q.defer();
        fs.mkdirs(options.dest, function() {
            fs.mkdir(options.dest + '/dot', function() {
                fs.mkdir(options.dest + '/png', function() {
                    fs.mkdir(options.dest + '/png/modules', function() {
                        deferred.resolve();
                    });
                });
            });
        });
        return deferred.promise;
    },

    parseSrcFile = function(file) {
        return {
            id: path.basename(file.path),
            text: file.contents.toString('utf8')
        };
    },

    analyseFiles = function(file, options) {
        var graph = architectureGraph(file, options),
            i = 0,
            _tmp = graph.angular.modules,
            len = _tmp.length;
        if (!Array.prototype.remove) {
            Array.prototype.remove = function(vals, all) {
                var i, removedItems = [];
                if (!Array.isArray(vals)) vals = [vals];
                for (var j = 0; j < vals.length; j++) {
                    if (all) {
                        for (i = this.length; i--;) {
                            if (this[i] === vals[j]) removedItems.push(this.splice(i, 1));
                        }
                    } else {
                        i = this.indexOf(vals[j]);
                        if (i > -1) removedItems.push(this.splice(i, 1));
                    }
                }
                return removedItems;
            };
        }

        if (options.filterModulesPrefixes.length > 0) {
            for (i; i < len; i++) {
                var j = 0,
                    leng = _tmp[i].modules.length,
                    name = '',
                    prefixesToRemove = [];
                for (j; j < leng; j++) {
                    name = _tmp[i].modules[j];
                    var k = 0,
                        lengt = options.filterModulesPrefixes.length;
                    for (k; k < lengt; k++) {
                        if (name.indexOf(options.filterModulesPrefixes[k]) === 0) {
                            prefixesToRemove.push(name);
                        }
                    }
                }
                if (prefixesToRemove.length > 0) {
                    _tmp[i].modules.remove(prefixesToRemove, true);
                }
            }

        }

        return graph.angular;
    },

    generateGraphFiles = function(angular, config) {
        var deferred = Q.defer();
        generateLegendGraph(config);
        generateAllGraph(angular, config);
        generateModulesGraph(angular, config);
        angular.modules.forEach(function(module) {
            generateModuleGraph(module, config);
        });
        deferred.resolve();
        return deferred.promise;
    },

    /**
     * Graphical functions
     */

    generateLegendGraph = function(config) {
        var legendResult = templates.legendTemplate();
        writeToFile(config.dest + '/dot/legend.dot', legendResult);
    },

    generateAllGraph = function(angular, config) {
        var allResult = templates.allTemplate({
            modules: angular.modules
        });
        writeToFile(config.dest + '/dot/all.dot', allResult);
    },

    generateModulesGraph = function(angular, config) {
        var modulesResult = templates.modulesTemplate({
            modules: angular.modules
        });
        writeToFile(config.dest + '/dot/modules.dot', modulesResult);
    },

    generateModuleGraph = function(module, config) {
        var moduleResult = templates.moduleTemplate(module);
        writeToFile(config.dest + '/dot/modules/' + module.name + '.dot', moduleResult);
    },

    renderDotFiles = function(files, config) {
        var deferred = Q.defer(),
        slash = (os.platform() === 'win32' || os.platform() === 'win64') ? '\\' : '/',
            dotsFolder = cleanPath(config.dest) + slash + 'dot',
            pngsFolder = cleanPath(config.dest) + slash + 'png';
        //Loop through all dot files generated, and generated a map 'dot':'png'
        file.walk(dotsFolder, function(ie, dirPath, dirs, files) {
            var i = 0,
                len = (files || []).length;

            //TODO : handle subdirectories

            for (i; i < len; i++) {
                var engine = 'dot';
                if (typeof config.largeGraph !== 'undefined' && config.largeGraph) {
                    engine = 'sfdp';
                }
                var finalName = files[i].replace(dotsFolder, pngsFolder).replace('.dot', '.png'),
                ls = process.spawn(engine, [
                    '-Tpng',
                    files[i],
                    '-o',
                    finalName,
                    '-Goverlap=false',
                    '-Gsplines=true'
                ]);

                ls.stdout.on('data', function(data) {
                    console.log('stdout: ' + data);
                });

                ls.stderr.on('data', function(data) {
                    console.log('stderr: ' + data);
                });

                ls.on('close', function(code) {
                    //Done
                });
            }

            deferred.resolve();
        });

        return deferred.promise;
    };

    return {
        preprocessTemplates: preprocessTemplates,
        preprocessOutputDirs: preprocessOutputDirs,
        parseSrcFile: parseSrcFile,
        analyseFiles: analyseFiles,
        generateGraphFiles: generateGraphFiles,
        renderDotFiles: renderDotFiles
    };
};

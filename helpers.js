'use strict';

var architectureGraph = require('angular-architecture-graph'),
	dot               = require('dot'),
	path 			  = require('path'),
	fs 				  = require('fs-extra'),
	Q 				  = require('q'),
	graphviz 		  = require('graphviz'),
	file 			  = require('file'),
	process		      = require('child_process');

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
	};

	var readFile = function(file) {
		var deferred = Q.defer();
		fs.readFile(file, 'utf8', function (err, data) {
		  	if (err) {
		  		deferred.reject(err);
		  	}
		  	deferred.resolve(data);
		});
		return deferred.promise;
	};

	var writeToFile = function(filename, data) {
        var deferred = Q.defer();
        fs.outputFile(filename, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('JSON ' + filename + ' saved');
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

	var readTemplateFiles = function() {
		return Q.all([
			readFile(basePath + 'templates/legend.def'),
			readFile(basePath + 'templates/all.def'),
			readFile(basePath + 'templates/modules.def'),
			readFile(basePath + 'templates/module.def')
		]);
	};

	var templates = {
	    legendTemplate:  {},
	    allTemplate:     {},
	    modulesTemplate: {},
	    moduleTemplate:  {}
  	};

  	var preprocessTemplates = function(options) {
  		console.log('preprocessTemplates');
  		readTemplateFiles().then(function(datas) {
  			console.log('All templates processed');

  			templateFiles['legend'] = datas[0];
  			templateFiles['all'] = datas[1];
  			templateFiles['modules'] = datas[2];
  			templateFiles['module'] = datas[3];

  			// Replace placeholders.
		    [
		    	'legend',
		    	'all',
		    	'modules',
		    	'module'
		    ].forEach(function (file) {
		    	templateFiles[file] = templateFiles[file]
		                      .replace(/\{1\}/g, options.shapeModules)
		                      .replace(/\{2\}/g, options.shapeFactories)
		                      .replace(/\{3\}/g, options.shapeDirectives)
		                      .replace(/\{scheme\}/g, options.colorScheme);
		    });

		    // Prime the templates object.
		    templates.legendTemplate  = dot.template(templateFiles.legend);
		    templates.allTemplate     = dot.template(templateFiles.all);
		    templates.modulesTemplate = dot.template(templateFiles.modules);
		    templates.moduleTemplate  = dot.template(templateFiles.module);
  		});
	}

	var parseSrcFile = function(file) {
	    return {
        	id: path.basename(file.path),
        	text: file.contents.toString('utf8')
    	};
	};

	var analyseFiles = function(file, options) {
		var graph = architectureGraph(file, options);
    	return graph.angular;
	};

	var generateGraphFiles = function(angular, config) {
		generateLegendGraph(config);
		generateAllGraph(angular, config);
		generateModulesGraph(angular, config);
    	angular.modules.forEach(function (module) {
      		generateModuleGraph(module, config);
    	});
		return angular;
	};

	/**
	 * Graphical functions
	 */
	
	var generateLegendGraph = function(config) {
		var legendResult = templates.legendTemplate();
		writeToFile(config.dest + '/dot/legend.dot', legendResult);
	};

	var generateAllGraph = function(angular, config) {
		var allResult = templates.allTemplate({
      		modules: angular.modules
    	});
    	writeToFile(config.dest + '/dot/all.dot', allResult);
	};

	var generateModulesGraph = function(angular, config) {
		var modulesResult = templates.modulesTemplate({
        	modules: angular.modules
    	});
    	writeToFile(config.dest + '/dot/modules.dot', modulesResult);
	};

	var generateModuleGraph = function(module, config) {
		var moduleResult = templates.moduleTemplate(module);
		writeToFile(config.dest + '/dot/modules/' + module.name + '.dot', moduleResult);
	};

	var renderDotFiles = function(files, config) {
		//Loop through all dot files generated, and generated a map 'dot':'png'
		file.walk(config.dest, function(ie, dirPath, dirs, files) {
			fs.mkdir(config.dest + '/png');

			var i = 0,
				len = files.length;

			//TODO : handle subdirectories

			for(i; i < len; i++) {
				var ls = process.spawn('dot', [
                    '-Tpng',
                    files[i],
                    '-o',
                    config.dest + '/png/' + files[i].replace(dirPath + '/', '').replace('.dot', '') + '.png' 
                ]);
	
				ls.stdout.on('data', function (data) {
				  console.log('stdout: ' + data);
				});
				
				ls.stderr.on('data', function (data) {
				  console.log('stderr: ' + data);
				});
				
				ls.on('close', function (code) {
				  console.log('child process exited with code ' + code);
				});
			}
		})
	};

	return {
		preprocessTemplates : preprocessTemplates,
    	parseSrcFile 		: parseSrcFile,
    	analyseFiles 		: analyseFiles,
    	generateGraphFiles	: generateGraphFiles,
    	renderDotFiles		: renderDotFiles
  	};
	
};

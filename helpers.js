'use strict';

var architectureGraph = require('angular-architecture-graph'),
	dot               = require('dot'),
	path 			  = require('path');

dot.templateSettings.strip = false;

module.exports = function(gutil) {

	var parseSrcFile = function(file) {
	    return {
        	id: path.basename(file.path),
        	text: file.contents.toString('utf8',0,5)
    	};
	};

	var analyseFile = function(file, options) {
		var graph = architectureGraph(file, options);
    	return graph.angular;
	};

	return {
    	parseSrcFile : parseSrcFile,
    	analyseFile  : analyseFile
  	};
	
};

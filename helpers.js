'use strict';

var architectureGraph = require('angular-architecture-graph'),
	dot               = require('dot'),
	path 			  = require('path');

dot.templateSettings.strip = false;

module.exports = function(gutil) {

	function parseSrcFile(file) {
	    return {
        	id: path.basename(file.path),
        	text: file.contents.toString('utf8',0,5)
    	};
	}

	return {
    	parseSrcFile : parseSrcFile
  	};
	
};

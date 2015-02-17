define([
    'intern/chai!expect',
    'intern!bdd',
    'intern/dojo/node!../index.js',
    'intern/dojo/node!path',
    'intern/dojo/node!gulp'
], function(expect, bdd, ngArchitectureGraph, path, gulp) {

    bdd.describe('ngArchitectureGraph plugin', function() {

        var stream = ngArchitectureGraph();

        //console.log(stream);

        bdd.it('should do the job', function() {
            expect(1).to.equal(1);
        });

    });
});

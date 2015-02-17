define([
    'intern/chai!expect',
    'intern!bdd',
    'intern/dojo/node!../index.js'
], function(expect, bdd, ngArchitectureGraph) {

    bdd.describe('ngArchitectureGraph plugin', function() {

        bdd.it('should do the job', function() {
            expect(1).to.equal(1);
        });

    });
});

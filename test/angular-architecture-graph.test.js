define([
    'intern/chai!expect',
    'intern!bdd',
    'intern/dojo/node!../index.js',
    'intern/dojo/node!path',
    'intern/dojo/node!fs'
], function(expect, bdd, ngArchitectureGraph, path, fs) {

    var compareFiles            = true,
        expectedResultFile      = 'test/expected/ui.router.dot',
        expectedResultFileData  = null,
        testResultFile          = 'tmp/dot/modules/ui.router.dot',
        testResultFileData      = null;

    bdd.describe('ngArchitectureGraph plugin', function() {

        fs.readFile(expectedResultFile, 'utf8', function (err, dataExpected) {
            if (err) {
                compareFiles = false;
            }
            expectedResultFileData = dataExpected;
            fs.readFile(testResultFile, 'utf8', function (err, dataTest) {
                if (err) {
                    compareFiles = false;
                }
                testResultFileData = dataTest;
                compareFiles = (expectedResultFileData === testResultFileData);
            });
        });

        bdd.it('should do the job', function() {
            expect(compareFiles).to.be.true;
        });

    });
});

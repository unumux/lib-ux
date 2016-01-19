var should = require('should');
var path = require("path");

var ux = require('../dist/index.js');

var fixtures = path.join(__dirname, "fixtures");


describe('getFolders', function() {
    it('return all folders except excluded', function () {
        ux.getFolders(path.join(fixtures, "getFolders"), [], ['node_modules']).should.eql([".", "js", "scss", "subfolder", "views"]);
        ux.getFolders(path.join(fixtures, "getFolders"), [], ['node_modules', 'subfolder']).should.eql([".", "js", "scss", "views"]);
        ux.getFolders(path.join(fixtures, "getFolders"), [], []).should.eql([".", "js", "node_modules", "scss", "subfolder", "views"]);
    });

    it('should return an empty array if all folders are ignored', function() {
        ux.getFolders(path.join(fixtures, "getFolders"), [], [".", "node_modules", "js", "scss", "subfolder", "views"]).should.eql([]);
    });

    it('return all folders containing a specified extension', function () {
        ux.getFolders(path.join(fixtures, "getFolders"), ["scss"], ['node_modules']).should.eql([".", "scss", "subfolder"]);
        ux.getFolders(path.join(fixtures, "getFolders"), ["js"], ['node_modules']).should.eql(["js"]);
        ux.getFolders(path.join(fixtures, "getFolders"), ["html"], ['node_modules']).should.eql(["views"]);
        ux.getFolders(path.join(fixtures, "getFolders"), ["invalid"], ['node_modules']).should.eql([]);
    });

    it('return all folders containing multiple extensions', function () {
        ux.getFolders(path.join(fixtures, "getFolders"), ["scss", "js"], ['node_modules']).should.eql([".", "js", "scss", "subfolder"]);
    });
});

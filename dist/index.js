"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shouldInstallBowerPackages = exports.shouldInstallNPMPackages = exports.shouldInstallPackages = undefined;
exports.getFolders = getFolders;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _semver = require("semver");

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

// import "babel-polyfill";

var DEFAULT_IGNORE_FOLDERS = ["node_modules", "bower_components"];

var NM_PATH = _path2.default.join(".", "node_modules");
var BOWER_PATH = _path2.default.join(".", "bower_components");

function getFolders(dir) {
    var extensions = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var ignoreFolders = arguments.length <= 2 || arguments[2] === undefined ? DEFAULT_IGNORE_FOLDERS : arguments[2];

    var basePath = _path2.default.resolve(dir);
    var dirContents = _fs2.default.readdirSync(basePath).filter(function (aDir) {
        return ignoreFolders.indexOf(aDir) < 0 && _fs2.default.statSync(_path2.default.join(basePath, aDir)).isDirectory();
    });

    var fileGlob = extensions.length > 0 ? "*.{," + extensions.join(",") + "}" : "*";
    var globString = "{{" + dirContents.join(",") + "}/**/" + fileGlob + "," + (ignoreFolders.indexOf(".") >= 0 ? "" : fileGlob) + "}";
    var results = _glob2.default.sync(globString, { cwd: basePath }).map(function (folder) {
        return _path2.default.dirname(_path2.default.join(".", folder)).split(_path2.default.sep)[0];
    });
    return _lodash2.default.uniq(results);
}

var checkDependency = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(version, name, packagePath, manifestName) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt("return", new Promise(function (resolve, reject) {
                            _fs2.default.readFile(_path2.default.join(packagePath, name, manifestName), function (err, data) {
                                if (!data) {
                                    resolve(false);
                                } else {
                                    var jsonData = JSON.parse(data);
                                    if (jsonData && jsonData.version) {
                                        resolve(_semver2.default.satisfies(jsonData.version, version));
                                    } else {
                                        resolve(false);
                                    }
                                }
                            });
                        }));

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function checkDependency(_x3, _x4, _x5, _x6) {
        return ref.apply(this, arguments);
    };
}();

var shouldInstallPackages = exports.shouldInstallPackages = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(packagePath, dependencies, manifestName) {
        var depPromises, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        depPromises = _lodash2.default.map(dependencies, function (version, name) {
                            var parsedVersion = version.split("#");
                            return checkDependency(parsedVersion[parsedVersion.length - 1], name, packagePath, manifestName);
                        });
                        _context2.next = 3;
                        return Promise.all(depPromises);

                    case 3:
                        res = _context2.sent;
                        return _context2.abrupt("return", res.reduce(function (prev, curr) {
                            return prev || !curr;
                        }, false));

                    case 5:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function shouldInstallPackages(_x7, _x8, _x9) {
        return ref.apply(this, arguments);
    };
}();

var shouldInstallNPMPackages = exports.shouldInstallNPMPackages = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var packageJson, dependencies;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        packageJson = JSON.parse(_fs2.default.readFileSync("./package.json"));
                        dependencies = _lodash2.default.merge(packageJson.devDependencies, packageJson.dependencies);
                        return _context3.abrupt("return", shouldInstallPackages(NM_PATH, dependencies, "package.json"));

                    case 3:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function shouldInstallNPMPackages() {
        return ref.apply(this, arguments);
    };
}();

var shouldInstallBowerPackages = exports.shouldInstallBowerPackages = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var bowerJson;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        bowerJson = JSON.parse(_fs2.default.readFileSync("./bower.json"));
                        return _context4.abrupt("return", shouldInstallPackages(BOWER_PATH, bowerJson.dependencies, "bower.json"));

                    case 2:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function shouldInstallBowerPackages() {
        return ref.apply(this, arguments);
    };
}();
import fs from "fs";
import path from "path";
import crypto from "crypto";

import _ from "lodash";
import glob from "glob";
import semver from "semver";

// import "babel-polyfill";


const DEFAULT_IGNORE_FOLDERS = [
    "node_modules",
    "bower_components"
];

const NM_PATH = path.join(".", "node_modules");
const BOWER_PATH = path.join(".", "bower_components");


export function getFolders(dir, extensions = [], ignoreFolders = DEFAULT_IGNORE_FOLDERS) {
    const basePath = path.resolve(dir);
    const dirContents = fs.readdirSync(basePath).filter(function(aDir) {
        return ignoreFolders.indexOf(aDir) < 0 && fs.statSync(path.join(basePath, aDir)).isDirectory();
    });

    const fileGlob = extensions.length > 0 ? `*.{,${extensions.join(",")}}` : "*";
    const globString = `{{${dirContents.join(",")}}/**/${fileGlob},${ignoreFolders.indexOf(".") >= 0 ? "" : fileGlob }}`
    const results = glob.sync(globString, {cwd: basePath}).map(function(folder) {
        return path.dirname(path.join(".", folder)).split(path.sep)[0];
    });
    return _.uniq(results);
}

async function checkDependency(version, name, packagePath, manifestName) {
    return new Promise(function(resolve, reject){
        fs.readFile(path.join(packagePath, name, manifestName), function(err, data) {
            if(!data) {
                resolve(false);
            } else {
                let jsonData = JSON.parse(data);
                if(jsonData && jsonData.version) {
                    resolve(semver.satisfies(jsonData.version, version));
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export async function shouldInstallPackages(packagePath, dependencies, manifestName) {
    let depPromises = _.map(dependencies, function(version, name) {
        let parsedVersion = version.split("#");
        return checkDependency(parsedVersion[parsedVersion.length - 1], name, packagePath, manifestName);
    });

    let res = await Promise.all(depPromises);

    return res.reduce(function(prev, curr) {
        return prev || !curr;
    }, false);
}

export async function shouldInstallNPMPackages() {
    let packageJson = JSON.parse(fs.readFileSync("./package.json"));
    let dependencies = _.merge(packageJson.devDependencies, packageJson.dependencies);
    return shouldInstallPackages(NM_PATH, dependencies, "package.json");
}

export async function shouldInstallBowerPackages() {
    let bowerJson = JSON.parse(fs.readFileSync("./bower.json"));
    return shouldInstallPackages(BOWER_PATH, bowerJson.dependencies, "bower.json");
}

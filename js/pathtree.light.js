const Fs = require("fs");
const Path = require("path");
const Util = require("util");


let processFile =  async function(path, relativeto, stat) {
    return {
        kind: "file",
        name: Path.basename(path),
        path: Path.relative(relativeto, path),
    }
}

let processDirectory =  async function(path, relativeto) {
    let files = await Util.promisify(Fs.readdir)(path);

    let tmp_files = []
    for (let i = 0; i < files.length; i++) {
        tmp_files.push(
            processPath(path + "/" + files[i], relativeto)
        );
    }

    let children = await Promise.all(tmp_files);
    return {
        kind: "dir",
        name: Path.basename(path),
        path: Path.relative(relativeto, path),
        children: children
    };
}

let processPath = async function(path, relativeto) {
    relativeto = relativeto || path

    let pthStat = await Util.promisify(Fs.stat)(path); // throws an error when 'path' does not exist

    if (pthStat.isFile()) {
        return processFile(path, relativeto, pthStat)
    }
    if (pthStat.isDirectory()) {
        return processDirectory(path, relativeto)
    }
}

//
exports.pathTree = processPath


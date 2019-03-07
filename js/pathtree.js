const Fs = require("fs");
const Path = require("path");
const Util = require("util");
//const Mime = require('mime-types')
const Mime = require('mime-type/with-db')
//
const detectFileFn = (() => {
    const Mmm = require("mmmagic");
    const magic = new Mmm.Magic(Mmm.MAGIC_MIME_TYPE );
    return Util.promisify(magic.detectFile.bind(magic));
})();


let processFile =  async function(path, relativeto, stat) {
    // get type
    let type = await detectFileFn(path)
    if ( type === undefined || type  === 'text/plain' ) {
        let tmpType = Mime.lookup(Path.extname(path))
        if ( tmpType !== undefined ) {
            type = tmpType
        }
    }

    return {
        kind: "file",
        path: Path.relative(relativeto, path),
        size: stat.size,
        type: type,
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
        path: Path.relative(relativeto, path),
        children: children
    };
}

let processPath = async function(path, relativeto) {
    let pthStat = await Util.promisify(Fs.stat)(path); // throws an error when 'path' does not exist

    if (pthStat.isFile()) {
        return processFile(path, relativeto, pthStat)
    }
    if (pthStat.isDirectory()) {
        return processDirectory(path, relativeto)
    }
}

let processPathWithCallbacks = function( path, relativeto, callback) {
     processPath.then((result) =>  callback(null, result),  error => callback(error));
}
//
exports.pathTreeCallback = processPathWithCallbacks
exports.pathTree = processPath


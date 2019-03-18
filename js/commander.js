const PathTree = require('./pathtree')
const Emitter = require('events').EventEmitter

module.exports = class extends Emitter {
    constructor(height, width) {
        super()
    }
    write(cmdText) {
        //
        let command = {}
        try {
            command = JSON.parse(cmdText)
        } catch (e) {
            console.error("error happened",e)
            return
        }
        //
        console.log("command recieved", command)

        //
        switch(command['type']) {
            case 'get-dir':
                this._cmd_getdir(command['dir'])
                break;
            default:
                console.error("unkown command type", command)
        }
    }


    _cmd_getdir(dir) {
        PathTree.pathTree(dir)
            .then( ( p ) => {
                this.emit('response',JSON.stringify(p))
            })
    }
};

const PathTree = require('./pathtree')
const Emitter = require('events').EventEmitter

module.exports.new = () => {
    let cmdEmitter = new Emitter()

    function recieve(cmdText) {
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
                cmd_getdir(command['dir'])
                break;
            default:
                console.error("unkown command type", command)
        }
    }


    function cmd_getdir(dir) {
        PathTree.pathTree(dir)
            .then( ( p ) => {
                cmdEmitter.emit('response',JSON.stringify(p))
            })
    }

    cmdEmitter.write = recieve
    return cmdEmitter
}

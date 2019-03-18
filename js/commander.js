const PathTree = require('./pathtree')
const Emitter = require('events').EventEmitter
const Fs = require('fs')
const watchlib = require('watch')

module.exports = class extends Emitter {
    constructor() {
        super()
        this.path = undefined
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
            //
            case 'init':
                this.path = this._cmd_init(command['path'],command['watch'],command['create'])
                break
            //
            case 'get-contents':
                this._cmd_get_contents()
                break;
            default:
                console.error("unkown command type", command)
        }
    }
    _cb_filecreated (f,stat) {
        console.log("file created :",f)
        this._cmd_get_contents()
    }
    _cb_fileremoved (f,stat) {
        console.log("file deleted :",f)
        this._cmd_get_contents()
    }
    _cb_filechanged (f,stat) {
        console.log("file changed :",f)
        //this._cmd_get_contents()
    }

    _cmd_get_contents() {
        PathTree.pathTree(this.path)
            .then( ( p ) => {
                this.emit('response',JSON.stringify({
                    type : 'contents',
                    contents : p
                }))
            })
    }
    _cmd_init(path,watch,isCreate) {
        if (isCreate) {
            try {
                Fs.accessSync(path, Fs.constants.R_OK);
            }
            catch (err) {
                Fs.mkdirSync(path, { recursive: true });
            }
        }

        if ( watch ) {
            //watchlib.watchTree(path,this._changes.bind(this))
            watchlib.createMonitor(path, (monitor) => {
                console.log(this._cb_filecreated)
                monitor.on("created", (f,s) => { this._cb_filecreated(f,s)})
                monitor.on("changed", (f,s) => { this._cb_filechanged(f,s)})
                monitor.on("removed", (f,s) => {this._cb_fileremoved(f,s)})
            })
        }
        //monitor.stop(); // Stop watching

        return path
    }
};

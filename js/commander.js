const PathTree = require('./pathtree')
const Emitter = require('events').EventEmitter
const Fs = require('fs')
const Path = require("path")
const watchlib = require('watch')




let Watchers = {}
module.exports = class extends Emitter {
    constructor() {
        super()
        this.path = undefined
        this.activeConnection = false
    } write(cmdText) {
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
            case 'get-file-tree':
                this._cmd_get_file_tree()
                break;
            case 'get-file-content':
                this._cmd_get_file_content(command['path'])
                break;
            default:
                console.error("unkown command type", command)
        }
    }
    _cb_filecreated (f,stat) {
        // the time out is to protect against many requests when alot of file change in an instant
        if ( this.activeConnection ) {
            return
        }
        this.activeConnection = true
        //
        setTimeout(()=> {
            this._cmd_get_file_tree()
            this.activeConnection = false
        }, 1000 )
    }
    _cb_fileremoved (f,stat) {
        if ( this.activeConnection ) {
            return
        }
        this.activeConnection = true
        //
        setTimeout(()=> {
            this._cmd_get_file_tree()
            this.activeConnection = false
        }, 1000 )
    }
    _cb_filechanged (f,stat) {
        console.log("file changed :",f)
        //
        this.emit("response", JSON.stringify({
            type : "file-changed",
            path : Path.relative(this.path,f),
        }))
    }

    _cmd_get_file_tree() {
        PathTree.pathTree(this.path)
            .then( ( p ) => {
                this.emit('response',JSON.stringify({
                    type : 'file-tree',
                    "file-tree" : p
                }))
            })
    }
    _cmd_get_file_content(filepath) {
        let filefullpath = this.path + "/" + filepath

        // TODO : check validity of filepath
        let stat = Fs.statSync(filefullpath)

        if ( stat.size > 5*1024*1024 ) {
            this.emit("response", JSON.stringify({
                type : "file-content",
                path : filepath,
                content : "Big File!"
            }))
            return
        }

        if ( ! stat.isFile()) {
            this.emit("response", JSON.stringify({
                type : "file-content",
                path : filepath,
                content : "Just a directory!"
            }))
            return
        }

        this.emit("response", JSON.stringify({
            type : "file-content",
            path : filepath,
            content : Fs.readFileSync(filefullpath, 'utf8')
        }))

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
            let oldWatcher = Watchers[path]
            if ( oldWatcher ) {
                console.log('old watcher found, and deleted')
                oldWatcher.stop()
            }

            watchlib.createMonitor(path, (monitor) => {
                Watchers[path] = monitor
                monitor.on("created", (f,s) => { this._cb_filecreated(f,s)})
                monitor.on("changed", (f,s) => { this._cb_filechanged(f,s)})
                monitor.on("removed", (f,s) => {this._cb_fileremoved(f,s)})
            })
        }

        return path
    }
};

const FileViewer = require('./fileviewer')

function processFileViewElement ( element ) {
    let dirpath = element.dataset.dir
    let isWatch =  ((typeof element.dataset['watch']) !== 'undefined' ? true : false)
    let isCreate =  ((typeof element.dataset['create']) !== 'undefined' ? true : false)
    //
    const socketUrl = `${(location.protocol === 'https:') ? 'wss://' : 'ws://'}${location.hostname}${location.port ? `:${location.port}` : ''}/malafat`;
    const socket = new WebSocket(socketUrl);
    //
    let fv = new FileViewer ({
        element : element,
        dir : dirpath,
        requestFileContentFn : (f) => {
            socket.send(JSON.stringify({
                "type" : "get-file-content",
                "path" : f,
            }))
        },
        requestFileTreeFn : () => {
            socket.send(JSON.stringify({
                "type" : "get-file-tree"
            }))
        },
        fontsize : "40px"
    })
    //
    socket.onmessage = function (ev) {
        let response = JSON.parse(ev['data'])
        switch ( response.type ) {
            case "file-tree" :
                fv.recieveFileTree(response['file-tree'])
                break;
            case "file-content" :
                fv.recieveFileContent(response['path'], response['content'])
                break;
            case "file-changed" :
                fv.notifyFileChanged(response['path'])
                break
        }
    }
    //
    socket.onopen = () => {
        console.log('websocket is connected ...')
        socket.send(JSON.stringify({
            "type" : "init",
            "path" : dirpath,
            "watch" : isWatch,
            "create" : isCreate
        }))
        fv.newTree()
    }
}
//
document.querySelectorAll('[data-malafat]').forEach((el) => {
    processFileViewElement(el)
})

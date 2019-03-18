


const FileTreeUI = require('./filetreeui')



document.querySelectorAll('[data-malafat]').forEach((el) => {
    let dirpath = el.dataset.dir
    let isWatch =  ((typeof el.dataset['watch']) !== 'undefined' ? true : false)
    let isCreate =  ((typeof el.dataset['create']) !== 'undefined' ? true : false)
    //
    let ftui = new FileTreeUI(el)




    const socketUrl = `${(location.protocol === 'https:') ? 'wss://' : 'ws://'}${location.hostname}${location.port ? `:${location.port}` : ''}/malafat/111`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
        console.log('websocket is connected ...')
        socket.send(JSON.stringify({
            "type" : "init",
            "path" : dirpath,
            "watch" : isWatch,
            "create" : isCreate
        }))

        socket.send(JSON.stringify({
            "type" : "get-contents"
        }))
    }

    socket.onmessage = function (ev) {
        let response = JSON.parse(ev['data'])
        switch ( response.type ) {
            case "contents" :
                ftui.render(response.contents)
                break;
        }
    }
})

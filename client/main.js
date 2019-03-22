const FileTreeUI = require('./filetreeui')

document.querySelectorAll('[data-malafat]').forEach((el) => {
    let dirpath = el.dataset.dir
    let isWatch =  ((typeof el.dataset['watch']) !== 'undefined' ? true : false)
    let isCreate =  ((typeof el.dataset['create']) !== 'undefined' ? true : false)
    //
    
    let leftpane = document.createElement('div')
    let rightpane = document.createElement('div')
    //el.setAttribute('style',"display: table; width: 100%;")
    el.setAttribute('style',"height:100%;width: 100%;display:flex;flex-wrap:nowrap")
    el.appendChild(leftpane)


    leftpane.setAttribute('style',"overflow-y:scroll")
    rightpane.setAttribute('style',"width:100%; margin-left:20px")
    let filetextEl = document.createElement("TEXTAREA")
    filetextEl.setAttribute("readonly","true")
    filetextEl.setAttribute("style","width:100%; height:100%" )
    rightpane.appendChild(filetextEl)
    el.appendChild(rightpane)









    //




    const socketUrl = `${(location.protocol === 'https:') ? 'wss://' : 'ws://'}${location.hostname}${location.port ? `:${location.port}` : ''}/malafat/111`;
    const socket = new WebSocket(socketUrl);

    let openfile = undefined;

    let ftui = new FileTreeUI(leftpane,(fileselected)=> {
        console.log("read file",fileselected)
        openfile = fileselected
        socket.send(JSON.stringify({
            "type" : "get-file-content",
            "path" : fileselected,
        }))
    })

    socket.onopen = () => {
        console.log('websocket is connected ...')
        socket.send(JSON.stringify({
            "type" : "init",
            "path" : dirpath,
            "watch" : isWatch,
            "create" : isCreate
        }))

        socket.send(JSON.stringify({
            "type" : "get-file-tree"
        }))
    }

    socket.onmessage = function (ev) {
        let response = JSON.parse(ev['data'])
        switch ( response.type ) {
            case "file-tree" :
                ftui.render(response['file-tree'])
                break;
            case "file-content" :
                filetextEl.value = response['content']
                break;
            case "file-changed" :
                console.log(response)
                if ( openfile === response['path'] ) {
                    socket.send(JSON.stringify({
                        "type" : "get-file-content",
                        "path" : openfile,
                    }))
                }
        }
    }
})

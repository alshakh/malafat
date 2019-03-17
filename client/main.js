







document.querySelectorAll('[data-malafat]').forEach((el) => {
    let dir = el.dataset['dir']



    const socketUrl = `${(location.protocol === 'https:') ? 'wss://' : 'ws://'}${location.hostname}${location.port ? `:${location.port}` : ''}/malafat/111`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = function () {
        console.log('websocket is connected ...')
        socket.send(JSON.stringify({
            "type" : "get-dir",
            "dir" : dir
        }))
    }

    socket.onmessage = function (ev) {
        el.innerHTML = ev['data']
        console.log(ev)
    }

})

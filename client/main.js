


document.querySelectorAll('[data-malafat]').forEach((el) => {
    let dir = el.dataset['dir']


    let ws = new WebSocket('ws://localhost:3000/malafat/test');
    ws.onopen = function () {
        console.log('websocket is connected ...')
        ws.send(JSON.stringify({
            "type" : "get-dir",
            "dir" : dir
        }))
    }

    ws.onmessage = function (ev) {
        el.innerHTML = ev['data']
        console.log(ev)
    }

})

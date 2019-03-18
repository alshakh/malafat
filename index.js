var express = require('express')
var expressws = require('express-ws')

var app = express()
var expressWs = expressws(app);

const Commander = require('./js/commander')




app.use(express.static(__dirname + "/client"));





expressWs.app.ws('/malafat/:id', function (ws, req) {
    let cmd = new Commander()
    ws.on('message', (message) => {
        cmd.write(message)
    })

    cmd.on("response", (response) => {
        ws.send(response)
    })
});

app.listen(3000,'localhost');

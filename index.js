var express = require('express')
var expressws = require('express-ws')

var app = express()
var expressWs = expressws(app);

app.use(express.static(__dirname + "/client"));

expressWs.app.ws('/malafat/:id', function (ws, req) {
  ws.on('message', (message) => {
      let command = JSON.parse(message)
      console.log("Received message =>", command)

      if (command['type'] === "get-dir") {
          ws.send(command['dir'])
      }
  })

});

app.listen(3000,'localhost');

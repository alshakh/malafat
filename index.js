var express = require('express')
var expressws = require('express-ws')

var app = express()
var expressWs = expressws(app);

const PathTree = require('./js/pathtree.js')




app.use(express.static(__dirname + "/client"));

expressWs.app.ws('/malafat/:id', function (ws, req) {
  ws.on('message', (message) => {
      let command = {}
      try {
          command = JSON.parse(message)
      } catch (e) {
          console.error("error happened",e)
          return
      }

      console.log("Received message =>", command)

      if (command['type'] === "get-dir") {
          PathTree.pathTree(command['dir'],command['dir'])
            .then( ( p ) => {
                ws.send(JSON.stringify(p))
            })
      }
  })

});

app.listen(3000,'localhost');

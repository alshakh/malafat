var express = require('express')
var expressws = require('express-ws')

var app = express()
var expressWs = expressws(app);
// Serve static assets from ./static
app.use(express.static(__dirname + "/client"));
// Instantiate shell and set up data handlers
expressWs.app.ws('/malafat', function (ws, req) {
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`)
  })
  ws.send('ho!')
});
// Start the application
app.listen(3000);

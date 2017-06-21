
var express = require('express');
var app = express();
var path = require('path');
var roslib = require('roslib');

app.use(express.static('public'));

var io = require('socket.io').listen(80); // initiate socket.io server

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' }); // Send data to client

  // wait for the event raised by the client
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/save', function(req, res){
 var json_string = req.query.json;
 var filename = req.query.name;
 var fs = require('fs');
   fs.writeFile("config_files/" + filename, json_string, function(err) {
       if(err) return console.log(err);
   });
 console.log("File saved.");
});

app.get('/connect_computer', function(req, res){
  var ip_address = req.query.ip;
  console.log(ip_address);
  var ros = new roslib.Ros();
  // ros.computer_frame = ip_address;
  // If there is an error on the backend, an 'error' emit will be emitted.
  ros.on('error', function(error) {
    // document.getElementById('connecting').style.display = 'none';
    // document.getElementById('connected').style.display = 'none';
    // document.getElementById('closed').style.display = 'none';
    // document.getElementById('error').style.display = 'inline';
    // computer_frame.style.border = "5px solid red";
    console.log("Error with roslib instance: ")
    console.log(error);
  });
  // Find out exactly when we made a connection.
  ros.on('connection', function() {
    console.log('Connection made!');
    // computer_frame.style.border = "5px solid green";

    // document.getElementById('connecting').style.display = 'none';
    // document.getElementById('error').style.display = 'none';
    // document.getElementById('closed').style.display = 'none';
    // document.getElementById('connected').style.display = 'inline';
  });
  ros.on('close', function() {
    console.log('Connection closed.');
    // document.getElementById('connecting').style.display = 'none';
    // document.getElementById('connected').style.display = 'none';
    // document.getElementById('closed').style.display = 'inline';
  });

  // Create a connection to the rosbridge WebSocket server.
  ros.connect('ws://' + ip_address + ':9090');

});


app.get('/load', function(req, res){

  var filename = req.query.file;

  var fs = require('fs');
    if (filename != "") {
      fs.readFile("config_files/" + filename, 'utf8', function(err, data) {
        if(err) return console.log(err);
        var content = JSON.parse(data);
        console.log(content);
        res.send(content);
      });
      console.log("File loaded.");
    } else {
      res.send({});
      console.log("Failed to load file.");

    }
});

console.log("Server started on http://localhost:8080");

app.listen(8080);

#!/usr/bin/env node
/* ROS Master Synchronizer Project! */
var express = require('express');
var path = require('path');
var RMS = require('./lib/ros_master_synchronizer');

// Parse command line arguments
var argv = require('yargs').argv;
var roslib = require('roslib');

// Set up a server
var app = express();
app.use(express.static('public'));


var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('update', function(data){
    console.log('got data from client');
    console.log(data);
  });
  client.on('request', function(data){
    console.log('got request from client');
    console.log(data);
    client.emit('update',ros_mm_obj);
  });
  client.on('disconnect', function(){});
});
server.listen(3000);

// Main ROS Multimaster object that gets passed to the server to show updates from the user
// and that is compared to the same structured object from the server to show changes
var ros_mm_obj = {
  //structure of ros websocket conections
  // key = ip_address of the ros websocket masters
  // values = 'computer_name'...
  'computers':{},
  //structure for ros topics
  'topics':{},
  //structure for ros services
  'services':{}
};

// var io = require('socket.io').listen(80); // initiate socket.io server

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

// Set up a handler to save a file
app.get('/save', function(req, res){
 var json_string = req.query.json;
 var filename = req.query.name;
 var fs = require('fs');
   fs.writeFile("config_files/" + filename, json_string, function(err) {
       if(err) return console.log(err);
   });
 console.log("File saved.");
});


// Set up a handler to add a ros master connection
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



// var rms = new RMS.ROSMasterSynchronizer();

// If desired, load a file
if (argv.config) {
  var filename = argv.config;
  console.log("Loading: " + filename);
  var fs = require('fs');
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) return console.log(err);
    var content = JSON.parse(data);
    // console.log(content);
    // rms.load_configuration(content);
  });
}

var server = app.listen(8080);

// Gracefully handle SIGINT / Ctrl-C
process.on('SIGINT', function() {
  console.log("Caught Ctrl-C, exiting...!");
  // Stop the server
  server.close();
  // Disconnect from ROS
  rms.disconnect_all();
  // Exit
  process.exit();
});

console.log("Server started on http://localhost:8080");

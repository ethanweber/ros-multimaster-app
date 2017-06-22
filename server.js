#!/usr/bin/env node
/* ROS Master Synchronizer Project! */
var express = require('express');
var path = require('path');
var RMS = require('./lib/ros_master_synchronizer');
require('colors')

// Parse command line arguments
var argv = require('yargs').argv;
var roslib = require('roslib');

// Set up an express server
var app = express();
app.use(express.static('public'));

// -- Paths for express app, will be replaced with socket functions --//

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

// Set up a handler to load a file
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



//-- Socket.io server, the new communication standard with web client --//

var server = require('http').createServer();
var io = require('socket.io')(server);
var client_connection;
io.on('connection', function(client){

  // Connection to the client-end socket
  console.log('Resetting state'.blue.bold+ ' new connection to client');
  rms.disconnect_all();
  reset_ros_mm_obj();
  rms.reset_rms();

  client_connection = client;
  client.on('update', function(data){
    console.log('Data from client:'.magenta.bold);
    console.log(data);
    if(data.msg == 'add-computer'){
      rms.find_and_add_new_computers(data.data);
    }
  });
  client.on('request', function(data){
    console.log('got request from client');
    client.emit('update',ros_mm_obj);
  });
  client.on('test', function(data){
    rms.push_update_to_client()
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

function reset_ros_mm_obj(){
  var ros_mm_obj = {
    'computers':{},
    'topics':{},
    'services':{}
  };
}


var rms = new RMS.ROSMasterSynchronizer(io);

// rms.add_computer('hello','172.25.21.250');
// rms.connect_to_all_computers();
// rms.update_computer_status('hello','wow');
// rms.update_computer_status('hello','error');


// If desired, load a file
if (argv.config) {
  var filename = argv.config;
  console.log("Loading: " + filename);
  var fs = require('fs');
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) return console.log(err);
    var content = JSON.parse(data);
    console.log(content);
    rms.load_configuration(content);
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

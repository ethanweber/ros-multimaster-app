#!/usr/bin/env node
/* ROS Master Synchronizer Project! */
var express = require('express');
var path = require('path');
var ros = require('roslib')

var RMS = require('./lib/ros_master_synchronizer');

// Parse command line arguments
var argv = require('yargs').argv;

// Set up a server
var app = express();
app.use(express.static('public'));

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

// Set up a handler to laod a file
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



var rms = new RMS.ROSMasterSynchronizer();

// If desired, load a file
if (argv.config) {
  var filename = argv.config;
  console.log("Loading: " + filename);
  var fs = require('fs');
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) return console.log(err);
    var content = JSON.parse(data);
    // console.log(content);
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

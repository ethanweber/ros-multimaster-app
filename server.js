
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/save', function(req, res){
 var json_string = req.query.json;
 var fs = require('fs');
   fs.writeFile("config.txt", json_string, function(err) {
       if(err) return console.log(err);
   });
 console.log("File saved.");
});


app.get('/load', function(req, res){

  var fs = require('fs');
    fs.readFile("config.txt", 'utf8', function(err, data) {
      if(err) return console.log(err);
      var content = JSON.parse(data);
      console.log(content);
      res.send(content);
   });
  console.log("File loaded.");
});

console.log("Server started on http://localhost:8080");

app.listen(8080);

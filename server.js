
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
console.log("Server started on http://localhost:8080");
app.listen(8080);

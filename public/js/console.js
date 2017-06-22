// --------------------------------------------------------------------------------------
// CONSOLE BLOCK
// ----------------------------------------------------------------------

var close = document.getElementsByClassName("closebtn");
var i;

for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function() {
      div.style.display = "none";
    }, 600);
  }
}

function clear_console(){
  $('#console-div').empty();
}

function add_console_msg(type, msg) {
  var msg_class = 'alert',
    msg_title = ' ';
  console.log(type);
  if (type == 'green') {
    msg_class = "alert success";
    msg_title = 'Success!';
  }
  else if (type == 'orange') {
    msg_class = "alert warning";
  }
  else if (type == 'red') {
    msg_class = "alert";
  }
  $('#console-div').append("<div class=\"" + msg_class + "\">" + " <span class=\"closebtn\">\&times</span>" + "  <strong>" + msg_title + "</strong > " + msg + "  </div>");

  var close = document.getElementsByClassName("closebtn");
  var i;
  console.log(close);
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function() {
        div.style.display = "none";
      }, 300);
    }
  }
}

// --------------------------------------------------------------------------------------
// CONSOLE BLOCK
// ----------------------------------------------------------------------

function clear_console(){
  $('#console-div').empty();
}

function update_console_close_buttons(){
  console_block = document.getElementById("console-div");
  var close_btns =   console_block.getElementsByClassName("closebtn");
  // var i;
  console.log(close_btns);
  for (var i = 0; i < close_btns.length; i++) {
    close_btns[i].onclick = function() {
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function() {
        div.style.display = "none";
      }, 400);
    }
  }
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
  $('#console-div').append("<div class=\"" + msg_class + "\">" + " <span class=\"closebtn\">\&times</span><div id=\"console-timestamp\">"+getLocalTimestamp()+"</div> <strong>" + msg_title + "</strong > " + msg + "  </div>");
  update_console_close_buttons();
}

function getLocalTimestamp() {
  var d = new Date();
  // var minutes = d.getTimezoneOffset();
  var timestamp_string= pad(d.getHours(),2)+":"+pad(d.getMinutes(),2)+":"+pad(d.getSeconds(),2);
  // console.log(d);
  // d = new Date(d.getTime() + minutes*60000);
  // console.log(d);
  return timestamp_string;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

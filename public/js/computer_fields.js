// --------------------------------------------------------------------------------------
// PAGE THEME
// ----------------------------------------------------------------------

function updateTheme(theme) {
  console.log('updating theme to ' + theme);
  document.getElementById("selected-theme").setAttribute("href", "/css/" + theme + "-theme.css");
  document.getElementById("save-config").src = "img/" + theme + "/save.png";
  document.getElementById("upload-config").src = "img/" + theme + "/upload.png";
  document.getElementById("config-menu").src = "img/" + theme + "/config.png";
}

updateTheme('dark');


// --------------------------------------------------------------------------------------
// COMPUTER FIELDS
// ----------------------------------------------------------------------

var computer_num = 0;
var computer_list = [];
var computer_dict = {};

document.getElementById("new_computer_field").addEventListener("click", function(event) {
  event.preventDefault();
  new_computer_field();
});

function new_computer_field() {
  computer_num += 1;

  $('#computer_fields').append("<div class=\"subsection\" id=\"computer-section-" + computer_num + "\"->\
        <div class=\"form-group\">\
          <label for=\"email\">Computer " + computer_num + ":</label>\
          <input type=\"email\" class=\"form-control name-input\" id=\"computer_" + computer_num + "\" placeholder=\"Enter name\">\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">IP Address " + computer_num + ":</label>\
          <input type=\"text\" class=\"form-control ip-input\" id=\"ip_" + computer_num + "\" placeholder=\"Enter IP\">\
        </div>\
        <img src=\"img/classic/link.png\" class=\"submit-computer-button\" id=\"computer-submit-" + computer_num + "\"/>\
        </div>");

  var computer_section = document.getElementById("computer-section-" + computer_num)
  document.getElementById("computer_" + computer_num).focus();
  document.getElementById("computer-submit-" + computer_num).addEventListener("click", function(event) {
    event.preventDefault();
    submit_computer(computer_section);
  });

  return [computer_num, computer_section];
}

function submit_computer(computer_frame) {

  console.log(computer_frame);

  var computer_input_side = computer_frame.children[0];
  var name = computer_input_side.children[1].value;
  if (name == "" || name == null) {
    console.log('no computer name given');
    computer_frame.remove();
    computer_num -= 1;
    check_for_other_empty_computers();
  } else {
    var ip_input_side = computer_frame.children[1];
    var ip_id = ip_input_side.children[1].value;
    addToComputerList(name, ip_id, computer_frame);
  }
  update_rostopic_dropdowns();
}

function check_for_other_empty_computers() {
  var computers = Array.prototype.slice.call($('#computer_fields').children());

  var computer_input_side = " ";
  var ip_input_side = " ";
  var name = " ";
  var ip_id = " ";

  for (i in computers) {
    var computer_frame = computers[i]
    computer_input_side = computers[i].children[0];
    name = computer_input_side.children[1].value;
    if (name == "" || name == null) {
      console.log('no computer name given');
      computers[i].remove();
      computer_num -= 1;
    }
  }
}

function addToComputerList(name, ip_address, computer_frame) {

  if (ip_address in computer_dict) {
    console.log('ip address: ' + ip_address + ' already registered');
    if (computer_dict[ip_address].name != name) {
      computer_dict[ip_address].name = name;
      console.log('updated name of computer at ' + ip_address + ' to be ' + name);
    }
  } else {
    console.log('adding computer ' + name + ' with ip address ' + ip_address);

    var ros = new ROSLIB.Ros();
    ros.computer_frame = ip_address;
    // If there is an error on the backend, an 'error' emit will be emitted.
    ros.on('error', function(error) {
      // document.getElementById('connecting').style.display = 'none';
      // document.getElementById('connected').style.display = 'none';
      // document.getElementById('closed').style.display = 'none';
      // document.getElementById('error').style.display = 'inline';
      computer_frame.style.border = "3px solid red";
      console.log("Error with roslib instance: ")
      console.log(error);
    });
    // Find out exactly when we made a connection.
    ros.on('connection', function() {
      console.log('Connection made!');
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

    computer_dict[ip_address] = {
      'name': name,
      'frame': computer_frame,
      'ros': ros
    }

  }
}

/*
function computer() {
  var obj = {};
  obj.name = "";
  obj.ip = "";
  obj.ros;
  obj.initialize = function(name, ip_address) {
    obj.name = name;
    obj.ip = ip_address;
    obj.ros = new ROSLIB.Ros({
      url: 'ws://' + ip_address + ':9090'
    });
  }
  return obj;
}
*/

function clear_computer_list() {
  computer_list = [];
  computer_dict = {};
  computer_num = 0;
  document.getElementById("computer_fields").innerHTML = "";
}

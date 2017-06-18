// --------------------------------------------------------------------------------------
// PAGE THEME
// ----------------------------------------------------------------------

function updateTheme(theme) {
  console.log('updating theme to ' + theme);
  document.getElementById("pagestyle").setAttribute("href", "/css/" + theme + "-style.css");
  document.getElementById("save-config").src = "img/" + theme + "-save.png";
  document.getElementById("upload-config").src = "img/" + theme + "-upload.png";
  document.getElementById("config-menu").src = "img/" + theme + "-config.png";
}

$('#upload-config').click(function() {
  $("#upload-input").click();
});

$("#upload-input").change(function() {
  alert('changed!');
  console.log($("upload-input"));

  var f = document.getElementById("upload-input");
  filename = f.files[0]['name'];

  var master_list;
  var parameters = {
    file: filename
  };
  $.get('/load', parameters, function(data) {

    master_list = data;

    console.log(master_list);
    console.log(master_list.computer_list);

    loadComputers(master_list.computer_list)
  })
});

function loadComputers(computers) {
  var computer,
    num,
    name,
    ip,
    comp_id,
    ip_id;

  for (i in computers) {
    computer = computers[i]
    num = new_computer_field();
    name = computer['name'];
    ip = computer['ip'];
    comp_id = 'computer_' + num;
    document.getElementById(comp_id).value = name;
    ip_id = 'ip_' + num;
    document.getElementById(ip_id).value = ip;
    // computer_list[i].initialize(name, ip);
    addToComputerList(name, ip_id);

  }

}

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
  // computer_list.push(new computer());
  // console.log(computer_list);
  // console.log(computer_list.length);
  $('#computer_fields').append("<div class=\"subsection\" id=\"computer-section-" + computer_num + "\"->\
        <div class=\"form-group\">\
          <label for=\"email\">Computer " + computer_num + ":</label>\
          <input type=\"email\" class=\"form-control name-input\" id=\"computer_" + computer_num + "\" placeholder=\"Enter name\">\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">IP Address " + computer_num + ":</label>\
          <input type=\"text\" class=\"form-control ip-input\" id=\"ip_" + computer_num + "\" placeholder=\"Enter IP\">\
        </div>\
        </div>");

  document.getElementById("computer_" + computer_num).focus();

  return computer_num;
}

document.getElementById("submit_computer_fields").addEventListener("click", function(event) {
  event.preventDefault();
  update_fields();
});

function update_fields() {

  var computers = Array.prototype.slice.call($('#computer_fields').children());

  var computer_input_side = " ";
  var ip_input_side = " ";
  var name = " ";
  var ip_id = " ";

  for (i in computers) {
    computer_input_side = computers[i].children[0];
    name = computer_input_side.children[1].value;
    if (name == "" || name == null) {
      console.log('no computer name given');
      computers[i].remove();
      computer_num -= 1;
    } else {
      ip_input_side = computers[i].children[1];
      ip_id = ip_input_side.children[1].value;
      addToComputerList(name, ip_id);
    }
    // console.log('got computer: ' + name + ' with ip: ' + ip_id);
  }
  // for (var i = 0; i < computer_list.length; i++) {
  //   var comp_id = 'computer_' + (i+1);
  //   var name = document.getElementById(comp_id).value;
  //   var ip_id = 'ip_' + (i+1);
  //   var ip = document.getElementById(ip_id).value;
  //   if(name == "" || name== null){
  //     document.getElementById("computer-section-"+(i+1)).remove();
  //   }
  //   else{
  //     computer_list[i].initialize(name, ip);
  //   }
  // }
  // console.log(computer_list);
}

function addToComputerList(name, ip_address) {

  if (ip_address in computer_dict) {
    console.log('ip address: ' + ip_address + ' already registered');
  } else {
    console.log('adding computer ' + name + ' with ip address ' + ip_address);
    var ros = new ROSLIB.Ros({
      url: 'ws://' + ip_address + ':9090'
    })
    ros.on('error', function(error) {
      console.log("Error with roslib instance: ")
      console.log(error);
    });
    ros.on('connection', function() {
      console.log('Connection made!');
    });

    computer_dict[ip_address] = {
      'name': name,
      'ros': ros
    }

  }
}

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

function clear_computer_list() {
  computer_list = [];
  computer_dict = {};
  computer_num = 0;
  document.getElementById("computer_fields").innerHTML = "";

}

// --------------------------------------------------------------------------------------
// COMPUTER FIELDS
// ----------------------------------------------------------------------

// Index of computer blocks added to the UI
var computer_num = 0;

/**
 * Adds a new computer block frame to the UI after pressing the 'Add Computer' button
 * Also sets up the onclick listener that attempts to link with the given inputs
 */
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

  var list_of_computers = ['localhost'];
  $("#ip_" + computer_num).autocomplete({source: list_of_computers});

  var computer_section = document.getElementById("computer-section-" + computer_num)
  document.getElementById("computer_" + computer_num).focus();
  document.getElementById("computer-submit-" + computer_num).addEventListener("click", function(event) {
    event.preventDefault();
    submit_computer(computer_section);
  });

  return [computer_num, computer_section];
}

// Add the onclick listener to the 'Add Computer' button
document.getElementById("new_computer_field").addEventListener("click", function(event) {
  event.preventDefault();
  new_computer_field();
});

/**
 * Attempts to use the computer block inputs to connect/link to another ROS websocket.
 * This function is called by the click event for the link button in each respective computer block.
 * Will remove the frame if no computer name given, and then call check_for_other_empty_computers()
 * @param {Div} computer_frame
 */
function submit_computer(computer_frame) {
  var computer_input_side = computer_frame.children[0];
  var name = computer_input_side.children[1].value;
  if (name == "" || name == null) {
    add_console_msg('orange', 'No computer name provided');
    computer_frame.remove();
    computer_num -= 1;
    check_for_other_empty_computers();
  } else {
    var ip_input_side = computer_frame.children[1];
    var ip_id = ip_input_side.children[1].value;
    addToComputerList(name, ip_id, computer_frame);
  }
}

/**
 * Adds a computer to the client state and then pushes the change to the server in order
 * to attempt a connection with the ros websocket at the given 'ip_address'.
 * Called by submit_computer() if this is a new name and ip address.
 * @param {String} name
 * @param {String} ip_address
 * @param {Div} computer_frame

 */
function addToComputerList(name, ip_address, computer_frame) {
  console.log(ros_mm_obj);
  // Do we already have a computer with this name registered?
  if (name in ros_mm_obj.computers) {
    // Maybe it lost connection and they are trying to reconnect?
    if (ros_mm_obj.computers[name].status == 'error') {
      update_from_ui('add-computer');
    } else {
      add_console_msg('orange', 'Computer name  \'' + name + '\' already registered');
      // console.log('ip address: ' + ip_address + ' already registered');
      // if (ros_mm_obj.computers[name].ip == ip_address) {
      // console.log('updated name of computer at ' + ip_address + ' to be ' + name);
      // }
    }
  } else {
    ros_mm_obj.computers[name] = {
      'name': name,
      'ip': ip_address,
      'status': 'unknown',
      'frame': computer_frame
    }
    console.log('adding computer ' + name + ' with ip address ' + ip_address);
    update_from_ui('add-computer');
  }
}

/**
 * Iterates through the computer block frames in the UI to find the emmpty ones and removes them.
 * This function is called after one computer block submitted without a name, this way we ensure that new
 * computer blocks added are in the right number order.
 */
function check_for_other_empty_computers() {
  var computers = Array.prototype.slice.call($('#computer_fields').children());

  var computer_input_side = " ";
  var name = " ";

  for (i in computers) {
    var computer_frame = computers[i]
    computer_input_side = computers[i].children[0];
    name = computer_input_side.children[1].value;
    if (name == "" || name == null) {
      // add_console_msg('orange', 'No computer name provided');
      computers[i].remove();
      computer_num -= 1;
    }
  }
}

/**
 * Updates the computer block frames in the app UI based on the state data recieved from the server
 * @param {Object} data
 */
function update_computers(data) {
  // console.log('update_computers:');
  data.computers
  var local_computer;
  for (local_computer in ros_mm_obj.computers) {
    if (local_computer in data.computers) {
      var computer_updated = data.computers[local_computer];
      var computer_local = ros_mm_obj.computers[local_computer]
      if (computer_updated.status == 'error') {
        computer_local.status = 'error';
        computer_local.frame.style.border = "5px solid red";
        computer_local.frame.style.backgroundColor = "#ff5353";
      } else if (computer_updated.status == 'connected') {
        computer_local.status = 'connected';
        computer_local.frame.style.border = "5px solid green";
        computer_local.frame.style.backgroundColor = "#4CAF50";
      }
    }
  }
}

/**
 * Clears the client state of computers, removes blocks from UI, and resets block index to 0
 */
function clear_computer_list() {
  computer_num = 0;
  ros_mm_obj.computers = {}
  document.getElementById("computer_fields").innerHTML = "";
}

// --------------------------------------------------------------------------------
// SAVE FILE
// ---------------------------------------------------------


document.getElementById("config-menu").addEventListener("click", function(event) {
  event.preventDefault();

    var parameters = {
      ip: '10.71.14.209',
    };
    $.get('/connect_computer', parameters, function(data) {
      // $('#results').html(data);
      console.log(data);
    });
  });


document.getElementById("save-config").addEventListener("click", function(event) {
  event.preventDefault();
  var json_string = generate_json();
  console.log(json_string);

  // this is used to convert json_string back to an object
  // var object = JSON.parse(json_string);
  // console.log(object);

  var filename = prompt("Please enter the filename to be saved.", "config.txt");
  if (filename != null && filename != "") {
    var parameters = {
      json: json_string,
      name: filename
    };
    $.get('/save', parameters, function(data) {
      // $('#results').html(data);
      console.log(data);
    });
  }
});

$('#upload-config').click(function() {
  $("#upload-input").click();
});

$("#upload-input").change(function() {
  event.preventDefault();

  clear_computer_list();
  clear_rostopic_list();
  clear_rosservice_list();

  reset_server('loading new configuration');

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

    loadComputers(master_list.computer_list);
    loadTopics(master_list.rostopic_list);
    loadServices(master_list.rosservice_list);

  })

});

function loadComputers(computers) {
  var computer,
    num,
    name,
    ip_address,
    comp_id,
    ip_id;

  for (i in computers) {
    computer = computers[i]
    data = new_computer_field();
    num = data[0];
    computer_frame = data[1];
    name = computer['name'];
    ip_address = computer['ip'];
    comp_id = 'computer_' + num;
    document.getElementById(comp_id).value = name;
    ip_id = 'ip_' + num;
    document.getElementById(ip_id).value = ip_address;
    // computer_list[i].initialize(name, ip);
    addToComputerList(name, ip_address, computer_frame);
  }
}

function loadTopics(topics) {

  var sub_comp,
    msg_type,
    pub_topic,
    sub_topic,
    pub_comp,
    checkbox;

  for (i in topics) {
    topic = topics[i];
    console.log('here');
    console.log(i);
    console.log(topic);
    new_rostopic_field();
    update_rostopic_dropdowns();

    sub_comp = topic['from'];
    msg_type = topic['msg_type'];
    pub_topic = topic['pub'];
    sub_topic = topic['sub'];
    pub_comp = topic['to'];
    checkbox = topic['checked'];

    // Need this for weird conversion of strings->ints in JSON
    // For example: index 0 in JSON, the key becomes 01 string for (i+1)
    i = parseInt(i);

    document.getElementById('topic_subscribe_computers_' + (i + 1)).value = sub_comp;
    document.getElementById('sub_topic_' + (i + 1)).value = sub_topic;
    document.getElementById('topic_publish_computers_' + (i + 1)).value = pub_comp;
    document.getElementById('pub_topic_' + (i + 1)).value = pub_topic;
    document.getElementById('msg_type_' + (i + 1)).value = msg_type;
    document.getElementById('checkbox_' + (i + 1)).checked = (checkbox == "true");
    rostopic_list[i].initialize(i + 1, sub_comp, sub_topic, pub_comp, pub_topic, msg_type, checkbox);
  }
}

function loadServices(services) {

  var sub_comp,
    srvs_type,
    pub_service,
    sub_service,
    pub_comp;

  for (i in services) {
    service = services[i];
    console.log('here');
    console.log(i);
    console.log(topic);
    new_rosservice_field();
    update_rosservice_dropdowns();

    sub_comp = service['from'];
    srvs_type = service['srvs_type'];
    pub_service = service['pub'];
    sub_service = service['sub'];
    pub_comp = service['to'];

    // Need this for weird conversion of strings->ints in JSON
    // For example: index 0 in JSON, the key becomes 01 string for (i+1)
    i = parseInt(i);

    document.getElementById('service_subscribe_computers_' + (i + 1)).value = sub_comp;
    document.getElementById('sub_service_' + (i + 1)).value = sub_service;
    document.getElementById('service_publish_computers_' + (i + 1)).value = pub_comp;
    document.getElementById('pub_service_' + (i + 1)).value = pub_service;
    document.getElementById('srvs_type_' + (i + 1)).value = srvs_type;
    rosservice_list[i].initialize(i + 1, sub_comp, sub_service, pub_comp, pub_service, srvs_type);
  }
}

function generate_json() {

  var computer_string = "{ \"computer_list\" : [";

  for (ip_address in computer_dict) {
    computer_obj = computer_dict[ip_address];
    computer_string += "{";
    computer_string += "\"name\": " + JSON.stringify(computer_obj.name) + ",";
    computer_string += "\"ip\": " + JSON.stringify(ip_address);
    computer_string += "}";
    computer_string += ",";
  }

  // Remove last comma because JSON :/
  computer_string = computer_string.replace(/,\s*$/, "");

  computer_string += "],";

  var rostopic_string = "\"rostopic_list\" : [";
  for (var i = 0; i < rostopic_list.length; i++) {
    rostopic_string += "{";
    rostopic_string += "\"from\": " + JSON.stringify(rostopic_list[i].storage[1]) + ",";
    rostopic_string += "\"sub\": " + JSON.stringify(rostopic_list[i].storage[2]) + ",";
    rostopic_string += "\"to\": " + JSON.stringify(rostopic_list[i].storage[3]) + ",";
    rostopic_string += "\"pub\": " + JSON.stringify(rostopic_list[i].storage[4]) + ",";
    rostopic_string += "\"msg_type\": " + JSON.stringify(rostopic_list[i].storage[5]) + ",";
    rostopic_string += "\"checked\": " + JSON.stringify(rostopic_list[i].storage[6]);
    rostopic_string += "}";
    if (i < rostopic_list.length - 1) {
      rostopic_string += ",";
    }
  }
  rostopic_string += "],";

  var rosservice_string = "\"rosservice_list\" : [";
  for (var i = 0; i < rosservice_list.length; i++) {
    rosservice_string += "{";
    rosservice_string += "\"from\": " + JSON.stringify(rosservice_list[i].storage[1]) + ",";
    rosservice_string += "\"sub\": " + JSON.stringify(rosservice_list[i].storage[2]) + ",";
    rosservice_string += "\"to\": " + JSON.stringify(rosservice_list[i].storage[3]) + ",";
    rosservice_string += "\"pub\": " + JSON.stringify(rosservice_list[i].storage[4]) + ",";
    rosservice_string += "\"srvs_type\": " + JSON.stringify(rosservice_list[i].storage[5]);
    rosservice_string += "}";
    if (i < rosservice_list.length - 1) {
      rosservice_string += ",";
    }
  }
  rosservice_string += "]}";

  return computer_string + rostopic_string + rosservice_string;

}

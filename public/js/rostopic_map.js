// ------------------------------------------------------------------
// ROSTOPIC MAPPING LISTS
// ------------------------------------------------------------------

// var rostopic_list = [
var std_msgs = [
  'std_msgs/Bool',
  'std_msgs/Byte',
  'std_msgs/ByteMultiArray',
  'std_msgs/Char',
  'std_msgs/ColorRGBA',
  'std_msgs/Duration',
  'std_msgs/Empty',
  'std_msgs/Float32',
  'std_msgs/Float32MultiArray',
  'std_msgs/Float64',
  'std_msgs/Float64MultiArray',
  'std_msgs/Header',
  'std_msgs/Int16',
  'std_msgs/Int16MultiArray',
  'std_msgs/Int32',
  'std_msgs/Int32MultiArray',
  'std_msgs/Int64',
  'std_msgs/Int64MultiArray',
  'std_msgs/Int8',
  'std_msgs/Int8MultiArray',
  'std_msgs/MultiArrayDimension',
  'std_msgs/MultiArrayLayout',
  'std_msgs/String',
  'std_msgs/Time',
  'std_msgs/UInt16',
  'std_msgs/UInt16MultiArray',
  'std_msgs/UInt32',
  'std_msgs/UInt32MultiArray',
  'std_msgs/UInt64',
  'std_msgs/UInt64MultiArray',
  'std_msgs/UInt8',
  'std_msgs/UInt8MultiArray'
];
var rostopic_blocks = {};

var n = 0;

// var my_status = setInterval(rostopic_status_checker, 2000);
// function rostopic_status_checker() {
//   console.log('status checker!');
//   // var current_time = new Date().getTime();
//   // for (var i = 0; i < rostopic_list.length; i++) {
//     // if ((current_time - rostopic_list[0].last_time_stamp) > 2000) {
//       // document.getElementById('topic_status_' + (i + 1)).style.color = "red";
//     // }
//   // }
// }

document.getElementById("new_rostopic_field").addEventListener("click", function(event) {
  event.preventDefault();
  new_rostopic_field();
});

var list_of_topics = [];
var list_of_msg_types = [];

// function update_list_of_topics() {
//   for (computer in computer_dict) {
//     // console.log(computer_dict[computer]);
//     computer_dict[computer].ros.getTopics(function(topics) {
//       // console.log(topics);
//       for (var i = 0; i < topics.topics.length; i++) {
//         list_of_topics.push(topics.topics[i]);
//         if (topics.types[i]) {
//           list_of_msg_types.push(topics.types[i]);
//         }
//       }
//     });
//   }
// }

function new_rostopic_field() {
  var new_topic_route_id = uuidv1();
  // rostopic_list.push(new rostopic_route());
  // console.log(rostopic_list.length);
  $('#rostopic_fields').append("<div class=\"subsection\" id=\"topic_subsection_" + new_topic_route_id + "\">\
        <div class=\"form-group topic-form\">\
          <label for=\"sel1\">Source</label>\
          <select class=\"form-control\" id=\"topic_subscribe_computers_" + new_topic_route_id + "\"></select>\
        </div>\
        <div class=\"form-group topic-form\">\
          <label for=\"pwd\">Subscribe Topic</label>\
          <input type=\"text\" class=\"form-control\" id=\"sub_topic_" + new_topic_route_id + "\" placeholder=\"Enter topic\">\
        </div>\
        <div class=\"form-group topic-form\">\
          <label for=\"sel1\">Destination</label>\
          <select class=\"form-control\" id=\"topic_publish_computers_" + new_topic_route_id + "\"></select>\
        </div>\
        <div class=\"form-group topic-form\">\
          <label for=\"pwd\">Publish Topic</label>\
          <input type=\"text\" class=\"form-control\" id=\"pub_topic_" + new_topic_route_id + "\" placeholder=\"Enter topic\">\
        </div>\
        <div class=\"form-group topic-form\">\
          <label for=\"pwd\">Message Type</label>\
          <input type=\"text\" class=\"form-control\" id=\"msg_type_" + new_topic_route_id + "\" placeholder=\"Enter type\">\
        </div>\
        <div class=\"form-group topic-form\">\
           <label for=\"checkbox_" + new_topic_route_id + "\">Loop</label>\
           <input type=\"checkbox\" id=\"checkbox_" + new_topic_route_id + "\" value=\"\">\ " +
  // <img class=\"resize\" src=\"/img/loop.jpg\"></img>\
          // <label style=\"color:red\" id=\"topic_status_" + new_topic_route_id + "\">STATUS</label>\
        "</div><span class=\"closebtn\" id=\"close_"+new_topic_route_id+"\">\&times</span> \
      </div>");

  // request from the server to update autocomplete and selectmenu sources
  request_new_topics_data();

  // Add the topic route ID to rostopic_blocks obj with blank value
  rostopic_blocks[new_topic_route_id] = ' ';
  $("#sub_topic_" + new_topic_route_id).autocomplete({source: list_of_topics});
  $("#pub_topic_" + new_topic_route_id).autocomplete({source: list_of_topics});
  $("#msg_type_" + new_topic_route_id).autocomplete({source: list_of_msg_types});
  // $( function() {
  $("#checkbox_" + new_topic_route_id).checkboxradio();
  // } );
  $("#close_" + new_topic_route_id).click(function() {
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function() {
      div.style.display = "none";
    }, 400);
  });

}

var last_data = {}

function update_rostopic_dropdowns(data) {
  last_data = data;
  list_of_topics = data.topics_list;
  list_of_msg_types = std_msgs.concat(data.msg_types);

  var rostopic_id;

  for (rostopic_id in rostopic_blocks) {
    var sub_comp_div = document.getElementById('topic_subscribe_computers_' + rostopic_id);
    var pub_comp_div = document.getElementById('topic_publish_computers_' + rostopic_id);
    var current_sub_comp = sub_comp_div.value;
    var current_pub_comp = pub_comp_div.value;

    sub_comp_div.innerHTML = "";
    pub_comp_div.innerHTML = "";
    var computer_name;
    for (computer_name in data.computers) {
      sub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
      pub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
    }
    // Preserve previously selected computer values
    sub_comp_div.value = current_sub_comp;
    pub_comp_div.value = current_pub_comp;

    $("#sub_topic_" + rostopic_id).autocomplete({source: list_of_topics});
    $("#pub_topic_" + rostopic_id).autocomplete({source: list_of_topics});
    $("#msg_type_" + rostopic_id).autocomplete({source: list_of_msg_types});
  }
}

function update_rostopic_status(data) {
  last_data = data;
  list_of_topic_routes = data.topic_routers;

  var rostopic_id;

  for (rostopic_id in rostopic_blocks) {
    if (list_of_topic_routes[rostopic_id]) {
      if (list_of_topic_routes[rostopic_id].status == 'connected') {
        document.getElementById('topic_subsection_' + rostopic_id).style.border = "5px solid green";
        document.getElementById('topic_subsection_' + rostopic_id).style.backgroundColor = "#4CAF50";
      } else if (list_of_topic_routes[rostopic_id].status == 'error') {
        document.getElementById('topic_subsection_' + rostopic_id).style.border = "5px solid red";
      } else {
        document.getElementById('topic_subsection_' + rostopic_id).style.border = "5px solid blue";
      }
    } else {
      document.getElementById('topic_subsection_' + rostopic_id).style.border = "5px solid yellow";
    }
    var sub_comp_div = document.getElementById('topic_subscribe_computers_' + rostopic_id);
    var pub_comp_div = document.getElementById('topic_publish_computers_' + rostopic_id);
    var current_sub_comp = sub_comp_div.value;
    var current_pub_comp = pub_comp_div.value;

    sub_comp_div.innerHTML = "";
    pub_comp_div.innerHTML = "";
    var computer_name;
    for (computer_name in data.computers) {
      sub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
      pub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
    }
    // Preserve previously selected computer values
    sub_comp_div.value = current_sub_comp;
    pub_comp_div.value = current_pub_comp;

    $("#sub_topic_" + rostopic_id).autocomplete({source: list_of_topics});
    $("#pub_topic_" + rostopic_id).autocomplete({source: list_of_topics});
    $("#msg_type_" + rostopic_id).autocomplete({source: list_of_msg_types});
  }
}

function rostopic_route() {
  var obj = {};
  obj.storage;
  obj.num;
  obj.sub_topic;
  obj.pub_topic;
  obj.last_time_stamp = new Date().getTime();
  obj.recently_sent_from_sub = []
  obj.recently_sent_from_pub = []
  obj.loop;

  obj.unsubscribe_all = function() {

    try {
      obj.sub_topic.unsubscribe();
      obj.pub_topic.unsubscribe();
    } catch (err) {
      console.log("Nothing to unsubscribe.");
    }

  };

  obj.normal_init = function(num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type) {
    // get the correct computers
    var sub_computer;
    var pub_computer;

    for (ip_address in computer_dict) {
      computer_obj = computer_dict[ip_address];
      if (computer_obj.name == sub_comp) {
        sub_computer = computer_obj.ros;
        console.log('sub_computer:')
        console.log(sub_computer)
      }
      if (computer_obj.name == pub_comp) {
        pub_computer = computer_obj.ros;
        console.log('pub_computer:')
        console.log(pub_computer)
      }
    }

    obj.sub_topic = new ROSLIB.Topic({ros: sub_computer, name: sub_topic, messageType: msg_type});

    obj.pub_topic = new ROSLIB.Topic({ros: pub_computer, name: pub_topic, messageType: msg_type});

    obj.sub_topic.subscribe(function(message) {

      // change the color to green when in use
      last_time_stamp = new Date().getTime();
      document.getElementById('topic_status_' + num).style.color = "green";

      obj.pub_topic.publish(message);
    });
  };

  obj.loop_init = function(num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type) {
    var sub_computer;
    var pub_computer;

    for (ip_address in computer_dict) {
      computer_obj = computer_dict[ip_address];
      if (computer_obj.name == sub_comp) {
        sub_computer = computer_obj.ros;
        console.log('sub_computer:')
        console.log(sub_computer)
      }
      if (computer_obj.name == pub_comp) {
        pub_computer = computer_obj.ros;
        console.log('pub_computer:')
        console.log(pub_computer)
      }
    }

    obj.sub_topic = new ROSLIB.Topic({ros: sub_computer, name: sub_topic, messageType: msg_type});

    obj.pub_topic = new ROSLIB.Topic({ros: pub_computer, name: pub_topic, messageType: msg_type});

    obj.sub_topic.subscribe(function(message) {

      // change the color to green when in use
      last_time_stamp = new Date().getTime();
      document.getElementById('topic_status_' + num).style.color = "green";

      var msg_str = JSON.stringify(message);
      if (obj.recently_sent_from_pub.indexOf(msg_str) < 0) {
        obj.pub_topic.publish(message);
        obj.recently_sent_from_sub.push(msg_str);
        if (obj.recently_sent_from_sub.length > 10)
          obj.recently_sent_from_sub.shift();
        }
      });

    obj.pub_topic.subscribe(function(message) {

      // change the color to green when in use
      last_time_stamp = new Date().getTime();
      document.getElementById('topic_status_' + num).style.color = "green";

      var msg_str = JSON.stringify(message);
      if (obj.recently_sent_from_sub.indexOf(msg_str) < 0) {
        obj.sub_topic.publish(message);
        obj.recently_sent_from_pub.push(msg_str);
        if (obj.recently_sent_from_pub.length > 10)
          obj.recently_sent_from_pub.shift();
        }
      });
  };

  obj.initialize = function(num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type, checked) {

    obj.storage = [
      num,
      sub_comp,
      sub_topic,
      pub_comp,
      pub_topic,
      msg_type,
      checked
    ];

    console.log(num);
    console.log(sub_comp);
    console.log(sub_topic);
    console.log(pub_comp);
    console.log(pub_topic);
    console.log(msg_type);
    console.log(checked);

    obj.num = num;
    obj.loop = checked;

    if (obj.loop == "true") {
      obj.loop_init(num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type);
      console.log("ROS Topic Loop Init.")
    } else {
      obj.normal_init(num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type);
      console.log("ROS Topic Normal Init.")
    }

  }
  return obj;
}

function update_rostopic_routes() {
  // console.log("here we go :D");

  var rostopic_id,
    sub_comp,
    sub_topic,
    pub_comp,
    pub_topic,
    msg_type,
    checked;

  for (rostopic_id in rostopic_blocks) {

    // rostopic_list[i].unsubscribe_all();
    sub_comp = document.getElementById('topic_subscribe_computers_' + rostopic_id).value;
    sub_topic = document.getElementById('sub_topic_' + rostopic_id).value;
    pub_comp = document.getElementById('topic_publish_computers_' + rostopic_id).value;
    pub_topic = document.getElementById('pub_topic_' + rostopic_id).value;
    msg_type = document.getElementById('msg_type_' + rostopic_id).value;
    checked = (document.getElementById('checkbox_' + rostopic_id).checked).toString();
    // rostopic_list[i].initialize(i + 1, sub_comp, sub_topic, pub_comp, pub_topic, msg_type, checked);

    var data_array = [
      sub_comp,
      sub_topic,
      pub_comp,
      pub_topic,
      msg_type,
      checked
    ];

    if (all_filled(data_array)) {
      ros_mm_obj.topic_routes[rostopic_id] = {
        'sub_comp': sub_comp,
        'sub_topic': sub_topic,
        'pub_comp': pub_comp,
        'pub_topic': pub_topic,
        'msg_type': msg_type,
        'checked': checked
      }
    } else {
      console.log('removed topic route of id: ' + rostopic_id);
      delete ros_mm_obj.topic_routes[rostopic_id];
    }
  }
  update_from_ui('new-topics');

}

function all_filled(list_of_vars) {
  for (var i = 0; i < list_of_vars.length; i++) {
    if (list_of_vars[i] == null || list_of_vars[i] == '') {
      return false;
    }
  }
  return true;
}

document.getElementById("start_topic_routing").addEventListener("click", function(event) {
  event.preventDefault();
  update_rostopic_routes();
});

function clear_rostopic_list() {
  // rostopic_list = [];
  rostopic_blocks = {};
  document.getElementById("rostopic_fields").innerHTML = "";

}

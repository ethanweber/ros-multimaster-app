// ------------------------------------------------------------------
// ROSTOPIC MAPPING LISTS
// ------------------------------------------------------------------

var rostopic_num = 0;
var rostopic_list = [];

var n = 0;

var my_status = setInterval(rostopic_status_checker, 2000);

function rostopic_status_checker() {
  var current_time = new Date().getTime();
  for (var i = 0; i < rostopic_list.length; i++) {
    if ((current_time - rostopic_list[0].last_time_stamp) > 2000) {
      document.getElementById('topic_status_' + (i + 1)).style.color = "red";
    }
  }
}

document.getElementById("new_rostopic_field").addEventListener("click", function(event) {
  event.preventDefault();
  new_rostopic_field();
});

var list_of_topics = [];
var list_of_msg_types = [];

function update_list_of_topics() {
  for (computer in computer_dict) {
    // console.log(computer_dict[computer]);
    computer_dict[computer].ros.getTopics(function(topics) {
      // console.log(topics);
      for (var i = 0; i < topics.topics.length; i++) {
        list_of_topics.push(topics.topics[i]);
        if (topics.types[i]) {
          list_of_msg_types.push(topics.types[i]);
        }
      }
    });
  }
}

function new_rostopic_field() {
  rostopic_num += 1;
  rostopic_list.push(new rostopic_route());
  console.log(rostopic_list.length);
  $('#rostopic_fields').append("<div class=\"subsection\" id=\"topic_subsection_" + rosservice_num + "\">\
        <br>\
        <div class=\"form-group\">\
          <label for=\"sel1\">Computer</label>\
          <select class=\"form-control\" id=\"topic_subscribe_computers_" + rostopic_num + "\"></select>\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">Subscribe Topic</label>\
          <input type=\"text\" class=\"form-control\" id=\"sub_topic_" + rostopic_num + "\" placeholder=\"Enter topic\">\
        </div>\
        <div class=\"form-group\">\
          <label for=\"sel1\">Destination</label>\
          <select class=\"form-control\" id=\"topic_publish_computers_" + rostopic_num + "\"></select>\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">Publish Topic</label>\
          <input type=\"text\" class=\"form-control\" id=\"pub_topic_" + rostopic_num + "\" placeholder=\"Enter topic\">\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">Message Type</label>\
          <input type=\"text\" class=\"form-control\" id=\"msg_type_" + rostopic_num + "\" placeholder=\"Enter type\">\
        </div>\
        <div class=\"form-group\">\
          <input type=\"checkbox\" id=\"checkbox_" + rostopic_num + "\" value=\"\">\
          <img class=\"resize\" src=\"/img/loop.jpg\"></img>\
          <label style=\"color:red\" id=\"topic_status_" + rostopic_num + "\">STATUS</label>\
        </div>\
        <div>");
  update_rostopic_dropdowns();

  $("#sub_topic_" + rostopic_num).autocomplete({source: list_of_topics});
  $("#pub_topic_" + rostopic_num).autocomplete({source: list_of_topics});
  $("#msg_type_" + rostopic_num).autocomplete({source: list_of_msg_types});

}

// document.getElementById("refresh_rostopic_fields").addEventListener("click", function(event) {
//   event.preventDefault();
//   update_rostopic_dropdowns();
// });

function update_rostopic_dropdowns() {
  for (var i = 0; i < rostopic_list.length; i++) {
    var sub_comp_div = document.getElementById('topic_subscribe_computers_' + (i + 1));
    var pub_comp_div = document.getElementById('topic_publish_computers_' + (i + 1));
    var current_sub_comp = sub_comp_div.value;
    var current_pub_comp = pub_comp_div.value;

    sub_comp_div.innerHTML = "";
    pub_comp_div.innerHTML = "";
    var computer_name;
    for (computer_ip in computer_dict) {
      console.log(computer_ip);
      computer_name = computer_dict[computer_ip].name;
      console.log(computer_dict[computer_ip]);
      console.log(computer_name);
      sub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
      pub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
    }

    // Preserve previously selected computer values
    sub_comp_div.value = current_sub_comp;
    pub_comp_div.value = current_pub_comp;
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
  for (var i = 0; i < rostopic_list.length; i++) {
    rostopic_list[i].unsubscribe_all();
    var sub_comp = document.getElementById('topic_subscribe_computers_' + (i + 1)).value;
    var sub_topic = document.getElementById('sub_topic_' + (i + 1)).value;
    var pub_comp = document.getElementById('topic_publish_computers_' + (i + 1)).value;
    var pub_topic = document.getElementById('pub_topic_' + (i + 1)).value;
    var msg_type = document.getElementById('msg_type_' + (i + 1)).value;
    var checked = (document.getElementById('checkbox_' + (i + 1)).checked).toString();
    rostopic_list[i].initialize(i + 1, sub_comp, sub_topic, pub_comp, pub_topic, msg_type, checked);
  }
}
document.getElementById("start_topic_routing").addEventListener("click", function(event) {
  event.preventDefault();
  update_rostopic_routes();
});

function clear_rostopic_list() {
  rostopic_list = [];
  rostopic_num = 0;
  document.getElementById("rostopic_fields").innerHTML = "";

}

// // First, we create a Service client with details of the service's name and service type.
// var addTwoIntsClient = new ROSLIB.Service({
//   ros : ros,
//   name : '/add_two_ints',
//   serviceType : 'rospy_tutorials/AddTwoInts'
// });
//
// // Then we create a Service Request. The object we pass in to ROSLIB.ServiceRequest matches the
// // fields defined in the rospy_tutorials AddTwoInts.srv file.
// var request = new ROSLIB.ServiceRequest({
//   a : 1,
//   b : 2
// });
//
// // Finally, we call the /add_two_ints service and get back the results in the callback. The result
// // is a ROSLIB.ServiceResponse object.
// addTwoIntsClient.callService(request, function(result) {
//   console.log('Result for service call on ' + addTwoIntsClient.name + ': ' + result.sum);
// });
//
// // Create a connection to the rosbridge WebSocket server.
//     ros.connect('ws://localhost:9090');
//
//     var addTwoIntsService = new ROSLIB.Service({
//       ros: ros,
//       name: '/add_two_ints',
//       serviceType: 'rospy_tutorials/AddTwoInts'
//     });
//
//     addTwoIntsService.advertise(function(req, resp) {
//       resp.sum = req.a + req.b;
//       console.log("Heck yeah!!!");
//       return true;
//     });


// ------------------------------------------------------------------
// ROSSERVICE MAPPING LISTS
// ------------------------------------------------------------------

var rosservice_num = 0;
var rosservice_list = [];

var n = 0;

var my_status = setInterval(rosservice_status_checker, 2000);

function rosservice_status_checker() {
  var current_time = new Date().getTime();
  for (var i = 0; i < rosservice_list.length; i++) {
    if ( (current_time - rosservice_list[0].last_time_stamp) > 2000 ) {
      document.getElementById('service_status_' + (i+1) ).style.color = "red";
    }
  }
}

document.getElementById("new_rosservice_field").addEventListener("click", function(event){
  event.preventDefault();
  new_rosservice_field();
});

function new_rosservice_field() {
  rosservice_num += 1;
  rosservice_list.push(new rosservice_route());
  console.log(rosservice_list.length);
  $('#rosservice_fields').append(
    "<div class=\"subsection\" id=\"service_subsection_" + rosservice_num + "\">\
    <br>\
    <div class=\"form-group\">\
      <label for=\"sel1\">Computer</label>\
      <select class=\"form-control\" id=\"service_subscribe_computers_" + rosservice_num + "\"></select>\
    </div>\
    <div class=\"form-group\">\
      <label for=\"pwd\">Subscribe Service</label>\
      <input type=\"text\" class=\"form-control\" id=\"sub_service_" + rosservice_num + "\" placeholder=\"Enter service\">\
    </div>\
    <div class=\"form-group\">\
      <label for=\"sel1\">Destination</label>\
      <select class=\"form-control\" id=\"service_publish_computers_" + rosservice_num + "\"></select>\
    </div>\
    <div class=\"form-group\">\
      <label for=\"pwd\">Publish Service</label>\
      <input type=\"text\" class=\"form-control\" id=\"pub_service_" + rosservice_num + "\" placeholder=\"Enter service\">\
    </div>\
    <div class=\"form-group\">\
      <label for=\"pwd\">Service Type</label>\
      <input type=\"text\" class=\"form-control\" id=\"srvs_type_" + rosservice_num + "\" placeholder=\"Enter type\">\
    </div>\
    <div class=\"form-group\">\
      <label style=\"color:red\" id=\"service_status_" + rosservice_num + "\">STATUS</label>\
    </div>\
    <!-- <div class=\"form-group\">\
      <button class=\"btn btn-default\" id=\"service_delete_button_" + rosservice_num + "\">Remove</button>\
    </div>\
    <script>\
    document.getElementById(\"service_delete_button_" + rosservice_num + "\").addEventListener(\"click\", function(event){\
      event.preventDefault();\
      console.log(\"going to deltete\");\
      $(\"#service_subsection_" + rosservice_num + "\").remove();\
    });\
    </script> --> \
    <div>");
}

// document.getElementById("refresh_rosservice_fields").addEventListener("click", function(event){
//   event.preventDefault();
//   update_rosservice_dropdowns();
// });

function update_rosservice_dropdowns() {
  for (var i = 0; i < rosservice_list.length; i++) {
    var sub_comp_div = document.getElementById('service_subscribe_computers_' + (i+1) );
    var pub_comp_div = document.getElementById('service_publish_computers_' + (i+1) );
    var current_sub_comp = sub_comp_div.value;
    var current_pub_comp = pub_comp_div.value;
    sub_comp_div.innerHTML = "";
    pub_comp_div.innerHTML = "";

    for (computer_ip in computer_dict) {
      computer_name = computer_dict[computer_ip].name;
      sub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
      pub_comp_div.innerHTML += "<option>" + computer_name + "</option>";
    }

    sub_comp_div.value = current_sub_comp;
    pub_comp_div.value = current_pub_comp;
  }
}
function rosservice_route() {
  var obj = {};
  obj.storage;
  obj.num;
  obj.sub_service;
  obj.pub_service;
  obj.last_time_stamp = new Date().getTime();
  obj.recently_sent_from_sub = []
  obj.recently_sent_from_pub = []

  obj.unsubscribe_all = function() {

    try {
        obj.sub_service.unsubscribe();
        obj.pub_service.unsubscribe();
    }
    catch(err) {
        console.log("Nothing to unsubscribe.");
    }

  };

  obj.normal_init = function(num, sub_comp, sub_service, pub_comp, pub_service, srvs_type) {
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

    obj.sub_service = new ROSLIB.Service({
      ros : sub_computer,
      name : sub_service,
      serviceType: srvs_type
    });

    obj.pub_service = new ROSLIB.Service({
      ros : pub_computer,
      name : pub_service,
      serviceType : srvs_type
    });

    // these two lines are for testing
    // name: '/add_two_ints',
    // serviceType: 'rospy_tutorials/AddTwoInts'

    // Ethan is getting some problems here with an infinite loop
    obj.sub_service.advertise(function(req, resp) { // look into javascript promises
      // resp.sum = req.a + req.b;
      // console.log(resp.sum);
      // console.log("Heck yeah!!!");
      obj.pub_service.callService(req, function(result) {
        console.log('Result for service call on ' + obj.pub_service.name + ': ' + result.sum);
        resp = result;
        return true;
      });
      // return true; //moved this up and then it worked
    });

  };

  obj.initialize = function(num, sub_comp, sub_service, pub_comp, pub_service, srvs_type) {

    obj.storage = [num, sub_comp, sub_service, pub_comp, pub_service, srvs_type];

    console.log(num);
    console.log(sub_comp);
    console.log(sub_service);
    console.log(pub_comp);
    console.log(pub_service);
    console.log(srvs_type);

    obj.num = num;

    obj.normal_init(num, sub_comp, sub_service, pub_comp, pub_service, srvs_type);
    console.log("ROS Service Init.")

  }
  return obj;
}

function update_rosservice_routes() {
  for (var i = 0; i < rosservice_list.length; i++) {
    rosservice_list[i].unsubscribe_all();
    var sub_comp = document.getElementById('service_subscribe_computers_' + (i+1) ).value;
    var sub_service = document.getElementById('sub_service_' + (i+1) ).value;
    var pub_comp = document.getElementById('service_publish_computers_' + (i+1) ).value;
    var pub_service = document.getElementById('pub_service_' + (i+1) ).value;
    var srvs_type = document.getElementById('srvs_type_' + (i+1) ).value;
    rosservice_list[i].initialize(i+1, sub_comp, sub_service, pub_comp, pub_service, srvs_type);
  }
}
document.getElementById("start_service_routing").addEventListener("click", function(event){
  event.preventDefault();
  update_rosservice_routes();
});

function clear_rosservice_list() {
  rosservice_list = [];
  rosservice_num = 0;
  document.getElementById("rosservice_fields").innerHTML = "";

}

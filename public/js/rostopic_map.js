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
        if ( (current_time - rostopic_list[0].last_update) > 2000 ) {
          document.getElementById('topic_status_' + (i+1) ).style.color = "red";
        }
      }
    }


    document.getElementById("new_rostopic_field").addEventListener("click", function(event){
      event.preventDefault();
      new_rostopic_field();
    });
    function new_rostopic_field() {
      rostopic_num += 1;
      rostopic_list.push(new rostopic_route());
      console.log(rostopic_list.length);
      $('#rostopic_fields').append(
        "<br>\
        <div class=\"form-group\">\
          <label for=\"sel1\">Computer</label>\
          <select class=\"form-control\" id=\"subscribe_computers_" + rostopic_num + "\"></select>\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">Subscribe Topic</label>\
          <input type=\"text\" class=\"form-control\" id=\"sub_topic_" + rostopic_num + "\" placeholder=\"Enter topic\">\
        </div>\
        <div class=\"form-group\">\
          <label for=\"sel1\">Destination</label>\
          <select class=\"form-control\" id=\"publish_computers_" + rostopic_num + "\"></select>\
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
          <label style=\"color:red\" id=\"topic_status_" + rostopic_num + "\">STATUS</label>\
        </div>");
    }

    document.getElementById("refresh_rostopic_fields").addEventListener("click", function(event){
      event.preventDefault();
      update_rostopic_dropdowns();
    });
    function update_rostopic_dropdowns() {
      for (var i = 0; i < rostopic_list.length; i++) {
        var current_sub_comp = document.getElementById('subscribe_computers_' + (i+1) ).value;
        var current_pub_comp = document.getElementById('publish_computers_' + (i+1) ).value;
        var sub_comp_div = document.getElementById('subscribe_computers_' + (i+1) );
        var pub_comp_div = document.getElementById('publish_computers_' + (i+1) );
        sub_comp_div.innerHTML = "";
        pub_comp_div.innerHTML = "";
        for (var j = 0; j < computer_list.length; j++) {
          var name = computer_list[j].name;
          if (name != "") {
            sub_comp_div.innerHTML += "<option>" + name + "</option>";
            pub_comp_div.innerHTML += "<option>" + name + "</option>";
          }
          document.getElementById('subscribe_computers_' + (i+1) ).value = name;
        }
        document.getElementById('subscribe_computers_' + (i+1) ).value = current_sub_comp;
        document.getElementById('publish_computers_' + (i+1) ).value = current_pub_comp;
      }
    }
    function rostopic_route() {
      var obj = {};
      obj.num;
      obj.storage;// = [6];
      obj.sub_topic;
      obj.pub_topic;
      obj.last_update = new Date().getTime();
      obj.initialize = function(num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type) {
        
        console.log(num);
        console.log(sub_comp);
        console.log(sub_topic);
        console.log(pub_comp);
        console.log(pub_topic);

        obj.num = num;

        obj.storage = [num, sub_comp, sub_topic, pub_comp, pub_topic, msg_type];

        var sub_computer;
        var pub_computer;
        for (var i = 0; i < computer_list.length; i++ ) {
          if (sub_comp == computer_list[i].name) {
            sub_computer = computer_list[i].ros;
            console.log(sub_computer);
          }
        }
        for (var i = 0; i < computer_list.length; i++ ) {
          if (pub_comp == computer_list[i].name) {
            pub_computer = computer_list[i].ros;
            console.log(pub_computer);
          }
        }

        obj.sub_topic = new ROSLIB.Topic({
          ros : sub_computer,
          name : sub_topic,
          messageType : msg_type
        });

        obj.pub_topic = new ROSLIB.Topic({
          ros : pub_computer,
          name : pub_topic,
          messageType : msg_type
        });

        obj.sub_topic.subscribe(function(message) {
          console.log('Received message on ' + sub_topic.name + ': ' + sub_topic.data);
          // listener.unsubscribe();
          // document.body.style.backgroundColor = "green";
          last_update = new Date().getTime();
          document.getElementById('topic_status_' + num ).style.color = "green";
          console.log(last_update);
          obj.pub_topic.publish(message);
        });
      }
      return obj;
    }
    function update_rostopic_routes() {
      // console.log("here we go :D");
      for (var i = 0; i < rostopic_list.length; i++) {
        var sub_comp = document.getElementById('subscribe_computers_' + (i+1) ).value;
        var sub_topic = document.getElementById('sub_topic_' + (i+1) ).value;
        var pub_comp = document.getElementById('publish_computers_' + (i+1) ).value;
        var pub_topic = document.getElementById('pub_topic_' + (i+1) ).value;
        var msg_type = document.getElementById('msg_type_' + (i+1) ).value;
        rostopic_list[i].initialize(i+1, sub_comp, sub_topic, pub_comp, pub_topic, msg_type);
      }
    }
    document.getElementById("start_routing").addEventListener("click", function(event){
      event.preventDefault();
      update_rostopic_routes();
    });

    function clear_rostopic_list() {
      rostopic_list = [];
      rostopic_num = 0;
      document.getElementById("rostopic_fields").innerHTML = "";

    }

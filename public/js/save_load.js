// --------------------------------------------------------------------------------
// SAVE FILE
// ---------------------------------------------------------
    document.getElementById("save_data").addEventListener("click", function(event){
      event.preventDefault();
      var json_string = generate_json();
      console.log(json_string);

      // this is used to convert json_string back to an object
      // var object = JSON.parse(json_string);
      // console.log(object);

      var filename = prompt("Please enter the filename to be saved.", "config.txt");
      if (filename != null) {
        var parameters = { json: json_string, name: filename };
        $.get( '/save',parameters, function(data) {
          // $('#results').html(data);
          console.log(data);
        });
      }
    });

    document.getElementById("load_data").addEventListener("click", function(event){
      event.preventDefault();

      clear_computer_list();
      clear_rostopic_list();

      var filename = "";
      var f = document.getElementById("config_file");
      filename = f.files[0]['name'];

      var master_list;
      var parameters = { file: filename };
      $.get( '/load', parameters, function(data) {

        master_list = data;

        console.log(master_list);
        console.log(master_list.computer_list);

        for (var i = 0; i < master_list.computer_list.length; i++ ) {
          new_computer_field();
          var name = master_list.computer_list[i]['name'];
          var ip = master_list.computer_list[i]['ip'];
          var comp_id = 'computer_' + (i+1);
          document.getElementById(comp_id).value = name;
          var ip_id = 'ip_' + (i+1);
          document.getElementById(ip_id).value = ip;
          computer_list[i].initialize(name, ip);
        }

        for (var i = 0; i < master_list.rostopic_list.length; i++) {
          new_rostopic_field();
          update_rostopic_dropdowns();
          var sub_comp = master_list.rostopic_list[i]['from'];
          var msg_type = master_list.rostopic_list[i]['msg_type'];
          var pub_topic = master_list.rostopic_list[i]['pub'];
          var sub_topic = master_list.rostopic_list[i]['sub'];
          var pub_comp = master_list.rostopic_list[i]['to'];
          var checkbox = master_list.rostopic_list[i]['checked'];
          document.getElementById('subscribe_computers_' + (i+1) ).value = sub_comp;
          document.getElementById('sub_topic_' + (i+1) ).value = sub_topic;
          document.getElementById('publish_computers_' + (i+1) ).value = pub_comp;
          document.getElementById('pub_topic_' + (i+1) ).value = pub_topic;
          document.getElementById('msg_type_' + (i+1) ).value = msg_type;
          document.getElementById('checkbox_' + (i+1) ).checked = checkbox;
          rostopic_list[i].initialize(i+1, sub_comp, sub_topic, pub_comp, pub_topic, msg_type, checkbox);
        }


      });

    });

    function generate_json() {

      var computer_string = "{ \"computer_list\" : [";
      for (var i = 0; i < computer_list.length; i++) {
        computer_string += "{";
        computer_string += "\"name\": " + JSON.stringify(computer_list[i].name) + ",";
        computer_string += "\"ip\": " +JSON.stringify(computer_list[i].ip);
        computer_string += "}";
        if (i < computer_list.length - 1) {
          computer_string += ",";
        }
      }

      computer_string += "],";

      var rostopic_string = "\"rostopic_list\" : [";
      for (var i = 0; i < rostopic_list.length; i++) {
        rostopic_string += "{";
        rostopic_string += "\"from\": " + JSON.stringify(rostopic_list[i].storage[1]) + ",";
        rostopic_string += "\"sub\": " + JSON.stringify(rostopic_list[i].storage[2]) + ",";
        rostopic_string += "\"to\": " +JSON.stringify(rostopic_list[i].storage[3]) + ",";
        rostopic_string += "\"pub\": " + JSON.stringify(rostopic_list[i].storage[4]) + ",";
        rostopic_string += "\"msg_type\": " + JSON.stringify(rostopic_list[i].storage[5]) + ",";
        rostopic_string += "\"checked\": " + JSON.stringify(rostopic_list[i].storage[6]);
        rostopic_string += "}";
        if (i < rostopic_list.length - 1) {
          rostopic_string += ",";
        }
      }
      rostopic_string += "]}";

      return computer_string + rostopic_string;

    }

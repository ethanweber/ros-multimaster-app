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

      var parameters = { json: json_string };
      $.get( '/save',parameters, function(data) {
        // $('#results').html(data);
        console.log(data);
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
        rostopic_string += "\"msg_type\": " + JSON.stringify(rostopic_list[i].storage[5]);
        rostopic_string += "}";
        if (i < rostopic_list.length - 1) {
          rostopic_string += ",";
        }
      }
      rostopic_string += "]}";

      return computer_string + rostopic_string;

    }

// --------------------------------------------------------------------------------------
// COMPUTER FIELDS
// ----------------------------------------------------------------------
    var computer_num = 0;
    var computer_list = [];
    document.getElementById("new_computer_field").addEventListener("click", function(event){
      event.preventDefault();
      new_computer_field();
    });
    function new_computer_field() {
      computer_num += 1;
      computer_list.push(new computer());
      console.log(computer_list.length);
      $('#computer_fields').append(
        "<div class=\"subsection\">\
        <br>\
        <div class=\"form-group\">\
          <label for=\"email\">Computer " + computer_num + ":</label>\
          <input type=\"email\" class=\"form-control\" id=\"computer_" + computer_num + "\" placeholder=\"Enter name\">\
        </div>\
        <div class=\"form-group\">\
          <label for=\"pwd\">IP Address " + computer_num + ":</label>\
          <input type=\"text\" class=\"form-control\" id=\"ip_" + computer_num + "\" placeholder=\"Enter IP\">\
        </div>\
        </div>");
    }
    document.getElementById("submit_computer_fields").addEventListener("click", function(event){
      event.preventDefault();
      update_fields();
    });
    function update_fields() {
      for (var i = 0; i < computer_list.length; i++) {
        var comp_id = 'computer_' + (i+1);
        var name = document.getElementById(comp_id).value;
        var ip_id = 'ip_' + (i+1);
        var ip = document.getElementById(ip_id).value;
        computer_list[i].initialize(name, ip);
      }
      console.log(computer_list);
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
          url : 'ws://' + ip_address + ':9090'
        });
      }
      return obj;
    }

    function clear_computer_list() {
      computer_list = [];
      computer_num = 0;
      document.getElementById("computer_fields").innerHTML = "";

    }

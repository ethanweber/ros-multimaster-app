
// Main ROS Multimaster object that gets passed to the server to show updates from the user
// and that is compared to the same structured object from the server to show changes
var ros_mm_obj = {
  //structure of ros websocket conections
  // key = ip_address of the ros websocket masters
  // values = 'computer_name'...
  'computers':{},
  //structure for ros topics
  'topics':{},
  //structure for ros services
  'services':{}
};

// connect socket to server
var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){
  clear_console();
  add_console_msg('green','Connected to the MultiMaster Server!');
});
socket.on('disconnect', function(){
  clear_console();
  add_console_msg('red','Disconnected from the MultiMaster Server!');
});

// listen to update event raised by the server
 socket.on('update', function (data) {
   console.log(data);
   update_computers(data);
   // make sure object still has all the required structures
   if (data.computers && data.topics && data.services){
     console.log('correct data format');
   }
   else if (data.type=='green' || data.type=='red'){
     add_console_msg(data.type,data.message);
   }
   else if (data.type=='topic-names'){
     update_rostopic_dropdowns(data);
   }
   // response to the server-side
   // maybe success or failure message?
   response = 'success'
  //  socket.emit('update-response', response); // raise an event on the server
 });

function update_from_ui(msg){
  console.log({'data':ros_mm_obj,'msg':msg})
  socket.emit('update',{'data':ros_mm_obj,'msg':msg}); // raise an event on the server
}

 function test_socket_send(){
   socket.emit('update', ros_mm_obj); // raise an event on the server
 }

 function test_socket_return(){
   socket.emit('test', ros_mm_obj); // raise an event on the server
 }

 function test_socket_request(){
   socket.emit('request', 'any updates?'); // raise an event on the server
 }

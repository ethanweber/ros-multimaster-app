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

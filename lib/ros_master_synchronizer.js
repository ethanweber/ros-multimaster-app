var ROSLIB = require('roslib');
require('colors')
var RTR = require('./rostopic_mapper');

class ROSMasterSynchronizer {
  constructor() {
    this.computers = {}
    // Fields for important things
    this.rostopic_routers = []

  }

  ////////////////////////////////////////////////////////
  //
  // Adding computers
  //
  ////////////////////////////////////////////////////////
  add_computer(name, ip) {
    // Don't allow already-existing names
    if (name in this.computers) {
      console.logerr("Name already exists! Not adding.")
      return false;
    }
    // Add it
    var ros = new ROSLIB.Ros()
    this.computers[name] = {
      name: name,
      ip: ip,
      ros: ros
    }

    // Set up some handlers
    ros.on('connection', function() {
      console.log('Connected'.green.bold + " to " + name + " (" + ip + ")");
    });
    ros.on('error', function() {
      console.log('Error'.red.bold + " connecting to " + name + " (" + ip + ")");
    });
    ros.on('close', function() {
      console.log('Disconnected'.red.bold + " from " + name + " (" + ip + ")");
    })


    return true;
  }


  get_computer(name) {
    return this.computers[name];
  }


  connect_to_computer(name) {
    var computer = this.get_computer(name);
    computer.ros.connect('ws://' + computer.ip + ':9090')
  }


  connect_to_all_computers() {
    var names = Object.keys(this.computers);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var success = this.connect_to_computer(name);
    }
  }

  disconnect_all(name) {
    var names = Object.keys(this.computers);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      console.log('Disconnecting'.green.bold + ' from ' + name);
      try {
        this.computers[name].ros.close();
      } catch (err) {
        // Do nothing
      }
    }
    return true;
  }


  ////////////////////////////////////////////////////////
  //
  // ROS topic routing
  //
  ////////////////////////////////////////////////////////
  add_topic_router(computer_from_name, computer_from_topic, computer_to_name, computer_to_topic, message_type, loop) {
    // Retrieve the ROSLIB.Ros objects for each computer
    var ros_sub = this.computers[computer_from_name].ros;
    var ros_pub = this.computers[computer_to_name].ros;
    // Set up (but don't start) a topic router
    var rtr = new RTR.ROSTopicRouter(ros_sub, computer_from_topic, ros_pub, computer_to_topic, message_type, loop);
    this.rostopic_routers.push(rtr);
    return rtr;
  }


  update_topic_router(index, computer_from_name, computer_from_topic, computer_to_name, computer_to_topic, message_type, loop) {
    // Called when we want to update the routing; changing message types, computers, looping, etc.
    // This should be called whenever the GUI updates.
    // Retrieve the desired ROS topic router
    var rtr = this.rostopic_routers[index];
    // Stop it
    rtr.stop();
    // Create a new, updated one
    var rtr_updated = new RTR.ROSTopicRouter(ros_sub, computer_from_topic, ros_pub, computer_to_topic, message_type, loop);
    this.rostopic_routers[index] = rtr_updated;
    // Start it!
    rtr_updated.start()
  }


  start_all_topic_routing() {
    // Start them all up!
    for (var i = 0; i < this.rostopic_routers.length; i++) {
      this.rostopic_routers[i].start();
    }
  }


  ////////////////////////////////////////////////////////
  //
  // Loading configuration files
  //
  ////////////////////////////////////////////////////////
  load_configuration(config) {
    // console.log(config);
    // First, load computers
    for (var i = 0; i < config.computer_list.length; i++) {
      var computer_info = config.computer_list[i];
      this.add_computer(computer_info.name, computer_info.ip);
    }

    // Next, load topic routing
    for (var i = 0; i < config.rostopic_list.length; i++) {
      var topic_info = config.rostopic_list[i];
      this.add_topic_router(topic_info.from, topic_info.sub, topic_info.to, topic_info.pub, topic_info.msg_type, topic_info.loop)
    }

    // Connect to all computers
    this.connect_to_all_computers();

    // Start all topic routers
    this.start_all_topic_routing();

  }


}

// Export it so other files can use this class
module.exports.ROSMasterSynchronizer = ROSMasterSynchronizer;

var ROSLIB = require('roslib');
require('colors')
var RTR = require('./rostopic_mapper');

var global_topics_list = {};

// var rms = {};

class ROSMasterSynchronizer {
  constructor(socket) {
    this.client = socket;
    this.computers = {};
    this.topic_names = {};
    this.msg_types = {};
    this.rostopic_routers = {};
    this.valid_messages = {
      'unknown': '',
      'connected': '',
      'error': '',
      'disconnected': ''
    }
  }

  reset_rms() {
    this.computers = {};
    this.topic_names = {};
    this.msg_types = {};
    this.rostopic_routers = {};
  }

  clean_computers() {
    var without_ros = {};
    var computers = this.computers
    var name;
    for (name in computers) {
      without_ros[name] = {
        name: name,
        ip: computers[name].ip,
        status: computers[name].status
      }
    }
    return without_ros;
  }

  clean_routers() {
    var without_ros = {};
    var topic_routers = this.rostopic_routers;
    var router_id;
    console.log('clean_routers:')
    console.log(topic_routers);

    for (router_id in topic_routers) {
      console.log(router_id);
      console.log(topic_routers[router_id]);
      without_ros[router_id] = {
        id: router_id,
        status: topic_routers[router_id].status
        // more stuff like sub_comp, sub_topic...
        // not needed yet
      };
    }
    return without_ros;
  }
  ////////////////////////////////////////////////////////
  //
  // Adding computers
  //
  ////////////////////////////////////////////////////////
  add_computer(name, ip) {
    // Don't allow already-existing names
    console.log('Adding computer \'' + name + '\'');
    if (name in this.computers) {
      console.log("Name already exists! Not adding.");
      return false;
    }
    // Add it
    var ros = new ROSLIB.Ros()
    this.computers[name] = {
      name: name,
      ip: ip,
      ros: ros,
      status: 'unknown'
    }

    // this.add_handlers()
    var rms = this;

    // Set up some handlers
    ros.on('connection', function() {
      console.log('Connected'.green.bold + " to \'" + name + "\' (" + ip + ")");
      rms.update_computer_status(name, 'connected');
    });
    ros.on('error', function() {
      console.log('Error'.red.bold + " connecting to \'" + name + "\' (" + ip + ")");
      rms.update_computer_status(name, 'error');
    });
    ros.on('close', function() {
      console.log('Disconnected'.red.bold + " from \'" + name + "\' (" + ip + ")");
      rms.update_computer_status(name, 'error');
    })

    this.connect_to_computer(name);
    this.update_topics();

    return true;
  }

  update_topics() {
    this.topic_names = {};
    this.msg_types = {};

    var name,
      ros,
      topic,
      msg_type;

    var rms = this;

    for (name in this.computers) {

      console.log(name.blue.bold);

      ros = this.computers[name].ros;

      ros.getTopics(function(topics) {
        console.log('topics:');
        console.log(topics);
        for (var i = 0; i < topics.length; i++) {
          topic = topics[i];
          if (!(topic in rms.topic_names)) {
            // add topic as key to this.topic_names obj without real value
            // console.log('adding the topic_name: '+topic);
            rms.topic_names[topic] = ' ';
            global_topics_list[topic] = ' ';
            ros.getTopicType(topic, function(type) {
              // console.log('type:');
              // console.log(type);
              if (!(type in rms.msg_types)) {
                // add msg_type as key to this.msg_types obj without real value
                // console.log('adding the msg_type: '+type);
                rms.msg_types[type] = ' ';
                // console.log(rms);
                rms.push_update_to_client('topic-names', 'updated topic and msg_types')
              }
            });
          }
        }
      });
    }
  }

  get_computer(name) {
    return this.computers[name];
  }

  find_and_add_new_computers(data) {
    var name;
    for (name in data.computers) {
      if (!(name in this.computers)) {
        var new_computer = data.computers[name];
        this.add_computer(new_computer.name, new_computer.ip // attempt to reconnect to previously saved computer
        );
      } else if (data.computers[name].status == 'error') {
        console.log('Attempting to reconnect'.yellow.bold + ' to \'' + name + '\' (' + data.computers[name].ip + ')');
        this.connect_to_computer(name);
      }
    }
  }

  find_and_add_new_topics(data) {
    var route_id;
    for (route_id in data.topic_routes) {
      if (!(route_id in this.rostopic_routers)) {
        var new_route = data.topic_routes[route_id];
        this.add_topic_router(route_id, new_route);
      }
      // attempt to reconnect to previously saved computer
      // else if(data.computers[name].status=='error'){
      // console.log('Attempting to reconnect'.yellow.bold+' to \''+name+'\' (' + data.computers[name].ip + ')');
      // this.connect_to_computer(name);
      // }
    }
    // console.log(this.rostopic_routers);
    this.start_all_topic_routing();
  }

  push_update_to_client(type, msg) {
    console.log('push update');
    console.log(msg);
    // console.log(global_topics_list);
    // console.log(this);
    var computers = this.clean_computers();
    var topic_routers = this.clean_routers();
    // console.log('topic_routers:');
    // console.log(topic_routers);
    var data = {
      'type': type,
      'message': msg,
      'computers': computers,
      'topic_routers': topic_routers,
      'topics_list': Object.keys(this.topic_names),
      'msg_types': Object.keys(this.msg_types)
    };
    // this.client.on('connection', function(client2) {
    // client2.emit('update', data);
    // });
    this.client.emit('update', data);

  }

  // Update computer status text
  // Valid statuses: {'unknown','connected','error','disconnected'}
  update_computer_status(name, status_msg) {
    if (name in this.computers) {
      if (status_msg in this.valid_messages) {
        this.computers[name].status = status_msg;
        // console.log('updating computer status ' + name + ' ' + status_msg);
        if (status_msg == 'connected') {
          this.push_update_to_client('green', 'Computer \'' + name + '\' ' + status_msg);
        } else if (status_msg == 'error') {
          this.push_update_to_client('red', 'Computer \'' + name + '\' connection ' + status_msg);
        }
      } else {
        console.log('Error:'.red.bold + " Given status_msg: " + status_msg + " not a valid status");
      }
    }
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

  disconnect_all() {
    var names = Object.keys(this.computers);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      // console.log('Disconnecting'.green.bold + ' from \'' + name + '\'');
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
  add_topic_router(route_id, route_data) {
    console.log(route_data);
    // (computer_from_name, computer_from_topic, computer_to_name, computer_to_topic, message_type, loop) {
    this.rostopic_routers[route_id] = route_data;
    // Retrieve the ROSLIB.Ros objects for each computer
    var ros_sub = this.computers[route_data.sub_comp].ros;
    var ros_pub = this.computers[route_data.pub_comp].ros;
    // Set up (but don't start) a topic router
    var rtr = new RTR.ROSTopicRouter(ros_sub, route_data.sub_topic, ros_pub, route_data.pub_topic, route_data.msg_type, route_data.checked);
    this.rostopic_routers[route_id].rtr = rtr;
    console.log('Connected'.green.bold + ' topic route \'' + route_id + '\'');
    return rtr;
  }

  update_topic_router(index, computer_from_name, computer_from_topic, computer_to_name, computer_to_topic, message_type, loop) {
    // Called when we want to update the routing; changing message types, computers, looping, etc.
    // This should be called whenever the GUI updates.
    // Retrieve the desired ROS topic router
    var rtr = this.rostopic_routers[index].rtr;
    // Stop it
    rtr.stop();
    // Create a new, updated one
    var rtr_updated = new RTR.ROSTopicRouter(ros_sub, computer_from_topic, ros_pub, computer_to_topic, message_type, loop);
    this.rostopic_routers[index].rtr = rtr_updated;
    // Start it!
    rtr_updated.start()
  }

  start_all_topic_routing() {
    // Start them all up!
    var topic_id;
    for (topic_id in this.rostopic_routers) {
      this.rostopic_routers[topic_id].rtr.start();
      this.rostopic_routers[topic_id].status = 'connected'
      console.log(this.rostopic_routers);
      this.push_update_to_client('route-status','start_all_topic_routing');
    }
  }

  ////////////////////////////////////////////////////////
  //
  // Loading configuration files
  //
  ////////////////////////////////////////////////////////
  load_configuration(config) {
    // console.log(config);
    // First, load computersf
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

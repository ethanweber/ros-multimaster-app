// ------------------------------------------------------------------
// ROSTOPIC MAPPING LISTS
// ------------------------------------------------------------------

// Global variables

// var rostopic_num = 0;
// var rostopic_list = [];
// var n = 0;
//
// var my_status = setInterval(rostopic_status_checker, 2000);
//
// var list_of_topics = [];
// var list_of_msg_types = [];

var ROSLIB = require('roslib');
require('colors')

class ROSTopicRouter {

  constructor(ros_sub_comp, sub_topic, ros_pub_comp, pub_topic, msg_type, loop) {
    // Store these fields
    this.ros_sub = ros_sub_comp;
    this.ros_pub = ros_pub_comp;
    this.msg_type = msg_type;
    this.loop = loop;

    this.last_time_stamp = new Date().getTime();
    this.recently_sent_from_sub = []
    this.recently_sent_from_pub = []

    // Create ROS Topics
    this.sub_topic = new ROSLIB.Topic({
      ros: this.ros_sub,
      name: sub_topic,
      messageType: this.msg_type
    });

    this.pub_topic = new ROSLIB.Topic({
      ros: this.ros_pub,
      name: pub_topic,
      messageType: this.msg_type
    });
  }


  start() {
    // If looping is enabled, publish in both directions
    if (this.loop) {
      this.connect_bidirectional();
    } else {
      this.connect_unidirectional();
    }
  }


  stop() {
    try {
      this.sub_topic.unsubscribe();
      this.pub_topic.unsubscribe();
    } catch (err) {
      console.log("Nothing to unsubscribe.");
    }
  }


  connect_unidirectional() {
    // Only publish in one direction
    // Tell the subscribe topic to publish back!
    var self = this;
    this.sub_topic.subscribe(function(message) {
      // change the color to green when in use
      self.last_time_stamp = new Date().getTime();
      // document.getElementById('topic_status_' + num).style.color = "green";
      self.pub_topic.publish(message);
    });
  }


  connect_bidirectional() {
    // Publish in both directions! Need to also detect cycles so we don't
    // have infinite loops
    var self = this;
    this.sub_topic.subscribe(function(message) {
      // change the color to green when in use
      self.last_time_stamp = new Date().getTime();
      // document.getElementById('topic_status_' + num).style.color = "green";
      var msg_str = JSON.stringify(message);
      if (self.recently_sent_from_pub.indexOf(msg_str) < 0) {
        self.pub_topic.publish(message);
        self.recently_sent_from_sub.push(msg_str);
        if (self.recently_sent_from_sub.length > 10) {
          self.recently_sent_from_sub.shift();
        }
      }
    });

    this.pub_topic.subscribe(function(message) {
      // change the color to green when in use
      self.last_time_stamp = new Date().getTime();
      // document.getElementById('topic_status_' + num).style.color = "green";
      var msg_str = JSON.stringify(message);
      if (self.recently_sent_from_sub.indexOf(msg_str) < 0) {
        self.sub_topic.publish(message);
        self.recently_sent_from_pub.push(msg_str);
        if (self.recently_sent_from_pub.length > 10) {
          self.recently_sent_from_pub.shift();
        }
      }
    });
  }


}


// Export it
module.exports.ROSTopicRouter = ROSTopicRouter;

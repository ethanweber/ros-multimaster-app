# ROS MASTER SYNCHRONIZER

This program was created in the Model-Based Embedded and Robotics Systems (MERS) Group at MIT in CSAIL. When multiple robots are used in coordination, it is important to have ROS Topic and ROS Service information shared between the machines. This program bridges the gap between multiple ROS masters on the same network.

### ROS Topic Mapper

By using this simple web app, one can route one rostopic from one computer to another computer to many. It is also possible to close a loop so that the topic acts as a shared topic between the computers.

### ROS Service Mapper
#### *This is not yet active.*
This web app is also used to act as a router for ROS Services. It is possible to call a ROS Service with a service name set in the app and have it reroute and call the service on a separate ROS Master computer.

# How To Use
```
1. Install node.js and navigate to this directory. Run **node server.js** to use the application. Then navigate to the appropriate URL at **http://localhost:8080/**. Google Chrome was used when testing this application, but it should work in any browser.

2. Start ROS Websockets on each computer. Run **roslaunch rodbridge_server rosbridge_websocket.launch** for each ROS Master used on the network.
```

# Developer Notes
1. In an old version of rosbridge_suite, there is a 10ms delay when sending messages. It's important to use the newest version. I ran into this problem when testing with a XWAM robot with old software in the MERS lab.

# Referenced URLs
1. https://github.com/RobotWebTools/rosbridge_suite/issues/203
2. https://github.com/RobotWebTools/rosbridge_suite/blob/d7138dc810aa77b8066a0a2d77195172221a1977/rosbridge_library/src/rosbridge_library/protocol.py#L247-L248

#Configurable Inputs

![Alt text](images/screenshot_minimal.png?raw=true "Configurable Inputs")

# Example Use
![Alt text](images/screenshot_example.png?raw=true "Example Use")

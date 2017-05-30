# ROS MASTER SYNCHRONIZER

This program was created in the Model-Based Embedded and Robotics Systems (MERS) Group at MIT in CSAIL. When multiple robots are used in coordination, it is important to have ROS Topic and ROS Service information shared between the machines. This program bridges the gap between multiple ROS Masters on the same network.

### ROS Topic Mapper

By using this simple web app, one can route one rostopic from one computer to another computer to many. It is also possible to close a loop so that the topic acts as a shared topic between the computers.

### ROS Service Mapper
#### *This is not yet active. I'm currently solving a nested Javascript callback issue.*
This web app is also used to act as a router for ROS Services. It is possible to call a ROS Service with a service name set in the app and have it reroute and call the service on a separate ROS Master computer.

# How To Use
### Initial Setup
1. Install node.js and navigate to this directory. Run **node server.js** to use the application.

2. Start ROS Websockets on each computer. Run **roslaunch rodbridge_server rosbridge_websocket.launch** for each ROS Master used on the network.

3. Navigate to the appropriate URL at **http://localhost:8080/** for configuration. Google Chrome was used when testing this application, but it should work in any browser. The web app should only run on one computer.

4. Click **"Add Computer"** for each computer used on the network. Enter a name for each computer and the local IP address for each used ROS Master. When finished adding each computer, click **"Submit"**.

### ROS Topic Mapper Use
```
1. Click **"Add Rostopic Route"** for each route desired.
2. Click **"Refresh"** to update the "Computer" field dropdowns.
3. Fill out the fields to route a topic name from one computer to another computer.
4. Make sure the enter the ROS msg type. It can be found by running rostopic info *name of topic* in the terminal.
5. Check the *Loop Box* to make it a closed loop to have the topic the same on both computers.
6. Click **"Start Topic Routing"** after entering the information. Your ROS topic should now be synchronized!
```

### ROS Service Mapper Use
```
This is not yet functional, but it nearly complete.
```

### Saving and Uploading
```
1. To save a working configuration, click **"Save File"** and enter a **.txt** filename.
2. To upload a previously saved file, click **"Choose File"** and then **"Upload File"** after choosing a file.
```

# Examples Usage
![Alt text](images/gui.png?raw=true "Configurable Inputs")

# Developer Notes
1. In an old version of rosbridge_suite, there is a 10ms delay when sending messages. It's important to use the newest version. I ran into this problem when testing with a XWAM robot with old software in the MERS lab.

# Referenced URLs
1. https://github.com/RobotWebTools/rosbridge_suite/issues/203
2. https://github.com/RobotWebTools/rosbridge_suite/blob/d7138dc810aa77b8066a0a2d77195172221a1977/rosbridge_library/src/rosbridge_library/protocol.py#L247-L248

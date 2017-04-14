# rostopic_mapper

This program is to pass rostopic messages between computers on the same network.

Navigate to this directory and run node server.js to use the application. Then navigate to the appropiate URL in using Google Chrome (the browser used for testing).

#Configurable Inputs

![Alt text](images/screenshot_minimal.png?raw=true "Configurable Inputs")

# Example Use
![Alt text](images/screenshot_example.png?raw=true "Example Use")

Here's how to run:
```
roslaunch rodbridge_server rosbridge_websocket.launch on each computer

node server.js

open localhost:8080

add files or load file

to save, save as .txt file after clicking start routing button

```


FIXED PROBLEM:

there was a 10 ms delay in the old code on the loki robot. rosbridge_suite needed to be updated

https://github.com/RobotWebTools/rosbridge_suite/issues/203

https://github.com/RobotWebTools/rosbridge_suite/blob/d7138dc810aa77b8066a0a2d77195172221a1977/rosbridge_library/src/rosbridge_library/protocol.py#L247-L248

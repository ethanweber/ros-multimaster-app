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

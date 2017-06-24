
### June 23, 2017 ~10pm [mdeyo]

- added time stamp based UUIDs for the topic blocks to ID the different topic routes robustly 

### June 23, 2017 ~5pm [mdeyo]

Possible things to work on this evening:

- update rostopic names currently happens twice in a row, find out why and fix! -> found the issue, called within the wrong loop
- want the topic block to turn green when successfully connected on the server ->
- want the topic block to turn orange when 'route topics' but inputs notFilled
- want the topic block to turn red when error occurs while routing on server
- all other possible issues I can think of avoided because dropdown computer names match what is connected on the server
- when a computer block turns red -> turn a rostopic block red with that computer
- require 'route topics' again to fix broken topic route after computer disconnected/reconnected
- remove computer names from dropdowns when disconnected? or just make the topic block red immediately

- check to make sure that the server function for updating topic routes works!
	- change a sub/pub computer
	- change a sub/pub topic name
	- change a msg_type

- what happens when msg_type sent to the server is incorrect for the sub topic or unavailable on sub_comp

Cool feature: autopopulate the msg_type input as soon as the pub_topic is selected (if it already exists in pub_comp)

How to handle rostopic routing when topics with 2 different msg_types are input??


### Starting this log of notes on June 23, 2017 [mdeyo]

Going to put newer stuff on the top of the document ^^

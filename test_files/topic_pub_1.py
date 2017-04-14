#!/usr/bin/env python
# license removed for brevity
import rospy
from std_msgs.msg import String
import random

def talker():
    pub = rospy.Publisher('chatter_1', String, queue_size=10)
    rospy.init_node('talker_1', anonymous=True)
    rate = rospy.Rate(250) # 10hz
    while not rospy.is_shutdown():
        # hello_str = raw_input('Enter input: ')
        hello_str = "asdfghjklqweryupozxcvlkjahsdfiubew"
        hello_str = hello_str[random.randint(1, len(hello_str) - 1):]
        rospy.loginfo(hello_str)
        pub.publish(hello_str)
        rate.sleep()

if __name__ == '__main__':
    try:
        talker()
    except rospy.ROSInterruptException:
        pass

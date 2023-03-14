#!/bin/bash
cd /home/ubuntu/Webpage
sudo npm install
sudo nohup node bin/www > /dev/null 2>&1 &

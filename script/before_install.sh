#!/bin/bash

PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      sudo kill "$PID"
 fi
cd /home/ubuntu/webpage/Webpage
sudo apt install npm -y
sudo apt install nodejs -y
sudo apt install mysql-client -y
sudo npm install

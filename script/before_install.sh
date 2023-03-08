#!/bin/bash

PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      sudo kill "$PID"
 fi
sudo apt install npm -y
sudo apt install nodejs -y
sudo apt install mysql-client -y
cd /home/ubuntu/webpage/
git pull
npm install

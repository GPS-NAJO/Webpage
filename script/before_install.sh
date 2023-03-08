#!/bin/bash
sudo su

PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      kill "$PID"
 fi
apt install npm -y
apt install nodejs -y
apt install mysql-client -y
cd /home/ubuntu/webpage/
git pull
npm install

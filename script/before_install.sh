#!/bin/bash
sudo su

PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      kill "$PID"
 fi
cd /home/ubuntu/webpage/
git pull
apt install npm -y
apt install nodejs -y
apt install mysql-client -y
node bin/www &

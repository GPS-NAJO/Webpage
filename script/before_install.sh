#!/bin/bash
sudo apt install npm -y

sudo apt install nodejs -y

sudo apt install mysql-client -y

sudo su

PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      kill "$PID"
 fi
cd /home/ubuntu/webpage/
git pull
npm install
node bin/www &
exit

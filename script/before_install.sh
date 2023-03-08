#!/bin/bash

PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      sudo kill "$PID"
 fi
cd /home/ubuntu
git pull
sudo npm install

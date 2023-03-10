#!/bin/bash

cd /home/ubuntu/Webpage
git pull
PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      sudo kill "$PID"
 fi

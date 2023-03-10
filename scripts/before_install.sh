#!/bin/bash

cd /home/ubuntu/Webpage
PID=$(pgrep -f -e "node bin/www")
 if [ -n "$PID" ]; then
     sudo kill "$PID"
 fi

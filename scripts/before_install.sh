#!/bin/bash

sudo cd /home/ubuntu/Webpage
PID=$(pgrep -f "node bin/www")
 if [ -n "$PID" ]; then
      sudo kill "$PID"
 fi

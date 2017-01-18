#!/bin/sh /etc/rc.common
START=99
STOP=15

start(){
  echo start
  node /root/app/app.js
}

stop(){
  echo stop
}

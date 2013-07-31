#!/bin/bash

akkahome=$AKKA_HOME
export AKKA_HOME=""
java -Dsbt.log.noformat=true -Xmx1024M -XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled -XX:+CMSClassUnloadingEnabled -XX:MaxPermSize=256m -jar `dirname $0`/sbt-launch.jar "$@"
RETVAL=$?
export AKKA_HOME=akkahome
exit $RETVAL


#!/bin/bash
interval=60
jobname="simplejob"
cmd="/usr/bin/php cron.php"
if [[ $2 =~ ^[1-9][0-9]*$ ]]; then
    interval="$2"        
fi
if [ "$1" = "start" ]; then	
	python crontab.py -i$interval -j$jobname start $cmd > $jobname.log 2>&1 &
elif [ "$1" = "stop" ]; then
	python crontab.py -j$jobname stop
fi

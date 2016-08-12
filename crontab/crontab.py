# !python
import sys
import os
import copy
import subprocess
import threading
import getopt
from threading import Thread
workdir =  os.path.dirname(os.path.realpath(__file__))
# stop
def stop():
    if os.path.isfile(startfile):
        os.system('touch ' + stopfile)
        os.remove(startfile)
        while True:
            if os.path.isfile(stopfile):
                threading._sleep(1)
            else:
                break
        print 'the job "'+jobname+'" stoped'
    else:
        print 'the job "'+jobname+'" did not start yet!'
    
class Subjob(Thread):
    taskfile = []
    def setTaskcmd(self,cmd):
        self.taskfile = cmd        
    def run(self):
        if self.taskfile:
            status = subprocess.call(self.taskfile)            
            if status != 0:
                print status
    
# Crontab class  
class Crontab(Thread):
    interval = 5
    taskfile = ''
    def setInterval(self,interval):
        self.interval = interval
    def setTaskcmd(self,cmd):
        self.taskfile = cmd        
    def run(self):
        if self.taskfile:
            while True:
                cnt = 0
                if countarg:
                    argx = copy.deepcopy(self.taskfile)
                    argx.append(str(countarg))
                    try:
                        p = subprocess.Popen(argx,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
                        cnt,errors = p.communicate()
                        if errors:
                            print "error:" + errors
                        else:
                            cnt = int(cnt,10)                            
                    except subprocess.CalledProcessError as err:
                        print "except: " + err
                if cnt > 0 :
                    ts = []
                    print "sub task:" , cnt
                    for i in range(0,cnt):    
                        print "run task:",i                    
                        tx = Subjob()
                        argx = copy.deepcopy(self.taskfile)
                        argx.append(str(i))
                        tx.setTaskcmd(argx)
                        ts.append(tx)
                        tx.start()
                    for td in ts:
                        td.join()
                elif cnt == 0 and countarg == '':
                    status = subprocess.call(self.taskfile)
                    if status != 0:
                        print status
                    
                if os.path.isfile(stopfile):
                    os.remove(stopfile)
                    break
                threading._sleep(self.interval)
                
        if os.path.isfile(startfile):
            os.remove(startfile)
# main            
def main(interval,taskfile):
    if os.path.isfile(startfile):
        print 'the job "'+ jobname +'" had been started, we cannot start it for you now.'
        return 2
    os.system('touch ' + startfile)
    t = Crontab()
    Crontab.instance = t
    t.setInterval(interval)
    t.setTaskcmd(taskfile)
    t.start()
    t.join()
    return 0
    
def usage():
    print 'Usage: python '+__file__+' [options] <start [cmd [cmd_args...]]|stop>'
    print 'options:'
    print "\t-j,--job \tjob id or name"
    print "\t-i,--interval \tinterval,default 10"
    print "\t--arg \t\tget the count of sub task arg,the script will exit a status that represents the count of task"  
    print ''
    print '[cmd]    \t\tto be executed cmd,it is a shell script. default: php task.php'   
           
if __name__ == '__main__':
    try:
        opts, args = getopt.getopt(sys.argv[1:], "j:i:h", ["help","job=", "interval=","arg="])
    except getopt.GetoptError as err:
        usage()
        sys.exit(2)
    
    taskfile = []
    jobname   = '0'
    interval = 10
    countarg = ''
    for o, a in opts:
        if o in ("-j","--job"):
            jobname = a
        elif o in ("-i", "--interval"):
            interval = int(a)
            if interval<=0:
                interval = 10
        elif o in ("-h", "--help"):
            usage()
            sys.exit(0)
        elif o in ("--arg"):
            countarg = a
        else:
           print "unkown option " + o 
    
    startfile = os.path.join(workdir,'.start.job.'+jobname);
    stopfile  = os.path.join(workdir,'.stop.job.'+jobname);
    
    if os.path.isfile(stopfile):
        print 'stop signal was sent, please wait it to stop.'
        sys.exit(1)
    if len(args) >= 1 :
        if args[0] == 'start':
            if len(args) > 2:
                taskfile = args[1:]
            else:
                usage()
                sys.exit(1)
            try:
                sys.exit(int(main(interval,taskfile) or 0))
            except:
                if os.path.isfile(startfile):
                    os.remove(startfile)
        elif args[0] == 'stop':
            sys.exit(int(stop() or 0))
        else:
            usage()
            sys.exit(1)
    else:
        usage()
        sys.exit(1)
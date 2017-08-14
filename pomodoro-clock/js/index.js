 
  //hover functions
  $(".box").hover(function() {
    $(".box-right").toggleClass('cl-box2');
    $(".bar").toggleClass('cl-bar2');
  });
  
  $(".back").hover(function() {
    $(".box-right1").toggleClass('cl-back2');
    $(".bar1").toggleClass('cl-bar12');
  });
  
  $(".bad").hover(function() {
    $(".box-right2").toggleClass('cl-bad2');
    $(".ram").toggleClass('cl-ram2');
  });
 
 //workers
var Timer = function(mins) {
  var timer = Math.round(mins * 60 * 1000);
  var startTime = 0;
  var timeElapsed = 0;

  this.now = function() {
    return (new Date()).getTime();
  };

  this.start = function() {
    startTime = timeElapsed ? this.now() - timeElapsed : this.now();
  };

  this.pause = function() {
    timeElapsed = this.now() - startTime;
  };

  this.timeRemaining = function() {
    var remTime = startTime ? timer - (this.now() - startTime) : timer;
    return remTime;
  };
};

var duration = 25;
var breaktime = 5;
var x = new Timer(duration);
var $time;
var $pom;
var clockTimeout;
var isPom;

var Notification = window.Notification || window.mozNotification || window.webkitNotification;
Notification.requestPermission(function(permission) {});

function update() {
  var minutes, seconds, millisecs;
  var remTime = x.timeRemaining();
  var remTimeArr = formatTime(remTime);
  if (remTime > 0) {
    minutes = remTimeArr[0];
    seconds = remTimeArr[1];
    millisecs = remTimeArr[2];
    scaleBg();
  } 
  else {
    minutes = 0;
    seconds = 0;
    millisecs = 0;
    clearInterval(clockTimeout);
    clockTimeout = false;
    triggerAlarm();
    alertUser();
    isPom = !isPom;
    restart();
  }
  $time.innerHTML = padNums(minutes, 2) + ":" + padNums(seconds, 2); // + ':' + padNums(millisecs, 3);
}

function padNums(num, spaces) {
  num = "" + num;
  return ("0000" + num).substring(4 + num.length - spaces);
}

function formatTime(remTime) {
  var minutes = Math.floor(remTime / 60000);
  var seconds = Math.floor(remTime % 60000 / 1000);
  var millisecs = Math.floor(remTime % 60000 % 1000);
  return [minutes, seconds, millisecs];
}

function start() {
  if (!clockTimeout) {
    x.start();
    clockTimeout = setInterval(update, 1);
  }
}

function pause() {
  clearInterval(clockTimeout);
  clockTimeout = false;
  x.pause();
}

function setup() {
  $time = document.getElementById('timer');
  $dur = document.getElementById('duration');
  $brk = document.getElementById('break');
  $status = document.getElementById('timer-status');
  $dur.innerHTML = duration;
  $brk.innerHTML = breaktime;
  isPom = true;
  update();
}

function reset() {
  x = new Timer(duration);
  clearInterval(clockTimeout);
  clockTimeout = false;
  update();
}

function restart(){
  x = isPom ? new Timer(duration) : new Timer(breaktime);
  $status.className = isPom ? 'pomodoro-color' : 'break-color';
  start();
}

//Scale background pom
function scaleBg(){
  var totalTime = isPom ? duration*60*1000 : breaktime*60*1000;
  var percTotDur = isPom ? (totalTime - x.timeRemaining())/totalTime : x.timeRemaining()/totalTime;
  $status.style.transform='scale('+percTotDur+')';
}

//Change the Break time by amt
function chBrk(amt) {
  if(breaktime>1 || amt > 0){
    breaktime += amt;
    $brk.innerHTML = breaktime;
    reset();
  }
}

//Change the Duration by amt
function chDur(amt) {
  if(duration>1 || amt > 0){
    duration += amt;
    $dur.innerHTML = duration;
    reset();
  }
}

//Creates a desktop popup alerting that the session is over
function alertUser() {
  window.setTimeout(function() {
    var instance = new Notification(
      "Pomodora Timer", {
        body: "This pomodoro session has ended, begin break!"
      }
    );

    setTimeout(function() {
      instance.close();
    }, 5000);

    instance.onclick = function() {
      window.focus();
    };

  }, 0);
}
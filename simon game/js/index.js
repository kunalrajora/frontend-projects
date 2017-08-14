var patternLength = 0;
var pattern = [];
var count = 0;
var strict = 0;
var power = 0;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var oscillator;
var freq = {blue:329.63,yellow:261.63,red:220,green:164.81,bad:110,win:360};
var soundPlaying = 0;

$('.btn').mousedown(function() {
  var top = $(this).css("margin-top");
  top = top.substring(0,top.length-2)*1 + 2;
  
  $(this).css("margin-top",top+"px");
  $(this).removeClass('btn-up');
  $(this).addClass('btn-down');
});

$('.btn').mouseup(function() {
  var top = $(this).css("margin-top");
  top = top.substring(0,top.length-2)*1 - 2;
  
  $(this).css("margin-top",top+"px");
  $(this).removeClass('btn-down');
  $(this).addClass('btn-up');
});

$('.start-button').click(function() {
  if (power == 1 && patternLength === 0) {
    startGame(); 
  }
});


$('.strict-button').click(function() {
  if (strict === 0 && power == 1) 
  { 
    strict = 1;
    $('.strict-led').removeClass('strict-off');
    $('.strict-led').addClass('strict-on');
  }
  else if (power == 1)
  { 
    strict = 0; 
    $('.strict-led').addClass('strict-off');
    $('.strict-led').removeClass('strict-on');
  }
});

$('.power-slot').click(function() {
  if ($('.power-switch').hasClass('power-off'))
  {
    $('.power-switch').addClass('power-on');
    $('.power-switch').removeClass('power-off');
    $('.window').addClass('window-on');
    $('.window').removeClass('window-off');
    power = 1;
  }
  else if ($('.power-switch').hasClass('power-on'))
  {
    $('.power-switch').addClass('power-off');
    $('.power-switch').removeClass('power-on');
    $('.strict-led').addClass('strict-off');
    $('.strict-led').removeClass('strict-on');
    $('.window').addClass('window-off');
    $('.window').removeClass('window-on');
    $('.window').text("--");
    stopSound();
    power = 0;
    patternLength = 0;
    pattern = [];
    count = 0;
  }
});

$('.quadrant').click(function() {
  
  if (pattern[count] == $(this).attr('id'))
  {
    ++count;
    if (count == pattern.length) 
    { 
      setTimeout(function() {
        count = 0;
        createPattern(); 
      },1000);
    }
  }
  else
  {
    if (strict == 0)
    {
      $('.window').text('!!');
      setTimeout(function() {
        count = 0;
        showPattern(0);
      },1000);
    }
    else
    {
      $('.outer-ring').css('pointer-events','all');
      setTimeout(function() {
        $('.window').text('!!');
        playSound(freq['bad']);
        setTimeout(function() {
          stopSound();
          reset();
          $('.outer-ring').css('pointer-events','none');
        },1000)
      },500);
    }
  }
  
});

$('#green,#red,#yellow,#blue').mousedown(function() {
  if (power == 0) { return; }
  
  var sel = $(this).attr('id');
  $('#'+sel).addClass(sel+'-lit');
  playSound(freq[sel]);
});


$('#green,#red,#yellow,#blue').mouseup(function() {
  if (power == 0) { return; }
  
  $('#green').removeClass('green-lit');
  $('#red').removeClass('red-lit');
  $('#yellow').removeClass('yellow-lit');
  $('#blue').removeClass('blue-lit');
  
  stopSound();
});


function startGame() {
  $('.window').text('00');
  createPattern();
}

function reset() {
  $('.window').text('--');
  count = 0;
  pattern = [];
  patternLength = 0;
  
}

function win() {
  $('.window').text('**');
  $('#green').addClass('green-lit');
  $('#red').addClass('red-lit');
  $('#yellow').addClass('yellow-lit');
  $('#blue').addClass('blue-lit');
  playSound(freq['win']);
  setTimeout(function() {
    stopSound(0);
    setTimeout(function() {
      playSound(freq['blue']);
      setTimeout(function() {
        stopSound(0);
        setTimeout(function() {
          playSound(freq['win']);
          setTimeout(function() {
            $('#red').mouseup();
          },1300);
        },10);
      },150);
    },10);
  },400);
}

function createPattern() {
  if (pattern.length >= 15)
  {
    $('.outer-ring').css('pointer-events','all');
    reset();
    win();
    return false;
  }
  var randNext = Math.floor(Math.random()*4);
  
  if (randNext === 0) { randNext = 'red'; }
  else if (randNext == 1)  { randNext = 'blue'; }
  else if (randNext == 2)  { randNext = 'yellow'; }
  else if (randNext == 3)  { randNext = 'green'; }
  
  pattern.push(randNext);
  ++patternLength;
  
  if (pattern.length < 10)
  { $('.window').text('0'+pattern.length); }
  else    
  { $('.window').text(pattern.length); }
  
  setTimeout(function() { showPattern(0); },250);
}

function showPattern(val) {
  
  if (pattern.length < 10)
  { $('.window').text('0'+pattern.length); }
  else    
  { $('.window').text(pattern.length); }
  
  $('.outer-ring').css('pointer-events','all');
  
  var showSpeed = 800;
  var pause = 200;
  
  if (pattern.length > 5) { showSpeed = 700; }
  if (pattern.length > 10) { showSpeed = 500; }  
  
  var color = pattern[val];
  
  playSound(freq[color]);  
  $('.quadrant.'+color).addClass(color+'-lit');
  
  setTimeout(function() {
    stopSound();
    $('.quadrant.'+color).removeClass(color+'-lit');
    
    setTimeout(function() {
      if (val < pattern.length-1) 
      { showPattern(val+1); }
      else
      {
        $('.outer-ring').css('pointer-events','none');
      }
    },pause);
  },showSpeed);
}


function playSound(val) {
  if (soundPlaying === 0) {
  var gainNode = audioCtx.createGain();
  
  oscillator = audioCtx.createOscillator();

  oscillator.type = 'triangle';
  oscillator.frequency.value = val;
  oscillator.connect(gainNode);
 gainNode.connect(audioCtx.destination);
  
  gainNode.gain.value = 0.1;
  
  oscillator.start();
  soundPlaying = 1; }
}

function stopSound(val){
  if (val === undefined)
  { var delay = 0; }
  else
  { var delay = val; }
    
  setTimeout(function() {
    oscillator.stop(0);
    soundPlaying = 0; 
  },delay);
}
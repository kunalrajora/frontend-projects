var pre = "";
var second = "";
var first = "";
var sup = "";
var dd = 0;

function myFunction(button) {
  var x = button.value;

  //reset
  if (x === "Ac") {
    second = "";
    pre = "";
    first = "";
    sup = "";
    document.getElementById("out").innerHTML = pre;
    document.getElementById("out2").innerHTML = first;
    loc = 0;
    return;
  }

  //clear
  if (x === "clear") {
    if (sup==="") {
      first = "";
      pre = "";
      sup = "";
      second = "";
    } else {
      pre = first + sup;
      second = "";
    }
    var yy = "";
    document.getElementById("out").innerHTML = yy;
    document.getElementById("out2").innerHTML = pre;
    return;
  }

  //evaluation
  if (x === "=") {
    var solution = eval(pre);
    pre = pre + x + solution;
    document.getElementById("out").innerHTML = solution;
    document.getElementById("out2").innerHTML = pre;
    pre = "";
    first = "";
    second = "";
    return;
  }

  //taking inputs
  
  if (!Number(x)) {
    sup = x;
    document.getElementById("out").innerHTML = sup;
    dd = 1;
  }
  
  if (Number(x) && sup!=="") {
    second += x;
    document.getElementById("out").innerHTML = second;

  }else if(sup===""){
    first += x;
    document.getElementById("out").innerHTML = first;
  }
  pre += x;
  document.getElementById("out2").innerHTML = pre;
}
var MAX_POWER = 40;
var DELAY = 46;

function switchOn(cb, power) {
  if (power === undefined) {
    power = 0;
  }
  setLight(power);
  if (power === MAX_POWER) {
    return cb();
  }
  setTimeout(switchOn, DELAY, cb, power + 1);
}

function switchOff(cb, power) {
  if (power === undefined) {
    power = MAX_POWER;
  }
  setLight(power);
  if (power === 0) {
    return cb();
  }
  setTimeout(switchOff, DELAY, cb, power - 1);
}


function setLight(power) {
  var pins = [A0, A1, A2, A3];
  pins.forEach(function (pin, index) {
    var value = normalize(power - index * MAX_POWER / pins.length);
    analogWrite(pin, value);
  });
}

function normalize(value) {
  value = Math.max(0, value);
  return Math.min(value / MAX_POWER, 1);
}

function loop(isMotionPrev) {
  var isMotionNow = digitalRead(P2);
  if (isMotionPrev && !isMotionNow) {
    switchOff(loop.bind(null, isMotionNow));
  } else if (!isMotionPrev && isMotionNow) {
    switchOn(loop.bind(null, isMotionNow));
  } else {
    setTimeout(loop, DELAY, isMotionNow);
  }
}

setLight(0);
loop();
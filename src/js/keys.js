class KeyManager {
  constructor() {
    // every key has following attrs: state, releasedLastAt
    this.keys = {};
  }

  keyCode(name) {
    let keyNameMap = {
      "up": "38",
      "down": "40",
      "left": "37",
      "right": "39",
      "space": "32",
      "enter": "13"
    };

    return keyNameMap[name];
  }

  wasReleasedRecently(key) {
    let millisecondsAgo = 20;
    let code = this.keyCode(key);
    if (!this.keys[code]) {
      return false;
    }

    // key is still pressed (hasn't been released yet)
    if (this.keys[code].state) {
      return false;
    }

    return (this.timeNowInMilliseconds() - this.keys[code].lastReleasedAt) <= millisecondsAgo;
  }

  isPressed(key) {
    let code = this.keyCode(key);
    if (!this.keys[code]) {
      return false;
    }

    return this.keys[code].state;
  }

  processKeyDownEvent(e) {
    e = e || window.event;
    this.disableScrollOnArrowKeys(e);

    if (!(e.keyCode in this.keys)) {
      this.keys[e.keyCode] = {state: true, lastReleasedAt: null};
    } else {
      this.keys[e.keyCode].state = true;
      this.keys[e.keyCode].lastReleasedAt = null;
    }
  }

  processKeyUpEvent(e) {
    e = e || window.event;

    if (!(e.keyCode in this.keys)) {
      this.keys[e.keyCode] = {state: false, lastReleasedAt: this.timeNowInMilliseconds()};
    } else {
      this.keys[e.keyCode].state = false;
      this.keys[e.keyCode].lastReleasedAt = this.timeNowInMilliseconds()
    }
  }

  disableScrollOnArrowKeys(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }

  timeNowInMilliseconds() {
    return new Date().getTime();
  }
}

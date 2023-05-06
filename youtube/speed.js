// ==UserScript==
// @name         Youtube Speed!!!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Speed up YT NX
// @author       You
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

(function (w) {
  'use strict';
  function speedX(val = 3) {
    document.querySelector('video').playbackRate = val;
  }

  function speedUp(event) {
    const speed = document.querySelector('#speed').value;
    speedX(speed);
  }

  function doubleClick() {
    const speed3x = document.querySelector('#speed3x');
    const speedBox =
      '<form onsubmit="speedUp(event)" style="display: inline"><input id="speed" size="1" type="text" name="speed"></form>';
    speed3x.insertAdjacentHTML('beforeEnd', speedBox);
    return false;
  }

  function init() {
    if (!document.querySelector('#speed3x')) {
      const fullScreenIcon = document.querySelector(
        '#title.style-scope.ytd-watch-metadata'
      );
      fullScreenIcon.insertAdjacentHTML(
        'beforeEnd',
        '<button id="speed3x" class="ytp-fullscreen-button ytp-button" onclick="speedX()" ondblclick="doubleClick()" style="font-size: 16px; display: inline">⏩</button>'
      );
    }
  }
  w.speedX = speedX;
  w.doubleClick = doubleClick;
  w.speedUp = speedUp;
  waitForKeyElements('#title.style-scope.ytd-watch-metadata', init);
})(window);

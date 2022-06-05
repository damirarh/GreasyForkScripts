// ==UserScript==
// @name         Copy recipes from leaneen.com
// @namespace    https://damirscorner.com
// @version      1.0.1
// @description  Enables regular browser commands for web page interaction (mouse & keyboard) on leaneen.com to allow copying content.
// @author       Damir Arh
// @license      MIT
// @supportURL   https://github.com/damirarh/GreasyForkScripts
// @match        https://leaneen.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // override user-select rule preventing text to be selected
  const style = document.createElement("style");
  document.body.appendChild(style);
  style.sheet.insertRule(
    "html, body, div, p, span, h1, h2, h3, h4, h5, h6, a { user-select: auto !important; }"
  );
  style.sheet.insertRule(".unselectable { cursor: auto; }");
  style.sheet.insertRule(
    '*:not(input):not(textarea):not(text):not([contenteditable="true"]):not([contenteditable]):not(code):not(code *), *::after, *::backdrop, *::before, *::cue, *::marker, *::placeholder { user-select: auto !important; }'
  );
  style.sheet.insertRule(
    '*:not(input):not(textarea):not(text):not([contenteditable="true"]):not([contenteditable]):not(code):not(code *)::selection, *:not(input):not(textarea):not(text):not([contenteditable="true"]):not([contenteditable]):not(code):not(code *)::-moz-selection { background: lightgrey !important; }'
  );

  // remove event handlers that disable context menu, text selection and keyboard shortcuts
  document.oncontextmenu = undefined;
  document.onselectstart = undefined;
  jQuery(document).unbind("keyup keydown");
})();

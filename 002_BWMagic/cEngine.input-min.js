!function e(n,o,t){function i(r,c){if(!o[r]){if(!n[r]){var d="function"==typeof require&&require;if(!c&&d)return d(r,!0);if(u)return u(r,!0);throw new Error("Cannot find module '"+r+"'")}var s=o[r]={exports:{}};n[r][0].call(s.exports,function(e){var o=n[r][1][e];return i(o?o:e)},s,s.exports,e,n,o,t)}return o[r].exports}for(var u="function"==typeof require&&require,r=0;r<t.length;r++)i(t[r]);return i}({1:[function(e,n,o){"use strict";!function(e){var n="MOUSE_LEFT_TOUCH",o={create:function(e){e=e||{};var t={cEnginePlugin:{name:"inputPlugin",version:"0.0.8"},engine:void 0,keys:{},touches:[],init:function(e){t.engine=e,"ontouchstart"in window?(t.engine.canvas.addEventListener("touchstart",t.touchstart),window.document.addEventListener("touchmove",t.touchmove),window.document.addEventListener("touchend",t.touchend),window.document.addEventListener("touchcancel",t.touchend)):(t.engine.canvas.addEventListener("mousedown",t.mousedown),window.document.addEventListener("mousemove",t.mousemove),window.document.addEventListener("mouseup",t.mouseup)),window.document.addEventListener("keydown",t.onKeydown),window.document.addEventListener("keyup",t.onKeyup)},destroy:function(){t.engine.canvas.removeEventListener("touchstart",t.touchstart),window.document.removeEventListener("touchmove",t.touchmove),window.document.removeEventListener("touchend",t.touchend),window.document.removeEventListener("touchcancel",t.touchend),t.engine.canvas.removeEventListener("mousedown",t.mousedown),window.document.removeEventListener("mousemove",t.mousemove),window.document.removeEventListener("mouseup",t.mouseup),window.document.removeEventListener("keydown",t.onKeydown),window.document.removeEventListener("keyup",t.onKeyup)},mousedown:function(e){1==e.which&&(e.preventDefault(),t.mouseIsTouching=!0,e.identifier=n,t.touches.push(t.createTouch(e)))},mousemove:function(e){if(1==e.which&&(e.preventDefault(),t.mouseIsTouching)){e.identifier=n;var o=t.ongoingTouchIndexById(e.identifier);o>=0&&t.touches.splice(o,1,t.createTouch(e))}},mouseup:function(e){if(1==e.which){e.preventDefault(),t.mouseIsTouching=!1,e.identifier=n;var o=t.ongoingTouchIndexById(e.identifier);o>=0&&t.touches.splice(o,1)}},touchstart:function(e){for(var n=e.changedTouches,o=0;o<n.length;o++)t.touches.push(t.createTouch(n[o]))},touchmove:function(e){for(var n=e.changedTouches,o=0;o<n.length;o++){var i=t.ongoingTouchIndexById(n[o].identifier);i>=0&&t.touches.splice(i,1,t.createTouch(n[o]))}},touchend:function(e){for(var n=e.changedTouches,o=0;o<n.length;o++){var i=t.ongoingTouchIndexById(n[o].identifier);i>=0&&t.touches.splice(i,1)}},ongoingTouchIndexById:function(e){for(var n=0;n<t.touches.length;n++){var o=t.touches[n].identifier;if(o==e)return n}return-1},onKeydown:function(e){t.keys[o.KeyCode[e.keyCode]]=!0},onKeyup:function(e){t.keys[o.KeyCode[e.keyCode]]=!1},createTouch:function(e){var n=t.engine.canvas.getBoundingClientRect(),o={identifier:e.identifier,x:e.clientX-n.left,y:e.clientY-n.top};return t.engine.useResolutionDevider&&(o.x=o.x/t.engine.resolutionDevider,o.y=o.y/t.engine.resolutionDevider),o}};return t},KeyCode:{27:"ESC",32:"SPACE",37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z"}};e.extend("input",o)}(cEngine)},{}]},{},[1]);
//# sourceMappingURL=cEngine.input-min.js.map
Clazz.declarePackage ("astex.awtjs2d");
Clazz.load (["javajs.api.GenericMouseInterface", "javajs.awt.event.Event"], "astex.awtjs2d.Mouse", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.vwr = null;
this.manager = null;
this.isMouseDown = false;
this.wheeling = false;
this.xWhenPressed = 0;
this.yWhenPressed = 0;
this.modifiersWhenPressed10 = 0;
Clazz.instantialize (this, arguments);
}, astex.awtjs2d, "Mouse", null, javajs.api.GenericMouseInterface);
Clazz.makeConstructor (c$, 
function (privateKey, vwr, display) {
this.vwr = vwr;
this.manager = this.vwr.getActionManager ();
}, "~N,javajs.api.PlatformViewer,~O");
Clazz.overrideMethod (c$, "clear", 
function () {
});
Clazz.overrideMethod (c$, "dispose", 
function () {
});
Clazz.overrideMethod (c$, "processEvent", 
function (id, x, y, modifiers, time) {
if (id != -1) modifiers = astex.awtjs2d.Mouse.applyLeftMouse (modifiers);
switch (id) {
case -1:
this.wheeled (time, x, modifiers);
break;
case 501:
this.xWhenPressed = x;
this.yWhenPressed = y;
this.modifiersWhenPressed10 = modifiers;
this.pressed (time, x, y, modifiers, false);
break;
case 506:
this.dragged (time, x, y, modifiers);
break;
case 504:
this.entry (time, x, y, false);
break;
case 505:
this.entry (time, x, y, true);
break;
case 503:
this.moved (time, x, y, modifiers);
break;
case 502:
this.released (time, x, y, modifiers);
if (x == this.xWhenPressed && y == this.yWhenPressed && modifiers == this.modifiersWhenPressed10) {
this.clicked (time, x, y, modifiers, 1);
}break;
default:
return false;
}
return true;
}, "~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "processTwoPointGesture", 
function (touches) {
}, "~A");
Clazz.defineMethod (c$, "mouseClicked", 
function (e) {
this.clicked (e.getWhen (), e.getX (), e.getY (), e.getModifiers (), e.getClickCount ());
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseEntered", 
function (e) {
this.entry (e.getWhen (), e.getX (), e.getY (), false);
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseExited", 
function (e) {
this.entry (e.getWhen (), e.getX (), e.getY (), true);
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mousePressed", 
function (e) {
this.pressed (e.getWhen (), e.getX (), e.getY (), e.getModifiers (), e.isPopupTrigger ());
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseReleased", 
function (e) {
this.released (e.getWhen (), e.getX (), e.getY (), e.getModifiers ());
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseDragged", 
function (e) {
var modifiers = e.getModifiers ();
if ((modifiers & 28) == 0) modifiers |= 16;
this.dragged (e.getWhen (), e.getX (), e.getY (), modifiers);
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseMoved", 
function (e) {
this.moved (e.getWhen (), e.getX (), e.getY (), e.getModifiers ());
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseWheelMoved", 
function (e) {
e.consume ();
this.wheeled (e.getWhen (), e.getWheelRotation (), e.getModifiers ());
}, "java.awt.event.MouseWheelEvent");
Clazz.defineMethod (c$, "keyTyped", 
function (ke) {
ke.consume ();
}, "java.awt.event.KeyEvent");
Clazz.defineMethod (c$, "keyReleased", 
function (ke) {
ke.consume ();
this.manager.keyReleased (ke.getKeyCode ());
}, "java.awt.event.KeyEvent");
Clazz.defineMethod (c$, "entry", 
 function (time, x, y, isExit) {
this.wheeling = false;
this.manager.mouseEnterExit (time, x, y, isExit);
}, "~N,~N,~N,~B");
Clazz.defineMethod (c$, "clicked", 
 function (time, x, y, modifiers, clickCount) {
this.manager.mouseAction (2, time, x, y, 1, modifiers);
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "moved", 
 function (time, x, y, modifiers) {
if (this.isMouseDown) this.manager.mouseAction (1, time, x, y, 0, astex.awtjs2d.Mouse.applyLeftMouse (modifiers));
 else this.manager.mouseAction (0, time, x, y, 0, modifiers);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "wheeled", 
 function (time, rotation, modifiers) {
this.wheeling = true;
this.manager.mouseAction (3, time, 0, rotation, 0, modifiers & -29 | 32);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "pressed", 
 function (time, x, y, modifiers, isPopupTrigger) {
this.isMouseDown = true;
this.wheeling = false;
this.manager.mouseAction (4, time, x, y, 0, modifiers);
}, "~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "released", 
 function (time, x, y, modifiers) {
this.isMouseDown = false;
this.wheeling = false;
this.manager.mouseAction (5, time, x, y, 0, modifiers);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "dragged", 
 function (time, x, y, modifiers) {
if (this.wheeling) return;
if ((modifiers & 20) == 20) modifiers = modifiers & -5 | 2;
this.manager.mouseAction (1, time, x, y, 0, modifiers);
}, "~N,~N,~N,~N");
c$.applyLeftMouse = Clazz.defineMethod (c$, "applyLeftMouse", 
 function (modifiers) {
return ((modifiers & 28) == 0) ? (modifiers | 16) : modifiers;
}, "~N");
});

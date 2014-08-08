Clazz.declarePackage ("astex.i18n");
Clazz.load (null, "astex.i18n.GT", ["java.text.MessageFormat"], function () {
c$ = Clazz.declareType (astex.i18n, "GT");
c$._ = Clazz.defineMethod (c$, "_", 
function (string) {
return string;
}, "~S");
c$.o = Clazz.defineMethod (c$, "o", 
function (s, o) {
if (!(Clazz.instanceOf (o, Array))) o = [o];
return java.text.MessageFormat.format (s, o);
}, "~S,~O");
c$.i = Clazz.defineMethod (c$, "i", 
function (s, n) {
return astex.i18n.GT.o (s, "" + n);
}, "~S,~N");
c$.escapeHTML = Clazz.defineMethod (c$, "escapeHTML", 
function (msg) {
var ch;
for (var i = msg.length; --i >= 0; ) if ((ch = msg.charAt (i)).charCodeAt (0) > 0x7F) {
msg = msg.substring (0, i) + "&#" + ((ch).charCodeAt (0)) + ";" + msg.substring (i + 1);
}
return msg;
}, "~S");
});

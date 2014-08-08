Clazz.declarePackage ("astex.util");
Clazz.load (["java.util.Properties"], "astex.util.Properties", ["astex.io.FILE", "JU.PT"], function () {
c$ = Clazz.declareType (astex.util, "Properties", java.util.Properties);
Clazz.defineMethod (c$, "loadFile", 
function (resource) {
{
this.simpleLoad(resource);
}}, "~S");
Clazz.defineMethod (c$, "simpleLoad", 
function (resource) {
var data = JU.PT.split (astex.io.FILE.getFileAsString (resource).$replace ('\r', '\n'), "\n");
for (var i = 0, n = data.length; i < n; i++) {
var line = data[i].trim ();
if (line.length == 0 || "!#".indexOf (line.charAt (0)) >= 0) continue;
while (line.endsWith ("\\")) {
var nb = line.length;
var j = nb;
for (; --j >= 0; ) if (line.charAt (j) != '\\') break;

if (((nb - j) % 2) == 1) break;
line = line.substring (0, j + 1) + (++i == n ? "" : data[i].trim ());
}
var j = 0;
var ch = ' ';
var nb = line.length;
for (; j < nb; j++) {
switch (ch = line.charAt (j)) {
case ' ':
case ':':
case '=':
j++;
break;
case '\\':
j++;
default:
continue;
}
break;
}
var key = line.substring (0, j - 1);
var value = line.substring (j).trim ();
if (ch == ' ' && value.length > 0 && ((ch = value.charAt (0)) == ':' || ch == '=')) value = value.substring (1).trim ();
this.put (key, value);
}
System.out.println (this.size () + " properties read for " + resource);
}, "~S");
});

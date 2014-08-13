Clazz.declarePackage ("astex.util");
c$ = Clazz.declareType (astex.util, "Mmatch");
c$.matches = Clazz.defineMethod (c$, "matches", 
function (pattern, string) {
return astex.util.Mmatch.matchExprRecursor (string, pattern, 0, 0, 15);
}, "~S,~S");
c$.matches = Clazz.defineMethod (c$, "matches", 
function (pattern, string, flags) {
return astex.util.Mmatch.matchExprRecursor (string, pattern, 0, 0, flags);
}, "~S,~S,~N");
c$.matchExprRecursor = Clazz.defineMethod (c$, "matchExprRecursor", 
 function (string, pattern, sIdx, pIdx, types) {
var pLen = pattern.length;
var sLen = string.length;
while (true) {
if (pIdx >= pLen) {
return (sIdx >= sLen);
}if (sIdx >= sLen && pattern.charAt (pIdx) != '*') {
return false;
}if ((types & 1) != 0 && pattern.charAt (pIdx) == '*') {
pIdx++;
if (pIdx >= pLen) return true;
while (true) {
if (astex.util.Mmatch.matchExprRecursor (string, pattern, sIdx, pIdx, types)) return true;
if (sIdx >= sLen) return false;
sIdx++;
}
}if ((types & 2) != 0 && pattern.charAt (pIdx) == '?') {
pIdx++;
sIdx++;
continue;
}if ((types & 4) != 0 && pattern.charAt (pIdx) == '[') {
for (pIdx++; ; pIdx++) {
if (pIdx >= pLen || pattern.charAt (pIdx) == ']') return false;
if (pattern.charAt (pIdx) == string.charAt (sIdx)) {
pIdx++;
break;
}if (pIdx < (pLen - 1) && pattern.charAt (pIdx + 1) == '-') {
if (pIdx >= (pLen - 2) || pattern.charAt (pIdx + 2) == ']') return false;
var chStr = string.charAt (sIdx);
var chPtn = pattern.charAt (pIdx);
var chPtn2 = pattern.charAt (pIdx + 2);
if ((chPtn <= chStr) && (chPtn2 >= chStr)) break;
if ((chPtn >= chStr) && (chPtn2 <= chStr)) break;
pIdx += 2;
}}
for (; pattern.charAt (pIdx) != ']'; pIdx++) {
if (pIdx >= pLen) {
pIdx--;
break;
}}
pIdx++;
sIdx++;
continue;
}if ((types & 8) != 0 && pattern.charAt (pIdx) == '\\') {
pIdx++;
if (pIdx >= pLen) return false;
}if (pIdx < pLen && sIdx < sLen) {
if (pattern.charAt (pIdx) != string.charAt (sIdx)) return false;
}pIdx++;
sIdx++;
}
}, "~S,~S,~N,~N,~N");
Clazz.defineStatics (c$,
"ASTERISK", 1,
"QUESTION_MARK", 2,
"BRACKETS", 4,
"BACKSLASH", 8,
"ALL", 15,
"DEFAULT", 15);

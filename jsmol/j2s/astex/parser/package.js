var path = ClazzLoader.getClasspathFor ("astex.parser.package");
path = path.substring (0, path.lastIndexOf ("package.js"));
ClazzLoader.jarClasspath (path + "Parser.js", [
"astex.parser.CUP$Parser$actions",
"$.Parser"]);

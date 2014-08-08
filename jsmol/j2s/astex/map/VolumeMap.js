Clazz.declarePackage ("astex.map");
Clazz.load (["astex.render.MoleculeRenderer"], "astex.map.VolumeMap", null, function () {
c$ = Clazz.declareInterface (astex.map, "VolumeMap");
Clazz.defineStatics (c$,
"READ_NEVER", 0,
"READ_FALSE", 1,
"READ_TRUE", 2,
"Weighted", 0,
"Raw", 1,
"Lines", 1,
"Surface", 2);
c$.MaximumContourLevels = c$.prototype.MaximumContourLevels = astex.render.MoleculeRenderer.MaximumContourLevels;
Clazz.defineStatics (c$,
"CCP4_BINARY", 1,
"SYBYL_ASCII", 2,
"INSIGHT_ASCII", 3,
"ASTEX_ASCII", 4,
"O_BINARY", 5,
"BRIX_BINARY", 6,
"BIT_BINARY", 7,
"CCP4_BYTE", 0,
"CCP4_SHORT", 1,
"CCP4_FLOAT", 2,
"CCP4_BYTE_1", 10,
"BYTE_RANGE", 256,
"SHORT_RANGE", 65536,
"EPSILON", 0.00000001);
});

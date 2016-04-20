var path = require('path');
var src = require.resolve('isparta/package.json');
var pkg = require('isparta/package.json');
module.exports = path.resolve(src, '..', pkg.bin['isparta']);

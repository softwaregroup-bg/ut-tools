var path = require('path');
var src = require.resolve('stylelint/package.json');
var pkg = require('stylelint/package.json');
module.exports = path.resolve(src, '..', pkg.bin.stylelint);

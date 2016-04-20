var path = require('path');
var src = require.resolve('babel-cli/package.json');
var pkg = require('babel-cli/package.json');
module.exports = path.resolve(src, '..', pkg.bin['babel-node']);

var path = require('path');
var src = require.resolve('@babel/node/package.json');
var pkg = require('@babel/node/package.json');
module.exports = path.resolve(src, '..', pkg.bin['babel-node']);

const path = require('path');
const src = require.resolve('stylelint/package.json');
const pkg = require('stylelint/package.json');
module.exports = path.resolve(src, '..', pkg.bin.stylelint);

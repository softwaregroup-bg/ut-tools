const lintPkg = require('./lib/lintPkg')
const path = require('path');
lintPkg(path.join(__dirname, '..', 'ut-port-cache'));
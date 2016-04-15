#!/usr/bin/env node
var path = require('path');

var gitTag = require('../lib/exec')('git', ['describe'], 'pipe');
var pkgVersion = require(path.join(process.cwd(), 'package.json')).version;
if (gitTag !== 'v' + pkgVersion) {
    require('../lib/exec')('npm', ['run', 'changelog', '--silent']);
}

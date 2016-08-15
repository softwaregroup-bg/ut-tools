#!/usr/bin/env node

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    require('../lib/ispartaPath'),
    'cover',
    '--report',
    'cobertura',
    '--report',
    'lcov',
    'test/cover.js'
].concat(process.argv.slice(2)));

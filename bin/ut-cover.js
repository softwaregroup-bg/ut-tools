#!/usr/bin/env node

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    '--presets',
    'es2015,react,stage-0',
    '--',
    require('../lib/ispartaPath'),
    'cover',
    '--report',
    'cobertura',
    '--report',
    'lcov',
    'test/cover.js'
]);

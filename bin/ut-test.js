#!/usr/bin/env node

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    '--presets',
    'es2015,react,stage-0',
    '--',
    require.resolve('blue-tape/bin/blue-tape'),
    'test/**/test*.js']);

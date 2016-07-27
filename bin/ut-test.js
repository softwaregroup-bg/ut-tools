#!/usr/bin/env node

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    require.resolve('blue-tape/bin/blue-tape'),
    'test/**/start*.js', 'test/**/test*.js', 'test/**/stop*.js']);

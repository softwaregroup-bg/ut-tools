#!/usr/bin/env node

require('../lib/exec')(require.resolve('nyc/bin/nyc'), [
    'node',	
    require('../lib/babelNodePath'),
    require.resolve('blue-tape/bin/blue-tape'),
    'test/**/start*.js', 'test/**/test*.js', 'test/**/stop*.js']);

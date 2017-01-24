#!/usr/bin/env node

require('../lib/exec')(require.resolve('nyc/bin/nyc'), [
    '--reporter=lcov',
    '--reporter=text',
    '--reporter=cobertura',
    '--include=**/*.js',
    '--exclude=!node_modules/ut-*/**/*.js',
    '--exclude=node_modules/!(ut-*)/**/*.js',
    '--exclude=**/test/**',
    'node',
    require('../lib/babelNodePath'),
    require.resolve('blue-tape/bin/blue-tape'),
    'test/**/start*.js', 'test/**/test*.js', 'test/**/stop*.js']);

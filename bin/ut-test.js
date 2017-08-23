#!/usr/bin/env node
/* eslint no-process-env:0 */

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    require.resolve('blue-tape/bin/blue-tape'),
    'test/**/start*.js', 'test/**/test*.js', 'test/**/stop*.js'].concat(process.argv.slice(2)));

require('../lib/exec')(require.resolve('jest/bin/jest'), []);

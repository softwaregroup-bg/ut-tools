#!/usr/bin/env node
/* eslint no-process-env:0 */

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    'test/integration/db'].concat(process.argv.slice(2)));

require('../lib/exec')('node', [
    require('../lib/babelNodePath'),
    require.resolve('tap/bin/run'),
    'test/integration', '-J', '-T'].concat(process.argv.slice(2)));

require('../lib/exec')('node', [
    require.resolve('jest/bin/jest'),
    '--testMatch=**/__tests__/**/*.js?(x)',
    '--maxWorkers=2'
]);

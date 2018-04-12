#!/usr/bin/env node
/* eslint no-process-env:0 */

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '--cov',
    '-j8',
    'test/integration'].concat(process.argv.slice(2)));

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '--cov',
    '-j4',
    'test/unit'].concat(process.argv.slice(2)));

require('../lib/exec')(process.execPath, [
    require.resolve('jest/bin/jest'),
    '--testMatch=**/__tests__/**/*.js?(x)',
    '--maxWorkers=2'
]);

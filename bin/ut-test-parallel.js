#!/usr/bin/env node
/* eslint no-process-env:0 */

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '-j' + (process.env.TAP_JOBS || '8'),
    'test/integration'].concat(process.argv.slice(2)));

require('../lib/exec')(process.execPath, [
    require.resolve('jest/bin/jest'),
    '--testMatch=**/__tests__/**/*.js?(x)',
    '--maxWorkers=2'
]);

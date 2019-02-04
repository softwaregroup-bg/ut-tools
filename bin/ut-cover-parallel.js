#!/usr/bin/env node
/* eslint no-process-env:0 */

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '--cov',
    '--coverage-report=text',
    '-j' + (process.env.TAP_JOBS || '8'),
    'test/integration',
    '!(node_modules)/**/*.test.js',
    'test/unit/cases'].concat(process.argv.slice(2)));

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '--coverage-report=cobertura'
]);

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '--coverage-report=html',
    '--no-browser'
]);

require('../lib/exec')(process.execPath, [
    require.resolve('jest/bin/jest'),
    '--testMatch=**/__tests__/**/*.js?(x)',
    '--passWithNoTests',
    '--maxWorkers=2'
]);

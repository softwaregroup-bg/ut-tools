#!/usr/bin/env node
/* eslint no-process-env:0 */

require('../lib/exec')(process.execPath, [
    require.resolve('tap/bin/run'),
    '--output-file=.lint/tap.txt',
    '--reporter=classic',
    '-j' + (process.env.TAP_JOBS || '8'),
    'test/integration',
    '!(node_modules)/**/*.test.js',
    'test/unit/cases'].concat(process.argv.slice(2)));

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap-mocha-reporter'),
    'xunit',
    '<.lint/tap.txt',
    '>.lint/xunit.xml'
], {shell: true});

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap-mocha-reporter'),
    'classic',
    '<.lint/tap.txt',
    '>.lint/test.txt'
], {shell: true});

require('../lib/exec')(process.execPath, [
    require.resolve('jest/bin/jest'),
    '--testMatch=**/__tests__/**/*.js?(x)',
    '--passWithNoTests',
    '--maxWorkers=2'
]);

#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0 */

let test = require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap/bin/run'),
    '--cov',
    '--coverage-report=text',
    '--output-file=.lint/tap.txt',
    '--reporter=classic',
    '-j' + (process.env.TAP_JOBS || '8'),
    'test/integration',
    '"!(node_modules|tap-snapshots)/**/*.test.js"',
    'test/unit/cases'].concat(process.argv.slice(2)), {shell: true}, false);

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap/bin/run'),
    '--coverage-report=cobertura'
], {shell: true});

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap/bin/run'),
    '--coverage-report=html',
    '--no-browser'
], {shell: true});

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap-mocha-reporter'),
    'xunit',
    '<.lint/tap.txt',
    '>.lint/xunit.xml'
], {shell: true}, false);

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap-mocha-reporter'),
    'classic',
    '<.lint/tap.txt',
    '>.lint/test.txt'
], {shell: true}, false);

if (test === false) process.exit(1);

require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('jest/bin/jest'),
    '--testMatch=**/__tests__/**/*.js?(x)',
    '--passWithNoTests',
    '--maxWorkers=2'
], {shell: true});

#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0 */
const fs = require('fs');
var paths = [];
if (fs.existsSync('test/integration')) paths.push('test/integration');
if (fs.existsSync('test/unit/cases')) paths.push('test/unit/cases');

let test = require('../lib/exec')('"' + process.execPath + '"', [
    require.resolve('tap/bin/run'),
    '--output-file=.lint/tap.txt',
    '--reporter=classic',
    '-j' + (process.env.TAP_JOBS || '8'),
    '"!(node_modules|tap-snapshots)/**/*.test.js"'].concat(paths, process.argv.slice(2)), {shell: true}, false);

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

#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0 */
const fs = require('fs');
const {testFiles} = require('../lib/defaults');
const redirect = require('os').platform() === 'win32' ? '2>nul' : '2>/dev/null';
const exec = require('../lib/exec');

const paths = [];
if (fs.existsSync('test/integration')) paths.push('test/integration');
if (fs.existsSync('test/unit/cases')) paths.push('test/unit/cases');

const test = exec('tap', [
    '-no-cov',
    '--output-file=.lint/tap.txt',
    '--reporter=classic',
    '-j' + (process.env.TAP_JOBS || '4')
].concat(testFiles, paths, process.argv.slice(2)), {shell: true}, false);

exec('tap-mocha-reporter', [
    'xunit',
    '<.lint/tap.txt',
    redirect,
    '>.lint/xunit.xml'
], {shell: true}, false);

exec('tap-mocha-reporter', [
    'classic',
    '<.lint/tap.txt',
    redirect,
    '>.lint/test.txt'
], {shell: true}, false);

if (test === false) process.exit(1);

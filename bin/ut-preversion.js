#!/usr/bin/env node
/* eslint no-process-env:0 */
const exec = require('../lib/exec');
exec('npm', ['run', 'cover']);
if (process.env.npm_package_json && require(process.env.npm_package_json).scripts?.license) {
    exec('npm', ['run', 'license']);
}

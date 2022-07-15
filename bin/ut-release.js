#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const exec = require('../lib/exec');
const versionBump = require('../lib/versionBump');
const fs = require('fs');

require('../lib/audit')();

versionBump()
    .then(({tag}) => {
        exec('git', ['push']);
        exec('git', ['push', 'origin', '--tags']);
        if (require(process.env.npm_package_json)?.scripts?.doc) exec('npm', ['run', 'doc']);
        if (require(process.env.npm_package_json)?.scripts?.compile) exec('npm', ['run', 'compile']);
        return exec('npm', (tag ? ['publish', '--tag', tag] : ['publish']).concat(process.argv.slice(2)));
    })
    .then(() => fs.copyFileSync && fs.copyFileSync('package.json', '.lint/result.json'))
    .catch(function(e) {
        console.error(e);
        process.exit(1);
    });

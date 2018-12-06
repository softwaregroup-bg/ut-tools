#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0 */
const exec = require('../lib/exec');
const versionBump = require('../lib/versionBump');
versionBump()
    .then(({tag}) => {
        exec('git', ['push']);
        exec('git', ['push', 'origin', '--tags']);
        return exec('npm', tag ? ['publish', '--tag', tag] : ['publish']);
    })
    .catch(function(e) {
        console.error(e);
        process.exit(1);
    });

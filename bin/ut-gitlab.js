#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0, no-console:0 */
var exec = require('../lib/exec');
var gitLog = exec('git', ['log', '-1', '--oneline'], 'pipe', false);

if (gitLog.match(/\[ci-skip]/)) {
    console.error('SHOULD NOT BE RUN IN CI', gitLog);
    process.exit(1);
}

require('../lib/setEnv');
require('../lib/exec')('npm', ['run', 'test', '--silent']);

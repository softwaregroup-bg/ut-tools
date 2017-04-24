#!/usr/bin/env node
/* eslint no-process-env:0 */

if (!process.env.UT_MODULE) {
    var utModule = (process.env.GIT_URL || '').match(/^.*\/.*-(.*)\.git$/);
    if (utModule) {
        process.env.UT_MODULE = utModule[1];
    }
}
require('../lib/setEnv');

var command;
var jobname = process.env.JOB_NAME || '';

if (
    /((ut)|(impl))-.+((_cr)|(_post-commit))$/.test(jobname) &&
    process.env.BUILD_CAUSE === 'SCMTRIGGER' &&
    (/(^master$)|(^ci_.*)/.test(process.env.gitlabSourceBranch) || /(^origin\/master$)|(^origin\/ci_.*)/.test(process.env.GIT_BRANCH))
) {
    command = 'release';
} else {
    command = 'test';
}

require('../lib/exec')('npm', ['run', command]);

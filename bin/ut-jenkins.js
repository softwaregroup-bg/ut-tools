#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0, no-console:0 */
var exec = require('../lib/exec');
var gitLog = exec('git', ['log', '-1', '--oneline'], 'pipe', false);

if (gitLog.match('[ci-skip]')) {
    console.error('SHOULD NOT BE RUN IN CI');
    process.exit(1);
}

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
    /^(ut|impl)-.+?(_cr|_post-commit)$/.test(jobname) &&
    process.env.BUILD_CAUSE === 'SCMTRIGGER' &&
    (
        /^(master|(hotfix|major|minor|patch)\/[^/]+)$/.test(process.env.gitlabSourceBranch) ||
        /^origin\/(master|(hotfix|major|minor|patch)\/[^/]+)$/.test(process.env.GIT_BRANCH)
    )
) {
    command = 'release';
} else {
    command = 'test';
}

exec('npm', ['run', command]);

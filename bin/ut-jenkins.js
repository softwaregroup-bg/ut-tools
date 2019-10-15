#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0, no-console:0 */
var exec = require('../lib/exec');
var gitLog = exec('git', ['log', '-1', '--oneline'], 'pipe', false);

if (!process.env.UT_MODULE) {
    var utModule = (process.env.GIT_URL || '').match(/^.*\/.*-(.*)\.git$/);
    if (utModule) {
        process.env.UT_MODULE = utModule[1];
    }
}
require('../lib/setEnv');

var command;
var jobname = process.env.JOB_NAME || '';
const SKIP = /\[ci-skip]/;
const BRANCH = /^origin\/(master|(hotfix|major|minor|patch)\/[^/]+)$/;
let branch = process.env.BRANCH_NAME || process.env.GIT_BRANCH;

if (
    process.env.JOB_TYPE === 'pipeline' &&
    !gitLog.match(SKIP) &&
    BRANCH.test(branch)
) {
    command = 'release';
} else if (
    /^(ut|impl|standard-service)(-\w{2,})+(_cr|_post-commit)$/.test(jobname) &&
    process.env.BUILD_CAUSE === 'SCMTRIGGER' &&
    (
        // /^(master|(hotfix|major|minor|patch)\/[^/]+)$/.test(process.env.gitlabSourceBranch) ||
        BRANCH.test(branch)
    )
) {
    if (gitLog.match(SKIP)) {
        console.error('SHOULD NOT BE RUN IN CI', gitLog);
        process.exit(1);
    }
    command = 'release';
} else {
    command = 'test';
}

exec('npm', ['run', command]);

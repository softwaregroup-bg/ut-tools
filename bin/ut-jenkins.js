#!/usr/bin/env node
/* eslint no-process-env:0, no-process-exit:0, no-console:0 */
const exec = require('../lib/exec');
const fs = require('fs');
const gitLog = exec('git', ['log', '-1', '--oneline'], 'pipe', false);

if (!process.env.UT_MODULE) {
    const utModule = (process.env.GIT_URL || '').match(/^.*\/.*-(.*)\.git$/);
    if (utModule) {
        process.env.UT_MODULE = utModule[1];
    }
}
require('../lib/setEnv');

if (process.env.JOB_TYPE !== 'pipeline' && fs.existsSync('Jenkinsfile')) {
    console.error('SKIPPING OLD JENKINS JOBS');
    process.exit(0);
}

let command;
const jobname = process.env.JOB_NAME || '';
const SKIP = /\[ci-skip]/;
const BRANCH = /^origin\/(master|(hotfix|major|minor|patch)\/[^/]+)$/;
const branch = process.env.BRANCH_NAME || process.env.GIT_BRANCH;

if (!/^origin\/(\w+\/)?(\w+-)*\w+$/.test(branch)) throw new Error('Branches names must match the following formats: xxx/yyy-zzz, xxx/yyy or xxx');

if (
    process.env.JOB_TYPE === 'pipeline' &&
    !gitLog.match(SKIP) &&
    BRANCH.test(branch)
) {
    command = process.env.CHANGE_ID ? 'cover' : 'release';
} else if (
    /^(ut|(ut|create|impl|standard-service)(-\w{2,})+)(_cr|_post-commit)$/.test(jobname) &&
    /SCMTRIGGER/.test(process.env.BUILD_CAUSE) &&
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
    command = 'cover';
}

exec('npm', ['run', command]);
if (process.env.npm_package_scripts_review && process.env.CHANGE_ID) exec('npm', ['run', 'review']);

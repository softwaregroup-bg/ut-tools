#!/usr/bin/env node
/*eslint no-process-env:0*/
require('../lib/setEnv');

var module = (process.env.gitlabSourceRepoName || '').match(/^.*\/.*-(.*)$/);
process.env.UT_MODULE = module && module[1];

var command;
var jobname = process.env.JOB_NAME || '';

if ((process.env.BUILD_CAUSE === 'SCMTRIGGER' && process.env.gitlabSourceBranch === 'master') || (process.env.BUILD_CAUSE === 'MANUALTRIGGER' && jobname.match(/ut-.+_cr$/))) {
    command = 'release';
} else {
    command = 'test';
}

require('../lib/exec')('npm', ['run', command, '--silent']);

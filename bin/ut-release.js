#!/usr/bin/env node
/* eslint no-process-env:0 */

var conventionalRecommendedBump = require('conventional-recommended-bump');

conventionalRecommendedBump({
    preset: 'angular'
}, function(err, result) {
    if (err) {
        throw err;
    } else {
        var releaseType = result.releaseType;
        if (
            (process.env.gitlabSourceBranch && /(^ci_.*)/.test(process.env.gitlabSourceBranch)) ||
            (process.env.GIT_BRANCH && /(^origin\/ci_.*)/.test(process.env.GIT_BRANCH))
        ) {
            releaseType = 'patch';
        }
        require('../lib/exec')('npm', ['version', releaseType, '-m', '[ci-skip][ci skip] version incremented to %s']);
        require('../lib/exec')('npm', ['publish']);
    };
});

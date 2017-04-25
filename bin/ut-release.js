#!/usr/bin/env node
/* eslint no-process-env:0 */

var path = require('path');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var semver = require('semver');
var packageJson = require(path.join(process.cwd(), 'package.json'));
var exec = require('../lib/exec');
var buildableBranches = {
    fix: 'patch',
    feat: 'preminor'
};
conventionalRecommendedBump({
    preset: 'angular'
}, function(err, result) {
    if (err) {
        throw err;
    } else {
        var releaseType = result.releaseType;
        var currentVersion = packageJson.version;
        var tokens = [];
        if (process.env.gitlabSourceBranch) {
            tokens = process.env.gitlabSourceBranch.split('/');
        } else if (process.env.GIT_BRANCH) {
            tokens = process.env.GIT_BRANCH.split('/').slice(1); // remove origin
        }
        var versionToRelease;
        if (tokens.length === 2 && buildableBranches[tokens[0]]) {
            releaseType = buildableBranches[tokens[0]];
            if (releaseType === 'preminor') {
                if (semver.prerelease(currentVersion)) {
                    // TO DO - check if the prerelease component in the current version is the same as that in the branch name
                    releaseType = 'prerelease';
                } else {
                    versionToRelease = semver.inc(currentVersion, releaseType, tokens[1]);
                }
            }
        }
        if (!versionToRelease) {
            versionToRelease = semver.inc(currentVersion, releaseType);
        }
        var publishedVersions = JSON.parse(exec('npm', ['show', packageJson.name, 'versions', '--json'], 'pipe'));
        var conflictingSemverDiff = releaseType.startsWith('pre') ? 'prerelease' : releaseType;
        var conflictingVersions = publishedVersions.filter((version) => {
            if (
                semver.eq(versionToRelease, version) ||
                (semver.lte(versionToRelease, version) && semver.diff(versionToRelease, version) === conflictingSemverDiff)
            ) {
                return true;
            }
            return false;
        });
        if (conflictingVersions.length) {
            throw new Error(`${releaseType} version ${versionToRelease} coudn't be published! Conflicting versions: ${conflictingVersions.join(', ')}`);
        }
        exec('npm', ['version', releaseType, '-m', '[ci-skip][ci skip] version incremented to %s']);
        exec('npm', ['publish']);
    };
});

#!/usr/bin/env node
/* eslint no-process-env:0, no-console:0, no-process-exit:0 */

var path = require('path');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var semver = require('semver');
var packageJson = require(path.join(process.cwd(), 'package.json'));
var pkgVersions = require('pkg-versions');
var exec = require('../lib/exec');
var buildableBranches = {
    hotfix: 'patch',
    major: 'premajor',
    minor: 'preminor',
    patch: 'prepatch'
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
        var setTag = false;
        if (process.env.gitlabSourceBranch) {
            tokens = process.env.gitlabSourceBranch.split('/');
        } else if (process.env.CIRCLE_BRANCH) {
            tokens = process.env.CIRCLE_BRANCH.split('/');
        } else if (process.env.GIT_BRANCH) {
            tokens = process.env.GIT_BRANCH.split('/').slice(1); // remove origin
        } else {
            throw new Error('Branch name could not be detected!');
        }
        var versionToRelease;
        if (tokens.length === 2 && buildableBranches[tokens[0]] && tokens[1]) {
            releaseType = buildableBranches[tokens[0]];
            if (releaseType.startsWith('pre')) {
                var prereleaseTokens = semver.prerelease(currentVersion);
                if (prereleaseTokens) {
                    if (prereleaseTokens[0] !== tokens[1]) {
                        throw new Error(`Release version mismatch: Version ${prereleaseTokens[0]} can't be released from version ${tokens[1]}`);
                    }
                    releaseType = 'prerelease';
                } else {
                    if (!semver.prerelease(currentVersion + '-' + tokens[1])) {
                        throw new Error(`incorrect branch name: ${tokens.join('/')}! ${tokens[1]} MUST comprise only [0-9A-Za-z-]`);
                    }
                    versionToRelease = semver.inc(currentVersion, releaseType, tokens[1]);
                }
            }
        } else if (tokens.length > 1 || (tokens.length === 1 && tokens[0] !== 'master')) {
            throw new Error(`incorrect branch name: ${tokens.join('/')}! Allowed branch names: master, hotfix/*, major/*, minor/*, patch/*`);
        }
        if (!versionToRelease) {
            if (tokens[0] === 'master') {
                setTag = true;
            }
            versionToRelease = semver.inc(currentVersion, releaseType);
        }
        return pkgVersions(packageJson.name)
        .catch(function() {
            // return empty array in case a list of current versions could not be obtained.
            // This is needed when publishing for the first time.
            return [];
        })
        .then(function(versions) {
            var conflictingSemverDiff = releaseType.startsWith('pre') ? 'prerelease' : releaseType;
            var conflictingVersions = Array.from(versions).filter((version) => {
                if (
                    semver.eq(versionToRelease, version) ||
                    (semver.lte(versionToRelease, version) && semver.diff(versionToRelease, version) === conflictingSemverDiff)
                ) {
                    return true;
                }
                return false;
            });
            if (conflictingVersions.length) {
                throw new Error(`${releaseType} version ${versionToRelease} couldn't be published! Conflicting versions: ${conflictingVersions.join(', ')}`);
            }
            var versionArgs = ['version', versionToRelease, '-m', '[ci-skip][ci skip] version incremented to %s'];
            if (!setTag) {
                versionArgs.unshift('--no-git-tag-version');
            }
            exec('npm', versionArgs);
            if (!setTag) {
                exec('git', ['commit', '-am', `[ci-skip][ci skip] version incremented to ${versionToRelease}`]);
            }
            exec('git', ['push']);
            exec('git', ['push', 'origin', '--tags']);
            exec('npm', setTag ? ['publish'] : ['publish', '--tag', 'ci']);
            return true;
        })
        .catch(function(e) {
            console.error(e);
            return process.exit(1);
        });
    }
});

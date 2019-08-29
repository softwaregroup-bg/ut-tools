/* eslint no-process-env:0 */
const exec = require('./exec');
const path = require('path');
const conventionalRecommendedBump = require('conventional-recommended-bump');
const semver = require('semver');
const pkgVersions = require('pkg-versions');
const buildableBranches = {
    hotfix: 'patch',
    major: 'premajor',
    minor: 'preminor',
    patch: 'prepatch'
};

module.exports = (pkg, bumpOptions) => {
    return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
            ...bumpOptions,
            preset: 'angular'
        }, function(err, result) {
            return err ? reject(err) : resolve(result.releaseType);
        });
    })
    .then((releaseType) => {
            let tokens = [];
            // if (process.env.gitlabSourceBranch) {
            // tokens = process.env.gitlabSourceBranch.split('/');
            // } else
            if (process.env.CIRCLE_BRANCH) {
                tokens = process.env.CIRCLE_BRANCH.split('/');
            } else if (process.env.GIT_BRANCH) {
                tokens = process.env.GIT_BRANCH.split('/').slice(1); // remove origin
            } else {
                throw new Error('Branch name could not be detected!');
            }
            let currentVersion = pkg.version;
            let tag = tokens[1];
            let version;
            if (tokens.length === 2 && buildableBranches[tokens[0]] && tokens[1]) {
                releaseType = buildableBranches[tokens[0]];
                if (releaseType.startsWith('pre')) {
                    let prereleaseTokens = semver.prerelease(currentVersion);
                    if (prereleaseTokens) {
                        if (prereleaseTokens[0] !== tokens[1]) {
                            throw new Error(`Release version mismatch: Version ${prereleaseTokens[0]} can't be released from version ${tokens[1]}`);
                        }
                        releaseType = 'prerelease';
                    } else {
                        if (!semver.prerelease(currentVersion + '-' + tokens[1])) {
                            throw new Error(`incorrect branch name: ${tokens.join('/')}! ${tokens[1]} MUST comprise only [0-9A-Za-z-]`);
                        }
                        version = semver.inc(currentVersion, releaseType, tokens[1]);
                    }
                }
            } else if (tokens.length > 1 || (tokens.length === 1 && tokens[0] !== 'master')) {
                throw new Error(`incorrect branch name: ${tokens.join('/')}! Allowed branch names: master, hotfix/*, major/*, minor/*, patch/*`);
            }
            if (!version) {
                if (tokens[0] === 'master') {
                    tag = null;
                }
                version = semver.inc(currentVersion, releaseType);
            }
            return pkgVersions(pkg.name)
                .catch(function() {
                    // return empty array in case a list of current versions could not be obtained.
                    // This is needed when publishing for the first time.
                    return [];
                })
                .then(function(existingVersions) {
                    var conflictingSemverDiff = releaseType;
                    var preid = '';
                    if (releaseType.startsWith('pre')) {
                        conflictingSemverDiff = 'prerelease';
                        preid = semver.prerelease(version)[0];
                    }
                    var conflictingVersions = Array.from(existingVersions).filter(existingVersion => {
                        let diff = semver.diff(version, existingVersion);
                        if (
                            !diff ||
                            (
                                semver.lte(version, existingVersion) &&
                                diff === conflictingSemverDiff &&
                                preid &&
                                preid === (semver.prerelease(existingVersion) || [])[0]
                            )
                        ) {
                            return true;
                        }
                        return false;
                    });
                    if (conflictingVersions.length) {
                        throw new Error(`${releaseType} version ${version} couldn't be published! Conflicting versions: ${conflictingVersions.join(', ')}`);
                    }

                    return {
                        version,
                        releaseType,
                        preid,
                        tag
                    };
                });
        });
};

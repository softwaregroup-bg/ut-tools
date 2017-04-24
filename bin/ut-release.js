#!/usr/bin/env node
var path = require('path');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var semver = require('semver');
var packageJson = require(path.join(process.cwd(), 'package.json'));
var exec = require('../lib/exec');
conventionalRecommendedBump({
    preset: 'angular'
}, function(err, result) {
    if (err) {
        throw err;
    } else {
        var releaseType = result.releaseType;
        var currentVersion = packageJson.version;
        var versionToRelease = semver.inc(currentVersion, releaseType);
        var publishedVersions = JSON.parse(exec('npm', ['show', packageJson.name, 'versions', '--json'], 'pipe'));
        var conflictingVersions = publishedVersions.filter((version) => {
            return semver.lte(versionToRelease, version) && semver.diff(versionToRelease, version) === releaseType;
        });

        if (conflictingVersions.length) {
            throw new Error(`${releaseType} version ${versionToRelease} coudn't be published! Conflicting versions: ${conflictingVersions.join()}`);
        } else {
            exec('npm', ['version', releaseType, '-m', '[ci-skip][ci skip] version incremented to %s']);
            exec('npm', ['publish']);
        }
    };
});

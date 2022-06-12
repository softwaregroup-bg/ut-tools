#!/usr/bin/env node
const path = require('path');
const semver = require('semver');
const pkgVersion = require(path.join(process.cwd(), 'package.json')).version;

if (!semver.prerelease(pkgVersion)) {
    const gitTag = require('../lib/exec')('git', ['describe'], 'pipe', false) || require('../lib/exec')('git', ['tag', '-a', 'initial_tag', '-m', '"Initial tag"'], 'pipe');
    if (gitTag !== 'v' + pkgVersion) {
        require('../lib/exec')('npm', ['run', 'changelog', '--silent']);
    }
}

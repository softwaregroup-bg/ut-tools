#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const exec = require('../lib/exec');
const versionInc = require('../lib/versionInc');
const fs = require('fs');

async function release() {
    try {
        const changed = JSON.parse(exec('lerna', [
            'changed',
            '--json'
        ], 'pipe'));

        // validate versions and get inc metadata
        const packages = await Promise.all(changed.map(async pkg => {
        return {...pkg, inc: await versionInc(pkg, {
                lernaPackage: pkg.name,
                path: pkg.location
            })}
        }));

        // get preid from the first package as it should be the same for all packages
        const { preid } = packages[0].inc;

        const versionCmd = ['version', '--conventional-commits', '--yes'];

        if (preid) {
            const prerelease = packages
                .filter(p => !p.version.includes(`-${preid}.`))
                .map(p => p.name)
                .join(',');

            if (prerelease) versionCmd.push('--preid', preid, '--conventional-prerelease=' + prerelease);
        } else {
            const graduate = packages
                .filter(p => /-[0-9A-Za-z-]+\./.test(p.version))
                .map(p => p.name)
                .join(',');

            if (graduate) versionCmd.push('--conventional-graduate=' + graduate);
        }

        exec('lerna', versionCmd);
        exec('lerna', ['publish', 'from-package', '--yes']);

    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

release();
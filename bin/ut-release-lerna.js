#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const tokenizeBranch = require('../lib/tokenizeBranch');
const versionInc = require('../lib/versionInc');
const exec = require('../lib/exec');
const fs = require('fs');

const isMaster = () => {
    const branchTokens = tokenizeBranch();
    return branchTokens.length === 1 && branchTokens[0] === 'master';
};

async function release() {
    try {
        const ls = ['ls', '--json', '--since'];
        if (isMaster()) ls.push('--conventional-graduate');

        const changed = JSON.parse(exec('lerna', ls, 'pipe'));
        if (!changed.length) {
            console.log('lerna info', 'No changed packages found');
            console.log('lerna', ls.join(' '), '=>', 0);
            return process.exit(0);
        }

        // validate versions and get inc metadata
        const packages = await Promise.all(changed.map(async pkg => {
            return {
                ...pkg,
                inc: await versionInc(pkg, {
                    lernaPackage: pkg.name,
                    path: pkg.location
                })
            };
        }));

        // get preid from the first package
        // as it is extracted from the branch name
        // and is therefore the same for all packages
        const { preid } = packages[0].inc;

        if (preid) {
            const releaseTypes = packages.reduce((all, pkg) => {
                const releaseType = pkg.inc.releaseType;
                if (!all[releaseType]) all[releaseType] = [];
                all[releaseType].push(pkg.name);
                return all;
            }, {});

            Object.entries(releaseTypes).forEach(([releaseType, list]) => {
                exec('lerna', [
                    'version',
                    releaseType,
                    '--conventional-prerelease=' + list.join(','),
                    '--preid',
                    preid,
                    '--no-changelog',
                    '--yes',
                    '--message',
                    '"chore(prerelease): [ci-skip] publish"'
                ]);
            });
        } else {
            const cmd = [
                'version',
                '--conventional-commits',
                '--yes',
                '--changelog-preset',
                require.resolve('./angular'),
                '--message',
                '"chore(release): [ci-skip] publish"'
            ];

            // packages with prerelease versions that have to be graduated
            const graduate = packages
                .filter(p => /-[0-9A-Za-z-]+\./.test(p.version))
                .map(p => p.name)
                .join(',');

            if (graduate) cmd.push('--conventional-graduate=' + graduate);

            exec('lerna', cmd);
        }

        exec('lerna', ['publish', 'from-package', '--yes']);

        fs.copyFileSync && fs.copyFileSync('package.json', '.lint/result.json');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

require('../lib/audit')();

release();

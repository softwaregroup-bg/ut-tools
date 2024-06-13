#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const exec = require('../lib/exec');
const versionBump = require('../lib/versionBump');
const pkgJson = process.env.npm_package_json && require(process.env.npm_package_json);
const {unlink, rename, copyFle} = require('node:fs/promises');
const {glob} = require('glob');

require('../lib/audit')();

versionBump()
    .then(async({tag}) => {
        if (pkgJson?.scripts?.doc) {
            exec('npm', ['run', 'doc',
                '--',
                '--fromVersion', pkgJson.version,
                '--toolsUrl', process.env.IMPL_TOOLS_URL,
                '--toolsUsername', process.env.IMPL_TOOLS_USR,
                '--toolsPassword', process.env.IMPL_TOOLS_PSW,
                '--branchName', process.env.BRANCH_NAME,
                '--buildNumber', process.env.BUILD_NUMBER
            ]);
        }
        exec('git', ['push']);
        exec('git', ['push', 'origin', '--tags']);
        if (pkgJson?.scripts?.compile) exec('npm', ['run', 'compile']);
        if (pkgJson?.scripts?.license) {
            const cjs = await glob('**/*.js.cjs', { ignore: 'node_modules/**' });
            await Promise.all(cjs.map(async f => {
                await unlink(f.replace('.cjs', ''));
                await rename(f, f.replace('.cjs', ''));
            }));
        }
        return exec('npm', (tag ? ['publish', '--tag', tag] : ['publish']).concat(process.argv.slice(2)));
    })
    .then(() => copyFle('package.json', '.lint/result.json'))
    .catch(function(e) {
        console.error(e);
        process.exit(1);
    });

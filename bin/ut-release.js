#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const exec = require('../lib/exec');
const versionBump = require('../lib/versionBump');
const pkgJson = process.env.npm_package_json && require(process.env.npm_package_json);
const {copyFile} = require('node:fs/promises');

async function release() {
    try {
        const versionParams = {};
        if (pkgJson?.scripts?.license) {
            const output = exec('npm', ['run', 'license'], 'pipe');
            const license = JSON.parse(output.split('\n').pop());
            versionParams.env = {
                AEGIS_KEY: license.encryptionKey,
                AEGIS_IV: license.encryptionIV,
                AEGIS_CIPHER: license.encryptionCipher,
                AEGIS_BUILD: 1,
                AEGIS_OVERWRITE: 1
            };
        }
        const {tag} = await versionBump(versionParams);
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
        exec('npm', (tag ? ['publish', '--tag', tag] : ['publish']).concat(process.argv.slice(2)));
        await copyFile('package.json', '.lint/result.json');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

require('../lib/audit')();
release();

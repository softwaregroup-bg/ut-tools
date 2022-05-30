#!/usr/bin/env node
const util = require('util');
const request = util.promisify(require('request'));
const minimist = require('minimist');
const {resolve} = require('path');
const versionRegex = /^(- name: version\s+default:) (\d+\.\d+.\d+)$/ms;
const tagRegex = /^- name: tag\s+default: (\S+)$/ms;

/* eslint-disable no-process-exit, no-process-env, no-console */

function check(result) {
    if (result.statusCode < 200 || result.statusCode >= 300) {
        console.error(result.body);
        throw new Error(`${result.statusCode} ${result.statusMessage}`);
    }
    return result.body;
}

(async() => {
    try {
        const argv = minimist(process.argv.slice(2));
        let base = argv._[0]; // https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repostoryId}
        base = base.endsWith('/') ? base : `${base}/`;
        const auth = {
            user: '',
            pass: process.env.DEPLOY_TOKEN,
            sendImmediately: true
        };
        const path = argv.path || '/azure-pipelines.yml';
        const branch = argv.branch || 'jenkins';
        if (base.startsWith('https://dev.azure.com/')) {
            const url = new URL('items', base);
            url.searchParams.set('api-version', '6.0');
            url.searchParams.set('path', path);
            url.searchParams.set('versionDescriptor.version', branch);
            url.searchParams.set('versionDescriptor.versionType', 'branch');
            const meta = check(await request(url, {json: true, auth}));
            const content = check(await request(url, {auth}));
            if (versionRegex.test(content) && tagRegex.test(content)) {
                const {version} = require(resolve('package.json'));
                const tag = content.match(tagRegex)[1];
                if (tag === process.env.DEPLOY_TAG) {
                    const updated = content.replace(versionRegex, `$1 ${version}`);
                    const push = new URL('pushes', base);
                    push.searchParams.set('api-version', '6.0');
                    const xx = check(await request(push, {
                        auth,
                        method: 'POST',
                        json: true,
                        body: {
                            refUpdates: [
                                {
                                    name: `refs/heads/${branch}`,
                                    oldObjectId: meta.commitId
                                }
                            ],
                            commits: [
                                {
                                    comment: `ut-deploy ${version}`,
                                    changes: [
                                        {
                                            changeType: 'edit',
                                            item: {
                                                path
                                            },
                                            newContent: {
                                                content: updated,
                                                contentType: 'rawtext'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }));
                    console.log(xx);
                } else {
                    throw new Error(`Tag Azure DevOps tag "${tag}" does not match deploy tag "${process.env.DEPLOY_TAG}"`);
                }
            }
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

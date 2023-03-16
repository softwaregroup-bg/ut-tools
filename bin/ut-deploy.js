#!/usr/bin/env node
const util = require('util');
const request = util.promisify(require('request'));
const minimist = require('minimist');
const {resolve} = require('path');

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
        const {version, name} = require(resolve('package.json'));
        const [, project] = name.match(/^impl-(.*)$/);
        const auth = {
            user: '',
            pass: process.env.DEPLOY_TOKEN,
            sendImmediately: true
        };
        const xx = check(await request(argv._[0] || 'https://dev.azure.com/sg-main/env-tools/_apis/pipelines/103/runs?api-version=7.0', {
            auth,
            method: 'POST',
            json: true,
            body: {
                resources: {
                    repositories: {
                        self: {
                            refName: 'refs/heads/main'
                        }
                    }
                },
                templateParameters: {
                    branch: argv.branch || 'ut',
                    project,
                    tag: 'latest',
                    version
                }
            }
        }));
        console.log(xx);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

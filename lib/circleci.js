/* eslint no-process-env:0 */
const exec = require('../lib/exec');
const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');

function ecrimage(tag) {
    return `${process.env.AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${image(tag)}`;
}

function image(tag) {
    return `${process.env.npm_package_name.replace(/^@/, '')}:${tag}`;
}

function project() {
    return `${process.env.npm_package_name.replace(/.+\//, '')}`;
}

module.exports = {
    build: function() {
        const dockerfile = path.resolve(__dirname, '..', 'circleci', 'circle-ci.dockerfile');
        exec('docker', ['build', '--rm=false', '-t', image('latest'), '-f', dockerfile, '.']);
    },
    cover: function() {
        exec('sed', ['-i', `s#/home/ubuntu/${project()}#/usr/src/node-app#g`, `${process.env.CIRCLE_ARTIFACTS}/lcov.info`]);
        exec('docker', [
            'run',
            '-i',
            '--rm',
            '-v', `${process.env.CIRCLE_ARTIFACTS}:/usr/src/node-app/coverage`,
            '-e', `SONAR_PROJECT_KEY=${project()}`,
            '-e', `SONAR_PROJECT_NAME=${project()}`,
            '-e', `SONAR_PROJECT_VERSION=${process.env.npm_package_version}`,
            '-e', `SONAR_BRANCH=${process.env.CIRCLE_BRANCH}`,
            image('latest'),
            'sonar-scanner-run.sh'
        ]);
    },
    tag: function() {
        exec('docker', ['tag', image('latest'), ecrimage('latest')]);
        exec('docker', ['tag', image('latest'), ecrimage(process.env.npm_package_version)]);
        exec('docker', ['tag', image('latest'), ecrimage(process.env.npm_package_version + '-' + process.env.CIRCLE_BRANCH.replace(/\//g, '_'))]);
    },
    push: function() {
        exec('aws', ['--version']);
        exec('aws', ['configure', 'set', 'default.region', 'us-west-2']);
        exec('aws', ['configure', 'set', 'default.output', 'json']);
        const login = exec('aws', ['ecr', 'get-login', '--region', 'us-west-2'], 'pipe');
        childProcess.execSync(login);
        exec('docker', ['push', ecrimage(process.env.npm_package_version + '-' + process.env.CIRCLE_BRANCH.replace(/\//g, '_'))]);
        exec('docker', ['push', ecrimage(process.env.npm_package_version)]);
        exec('docker', ['push', ecrimage('latest')]);
    },
    test: function() {
        process.env.UT_COVER_DIR = process.env.CIRCLE_ARTIFACTS;
        fs.mkdirSync(`${process.env.CIRCLE_TEST_REPORTS}/reports`);
        if (/^(master|(hotfix|major|minor|patch)\/[^/]+)$/.test(process.env.CIRCLE_BRANCH)) {
            childProcess.spawnSync('npm run release', {shell: '/bin/bash', stdio: 'inherit'});
        } else {
            childProcess.spawnSync('npm run test', {shell: '/bin/bash', stdio: 'inherit'});
        }
        // exec('npm', ['run', 'cover', '--', '--dir', process.env.CIRCLE_ARTIFACTS]);
    }
};

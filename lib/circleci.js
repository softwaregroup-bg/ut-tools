/* eslint no-process-env:0 */
var exec = require('../lib/exec');
var path = require('path');
var childProcess = require('child_process');

function ecrimage(tag) {
    return `${process.env.AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${process.env['npm_package_name'].replace(/^@/, '')}:${tag}`;
}

function image(tag) {
    return `${process.env['npm_package_name'].replace(/^@/, '')}:${tag}`;
}

module.exports = {
    build: function() {
        var dockerfile = path.resolve(__dirname, '..', 'circleci', 'circle-ci.dockerfile');
        exec('docker', ['build', '--rm=false', '-t', image('latest'), '-f', dockerfile, '.']);
        exec('docker', ['tag', image('latest'), ecrimage('latest')]);
        exec('docker', ['tag', image('latest'), ecrimage(process.env['npm_package_version'])]);
    },
    push: function() {
        exec('aws', ['--version']);
        exec('aws', ['configure', 'set', 'default.region', 'us-west-2']);
        exec('aws', ['configure', 'set', 'default.output', 'json']);
        var login = exec('aws', ['ecr', 'get-login', '--region', 'us-west-2'], 'pipe');
        childProcess.execSync(login);
        exec('docker', ['push', ecrimage(process.env['npm_package_version'])]);
        exec('docker', ['push', ecrimage('latest')]);
    },
    test: function() {
        if (process.env.CIRCLE_BRANCH === 'master') {
            childProcess.execSync(`npm run release | tee >(tap-xunit > ${process.env.CIRCLE_TEST_REPORTS}/tape.xml)`, {shell: '/bin/bash'});
        } else {
            childProcess.execSync(`npm run test | tee >(tap-xunit > ${process.env.CIRCLE_TEST_REPORTS}/tape.xml)`, {shell: '/bin/bash'});
        }
        exec('npm', ['run', 'cover', '--', '--dir', process.env.CIRCLE_ARTIFACTS]);
    }
};

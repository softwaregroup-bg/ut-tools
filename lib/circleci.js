/* eslint no-process-env:0 */
var exec = require('../lib/exec');
var path = require('path');
var childProcess = require('child_process');

function ecrimage(tag) {
    return `${process.env.AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${image(tag)}`;
}

function image(tag) {
    return `${process.env['npm_package_name'].replace(/^@/, '')}:${tag}`;
}

function project() {
    return `${process.env['npm_package_name'].replace(/.+\//, '')}`;
}

module.exports = {
    build: function() {
        var dockerfile = path.resolve(__dirname, '..', 'circleci', 'circle-ci.dockerfile');
        exec('docker', ['build', '--rm=false', '-t', image('latest'), '-f', dockerfile, '.']);
    },
    cover: function() {
        exec('docker', [
            'run',
            '-i',
            '--rm',
            '-e', `SONAR_PROJECT_KEY=${project()}`,
            '-e', `SONAR_PROJECT_NAME=${project()}`,
            '-e', `SONAR_PROJECT_VERSION=${process.env['npm_package_version']}`,
            '-e', `SONAR_BRANCH=${process.env['CIRCLE_BRANCH']}`,
            image('latest'),
            'sonar-scanner-run.sh'
        ]);
    },
    tag: function() {
        exec('docker', ['tag', image('latest'), ecrimage('latest')]);
        exec('docker', ['tag', image('latest'), ecrimage(process.env['npm_package_version'])]);
        exec('docker', ['tag', image('latest'), ecrimage(process.env['npm_package_version'] + '-' + process.env.CIRCLE_BRANCH)]);
    },
    push: function() {
        exec('aws', ['--version']);
        exec('aws', ['configure', 'set', 'default.region', 'us-west-2']);
        exec('aws', ['configure', 'set', 'default.output', 'json']);
        var login = exec('aws', ['ecr', 'get-login', '--region', 'us-west-2'], 'pipe');
        childProcess.execSync(login);
        exec('docker', ['push', ecrimage(process.env['npm_package_version'] + '-' + process.env.CIRCLE_BRANCH)]);
        exec('docker', ['push', ecrimage(process.env['npm_package_version'])]);
        exec('docker', ['push', ecrimage('latest')]);
    },
    test: function() {
        if (/(^master$)|(^ci_.*)/.test(process.env.CIRCLE_BRANCH)) {
            childProcess.execSync(`npm run release | tee >(tap-xunit > ${process.env.CIRCLE_TEST_REPORTS}/tape.xml)`, {shell: '/bin/bash'});
        } else {
            childProcess.execSync(`npm run test | tee >(tap-xunit > ${process.env.CIRCLE_TEST_REPORTS}/tape.xml)`, {shell: '/bin/bash'});
        }
        exec('npm', ['run', 'cover', '--', '--dir', process.env.CIRCLE_ARTIFACTS]);
    }
};

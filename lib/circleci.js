/* eslint no-process-env:0 */
var exec = require('../lib/exec');
var path = require('path');
var childProcess = require('child_process');

function image(tag) {
    return process.env.AWS_ACCOUNT_ID + '.dkr.ecr.us-west-2.amazonaws.com/' + process.env['npm_package_name'].replace(/^@/, '') + ':' + tag;
}

module.exports = {
    build: function() {
        var dockerfile = path.resolve(__dirname, '..', 'circleci', 'circle-ci.dockerfile');
        exec('docker', ['build', '--rm=false', '-t', image('latest'), '-t', image(process.env['npm_package_version']), '-f', dockerfile, '.']);
    },
    push: function() {
        exec('aws', ['--version']);
        exec('aws', ['configure', 'set', 'default.region', 'us-west-2']);
        exec('aws', ['configure', 'set', 'default.output', 'json']);
        var login = exec('aws', ['ecr', 'get-login', '--region', 'us-west-2'], 'pipe');
        childProcess.execSync(login);
        exec('docker', ['push', image(process.env['npm_package_version'])]);
    }
};

/* eslint no-process-env:0, no-console:0 */
var exec = require('../lib/exec');
var path = require('path');
var childProcess = require('child_process');

function image(tag) {
    return process.env.AWS_ACCOUNT_ID + '.dkr.ecr.us-east-1.amazonaws.com/' + process.env['npm_package_name'].split('/').pop() + ':' + tag;
}

module.exports = {
    build: function() {
        var dockerfile = path.resolve(__dirname, '..', 'circleci', 'circle-ci.dockerfile');
        exec('docker', ['build', '-t', image('latest'), '-t', image(process.env['npm_package_version']), '-f', dockerfile, '.']);
    },
    push: function() {
        console.log(exec('aws', ['--version']));
        exec('aws', ['configure', 'set', 'default.region', 'us-east-1']);
        exec('aws', ['configure', 'set', 'default.output', 'json']);
        var login = exec('aws', ['ecr', 'get-login', '--region', 'us-east-1']);
        childProcess.execSync(login);
        exec('docker', ['push', image(process.env['npm_package_version'])]);
    }
};

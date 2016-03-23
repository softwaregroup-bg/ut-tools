/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
var latestVersion = require('latest-version');
var semver = require('semver');

module.exports = function() {
    var pkg = require('../package.json');
    process.env['npm_registry'] = pkg.publishConfig.registry;

    latestVersion(pkg.name).then(function(version) {
        if (semver.lt(pkg.version, version)) {
            console.error('Please update to ' + pkg.name + '@' + version);
            process.exit(1);
        } else {
            console.log(pkg.name, pkg.version, 'linting...');
            if (require('./lintJS')() || require('./lintPkg')()) {
                process.exit(1);
            }
        }
    }).catch(function(err) {
        console.error(err);
        process.exit(1);
    });
};

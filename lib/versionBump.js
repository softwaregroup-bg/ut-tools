/* eslint no-process-env:0 */
const versionInc = require('./versionInc');
const path = require('path');
const exec = require('./exec');
module.exports = ({env} = {}) => {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    return versionInc(pkg)
        .then(result => {
            exec('npm', ['version', result.version, '-m', '[ci-skip][ci skip] version incremented to %s'], {env});
            return result;
        });
};

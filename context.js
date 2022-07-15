/* eslint no-process-env:0 */

function getOwner() {
    const owner = require(process.env.npm_package_json)?.repository?.url;
    return (owner && owner.split(/[:/]/)[1]) || 'softwaregroup-bg';
}

function getHost() {
    const host = require(process.env.npm_package_json)?.repository?.url;
    return 'https://' + ((host && host.split(/[:/@]/)[1]) || 'github.com');
}

module.exports = {
    protocol: 'https:',
    host: getHost(),
    owner: getOwner(),
    repository: process.env.npm_package_name,
    commit: 'commit'
};

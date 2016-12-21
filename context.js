/* eslint no-process-env:0 */

function getOwner() {
    var owner = process.env['npm_package_repository_url'];
    return (owner && owner.split(/[:/]/)[1]) || 'softwaregroup-bg';
}

function getHost() {
    var host = process.env['npm_package_repository_url'];
    return 'https://' + ((host && host.split(/[:/@]/)[1]) || 'github.com');
}

module.exports = {
    protocol: 'https:',
    host: getHost(),
    owner: getOwner(),
    repository: process.env['npm_package_name'],
    commit: 'commit'
};

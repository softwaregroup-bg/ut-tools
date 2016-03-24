/* eslint no-process-env:0 */

function getOwner() {
    var owner = process.env['npm_package_repository_url'];
    return (owner && owner.split(/[:\/]/)[1]) || 'ut5';
}

module.exports = {
    protocol: 'https:',
    host: 'https://git.softwaregroup-bg.com',
    owner: getOwner(),
    repository: process.env['npm_package_name'],
    commit: 'commit'
};

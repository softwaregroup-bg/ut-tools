/* eslint no-process-env:0 */
module.exports = {
    protocol: 'https:',
    host: 'https://git.softwaregroup-bg.com',
    owner: 'ut5',
    repository: process.env['npm_package_name'],
    commit: 'commit'
};

const request = require('sync-request');

const gitlabEndpoint = 'https://git.softwaregroup-bg.com/api/v3';

module.exports.projects = function() {
    var response = request('GET', gitlabEndpoint + '/projects', {
        qs: {
            private_token: 'WqYZDeAhwuUhpsrFT9Db',
            per_page: 100
        }
    });
    if (response.statusCode === 200) {
        return JSON.parse(response.body);
    }
};

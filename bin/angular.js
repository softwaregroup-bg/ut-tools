var gitSemverTags = require('git-semver-tags');

module.exports = Promise.resolve()
    .then(() => require('conventional-changelog-angular'))
    .then(options => {
        return new Promise((resolve, reject) => {
            gitSemverTags(function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    const from = result.find(tag => /^.*@\d+\.\d+.\d+$/.test(tag)); // find the first non prerelase tag
                    if (from) options.conventionalChangelog.gitRawCommitsOpts = {from};
                    resolve(options);
                }
            }, {
                lernaTags: true
            });
        });
    });

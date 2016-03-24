/* eslint no-console:0, no-process-exit:0 */
var path = require('path');

module.exports = function(from) {
    var fileName = path.join(from || process.cwd(), 'package.json');
    var errorCode = 0;

    function error(msg) {
        console.error(fileName + '\n  1:1  error  ' + msg);
        errorCode = 1;
    }

    function match(s, name, exp) {
        if (exp) {
            if (typeof s !== 'string' || !s.match(exp)) {
                error(name + '=' + s + ' is expected to match ' + exp);
            }
        } else {
            s || error('Missing property ' + name);
        }
    }

    var p = require(fileName);
    p.scripts || error('Missing scripts property');

    match(p.name, 'name', /^(ut-)|(impl-)/);

    match(p.scripts, 'scripts');
    if (p.scripts) {
        match(p.scripts.changelog, 'scripts.changelog', /ut-changelog/);
        match(p.scripts.check, 'scripts.check', /ut-check/);
        match(p.scripts.cover, 'scripts.cover', /ut-cover/);
        match(p.scripts.lint, 'scripts.lint', /ut-lint/);
        // match(p.scripts.postpublish, 'scripts.postpublish', /ut-postpublish/);
        match(p.scripts.postversion, 'scripts.postversion', /ut-postversion/);
        match(p.scripts.precommit, 'scripts.precommit', /ut-precommit/);
        match(p.scripts.prepublish, 'scripts.prepublish', /ut-prepublish/);
        match(p.scripts.prepush, 'scripts.prepush', /ut-prepush/);
        match(p.scripts.pretest, 'scripts.pretest', /ut-pretest/);
        match(p.scripts.preversion, 'scripts.preversion', /ut-preversion/);
        match(p.scripts.test, 'scripts.test', /ut-test/);
    }

    match(p.repository, 'repository');
    if (p.repository) {
        match(p.repository.type, 'repository.type', /^git$/);
        (typeof p.name === 'string') && p.name.match(/^ut-/) && match(p.repository.url, 'repository.url', /^git@git\.softwaregroup-bg\.com:ut5\/ut-.*\.git$/);
        (typeof p.name === 'string') && p.name.match(/^impl-/) && match(p.repository.url, 'repository.url', /^git@git\.softwaregroup-bg\.com:ut5impl\/impl-.*\.git$/);
    }

    match(p.publishConfig, 'publishConfig');
    if (p.publishConfig) {
        match(p.publishConfig.registry, 'publishConfig.registry', /^https:\/\/nexus.softwaregroup-bg.com\/repository\/npm-internal$/);
    }

    match(p.devDependencies, 'devDependencies');
    if (p.devDependencies) {
        match(p.devDependencies['ut-tools'], 'devDependencies.ut-tools', /.?/);
    }

    return errorCode;
};

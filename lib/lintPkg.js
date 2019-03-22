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

    match(p.name, 'name', /^(ut-)|(impl-)|(@leveloneproject\/dfsp-)|(@leveloneproject\/ist-)/);

    match(p.scripts, 'scripts');
    if (p.scripts) {
        match(p.scripts.changelog, 'scripts.changelog', /ut-changelog/);
        match(p.scripts.check, 'scripts.check', /ut-check/);
        match(p.scripts.cover, 'scripts.cover', /ut-cover/);
        match(p.scripts.gitlab, 'scripts.gitlab', /ut-gitlab/);
        match(p.scripts.jenkins, 'scripts.jenkins', /ut-jenkins/);
        match(p.scripts.lint, 'scripts.lint', /ut-lint/);
        match(p.scripts.postversion, 'scripts.postversion', /ut-postversion/);
        match(p.scripts.precommit, 'scripts.precommit', /ut-precommit/);
        match(p.scripts.prepush, 'scripts.prepush', /ut-prepush/);
        match(p.scripts.pretest, 'scripts.pretest', /ut-pretest/);
        match(p.scripts.precover, 'scripts.precover', /ut-precover/);
        match(p.scripts.preversion, 'scripts.preversion', /ut-preversion/);
        match(p.scripts.release, 'scripts.release', /ut-release/);
        match(p.scripts.test, 'scripts.test', /ut-test/);
    }

    var UTRE = /^git@((git\.softwaregroup\.com:ut5)|(github\.com:softwaregroup-bg))\/ut-.*\.git$/;
    var UTIMPLRE = /^git@git\.softwaregroup\.com:ut5impl\/impl-.*\.git$/;
    var L1PRE = /^git@github.com:LevelOneProject\/((dfsp-)|(ist-)).*\.git$/;
    var GITHUBRE = /^git@github.com/;
    var SGRE = /^git@git\.softwaregroup\.com:ut5/;

    match(p.repository, 'repository');
    if (p.repository) {
        match(p.repository.type, 'repository.type', /^git$/);
        (typeof p.name === 'string') && p.name.match(/^ut-/) && match(p.repository.url, 'repository.url', UTRE);
        (typeof p.name === 'string') && p.name.match(/^impl-/) && match(p.repository.url, 'repository.url', UTIMPLRE);
        (typeof p.name === 'string') && p.name.match(/^@leveloneproject\//) && match(p.repository.url, 'repository.url', L1PRE);
    }

    if (p.repository && SGRE.test(p.repository.url)) {
        match(p.publishConfig, 'publishConfig');
        if (p.publishConfig) {
            match(p.publishConfig.registry, 'publishConfig.registry', /^https:\/\/nexus.softwaregroup.com\/repository\/npm-internal$/);
        }
    }

    if (p.repository && L1PRE.test(p.repository.url)) {
        match(p.license, 'license', /^SEE LICENSE IN LICENSE$/);
    } else if (p.repository && GITHUBRE.test(p.repository.url)) {
        match(p.license, 'license', /^Apache-2\.0$/);
    }

    match(p.devDependencies, 'devDependencies');
    if (p.devDependencies) {
        match(p.devDependencies['ut-tools'], 'devDependencies.ut-tools', /.?/);
    }

    return errorCode;
};

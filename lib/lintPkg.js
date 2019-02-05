var path = require('path');
var semver = require('semver');
var lintOutput = require('./lintOutput');

module.exports = function(from) {
    var fileName = path.join(from || process.cwd(), 'package.json');
    var errors = [];

    function error(msg) {
        errors.push({
            line: 1,
            column: 1,
            fatal: true,
            message: msg,
            ruleId: 'ut-lint-pkg'
        });
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

    function lintDeps(pkg) {
        var checklist = require('./dependencies');

        function superset(allowFixed, v1, v2) {
            if (v1 === v2) return true;
            if (!semver.validRange(v1) || !semver.validRange(v2)) return false;
            var r1 = semver.Range(v1);
            var r2 = semver.Range(v2);
            if (r1.set[0][0].operator === r2.set[0][0].operator || (allowFixed && (r2.set[0][0].operator === ''))) {
                switch (r1.set[0][0].operator) {
                    case '': return semver.eq(r2.set[0][0].semver.version, r1.set[0][0].semver.version);
                    case '>=':
                    case '>': return semver.gte(r2.set[0][0].semver.version, r1.set[0][0].semver.version);
                }
            }
        }

        function supersetAlternatives(allowFixed, v1, v2) {
            if (Array.isArray(v1)) {
                return v1.find(item => superset(allowFixed, item, v2));
            } else {
                return superset(allowFixed, v1, v2);
            }
        }

        function checkWhitelist(name, checkUnexpected = true, allowFixed = false) {
            pkg[name] && Object.keys(pkg[name]).forEach(dep => {
                if (checklist[name][dep]) {
                    !supersetAlternatives(allowFixed, checklist[name][dep], pkg[name][dep]) && error(`Expected ${dep}@${checklist[name][dep]}, but found ${dep}@${pkg[name][dep]} in "${name}"`);
                } else {
                    checkUnexpected && error(`Unexpected ${dep}@${pkg[name][dep]} in "${name}"`);
                }
            });
        };

        function checkBlacklist(name, blacklist) {
            pkg[name] && Object.keys(pkg[name]).forEach(dep => {
                blacklist.includes(dep) && error(`Unexpected ${dep}@${pkg[name][dep]} in "${name}"`);
            });
        }

        if ((typeof pkg.name === 'string') && pkg.name.match(/^ut-/)) {
            Object.assign(checklist.peerDependencies, checklist.peerDevDependencies);
            checkWhitelist('dependencies');
            checkWhitelist('devDependencies');
            checkWhitelist('peerDependencies');
            checkWhitelist('optionalDependencies');
        } else if ((typeof pkg.name === 'string') && pkg.name.match(/^impl-/)) {
            Object.assign(checklist.devDependencies, checklist.peerDevDependencies);
            Object.assign(checklist.dependencies, checklist.peerDependencies);
            checkWhitelist('dependencies', false, true);
            checkWhitelist('devDependencies', false, true);
            checkBlacklist('dependencies', Object.keys(checklist.peerDevDependencies));
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

    var UTRE = /^git@((git\.softwaregroup-bg\.com:ut5)|(github\.com:softwaregroup-bg))\/ut-.*\.git$/;
    var UTIMPLRE = /^git@git\.softwaregroup-bg\.com:ut5impl\/impl-.*\.git$/;
    var L1PRE = /^git@github.com:LevelOneProject\/((dfsp-)|(ist-)).*\.git$/;
    var GITHUBRE = /^git@github.com/;
    var SGRE = /^git@git\.softwaregroup-bg\.com:ut5/;

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
            match(p.publishConfig.registry, 'publishConfig.registry', /^https:\/\/nexus.softwaregroup-bg.com\/repository\/npm-internal$/);
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

    lintDeps(p);

    lintOutput('lint-package.xml', [{
        filePath: fileName,
        messages: errors,
        errorCount: errors.length,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    }]);

    return errors.length;
};

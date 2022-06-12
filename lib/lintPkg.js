const path = require('path');
const semver = require('semver');
const lintOutput = require('./lintOutput');
const request = require('request-promise-native');
const {parse} = require('./json/parse');
const fs = require('fs');

module.exports = async function(from) {
    const fileName = path.join(from || process.cwd(), 'package.json');
    const errors = [];

    function error(msg, line, column) {
        errors.push({
            line: line || 1,
            column: column || 1,
            fatal: true,
            message: msg,
            ruleId: 'ut-lint-pkg'
        });
    }

    function match(parsed, s, name, exp) {
        if (exp) {
            if (typeof s !== 'string' || !s.match(exp)) {
                error(`${name}=${s} is expected to match ${exp}`, parsed && parsed.start.line, parsed && parsed.start.column);
            }
        } else {
            s || error('Missing property ' + name);
        }
    }

    async function lintDeps(pkg, parsed) {
        let checklist;

        function superset(allowFixed, v1, v2) {
            if (v1 === v2) return true;
            if (!semver.validRange(v1) || !semver.validRange(v2)) return false;
            const r1 = new semver.Range(v1);
            const r2 = new semver.Range(v2);
            if (r1.set[0][0].operator === r2.set[0][0].operator || (allowFixed && (r2.set[0][0].operator === ''))) {
                switch (r1.set[0][0].operator) {
                    case '': return semver.eq(r2.set[0][0].semver.version, r1.set[0][0].semver.version);
                    case '>=':
                    case '>': return semver.gte(r2.set[0][0].semver.version, r1.set[0][0].semver.version);
                }
            }
        }

        function supersetAlternatives(allowFixed, v1, v2) {
            return v1.split('||').map(s => s.trim()).find(item => superset(allowFixed, item, v2));
        }

        function checkWhitelist(name, checkUnexpected = true, allowFixed = false) {
            pkg[name] && Object.keys(pkg[name]).forEach(dep => {
                if (checklist[name][dep]) {
                    !supersetAlternatives(allowFixed, checklist[name][dep], pkg[name][dep]) && error(
                        `Expected ${dep}@${checklist[name][dep]}, but found ${dep}@${pkg[name][dep]} in "${name}"`,
                        parsed && parsed[name][dep + '$location'].start.line,
                        parsed && parsed[name][dep + '$location'].start.column
                    );
                } else {
                    checkUnexpected && error(
                        `Non whitelisted ${dep}@${pkg[name][dep]} in "${name}"`,
                        parsed && parsed[name][dep + '$location'].start.line,
                        parsed && parsed[name][dep + '$location'].start.column
                    );
                }
            });
        };

        function checkBlacklist(name, blacklist) {
            pkg[name] && Object.keys(pkg[name]).forEach(dep => {
                blacklist.includes(dep) && error(
                    `Unexpected dev dependency ${dep}@${pkg[name][dep]} found in "${name}"`,
                    parsed && parsed[name][dep + '$location'].start.line,
                    parsed && parsed[name][dep + '$location'].start.column
                );
            });
        }

        if (['ut-portal', 'ut-webpack', 'ut-storybook', 'ut-help'].includes(pkg.name)) {
            checklist = JSON.parse(await request.get('https://raw.githubusercontent.com/softwaregroup-bg/whitelist/master/ut/package.json'));
            // checklist = require('whitelist/ut/package');
            Object.assign(checklist.dependencies, checklist.peerDependencies);
            Object.assign(checklist.dependencies, checklist.devDependencies);
            checkWhitelist('dependencies');
            checkWhitelist('devDependencies', true, true);
            checkWhitelist('peerDependencies');
            checkWhitelist('optionalDependencies');
        } else if ((typeof pkg.name === 'string') && pkg.name.match(/^ut-/)) {
            checklist = JSON.parse(await request.get('https://raw.githubusercontent.com/softwaregroup-bg/whitelist/master/ut/package.json'));
            // checklist = require('whitelist/ut/package');
            checkBlacklist('dependencies', Object.keys(checklist.devDependencies));
            Object.assign(checklist.devDependencies, checklist.dependencies);
            checkWhitelist('dependencies');
            checkWhitelist('devDependencies', true, true);
            checkWhitelist('peerDependencies');
            checkWhitelist('optionalDependencies');
        } else if ((typeof pkg.name === 'string') && pkg.name.match(/^impl-/)) {
            checklist = JSON.parse(await request.get('https://raw.githubusercontent.com/softwaregroup-bg/whitelist/master/impl/package.json'));
            // checklist = require('whitelist/impl/package');
            checkBlacklist('dependencies', Object.keys(checklist.devDependencies));
            Object.assign(checklist.devDependencies, checklist.dependencies);
            checkWhitelist('dependencies', false, true);
            checkWhitelist('devDependencies', false, true);
            checkWhitelist('peerDependencies');
            checkWhitelist('optionalDependencies');
        }
    }

    const p = require(fileName);
    const parsed = parse(fs.readFileSync(fileName, 'utf-8'));

    p.scripts || error('Missing scripts property');

    match(parsed.name$location, p.name, 'name', /^(ut|(ut|create|impl|standard-service)(-\w{2,})+)$/);
    match(parsed.scripts$location, p.scripts, 'scripts');
    if (p.scripts) {
        match(parsed.scripts.changelog$location, p.scripts.changelog, 'scripts.changelog', /ut-changelog/);
        match(parsed.scripts.check$location, p.scripts.check, 'scripts.check', /ut-check/);
        match(parsed.scripts.cover$location, p.scripts.cover, 'scripts.cover', /ut-cover|jest/);
        match(parsed.scripts.gitlab$location, p.scripts.gitlab, 'scripts.gitlab', /ut-gitlab/);
        match(parsed.scripts.jenkins$location, p.scripts.jenkins, 'scripts.jenkins', /ut-jenkins/);
        match(parsed.scripts.lint$location, p.scripts.lint, 'scripts.lint', /ut-lint/);
        match(parsed.scripts.postversion$location, p.scripts.postversion, 'scripts.postversion', /ut-postversion/);
        match(parsed.scripts.precommit$location, p.scripts.precommit, 'scripts.precommit', /ut-precommit/);
        match(parsed.scripts.prepush$location, p.scripts.prepush, 'scripts.prepush', /ut-prepush/);
        match(parsed.scripts.pretest$location, p.scripts.pretest, 'scripts.pretest', /ut-pretest/);
        match(parsed.scripts.precover$location, p.scripts.precover, 'scripts.precover', /ut-precover/);
        match(parsed.scripts.preversion$location, p.scripts.preversion, 'scripts.preversion', /ut-preversion/);
        match(parsed.scripts.release$location, p.scripts.release, 'scripts.release', /ut-release/);
        match(parsed.scripts.test$location, p.scripts.test, 'scripts.test', /ut-test|jest/);
    }

    const DWRE = /^git@git\.softwaregroup\.com:dw\/(standard\/standard-service(-\w{2,})+|impl\/((\w{2,}-){0,}\w{2,})\/impl-\3-(service(-\w{2,})+|env|ui))\.git$/i;
    const UTRE = /^git@(git\.softwaregroup\.com:ut5|github\.com:softwaregroup-bg)\/ut(-\w{2,})+\.git$/;
    const CREATERE = /^git@github\.com:softwaregroup-bg\/create(-\w{2,})+\.git$/;
    const UTIMPLRE = /^git@git\.softwaregroup\.com:ut5impl\/impl(-\w{2,})+\.git$/;
    const GITHUBRE = /^git@github.com/;
    const SGRE = /^git@git\.softwaregroup\.com:ut5/;

    match(parsed.repository$location, p.repository, 'repository');
    if (p.repository) {
        match(parsed.repository.type$location, p.repository.type, 'repository.type', /^git$/);
        if (typeof p.name === 'string') {
            if (/^(standard-service|impl(-\w{2,})+-(service(-\w{2,})+|env|ui)$)/.test(p.name)) match(parsed.repository.url$location, p.repository.url, 'repository.url', DWRE);
            else if (/^ut-/.test(p.name)) match(parsed.repository.url$location, p.repository.url, 'repository.url', UTRE);
            else if (/^impl-/.test(p.name)) match(parsed.repository.url$location, p.repository.url, 'repository.url', UTIMPLRE);
            else if (/^create-/.test(p.name)) match(parsed.repository.url$location, p.repository.url, 'repository.url', CREATERE);
            else if (p.name === 'ut') match(parsed.repository.url$location, p.repository.url, 'repository.url', /^git@github\.com:softwaregroup-bg\/ut\.git$/);
        }
    }

    if (p.repository && SGRE.test(p.repository.url)) {
        match(parsed.publishConfig$location, p.publishConfig, 'publishConfig');
        if (p.publishConfig) {
            match(parsed.publishConfig.registry$location, p.publishConfig.registry, 'publishConfig.registry', /^https:\/\/nexus.softwaregroup.com\/repository\/npm-internal$/);
        }
    }

    if (p.repository && GITHUBRE.test(p.repository.url)) {
        match(parsed.license$location, p.license, 'license', /^Apache-2\.0$/);
    }

    match(parsed.devDependencies$location, p.devDependencies, 'devDependencies');
    if (p.devDependencies) {
        match(parsed.devDependencies['ut-tools$location'], p.devDependencies['ut-tools'], 'devDependencies.ut-tools', /.?/);
    }

    await lintDeps(p, parsed);

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

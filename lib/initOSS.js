var path = require('path');
var merge = require('lodash.merge');
var ownPkg = require('../package.json');
var template = {
    devDependencies: {
        'ut-tools': '^' + ownPkg.version
    },
    scripts: {
        changelog: 'ut-changelog',
        check: 'ut-check',
        cover: 'ut-cover',
        gitlab: 'ut-gitlab',
        jenkins: 'ut-jenkins',
        lint: 'ut-lint .',
        'lint-js': 'ut-lint-js .',
        postpublish: 'ut-postpublish',
        postversion: 'ut-postversion',
        precommit: 'ut-precommit',
        prepublish: 'ut-prepublish',
        prepush: 'ut-prepush',
        pretest: 'ut-pretest',
        preversion: 'ut-preversion',
        release: 'ut-release',
        test: 'ut-test',
        version: 'ut-version'
    },
    license: 'Apache-2.0'
};

var write = require('write-json-file');

module.exports = function(file) {
    var pkgPath = path.resolve(process.cwd(), file || 'package.json');
    var pkg = require(pkgPath);
    pkg.scripts && delete pkg.scripts['pre-release'];
    pkg.scripts && delete pkg.scripts['post-release'];
    pkg.scripts && delete pkg.scripts['pre-commit'];
    delete pkg.publishConfig;

    template.repository = {
        type: 'git',
        url: 'git@github.com:softwaregroup-bg/' + pkg.name + '.git'
    };

    pkg = merge(pkg, template, function(a, b) {
        return Array.isArray(a) ? a.concat(b) : undefined;
    });
    write.sync(pkgPath, pkg, {indent: 2});
};

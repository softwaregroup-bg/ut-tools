var path = require('path');
var merge = require('lodash/object/merge');
var isArray = require('lodash/lang/isArray');
var ownPkg = require('../package.json');
var template = {
    devDependencies: {
        'ut-tools': '^' + ownPkg.version
    },
    publishConfig: {
        registry: 'https://nexus.softwaregroup-bg.com/repository/npm-internal'
    },
    scripts: {
        changelog: 'ut-changelog',
        check: 'ut-check',
        cover: 'ut-cover',
        jenkins: 'ut-jenkins',
        gitlab: 'ut-gitlab',
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
    }
};

var write = require('write-json-file');

module.exports = function(file) {
    var pkgPath = path.resolve(process.cwd(), file || 'package.json');
    var pkg = require(pkgPath);
    pkg.scripts && delete pkg.scripts['pre-release'];
    pkg.scripts && delete pkg.scripts['post-release'];
    pkg.scripts && delete pkg.scripts['pre-commit'];
    pkg = merge(pkg, template, function(a, b) {
        return isArray(a) ? a.concat(b) : undefined;
    });
    write.sync(pkgPath, pkg, {indent: 2});
};

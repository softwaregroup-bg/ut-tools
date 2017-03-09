#!/usr/bin/env node

var conventionalRecommendedBump = require('conventional-recommended-bump');

conventionalRecommendedBump({
    preset: 'angular'
}, function(err, result) {
    if (err) {
        throw err;
    } else {
        require('../lib/exec')('npm', ['version', result.releaseType, '-m', '[ci-skip][ci skip] version incremented to %s']);
        require('../lib/exec')('npm', ['publish']);
    };
});

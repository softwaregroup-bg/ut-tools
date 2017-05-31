#!/usr/bin/env node
/* eslint no-process-env:0 */
require('../lib/exec')(require.resolve('nyc/bin/nyc'), [
    '--reporter=lcov',
    '--reporter=text',
    '--reporter=cobertura',
    '--include=**/*.js',
    '--exclude=**/ut-tools/**/*.js',
    '--exclude=!node_modules/ut-*/**/*.js',
    '--exclude=node_modules/!(ut-*)/**/*.js',
    '--exclude=**/*marko.js',
    '--exclude=**/test/**'].concat(
        process.env.UT_COVER_DIR ? [`--report-dir=${process.env.UT_COVER_DIR}`] : []
    ).concat([
        'node',
        require('../lib/babelNodePath'),
        require.resolve('blue-tape/bin/blue-tape'),
        'test/**/start*.js',
        'test/**/test*.js',
        'test/**/stop*.js'
    ]));

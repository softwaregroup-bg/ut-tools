#!/usr/bin/env node

require('../lib/exec')(require.resolve('conventional-changelog-cli/cli'), ['-p', 'angular', '-i', 'CHANGELOG.md', '-s', '-c', require.resolve('../context.js')]);
require('../lib/exec')('git', ['add', 'CHANGELOG.md']);

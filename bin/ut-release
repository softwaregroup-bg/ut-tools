#!/usr/bin/env node

require('../lib/exec')('npm', ['version', 'patch', '--silent', '-m', '[ci-skip][ci skip] version incremented to %s']);
require('../lib/exec')('npm', ['publish', '--silent']);

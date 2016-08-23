#!/usr/bin/env node

require('../lib/exec')('npm', ['test']);
require('../lib/exec')('nsp', ['check']);
// npm outdated --depth 0 --registry https://nexus.softwaregroup-bg.com/repository/npm-all/

#!/usr/bin/env node

require('../lib/exec')('npm', ['test']);
require('../lib/exec')('npm', ['audit']);
// npm outdated --depth 0 --registry https://nexus.softwaregroup.com/repository/npm-all/

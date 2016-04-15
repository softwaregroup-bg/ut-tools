#!/usr/bin/env node

require('../lib/exec')('isparta', ['cover', '--report', 'cobertura', '--report', 'lcov', './test/test.hsm.js']);

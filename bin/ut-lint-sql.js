#!/usr/bin/env node
/* eslint no-process-exit:0 */
require('../lib/lintSQL')(process.argv[2]) || process.exit(1);

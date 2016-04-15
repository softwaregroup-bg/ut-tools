#!/usr/bin/env node

require('../lib/exec')('git', ['push']);
require('../lib/exec')('git', ['push', 'origin', '--tags']);

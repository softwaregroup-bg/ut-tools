#!/usr/bin/env node

var childProcess = require('child_process');

function executeCommand(cmd, logMessage){
    console.log(logMessage);
    try {
        procStdout = childProcess.execSync(cmd);

    } catch (procStdout) {

        console.log(procStdout.stack);
        return false;
    }
    return true;
}

module.exports = executeCommand;

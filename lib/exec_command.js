#!/usr/bin/env node

var childProcess = require('child_process');

function executeCommand(cmd, logMessage){
    console.log(logMessage);

    try {
        procStdout = childProcess.execSync(cmd, {stdio:[0,1,2]});

    } catch (procStdout) {
        //throw procStdout;
        process.exit(1000)
        return false;
    }
    return true;
}

module.exports = executeCommand;




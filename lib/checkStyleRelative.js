/**
 * @fileoverview CheckStyle XML reporter
 * @author Ian Christian Myers
 */

// modified to output relative paths

'use strict';

const path = require('path');
const xmlEscape = function(s) {
    return (`${s}`).replace(/[<>&"'\x00-\x1F\x7F\u0080-\uFFFF]/g, c => { // eslint-disable-line no-control-regex
        switch (c) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case '"':
                return '&quot;';
            case "'":
                return '&apos;';
            default:
                return `&#${c.charCodeAt(0)};`;
        }
    });
};

function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return 'error';
    }
    return 'warning';
}

module.exports = function(results) {
    let output = '';

    output += '<?xml version="1.0" encoding="utf-8"?>';
    output += '<checkstyle version="4.3">';
    const cwd = process.cwd();

    results.forEach(result => {
        const messages = result.messages;

        output += `<file name="${xmlEscape(path.relative(cwd, result.filePath))}">`;

        messages.forEach(message => {
            output += [
                `<error line="${xmlEscape(message.line)}"`,
                `column="${xmlEscape(message.column)}"`,
                `severity="${xmlEscape(getMessageType(message))}"`,
                `message="${xmlEscape(message.message)}${message.ruleId ? ` (${message.ruleId})` : ''}"`,
                `source="${message.ruleId ? xmlEscape(`eslint.rules.${message.ruleId}`) : ''}" />`
            ].join(' ');
        });

        output += '</file>';
    });

    output += '</checkstyle>';

    return output;
};

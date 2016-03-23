'use strict';

const meow = require('meow');
const gitlab = require('./gitlab');
const fs = require('fs');
const Git = require('nodegit');
const path = require('path');
const ds = path.sep;

const clone = meow(`
    Usage
      $ ut5 clone [impl]

    Options
      -a, --anonymous Anonymous, wil not allow push

    Examples
      $ ut5 clone --anonymous
`, {
    alias: {
        a: 'anonymous'
    }
});

function git_clone(structure, rootDir, cloneOpts) {
    var project;
    var dir = rootDir;
    if (structure.ut5repo) {
        project = structure.ut5repo.pop();
    } else if (structure.impl.length) {
        project = structure.impl.pop();
        dir = rootDir + ds + 'ut' + ds + 'node_modules' + ds + project.name;
    } else {
        project = structure.ut5.shift();
        dir = rootDir + ds + 'ut' + ds + 'node_modules' + ds + project.name;
    }
    console.info('Cloning project', project.name);
    Git.Clone(project.ssh_url_to_repo, dir, cloneOpts).then(function() {
        if (structure.ut5repo) {
            fs.mkdirSync(dir + ds + 'ut');
            fs.mkdirSync(dir + ds + 'ut' + ds + 'node_modules');
            delete structure.ut5repo;
        }

        if (structure.ut5.length) {
            git_clone(structure, rootDir, cloneOpts);
        }
    }, function(err) {
        console.error('err', err);
    });
}

module.exports = function() {
    var projects = gitlab.projects();
    var structure = {
        ut5repo: projects.filter(function(project) {
            return project.namespace.name === 'ut5' && project.name === 'ut5';
        }),
        ut5: projects.filter(function(project) {
            return project.namespace.name === 'ut5' && project.name !== 'ut5';
        }),
        impl: projects.filter(function(project) {
            return clone.input[1] && clone.input[1] === project.name;
        })
    };

    var cloneOpts = {
        fetchOpts: {
            callbacks: {
                credentials: function(url, userName) {
                    if (clone.flags.anonymous) {
                        var sshDirectory = path.dirname(process.argv[1]) + ds + 'files' + ds + 'ssh' + ds;
                        return Git.Cred.sshKeyNew(userName, sshDirectory + 'anonymous_id_rsa.pub', sshDirectory + 'anonymous_id_rsa', '');
                    }
                    var sshDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
                    return Git.Cred.sshKeyNew(userName, sshDirectory + ds + '.ssh' + ds + 'id_rsa.pub', sshDirectory + ds + '.ssh' + ds + 'id_rsa', '');
                }
            }
        }
    };

    git_clone(structure, process.cwd(), cloneOpts);
};

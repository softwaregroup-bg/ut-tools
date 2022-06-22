# UT Tools

Continuous integration, continuous delivery and automation scrips to be used
within package.json scripts section.

Starting with `ut-tools` version 7, it needs to be installed as a global package,
instead of adding it in `devDependencies`, which will only slow down
`npm install` for each developer and the Jenkins builds.

To enable VSCode linter to use the same rules as `ut-tools`, add these settings
in the appropriate place (user or workspace settings ctrl+, ):

```json
{
    "eslint.options": {
        "overrideConfigFile": "/enter the installation path here/ut-tools/eslint/.eslintrc.js"
    },
    "eslint.nodePath": "/enter the installation path here/ut-tools/node_modules"
}
```

## Available scripts

* ut-changelog: generate or update CHANGELOG.MD, based on [conventional-changelog](https://www.npmjs.com/package/conventional-changelog)
* ut-check: run tests and [npm audit](https://docs.npmjs.com/cli/audit) security
  checks
* ut-cover: run code coverage
* ut-jenkins: run tests in Jenkins and optionally publish to npm if the current
  branch is the master
* ut-lint-css: lint css files
* ut-lint: lint .js files and package.json
* ut-lint-js: lint .js files
* ut-postversion: does not do anything currently
* ut-precommit: run linting
* ut-prepush: run npm test (suitable to be used in git hook)
* ut-pretest: run linting before testing
* ut-preversion: run test coverage before incrementing the version
* ut-release: increment the version, push to git and publish to npmjs or nexus
* ut-release-lerna: increment the versions of all updated
  lerna monorepo packages and publish to npm
* ut-test: run all tests

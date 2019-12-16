# UT Tools

Continuous integration, continuous delivery and automation scrips to be used
within package.json scipts secion in various environments like Jenkins,
Circle CI, Gitlab CI, etc.

## Available scripts

* ut-changelog: generate or update CHANGELOG.MD, based on [conventional-changelog](https://www.npmjs.com/package/conventional-changelog)
* ut-check: run tests and [npm audit](https://docs.npmjs.com/cli/audit) security
  checks
* ut-circleci-build: build docker images in CircleCI
* ut-circleci-push: push docker images from CircleCI to Amazon ECS registry.
  The following variables are required to be set:

  ```bash
  AWS_ACCESS_KEY_ID # access key ID of AWS ECS credentials for push
  AWS_SECRET_ACCESS_KEY # secret access key of AWS ECS credentials for push
  AWS_ACCOUNT_ID # account ID, used for ECS Docker registry
  ```

* ut-circleci-test: run tests and code coverage in CircleCI.
  In case of success, publish to npm and push to git.

  ```bash
  GIT_AUTHOR_EMAIL # standard git variable, used when pushing
  GIT_AUTHOR_NAME # standard git variable, used when pushing
  GIT_COMMITTER_EMAIL # standard git variable, used when pushing
  GIT_COMMITTER_NAME # standard git variable, used when pushing
  NPM_EMAIL # standard npm variable, used when publishing
  NPM_PASSWORD # standard npm variable, used when publishing
  NPM_USER # standard npm variable, used when publishing
  ```

* ut-cover: run code coverage
* ut-gitlab: run tests in GitLab CI
* ut-init: initialize basic UT module settings in project.json
* ut-initOSS: initialize basic UT OSS module settings in project.json
* ut-jenkins: run tests in Jenkins and optionally publish to npm if the current
  branch is the master
* ut-lint-css: lint css files
* ut-lint: lint .js files and package.json
* ut-lint-js: lint .js files
* ut-postversion: push to git
* ut-precommit: run linting
* ut-prepush: run npm test (suitable to be used in git hook)
* ut-pretest: run linting before testing
* ut-preversion: run tests before incrementing the version
* ut-release: increment the version and publish to npm
* ut-release-lerna: increment the versions of all updated
  lerna monorepo packages and publish to npm
* ut-test: run all tests with blue-tape

* ut command with arguments. Arguments can be one of the following 'status',
  'hooks', 'update', 'branches', 'usedev', 'versionsup'.
  * ut status - checks status for current implementation and all projects in dev
    directory. This is usefull when you work on many modules and you are not sure
    where you made changes and what should be pushed to remote.
  * ut branches - This command is scanning current implementation and all
    subdirectories of dev, runs git branch and get the current branch.
  * ut usedev - When running npm install you receive latest versions from nexus,
    but when you work on some modules you prefer to use them only from dev
    directory. This command scans all subdirectories of dev and deletes the
    directory with the same name in node_modules.
  * ut update - Runs git pull for current implementatation and all
    subdirectories in dev in parallel.
  * ut hooks - The script goes through current implementation and all
    subdirectories in dev and creates pre commit hook which runs npm run lint.
  * ut versionsup - Update all versions of ut-* modules in implementation package.json.

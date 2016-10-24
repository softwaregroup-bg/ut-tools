# UT Tools

Continuous integration, continuous delivery and automation scrips to be used within package.json scipts secion
in various environments like Jenkins, Circle CI, Gitlab CI, etc.

## Available scripts

* ut-changelog: generate or update CHANGELOG.MD, based on [conventional-changelog](https://www.npmjs.com/package/conventional-changelog)
* ut-check: run tests and [nsp](https://www.npmjs.com/package/nsp) security checks
* ut-circleci-build: build docker images in CircleCI
* ut-circleci-push: push docker images from CircleCI to Amazon ECS registry. The following variables are required to be set:

  ```bash
  AWS_ACCESS_KEY_ID # access key ID of AWS ECS credentials for push
  AWS_SECRET_ACCESS_KEY # secret access key of AWS ECS credentials for push
  AWS_ACCOUNT_ID # account ID, used for ECS Docker registry
  ```
  
* ut-circleci-test: run tests and code coverage in CircleCI. In case of success, publish to npm and push to git.

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
* ut-jenkins: run tests in Jenkins and optionally publish to npm if the current branch is the master
* ut-lint-css: lint css files
* ut-lint: lint .js files and package.json
* ut-lint-js: lint .js files
* ut-postversion: push to git
* ut-precommit: run linting
* ut-prepush: run npm test (suitable to be used in git hook)
* ut-pretest: run linting before testing
* ut-preversion: run tests before incrementing the version
* ut-release: increment the version and publish to npm
* ut-test: run all tests with blue-tape


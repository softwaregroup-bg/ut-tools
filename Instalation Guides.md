# Setup Git, ESLint, stylelint, Visual studio code linting + ut-tools

## Git

- install git for [Windows](https://git-scm.com/downloads)

### Setup Git ssh keys

- right click on desktop and select Git Gui here
- in gui menu select help > ssh keys
- choose genarete ssh key
- open ssh pub key (located at C:\Users\<user home dir>\.ssh\id_rsa.pub) and add
  myour mail at the end of file before new line (there is    already some string
  generated that looks like mail or username, replace it with your mail)
- add pub key to gitlab ssh keys
  - Open [https://git.softwaregroup-bg.com/profile/keys](https://git.softwaregroup-bg.com/profile/keys)
  - Add SSH key
  - Copy the content of the ssh pub key file and paste it in the key field and
    add your email in the title field

## ESLInt

- Install nodejs for [Windows](https://nodejs.org/en/)
- Update npm to latest version `npm install npm -g`
- install eslint `npm install eslint -g`
- install stylelint `npm install stylelint -g`

## Visual studio code linting + ut-tools

- set local npm registry to be used with executing in cmd `npm set registry https://nexus.softwaregroup-bg.com/repository/npm-all/`
- Install ut tools `npm install ut-tools -g`
- install eslint extension in visual studio code
  - ctrl+shift+p and type `install` then select "Extension: Install extensions"
  - in the newly opened fast search start typing `eslint` and install it
- install stylelint extension in visual studio code
  - ctrl+shift+p and type `install` then select "Extension: Install extensions"
  - in the newly opened fast search start typing `stylelint` and install it
- restart VSC
- Install all required packages for linting based on error codes returned from ide,
- File > Preferences > user settings
- on the right pane paste

  ```json
    {
        "eslint.options": {
            "configFile": "C:/Users/<user home dir>/AppData/Roaming/npm/node_modules/ut-tools/eslint/.eslintrc"
        },
        "stylelint.enable": true,
        "markdownlint.config": {
            "MD013": {
                "tables": false,
                "headings": false
            }
        },
    }
  ```

  - In the root of the project you should have stylelint.config.js file
  - Inside stylelint.config.js file the content should be

  ```js
    module.exports = require('ut-tools/stylelint');
  ```

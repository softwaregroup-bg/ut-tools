/* eslint no-process-env:0 */
module.exports = () => {
    // if (process.env.gitlabSourceBranch) {
    // return process.env.gitlabSourceBranch.split('/');
    // } else
    if (process.env.CIRCLE_BRANCH) {
        return process.env.CIRCLE_BRANCH.split('/');
    } else if (process.env.GIT_BRANCH) {
        return process.env.GIT_BRANCH.split('/').slice(1); // remove origin
    } else {
        throw new Error('Branch name could not be detected!');
    }
};

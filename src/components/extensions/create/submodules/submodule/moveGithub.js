const { resolve } = require('path');
const { copyDir } = require('../shared/copyDir');
const { MAIN_REPO, SUBMODULE } = require('../../../../common/paths');
const { updateDependabot } = require('../shared/updateDependabot');

exports.moveGithub = async function (submoduleName, projectName, repoPlatform) {
	if (repoPlatform == 'bitbucket') return;
	const MAIN_GITHUB_PATH = resolve(MAIN_REPO(projectName), `.${repoPlatform}`);
	const SUBMODULE_GITHUB_PATH = resolve(SUBMODULE(submoduleName, projectName), `.${repoPlatform}`);
	await copyDir(MAIN_GITHUB_PATH, SUBMODULE_GITHUB_PATH);
	await updateDependabot(resolve(SUBMODULE_GITHUB_PATH, 'dependabot.yml'), submoduleName, repoPlatform, true);
};

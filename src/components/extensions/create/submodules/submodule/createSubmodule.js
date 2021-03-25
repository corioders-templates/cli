const { copyDir } = require('../shared/copyDir');
const { spawn } = require('../../../../../util/spawn');
const { SUBMODULE, MAIN_REPO } = require('../../../../common/paths');
const { sleep } = require('../../../../../util/sleep');
const { copyFile } = require('fs').promises;
const { resolve } = require('path');
const { openGithub } = require('../../../../common/openGithub');
const { writeFile } = require('fs/promises');
const { moveHooks } = require('./moveHooks');
const { moveVscode } = require('./moveVscode');
const { moveGithub } = require('./moveGithub');

exports.createSubmodule = async function (submoduleName, projectName, url, repoName, platform, spinner) {
	spinner.start();
	await copyDir(MAIN_REPO(projectName), SUBMODULE(submoduleName, projectName));
	await spawn('git', ['add', '.'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['commit', '-m', 'pre-submodule', '--no-verify'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['filter-branch', '--subdirectory-filter', submoduleName, '--', '--all'], { cwd: SUBMODULE(submoduleName, projectName) });
	await copyFile(resolve(MAIN_REPO(projectName), '.gitignore'), resolve(SUBMODULE(submoduleName, projectName), '.gitignore'));
	await moveHooks(submoduleName, projectName);
	await writeFile(resolve(SUBMODULE(submoduleName, projectName), '.submodule'), '', 'utf-8');
	await moveVscode(submoduleName, projectName);
	await moveGithub(submoduleName, projectName, platform);
	await spawn('git', ['add', '.'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['commit', '-m', 'submodule', '--no-verify'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['remote', 'set-url', 'origin', url], { cwd: SUBMODULE(submoduleName, projectName) });
	spinner.stop();
	await openGithub(repoName, platform);
	spinner.start();
	while (true) {
		try {
			await sleep(500);
			await spawn('git', ['push', 'origin', 'master', '--no-verify'], { cwd: SUBMODULE(submoduleName, projectName) });
			break;
		} catch (e) {}
	}
	spinner.stop();
};

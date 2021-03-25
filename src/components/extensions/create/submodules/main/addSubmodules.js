const { rmdir } = require('fs/promises');
const { resolve } = require('path');
const { spawn } = require('../../../../../util/spawn');
const { MAIN_REPO } = require('../../../../common/paths');

exports.addSubmodules = async function (config) {
	if (config.submodules.app != undefined) await add('app', config.name, config.submodules['app'].url);
	if (config.submodules.server != undefined) await add('server', config.name, config.submodules['server'].url);

	await spawn('git', ['submodule', 'update', '--recursive'], { cwd: MAIN_REPO(config.name) });
};

async function add(submoduleName, projectName, url) {
	await spawn('git', ['rm', '-r', '--force', submoduleName], { cwd: MAIN_REPO(projectName) });
	await rmdir(resolve(MAIN_REPO(projectName), submoduleName), { recursive: true });
	await spawn('git', ['add', '.'], { cwd: MAIN_REPO(projectName) });
	await spawn('git', ['commit', '-m', `pre-submodule-${submoduleName}`, '--no-verify'], { cwd: MAIN_REPO(projectName) });
	await spawn('git', ['submodule', 'add', url, submoduleName], { cwd: MAIN_REPO(projectName) });
}

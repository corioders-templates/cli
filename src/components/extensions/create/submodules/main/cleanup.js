const { writeFile, unlink, rename, rmdir } = require('fs/promises');
const { resolve } = require('path');
const { PROJECT_DIR, MAIN_REPO, ROOT_DIR } = require('../../../../common/paths');
const { cleanVsc } = require('../shared/cleanVsc');
const { updateDependabot } = require('../shared/updateDependabot');

exports.cleanup = async function (config) {
	await dependabot(config);
	await cleanVscode(config);
	await changeName(config);
};

async function dependabot(config) {
	const repoPlatform = config.repoPlatform.toLowerCase();
	if (config.submodules.app != undefined && config.submodules.server != undefined) {
		await updateDependabot(resolve(MAIN_REPO(config.name), '.github', 'dependabot.yml'), 'tools', repoPlatform, false);
	} else if (config.submodules.app != undefined) {
		await updateDependabot(resolve(MAIN_REPO(config.name), '.github', 'dependabot.yml'), ['tools', 'server'], repoPlatform, false);
	} else if (config.submodules.server != undefined) {
		await updateDependabot(resolve(MAIN_REPO(config.name), '.github', 'dependabot.yml'), ['tools', 'app'], repoPlatform, false);
	}
}

async function cleanVscode(config) {
	const VSCODE_PATH = resolve(MAIN_REPO(config.name), '.vscode');
	const SETTINGS_PATH = resolve(VSCODE_PATH, 'settings.json');
	const LAUNCH_PATH = resolve(VSCODE_PATH, 'launch.json');
	let settings = require(SETTINGS_PATH);
	let launch = require(LAUNCH_PATH);
	const cleanConfig = require(resolve(ROOT_DIR, 'data', 'cleanVscode.json'));

	if (config.submodules.app != undefined && config.submodules.server != undefined) launch = undefined;

	if (config.submodules.app != undefined) {
		settings = cleanVsc(settings, cleanConfig.main.app.settings);
		if (launch != undefined) launch.configurations.splice(...cleanConfig.server.launch);
	}
	if (config.submodules.server != undefined && launch != undefined) launch.configurations.splice(...cleanConfig.app.launch);

	await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');

	if (launch == undefined) await unlink(LAUNCH_PATH);
	else await writeFile(LAUNCH_PATH, JSON.stringify(launch, null, 2), 'utf-8');
}

async function changeName(config) {
	const tempDirName = `.temp${config.name}ProjectDir`;
	await rename(MAIN_REPO(config.name, config.name), PROJECT_DIR(tempDirName));
	await rmdir(PROJECT_DIR(config.name), { recursive: true });
	await rename(PROJECT_DIR(tempDirName), PROJECT_DIR(config.name));
}

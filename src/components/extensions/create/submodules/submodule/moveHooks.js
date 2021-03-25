const { resolve } = require('path');
const { spawn } = require('../../../../../util/spawn');
const { copyDir } = require('../shared/copyDir');
const { SUBMODULE, MAIN_REPO } = require('../../../../common/paths');
const { readFile, writeFile, mkdir } = require('fs/promises');
const { existsSync } = require('fs');

exports.moveHooks = async function (submoduleName, projectName) {
	const TOOLS_DIR = resolve(SUBMODULE(submoduleName, projectName), 'tools');
	const CONFIG_DIR = resolve(TOOLS_DIR, 'config');
	const JSON_PATH = resolve(CONFIG_DIR, 'package.json');
	if (!existsSync(TOOLS_DIR)) await mkdir(TOOLS_DIR, { recursive: true });
	await copyDir(resolve(MAIN_REPO(projectName), 'tools', 'config'), CONFIG_DIR);
	if (!existsSync(JSON_PATH)) await writeFile(JSON_PATH, '{}', 'utf-8');
	await spawn('npx', ['add-dependencies', 'husky', '@commitlint/cli', 'commitlint-config-jira', 'commitlint-plugin-jira-rules', '--dev'], { cwd: CONFIG_DIR });
	const commit_msg = `#!/bin/sh\n\ncd tools/config && npx --no-install commitlint --config ./commitlint.config.js --edit $1`;
	await writeFile(resolve(CONFIG_DIR, '.husky', 'commit-msg'), commit_msg, 'utf-8');
	const COMMITLINT_PATH = resolve(CONFIG_DIR, 'commitlint.config.js');
	let commitlint = await readFile(COMMITLINT_PATH, 'utf-8');
	commitlint = commitlint.replaceAll('../node_modules/', './node_modules/');
	await writeFile(COMMITLINT_PATH, commitlint, 'utf-8');
	const json = require(JSON_PATH);
	if (json.scripts == undefined) json.scripts = { postinstall: 'cd .. && cd .. && husky install ./tools/config/.husky' };
	else json.scripts.postinstall = 'cd .. && cd .. && husky install ./tools/config/.husky';
	await writeFile(JSON_PATH, JSON.stringify(json, null, 2), 'utf-8');
};

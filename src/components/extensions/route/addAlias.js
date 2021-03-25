const { writeFile, readFile } = require('fs/promises');
const { existsSync } = require('fs');
const { join, resolve } = require('path');
const { PROJECT_DIR, APP_DIR } = require('../../common/paths');

exports.addAlias = async function (alias, dirName) {
	await Promise.all([webpack(alias, dirName), ts(alias, dirName), settings(alias, dirName)]);
};

async function webpack(alias, dirName) {
	const WEBPACK_ALIAS_PATH = resolve(APP_DIR(), 'config', 'webpackAlias.json');
	let webpackAlias = require(WEBPACK_ALIAS_PATH);
	webpackAlias[alias] = join('src', 'routes', dirName);
	await writeFile(WEBPACK_ALIAS_PATH, JSON.stringify(webpackAlias, null, 2), 'utf-8');
}

async function ts(alias, dirName) {
	const TS_CONFIG_PATH = resolve(APP_DIR(), 'tsconfig.json');
	let tsconfigString = await readFile(TS_CONFIG_PATH, 'utf-8');
	let tsconfig = tsconfigString.slice(tsconfigString.search('"paths": {'));
	tsconfig = tsconfig.slice(0, tsconfig.search('},') + 1);
	const toReplace = tsconfig;
	tsconfig = JSON.parse(`{${tsconfig}}`);
	tsconfig.paths[`${alias}/*`] = [join('src', 'routes', dirName, '*')];
	tsconfigString = tsconfigString.replace(toReplace, `"paths": ${JSON.stringify(tsconfig.paths, null, 2)}`.replaceAll('\n', '\n\t\t'));
	await writeFile(TS_CONFIG_PATH, tsconfigString, 'utf-8');
}

async function settings(alias, dirName) {
	const VSCODE_SETTINGS_PATH = resolve(PROJECT_DIR(), '.vscode', 'settings.json');
	let vscodeSettingsString = await readFile(VSCODE_SETTINGS_PATH, 'utf-8');
	let vscodeSettings = vscodeSettingsString.slice(vscodeSettingsString.search('"path-intellisense.mappings": {'));
	vscodeSettings = vscodeSettings.slice(0, vscodeSettings.search('},') + 1);
	const toReplace = vscodeSettings;
	vscodeSettings = JSON.parse(`{${vscodeSettings}}`);
	vscodeSettings['path-intellisense.mappings'][alias] = join('${workspaceRoot}', 'app', 'src', 'routes', dirName);
	vscodeSettingsString = vscodeSettingsString.replace(
		toReplace,
		`"path-intellisense.mappings": ${JSON.stringify(vscodeSettings['path-intellisense.mappings'], null, 2)}`.replaceAll('\n', '\n\t'),
	);
	await writeFile(VSCODE_SETTINGS_PATH, vscodeSettingsString, 'utf-8');
}

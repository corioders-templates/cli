const { existsSync } = require('fs');
const { resolve } = require('path');
const { APP_DIR, SERVER_DIR, TOOLS_DIR, PROJECT_DIR } = require('../../components/common/paths');

exports.checkDir = function (options) {
	if (options.app == true && options.server == true && (!existsSync(TOOLS_DIR()) || !existsSync(APP_DIR()) || !existsSync(SERVER_DIR()))) return noDir();
	const SUBMODULE = resolve(PROJECT_DIR(), '.submodule');
	if (options.app == true && !existsSync(APP_DIR()) && !existsSync(SUBMODULE)) return noDir();
	if (options.server == true && !existsSync(SERVER_DIR()) && !existsSync(SUBMODULE)) return noDir();
	return true;
};

function noDir() {
	const chalk = require('chalk');

	console.error(chalk.red("You have to run this command in project's root dir!"));
	return false;
}

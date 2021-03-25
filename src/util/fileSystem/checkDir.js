const { existsSync } = require('fs');
const { APP_DIR, SERVER_DIR, TOOLS_DIR } = require('../../components/common/paths');

exports.checkDir = function (options) {
	if (options.app == true && options.server == true && (!existsSync(TOOLS_DIR()) || !existsSync(APP_DIR()) || !existsSync(SERVER_DIR()))) return noDir();
	if (options.app == true && !existsSync(APP_DIR())) return noDir();
	if (options.server == true && !existsSync(SERVER_DIR())) return noDir();
	return true;
};

function noDir() {
	const chalk = require('chalk');

	console.error(chalk.red('You have to run this command in project the root dir!'));
	return false;
}

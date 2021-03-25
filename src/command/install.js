const { checkDir } = require('../util/fileSystem/checkDir');

const { APP_DIR, SERVER_DIR } = require('../components/common/paths');
const { spawnSync } = require('child_process');
const { prepareOptions } = require('../components/common/prepareOptions');

exports.install = async function install(options) {
	try {
		options = await prepareOptions(options);
		if (!checkDir(options)) return;

		const chalk = require('chalk');
		console.log(chalk.blue.bold('Installing dependencies'));

		if (options.hasOwnProperty('app')) spawnSync('yarn', ['install'], { cwd: APP_DIR() });
		if (options.hasOwnProperty('server')) spawnSync('go', ['mod', 'download'], { cwd: SERVER_DIR() });
	} catch (error) {
		console.error(error);
	}
};

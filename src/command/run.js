const { checkDir } = require('../util/fileSystem/checkDir');
const { STMUX_DIR, TOOLS_DIR, STMUX_PATH, PROJECT_DIR, APP_DIR, SERVER_DIR } = require('../components/common/paths');
const { prepareOptions } = require('../components/common/prepareOptions');
const { existsSync } = require('fs');
const { spawn } = require('../util/spawn');
const { resolve } = require('path');
const { install } = require('./install');

exports.run = async function (options) {
	if (!checkDir(options)) return;
	options = await prepareOptions(options);

	await install(options);

	const chalk = require('chalk');
	console.log(chalk.blue.bold('Launching your app'));

	if (options.hasOwnProperty('app') && options.hasOwnProperty('server')) {
		const { workaround } = require('../../more/stmux/workaround');
		await spawn('yarn', ['install'], { cwd: STMUX_DIR });
		workaround();
		await spawn('node', [STMUX_PATH, `-e ERROR`, `-m beep,system`, `-M true`, `-c line`, `--`, `[`, `yarn app`, `..`, `yarn server`, `]`], {
			stdio: 'inherit',
			cwd: TOOLS_DIR(),
		});
	} else if (options.hasOwnProperty('app')) {
		await spawn('yarn', ['start'], { stdio: 'inherit', cwd: APP_DIR() });
	} else {
		await spawn('go', ['run', '.'], { stdio: 'inherit', cwd: SERVER_DIR() });
	}
};

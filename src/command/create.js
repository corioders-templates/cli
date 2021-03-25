const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const { getConfig } = require('../components/create/config/getConfig');
const { clone, git } = require('../components/create/git');
const { replacePhrases } = require('../components/create/replacePhrases');
const { save } = require('../components/create/config/default/save');
const { openGithub } = require('../components/common/openGithub');
const { cleanup } = require('../components/create/cleanup');

exports.create = async function (name, options) {
	console.clear();
	console.log(chalk.blue.bold(figlet.textSync('Corioders CLI', { horizontalLayout: 'full' })));

	const spinner = ora('Creating your project');
	spinner.color = 'blue';

	const config = await getConfig(name, options);
	spinner.start();
	await clone(config.template.url, config.name);
	await save(config.template, config);
	await replacePhrases(config);
	spinner.stop();
	await openGithub(config.ghRepo, config.repoPlatform.toLowerCase(), config.sleep);
	if (config.submodules != undefined && config.submodules != []) {
		const { submodules } = require('../components/extensions/create/submodules/submodules');
		await submodules(config, spinner);
	}
	spinner.start();
	await cleanup(config);
	await git(config.url, config.name);
	spinner.stop();

	process.exit(0);
};

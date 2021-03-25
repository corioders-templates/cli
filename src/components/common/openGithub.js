const chalk = require('chalk');
const open = require('open');
const { prompt } = require('../../util/prompt');
const { copy } = require('copy-paste');
const { sleep } = require('../../util/sleep');

exports.openGithub = async function (repoName, platform, sleepToRead = false) {
	console.log(`Please create a repository with name ${repoName} ${platform != 'bitbucket' ? '' : `without readme & gitignore and with default branch master`}`);
	await copy(repoName);
	console.log(chalk.blue.bold(`You have it in your clipboard, just paste it on ${platform}`));
	if (sleepToRead) await sleep(5000);

	let link = 'https://github.com/new';
	if (platform == 'gitlab') link = 'https://gitlab.com/projects/new#blank_project';
	if (platform == 'bitbucket') link = 'https://bitbucket.org/repo/create';
	await open(link);

	let isCreated = false;
	do {
		isCreated = await prompt(`Have you created the ${repoName} repo?`, 'confirm');
	} while (!isCreated);
};

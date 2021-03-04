const { input, prompt } = require('../input/input');
exports.advanced = async function (name) {
	let config = await input(name);
	const submodules = await prompt('If you want to create git submodules choose where', 'checkbox', ['app', 'server'], []);
	config.submodules = [];
	if (submodules.includes('app')) config = await ask('app', config);
	if (submodules.includes('server')) config = await ask('server', config);
	return config;
};

async function ask(dir, config) {
	config.submodules[dir] = {};
	config.submodules[dir].ghRepo = await prompt(`${config.repoPlatform} repo name`, 'input', undefined, `${config.ghRepo}-submodule-${dir}`);

	const platform = config.repoPlatform.toLowerCase();
	const extension = platform == 'bitbucket' ? 'org' : 'com';
	config.submodules[dir].url = config.ssh
		? `git@${platform}.${extension}:${config.ghUsername}/${config.submodules[dir].ghRepo}.git`
		: `https://${platform}.${extension}/${config.ghUsername}/${config.submodules[dir].ghRepo}`;

	return config;
}

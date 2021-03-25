const { readFile, writeFile } = require('fs/promises');
const YAML = require('yaml');

exports.updateDependabot = async function (path, dirName, repoPlatform, isSubmodule) {
	if (repoPlatform != 'github') return;
	let config = await readFile(path, 'utf-8');
	config = new YAML.parse(config);
	let updates;
	if (isSubmodule) {
		updates = config.updates.find((obj) => obj.directory == `/${dirName}`);
		updates.directory = '/';
	} else {
		updates = config.updates.filter((obj) => {
			if (dirName.includes(obj.directory.replace('/', ''))) return obj;
		});
	}
	config.updates = updates;
	await writeFile(path, YAML.stringify(config), 'utf-8');
};

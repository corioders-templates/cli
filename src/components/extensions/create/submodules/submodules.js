const { createSubmodule } = require('./submodule/createSubmodule');
const { PROJECT_DIR, MAIN_REPO } = require('../../../common/paths');
const { mkdir, rename } = require('fs').promises;
const { addSubmodules } = require('./main/addSubmodules');
const { cleanup } = require('./main/cleanup');

exports.submodules = async function (config, spinner) {
	try {
		spinner.start();
		const tempDirName = `.temp${config.name}ProjectDir`;
		await rename(PROJECT_DIR(config.name), PROJECT_DIR(tempDirName));
		await mkdir(MAIN_REPO(config.name, config.name), { recursive: true });
		await rename(PROJECT_DIR(tempDirName), MAIN_REPO(config.name, config.name));
		spinner.stop();
		if (config.submodules.app != undefined)
			await createSubmodule('app', config.name, config.submodules['app'].url, config.submodules['app'].ghRepo, config.repoPlatform.toLowerCase(), spinner);
		if (config.submodules.server != undefined)
			await createSubmodule('server', config.name, config.submodules['server'].url, config.submodules['server'].ghRepo, config.repoPlatform.toLowerCase(), spinner);

		spinner.start();
		await addSubmodules(config);
		await cleanup(config);
		spinner.stop();
	} catch (error) {
		console.error(error);
	}
};

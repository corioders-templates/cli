const { existsSync } = require('fs');
const { resolve } = require('path');
const { PROJECT_DIR, APP_DIR } = require('../../../common/paths');
const { createDirs } = require('./createDirs');
const { createFiles } = require('./createFiles');

exports.createRoute = async function (name, alias, dirName) {
	const isSubmodule = existsSync(resolve(PROJECT_DIR(), '.submodule'));
	const ROUTE_DIR = resolve(!isSubmodule ? APP_DIR() : PROJECT_DIR(), 'src', 'routes', dirName);
	await createDirs(ROUTE_DIR);
	await createFiles(name, alias, dirName, ROUTE_DIR);
};

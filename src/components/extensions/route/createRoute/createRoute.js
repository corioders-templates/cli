const { resolve } = require('path');
const { APP_DIR } = require('../../../common/paths');
const { createDirs } = require('./createDirs');
const { createFiles } = require('./createFiles');

exports.createRoute = async function (name, alias, dirName) {
	const ROUTE_DIR = resolve(APP_DIR(), 'src', 'routes', dirName);
	await createDirs(ROUTE_DIR);
	await createFiles(name, alias, dirName, ROUTE_DIR);
};

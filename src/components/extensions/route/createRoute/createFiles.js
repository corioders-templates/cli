const { writeFile } = require('fs/promises');
const { resolve } = require('path');
const { ROOT_DIR } = require('../../../common/paths');

exports.createFiles = async function (fileName, alias, dirName, path) {
	const files = require(resolve(ROOT_DIR, 'data', 'routes.json'));
	const phrases = {
		name: '___ROUTE_NAME___',
		dirName: '___ROUTE_DIR_NAME___',
		alias: '___ROUTE_ALIAS___',
	};
	files.main = files.main.replaceAll(phrases.name, fileName);
	files.main = files.main.replaceAll(phrases.dirName, dirName);
	files.main = files.main.replaceAll(phrases.alias, alias);

	files.routes = files.routes.replaceAll(phrases.name, fileName);
	files.routes = files.routes.replaceAll(phrases.dirName, dirName);
	files.routes = files.routes.replaceAll(phrases.alias, alias);

	await Promise.all([
		writeFile(resolve(path, 'routes', `${fileName}.vue`), files.main, 'utf-8'),
		writeFile(resolve(path, `${fileName}App.vue`), files.app, 'utf-8'),
		writeFile(resolve(path, `routes.ts`), files.routes, 'utf-8'),
	]);
};

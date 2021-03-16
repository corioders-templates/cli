const { existsSync } = require('fs');
const { writeFile } = require('fs/promises');
const { resolve } = require('path');
const { ROOT_DIR } = require('../../common/paths');

exports.createFiles = async function (fileName, dirName, path) {
	const files = require(resolve(ROOT_DIR, 'data', '.routes.json'));
	const phrases = {
		name: '___ROUTE_NAME___',
		dirName: '___ROUTE_DIR_NAME___',
	};
	files.main = files.main.replaceAll(phrases.name, fileName);
	files.main = files.main.replaceAll(phrases.dirName, dirName);

	files.routes = files.routes.replaceAll(phrases.name, fileName);
	files.routes = files.routes.replaceAll(phrases.dirName, dirName);

	await writeFile(resolve(path, `${fileName}.vue`), files.main, 'utf-8');
	await writeFile(resolve(path, `${fileName}View.vue`), files.view, 'utf-8');
	await writeFile(resolve(path, `routes.ts`), files.routes, 'utf-8');
};
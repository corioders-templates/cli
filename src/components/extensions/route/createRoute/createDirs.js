const { mkdir } = require('fs/promises');
const { resolve } = require('path');

exports.createDirs = async function (path) {
	await mkdir(path);
	await Promise.all([mkdir(resolve(path, 'assets')), mkdir(resolve(path, 'components')), mkdir(resolve(path, 'routes')), mkdir(resolve(path, 'store'))]);
};

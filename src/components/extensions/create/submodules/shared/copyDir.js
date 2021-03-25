const FSP = require('fs').promises;
const { join } = require('path');

async function copyDir(src, dest) {
	const entries = await FSP.readdir(src, { withFileTypes: true });
	await FSP.mkdir(dest);
	for (let entry of entries) {
		const srcPath = join(src, entry.name);
		const destPath = join(dest, entry.name);
		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath);
		} else {
			await FSP.copyFile(srcPath, destPath);
		}
	}
}

exports.copyDir = copyDir;

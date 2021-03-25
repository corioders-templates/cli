const { spawn } = require('../../util/spawn');
const { PROJECT_DIR, TOOLS_DIR } = require('../common/paths');

exports.clone = async function (selectedUrl, name) {
	try {
		await spawn('git', ['clone', selectedUrl, name]);
	} catch (error) {
		console.error(error);
	}
};

exports.git = async function (url, name) {
	try {
		await spawn('yarn', ['install'], { cwd: TOOLS_DIR(name) });
		await spawn('git', ['add', '.'], { cwd: PROJECT_DIR(name) });
		await spawn('git', ['commit', '-m', 'init', '--no-verify'], { cwd: PROJECT_DIR(name) });
		await spawn('git', ['remote', 'rename', 'origin', 'template'], { cwd: PROJECT_DIR(name) });
		await spawn('git', ['remote', 'set-url', '--push', 'template', 'no_push'], { cwd: PROJECT_DIR(name) });
		await spawn('git', ['remote', 'add', 'origin', url], { cwd: PROJECT_DIR(name) });
		await spawn('git', ['push', 'origin', 'master', '--no-verify'], { cwd: PROJECT_DIR(name) });
	} catch (error) {
		console.error(error);
	}
};

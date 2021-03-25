const { spawnSync } = require('child_process');
const { PROJECT_DIR } = require('../components/common/paths');

exports.update = function () {
	let { status: add } = spawnSync('git', ['pull', 'template'], { stdio: 'inherit', cwd: PROJECT_DIR() });
	if (add != 0) return;
};

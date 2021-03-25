exports.registerExtensions = function (program) {
	const { VUE_FILE } = require('../../components/common/paths');
	const { existsSync } = require('fs');
	if (existsSync(VUE_FILE)) {
		program
			.command('route <routeName>')
			.alias('comp')
			.action((name) => {
				const { route } = require('./route');
				route(name);
			});
	}
};

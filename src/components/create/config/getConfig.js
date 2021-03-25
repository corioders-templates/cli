const { getNormal } = require('./getNormal');
const { getDefault } = require('./default/getDeafult');

exports.getConfig = async function (name, options) {
	if (options.default) {
		const config = getDefault(name);
		if (!!config) return config;
	}
	return await getNormal(name);
};

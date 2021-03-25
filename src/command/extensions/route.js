const { addAlias } = require('../../components/extensions/route/addAlias');
const { addRoute } = require('../../components/extensions/route/addRoute');
const { createRoute } = require('../../components/extensions/route/createRoute/createRoute');
const { prepareName } = require('../../components/extensions/route/prepareName');

exports.route = async function (componentName) {
	const { name, dirName, alias } = prepareName(componentName);
	await createRoute(name, alias, dirName);
	await Promise.all([addAlias(alias, dirName), addRoute(name, alias, dirName)]);
};

exports.prepareName = function (name) {
	const dirName = name[0].toLowerCase() + name.slice(1);
	return {
		name: name[0].toUpperCase() + name.slice(1),
		dirName,
		alias: `@${dirName}`,
	};
};

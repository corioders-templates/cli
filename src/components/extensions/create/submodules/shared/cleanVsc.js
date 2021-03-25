exports.cleanVsc = function (data, toDelete) {
	for (let element of toDelete) {
		if (typeof element == 'string' || element instanceof String) delete data[element];
		else if (typeof element == 'object' && element != null) {
			const key = Object.keys(element)[0];
			delete data[key][element[key]];
		}
	}
	return data;
};

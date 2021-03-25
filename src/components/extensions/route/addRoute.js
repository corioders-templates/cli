const { writeFile, readFile } = require('fs/promises');
const { existsSync } = require('fs');
const { resolve } = require('path');
const { APP_DIR, PROJECT_DIR } = require('../../common/paths');

exports.addRoute = async function (name, alias, dirName) {
	const ROUTER_PATH = resolve(APP_DIR(), 'src', 'router.ts');
	let routerString = await readFile(ROUTER_PATH, 'utf-8');

	const includes = routerString.includes('\nconst routes: RouteRecordRaw[] = [');

	routerString = routerString.replace(
		includes ? '\nconst routes: RouteRecordRaw[] = [' : 'const routes: RouteRecordRaw[] = [',
		`import ${dirName}Routes from '${alias}/routes';\n\nconst routes: RouteRecordRaw[] = [`,
	);

	let router = routerString.slice(routerString.search('const routes: RouteRecordRaw') + 33);
	router = router.slice(0, router.search('];') + 1);
	const toReplace = router;
	router = router.replace('\n]', `\n\t...${dirName}Routes('/'),\n]`);
	routerString = routerString.replace(toReplace, router);
	await writeFile(ROUTER_PATH, routerString, 'utf-8');
};

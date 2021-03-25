const { resolve } = require('path');
const { homedir } = require('os');

//COMPUTER HOME
exports.HOME_DIR = homedir();
exports.CONFIG_DIR = resolve(this.HOME_DIR, '.corioders', 'cli');
exports.CONFIG_PATH = resolve(this.CONFIG_DIR, 'userConfig.json');

//CLI
exports.ROOT_DIR = resolve(__dirname, '..', '..', '..');
exports.TEMPLATES_PATH = resolve(this.ROOT_DIR, 'data', 'templates.json');
exports.STMUX_DIR = resolve(this.ROOT_DIR, 'node_modules', 'stmux');
exports.STMUX_PATH = resolve(this.STMUX_DIR, 'bin', 'stmux.js');
exports.STMUX_KEYS_PATH = resolve(this.STMUX_DIR, 'src/stmux-9-keys.js');

//PROJECT
exports.PROJECT_DIR = (name = undefined) => (name != undefined ? resolve(process.cwd(), name) : process.cwd());
exports.APP_DIR = (name) => resolve(this.PROJECT_DIR(name), 'app');
exports.TOOLS_DIR = (name) => resolve(this.PROJECT_DIR(name), 'tools');
exports.SERVER_DIR = (name) => resolve(this.PROJECT_DIR(name), 'server');
exports.JSON_PATH = (name) => resolve(this.APP_DIR(name), 'package.json');

//vue
exports.VUE_FILE = resolve(this.PROJECT_DIR(), '.vue');

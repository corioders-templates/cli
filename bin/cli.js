#!/usr/bin/env node

const { create } = require('../src/command/create.js');
const { run } = require('../src/command/run.js');
const { program } = require('commander');
const { update } = require('../src/command/update.js');
const { install } = require('../src/command/install.js');
const { registerExtensions } = require('../src/command/extensions/registerExtensions.js');

program.version('0.0.1');
program
	.command('create <projectName>')
	.alias('c')
	.option('-d, --default', 'Create new project using your default config')
	.option('-adv, --advanced', 'Create new project with advanced options')
	.description('Create new project')
	.action((name, options) => {
		create(name, options);
	});
program
	.command('run')
	.alias('r')
	.description('Run your project')
	.option('-a, --app', 'Run app')
	.option('-s,--server', 'Run server')
	.option('-b,--both', 'Run app and server side by side')
	.action((options) => {
		run(options);
	});
program
	.command('install')
	.alias('i')
	.description('Install dependencies in your project')
	.option('-a, --app', 'Install in app')
	.option('-s,--server', 'Install in server')
	.option('-b,--both', 'Install in app and server')
	.action((options) => {
		install(options);
	});
program.command('update').alias('u').description('Update template').action(update);

registerExtensions(program);

program.parse(process.argv);

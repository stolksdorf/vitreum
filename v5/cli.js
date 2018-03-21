#!/usr/bin/env node
const cli = require('commander');
const rootPckg = require('../package.json');

const cliOpts = cli
	.version(rootPckg.version)
	.command('vitreum [entrypoints]')
	.usage('[options] <entrypoints...>')
	.option('-d --dev', 'run a dev build of the project')
	.option('-s --static', 'create static renders of the entrypoints')
	.option('-e --embed', 'embed styling into components')

	.parse(process.argv)

	// //Bootstrapper options
	// //TODO: make these into comamnds
	// // https://www.npmjs.com/package/commander#command-specific-options
	// .option('-c --jsx', 'create a component')
	// .option('-p --pure', 'create a pure functional component')
	// .option('--init', 'bootstrap a vitreum project')


//const cliOpts = cli.parse(process.argv);


//if(cliOpts.jsx) return console.log('yo');

cliOpts.targets = cliOpts.args;
delete cliOpts.args;

console.log(cliOpts);


if(cliOpts.dev) return require('./dev.js')(cliOpts.targets, cliOpts);
require('./build.js')(cliOpts.targets, cliOpts);
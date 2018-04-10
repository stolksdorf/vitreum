#!/usr/bin/env node
const cli = require('yargs').version();

//TODO: uses cli.js instead of vitreum in the help
cli.command('* [targets...]', 'Build your project', {
	dev : {
		alias    : 'd',
		describe : 'Run a dev build of the project',
	},
	static : {
		alias    : 's',
		describe : 'Create static renders of the entrypoints',
	},

}, (args)=>{
	(args.dev
		? require('../dev.js')
		: require('../build.js')
	)(args.targets, args)
		.catch((err)=>console.log(err))
})

cli.command('init', 'Bootstrap a vitreum project', {
	lint : {
		alias    : 'l',
		describe : 'Add in eslint config',
	},
	tests : {
		alias    : 't',
		describe : 'Add in tests',
	},
	flux : {
		alias    : 'f',
		describe : 'Add in flux stores, actions, and smart component',
	},
	all : {
		alias    : 'y',
		describe : 'Select everything',
	},
}, (args)=>require('./templates/init.js')(args));

cli.command('jsx <component name>', 'Create a jsx component', {
	pure : {
		alias    : 'p',
		describe : 'Create a functional pure component',
	},
	smart : {
		alias    : 's',
		describe : 'Create a smart component',
	},
}, (args)=>require('./templates/jsx.js')(args));

cli.help('help').alias('help', 'h').argv;
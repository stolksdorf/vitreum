const _     = require('lodash');
const chalk = require('chalk');
const path  = require('path');

let isSilent = false;

module.exports = {
	setSilent : (state)=>isSilent=!!state,

	libWarnings : (bundledLibs) => {
		if(isSilent) return;
		if(!bundledLibs.length) return;
		const libs = _.uniq(bundledLibs);
		console.log(chalk.red("Warning: ") + "The following node modules are in your js bundle.");
		console.log('    ' + chalk.yellow(libs.join('\n    ')));
		console.log(chalk.green('  Consider adding these to the `libs` parameter on your jsx step\n'));
	},

	time : (label) => {
		const time = Date.now();
		if(!isSilent) console.log(chalk.gray(`${label}...`));
		return () => {
			if(isSilent) return;
			console.log(`${_.padEnd(label, 16)} ${chalk.green('✓')} ${chalk.yellow(Date.now() - time + 'ms')}`);
		};
	},

	noDeps : (label) => {
		if(isSilent) return;
		console.log(`${chalk.red('Warning: ')} No dependacy list provided for ${label} less step.`);
		console.log(chalk.green('  Try running the jsx step first.'));
	},

	watch : (label) => {
		if(isSilent) return;
		console.log(chalk.magenta(`  ${label}`));
	},

	checkProduction : (label) => {
		if(isSilent) return;
		const isProd = process.env.NODE_ENV === 'production';
		if(isProd){
			console.log(`${chalk.yellow('Warning:')} You are using the dev step '${label}' in production mode.`);
			console.log(`         This step will fail with a production install of Vitreum.`);
		}
	},

	updateCache : (label) => {
		if(isSilent) return;
		console.log(chalk.gray(`  ${label}, updating bundle cache...`));
	},

	jsxError : (error) => {
		const err = _.defaults(error,{
			filename : '',
			message : '',
			codeFrame : '',
			loc : {}
		});
		err.type = error.toString().substring(0, error.toString().indexOf(':'));

		if(err.message.indexOf('Cannot find module') !== -1){
			//Require Error
		}else{
			err.filename = err.filename.replace(process.cwd() + path.sep, '');
			let message = err.message.substring(err.message.indexOf(': ') + 2);
			message = message.substring(0, message.indexOf(err.loc.line) - 2);
			if(message) err.message = message;
		}

		console.log();
		console.log(chalk.red('ERR: ') + err.message);
		if(!_.isEmpty(err.loc))
			console.log('  ' + chalk.cyan(err.filename) + chalk.yellow(` (${err.loc.line}:${err.loc.column})`));
		console.log(err.codeFrame);
		console.log();
	},

	lessError : (err) => {
		const relativeName = err.filename.replace(process.cwd() + path.sep, '');
		console.log();
		console.log(chalk.red('ERR: ') + err.message);
		console.log('  ' + chalk.cyan(relativeName) + chalk.yellow(` (${err.line}:${err.column})`));
		console.log();
	},

	renderError : (error, rootPath) => {
		console.log(typeof error);
		const keyLine = error.stack.split('\n')[1];
		const filename = keyLine.substring(keyLine.indexOf('(')+1, keyLine.length -1);
		const fields = filename.replace(rootPath + path.sep, '').split(':');

		const relativeName = fields[0];
		const line = fields[1];
		const column = fields[2];

		console.log();
		console.log(chalk.red(error.name + ': ') + error.message);
		console.log('  ' + chalk.cyan(relativeName) + chalk.yellow(` (${line}:${column})`));
		console.log();
	}

};
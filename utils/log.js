const _ = require('lodash');
const chalk = require('chalk');

const path =require('path');

module.exports = {

	libWarnings : (bundledLibs) => {
		if(!bundledLibs.length) return;
		const libs = _.uniq(bundledLibs);
		console.log(chalk.red("Warning: ") + "The following node modules are in your js bundle.");
		console.log('    ' + chalk.yellow(libs.join('\n    ')));
		console.log(chalk.green('  Consider adding these to the `libs` parameter on your jsx step\n'));
	},

	time : (label) => {
		const time = Date.now();
		console.log(chalk.gray(`${label}...`));
		return () => {
			console.log(`${_.padEnd(label, 16)} ${chalk.green('✓')} ${chalk.yellow(Date.now() - time + 'ms')}`);
		};
	},

	noDeps : (label) => {
		console.log(`${chalk.red('Warning: ')} No dependacy list provided for ${label} less step.`);
		console.log(chalk.green('  Try running the jsx step first.'));
	},

	watch : (label) => {
		console.log(chalk.magenta(`  ${label}`));
	},

	checkProduction : (label) => {
		const isProd = process.env.NODE_ENV === 'production';
		if(isProd){
			console.log(`${chalk.yellow('Warning:')} You are using the dev step '${label}' in production mode.`);
			console.log(`         This step will fail with a production install of Vitreum.`);
		}
	},

	updateCache : (label) => {
		console.log(chalk.gray(`  ${label}, updating bundle cache...`));
	},

	jsxError : (err) => {
		const relativeName = err.filename.replace(process.cwd() + path.sep, '');

		let message = err.message.substring(err.message.indexOf(': ') + 2);
			message = message.substring(0, message.indexOf(err.loc.line) - 2)

		console.log();
		console.log(chalk.red('ERR: ') + message);
		console.log('  ' + chalk.cyan(relativeName) + chalk.yellow(` (${err.loc.line}:${err.loc.column})`));
		console.log(err.codeFrame);
		console.log();
	},

	lessError : (err) => {
		const relativeName = err.filename.replace(process.cwd() + path.sep, '');
		console.log();
		console.log(chalk.red('ERR: ') + err.message);
		console.log('  ' + chalk.cyan(relativeName) + chalk.yellow(` (${err.line}:${err.column})`));
		console.log();
	}

};
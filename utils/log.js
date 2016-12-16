const _ = require('lodash');
const chalk = require('chalk');

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
		console.log(`${label}...`);
		//TODO: add some color
		return () => {
			console.log(`${label}   ✓ ${Date.now() - time}ms`);
		}
	},

	noDeps : (label) => {
		console.log(`${chalk.red('Warning: ')} No dependacy list provided for ${label} less step.`);
		console.log(chalk.green('  Try running the jsx step first.'));
	},

	watch : (label) => {
		console.log(`${label}   `);
	},

	checkProduction : (label) => {
		const isProd = process.env.NODE_ENV === 'production';
		if(isProd){
			console.log(`${chalk.red('Warning: ')} You are using the step '${label}' in production mode. This step will not work on a production install of Vitreum.`);
		}
	}

};
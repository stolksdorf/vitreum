const _ = require('lodash');
const chalk = require('chalk');

module.exports = {

	libWarnings : (bundledLibs) => {
		if(!bundledLibs.length) return;
		const libs = _.uniq(bundledLibs);
		console.log(chalk.red("Warning: ") + "The following node modules are in your js bundle.");
		console.log('    ' + chalk.yellow(libs.join('\n    ')));
		console.log(chalk.green("Consider adding these to the 'libs' parameter on your jsx step\n"));
	},

	time : (label) => {
		const time = Date.now();
		console.log(`${label}...`);
		//TODO: add some color
		return () => {
			console.log(`${label}   ✓ ${Date.now() - time}ms`);
		}
	},

	/*
	watch : (type, name) => {
		console.log(`Enabling ${type} for ${name}   ✓`);
	},
	*/

	watch : (label) => {
		console.log(`${label}   ✓ 🕒`);
	},

	noDeps : (name) => {
		return `Dependacies for '${name}' not set. Try running the js build first.`
	}

};
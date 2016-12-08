const chalk = require('chalk');

module.exports = {

	libWarnings : (bundledLibs) => {
		if(!bundledLibs.length) return;
		console.log(chalk.red("Warning: ") + "The following node modules are in your js bundle.");
		console.log('    ' + chalk.yellow(bundledLibs.join('\n    ')));
		console.log(chalk.green("Consider adding these the 'libs' field in your project.json\n"));
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
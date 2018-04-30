const chalk = require('chalk');
const path  = require('path');

//TODO: Remove?
let isSilent = false;

const rel = (filepath)=>path.relative(process.cwd(), filepath);


//TODO: potentailly group logs by role "build/dev"

const log = {

	styleError : (err)=>{
		console.log('STYLE', err);
	},

	bundleError : (err) => {
		console.log(err);
		err.title = err.message.split('\n')[0];
		err.title = err.title.substring(err.title.indexOf(': ') + 2);
		err.title = err.title.substring(0, err.title.indexOf(err.loc.line) - 2);

		err.codeFrame = err.message.split('\n').splice(2).join('\n');

		console.log();
		console.log(chalk.red('ERR: ') + chalk.white(err.title));
		if(err.loc && err.loc.line)
			console.log('  ' + chalk.cyan(rel(err.filename)) + chalk.yellow(` (${err.loc.line}:${err.loc.column})`));
		console.log();
		console.log(err.codeFrame);
		console.log();
	},

	//TODO: make a log that truncates file paths to be relative to root
	//  possibly rmeove
	//step : (type, target)=>log.time(`${type} ${rel(target)}`),

	time : (label, doneLabel) => {
		const time = Date.now();
		if(!isSilent) console.log(`${label}...`);
		return () => {
			if(isSilent) return;
			console.log(`${(doneLabel || label).padEnd(16)} ${chalk.green('✓')} ${chalk.yellow(Date.now() - time + 'ms')}`);
		};
	},


	/** Build **/

	beginBuild : (opts)=>{
		console.log('Starting build...');
		//console.log(opts.targets.map((target)=>`  ${rel(target)}`).join('\n'));
	},

	// buildEntryPoint : (entry)=>{
	// 	const time = Date.now();
	// 	console.log(chalk.gray(`Bundling ${entry.name}...`));
	// 	return ()=>{
	// 		console.log(`  ${chalk.green('✓')} ${chalk.yellow(Date.now() - time + 'ms')}`);
	// 	};
	// },

	// libs : (libs)=>{
	// 	const time = Date.now();
	// 	console.log(chalk.gray(`Bundling Libs`));
	// 	console.log(Object.keys(libs).map((libName)=>`  ${libName}`).join('\n'));
	// 	return ()=>{
	// 		console.log(`  ${chalk.green('✓')} ${chalk.yellow(Date.now() - time + 'ms')}`);
	// 	};
	// },

	buildEntryPoint : (entry)=>{
		return log.time(chalk.gray(`Bundling ${entry.name}`));
	},

	libs : (libs)=>{
		const res = log.time(chalk.gray(`Bundling Libs`));
		console.log(Object.keys(libs).map((libName)=>`  ${libName}`).join('\n'));
		return res;
	},



	/** Dev **/
	restartServer : (serverFile, changedFiles=[])=>{
		if(changedFiles.length){
			console.log(chalk.cyan('Server change detected:'), changedFiles.map(rel).join(', '));
		}
		console.log(chalk.magenta(`  Restarting`), rel(serverFile));
	},
	beginDev : (opts)=>{
		console.log('Starting dev build...');
	},
	rebundle : (entry, changedFiles)=>{
		console.log(chalk.cyan('Client change detected:'), changedFiles.map(rel).join(', '));
	},
	notBuilt : (entry)=>{
		console.log(chalk.red('bad bad'));
		return `Entrypoint: ${entry.name} has not been built, please run a build before you dev`;
	},













	/** Verify below **/



	// setSilent : (state)=>isSilent=!!state,

	// libWarnings : (bundledLibs) => {
	// 	if(isSilent) return;
	// 	if(!bundledLibs.length) return;
	// 	const libs = _.uniq(bundledLibs);
	// 	console.log(chalk.red("Warning: ") + "The following node modules are in your js bundle.");
	// 	console.log('    ' + chalk.yellow(libs.join('\n    ')));
	// 	console.log(chalk.green('  Consider adding these to the `libs` parameter on your jsx step\n'));
	// },



	// noDeps : (label) => {
	// 	if(isSilent) return;
	// 	console.log(`${chalk.red('Warning: ')} No dependacy list provided for ${label} less step.`);
	// 	console.log(chalk.green('  Try running the jsx step first.'));
	// },

	/*

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

	*/

};
module.exports = log;
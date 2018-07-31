const chalk = require('chalk');
const path  = require('path');

//TODO: Remove?
let isSilent = false;

const rel = (filepath)=>path.relative(process.cwd(), filepath);


//TODO: potentailly group logs by role "build/dev"

const log = {

	requireError : (modName)=>{
		console.log();
		console.log(chalk.red('ERR: ') + chalk.white(`Can't find module ${modName}. Make sure it's installed, or you are referencing properly`));
		console.log();
	},

	styleError : (err)=>{
		console.log('STYLE', err);
	},

	bundleError : (err) => {
		err.title = err.message.split('\n')[0];
		err.title = err.title.substring(err.title.indexOf(': ') + 2);
		if(err.loc) err.title = err.title.substring(0, err.title.indexOf(err.loc.line) - 2);

		err.codeFrame = err.message.split('\n').splice(2).join('\n');
		delete err.stream;

		console.log(err);
		return;

		/** Fix the below, browserify has updated how it errors **/
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

	buildEntryPoint : (entry, isProd)=>{
		const res = log.time(chalk.gray(`Bundling ${entry.name}`));
		if(isProd) console.log(chalk.gray(`Compressing ${entry.name}...`));
		return res;
	},

	libs : (libs, isProd)=>{
		const res = log.time(chalk.gray(`Bundling Libs`));
		console.log(Object.keys(libs).map((libName)=>`  ${libName}`).join('\n'));
		if(isProd) console.log(chalk.gray(`Compressing Libs...`));
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
};
module.exports = log;
const nodemon = require('nodemon');
const path = require('path');
const {chalk} = require('./utils.js');

const rel = (filepath)=>path.relative(process.cwd(), filepath);

module.exports = (filepath, opts={})=>{
	return nodemon({ script:filepath, delay:2,
		...opts,
		watch: (opts.watch || []).concat(path.dirname(filepath)),
	})
		.on('restart', (changedFiles)=>{
			//TODO: Make these prettier
			if(changedFiles.length){
				console.log(chalk.cyan('Server change detected:'), changedFiles.map(rel).join(', '));
			}
			console.log(chalk.magenta(`  Restarting`), filepath);
		});
}

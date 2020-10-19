const chalk = require('./chalk.js');
const pckg = require('../package.json');
const peerDeps = Object.keys(pckg.peerDependencies).join(' ');

console.log(chalk.green('\nBe sure to install the needed peer dependencies:'));
console.log(chalk.cyan(`npm install ${peerDeps}`));

console.log(`\nUse ${chalk.cyan(`node node_modules/vitreum/utils/scaffold.js`)} to quickly setup your project.`)
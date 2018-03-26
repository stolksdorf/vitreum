const fse = require('fs-extra');
const chalk = require('chalk');
const jsx = require('./jsx.js');

const LIBS = [
	'lodash',
	'pico-conf',
	'vitreum',
	'express',
];
let DEV_LIBS = [];
let pckg;

const done = (msg)=>console.log(`  ${chalk.green('✓')} ${msg}`);

const addTests = ()=>{
	pckg.scripts.test = 'pico-check';
	pckg.scripts['test:dev'] = 'pico-check -v -w';
	pckg.picocheck={require:'@babel/register'}
	DEV_LIBS = DEV_LIBS.concat(['pico-check', 'react-test-renderer', '@babel/register']);
	fse.outputFileSync('./tests/widget.test.jsx',
`const React  = require('react');
const test   = require('pico-check');
const render = (comp) => require('react-test-renderer').create(comp).toJSON();

const Widget = require('vitreum/require')('../client/shared/widget/widget.jsx');

test('renders to a div', (t)=>{
	const widget = render(<Widget />);
	t.is(widget.type, 'div');
});
module.exports = test;`);
	done('created tests');
};

const addLint = async ()=>{
	pckg.scripts.lint = 'eslint --fix **/*.{js,jsx}';
	pckg.scripts['lint:dry'] = 'eslint **/*.{js,jsx}';
	DEV_LIBS = DEV_LIBS.concat(['eslint', 'eslint-plugin-react']);
	fse.copySync(`${__dirname}/eslintrc.js`, `.eslintrc.js`);
	done('added lint');
};

const addFlux = ()=>{
	LIBS.push('pico-flux');
	//TODO: Add in these scripts
	fse.outputFileSync(`./client/shared/store.js`,``);
	fse.outputFileSync(`./client/shared/actions.js`,``);

	done('added flux store and actions');
}

const addServer = ()=>{
fse.outputFileSync(`app.js`,
`const config = require('pico-conf')
	.argv()
	.env({lowercase:true})
	.add(require(\`./config/\${process.env.NODE_ENV}.js\`))
	.defaults(require('./config/default.json'));

const server = require('./server/server.js');

const PORT = config.get('port');
server.listen(PORT, ()=>{
	console.log(\`server on port:\${PORT}\`);
});`);
fse.outputFileSync(`./server/server.js`,
`const express = require('express');
const app     = express();

app.use(express.static('./build'));
app.enable('trust proxy');

app.use(require('./page.router.js'));

app.all('*', (req, res) => {
	res.status(404).send('Oh no.');
});

module.exports = app;`);
fse.outputFileSync(`./server/page.router.js`,
`const router = require('express').Router();
const mainRenderer = require('../build/main/render.js');

router.get('/', (req, res) => {
	return res.send(mainRenderer({
		url : req.url
	}));
});

module.exports = router;`);
	done('created server files');
};

module.exports = (args)=>{
	try{
		pckg = require(`${process.cwd()}/package.json`);
	}catch(err){
		return console.log('No package.json found. try running `npm init` first');
	}

	/** package config **/
	pckg.main = 'app.js';
	pckg.scripts.build = 'vitreum';
	pckg.scripts.dev = 'vitreum --dev';
	pckg.scripts.postinstall = 'npm run build';
	pckg.scripts.start = `node ${pckg.main}`;
	pckg.vitreum = {
		targets : ['client/main/main.jsx']
	};
	pckg.babel = {
		presets: [
			'@babel/preset-stage-3',
			'@babel/preset-react'
		]
	};
	done('configured package.json');

	/** Dot Files **/
	fse.outputFileSync(`./.gitignore`, `node_modules\nbuild\nconfig/local.*\n.DS_Store`);
	fse.outputFileSync(`./.gitattributes`, `package-lock.json binary`);
	done('added dotfiles');

	/** Config **/
	fse.outputJsonSync(`./config/default.json`, {port:8000}, {spaces: 2});
	fse.outputFileSync(`./config/local.js`, `module.exports={\n\n};`);
	fse.outputFileSync(`./config/production.js`, `module.exports={\n\n};`);
	done('setup config files');

	/** Client Files **/
	jsx({componentname:'main'}, `${process.cwd()}/client`);
	jsx({componentname:'widget', pure:true, smart:(args.flux || args.all)}, `${process.cwd()}/client/shared`);
	done('created client files');

	addServer();

	if(args.lint || args.all) addLint();
	if(args.tests || args.all) addTests();
	if(args.flux || args.all) addFlux();

	fse.outputJsonSync('./package.json', pckg, {spaces:2});

	console.log(chalk.magenta('\n🎉 done! 🎉'));
	console.log('\nInstall the following libs:\n');
	console.log(chalk.cyan(`  npm i ${Object.keys(require('../package.json').peerDependencies).join(' ')}`));
	console.log(chalk.cyan(`  npm i ${LIBS.join(' ')}`));
	console.log(chalk.yellow(`  npm i --save-dev ${DEV_LIBS.join(' ')}\n`));
}
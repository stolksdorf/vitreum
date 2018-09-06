const fse = require('fs-extra');
const chalk = require('chalk');
const jsx = require('./jsx.js');

//TODO: add in a shared/core.less, make it required by main.less
// Should have basic style cleanup

const LIBS = [
	'lodash',
	'pico-conf',
	'express',
	'classnames',
	'vitreum',
];
let DEV_LIBS = [];
let PEER_LIBS = [
	'@babel/core',
	'@babel/preset-react',
	'@babel/plugin-proposal-object-rest-spread',
	'react',
	'react-dom',
	'create-react-class',
];
let pckg;

const done = (msg)=>console.log(`  ${chalk.green('✓')} ${msg}`);

const addTests = ()=>{
	pckg.scripts.test = 'pico-check';
	pckg.scripts['test:dev'] = 'pico-check -v -w';
	pckg.picocheck={require:'./tests/test.init.js'};
	DEV_LIBS = DEV_LIBS.concat(['pico-check', 'react-test-renderer']);
	fse.outputFileSync('./tests/test.init.js',
`require('@babel/register');
require('../config/config.init.js');`);
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
	pckg.eslintIgnore = ['build/*', 'node_modules/*'];
	DEV_LIBS = DEV_LIBS.concat(['eslint', 'eslint-plugin-react', 'babel-eslint']);
	fse.copySync(`${__dirname}/eslintrc.js`, `.eslintrc.js`);
	done('added lint');
};

const addFlux = ()=>{
	LIBS.push('pico-flux');
	fse.outputFileSync(`./client/shared/store.js`,`const flux = require('pico-flux');
let State = {
	value : 0
};
const Store = flux({
	init(state){
		State = Object.assign(State, state);
	},
	setVal(val){
		State.value = val;
	}
});

Store.getValue=()=>State.value;

module.exports = Store;`);
	fse.outputFileSync(`./client/shared/actions.js`,`const Store = require('./store.js');
const Actions = {
	init : (initState)=>{
		Store.setters.init(initState);
	},
	inc : (val = 1) => {
		Actions.setVal(Store.getVal() + val);
	},
	setVal : (newVal) => {
		Store.setters.setVal(newVal);
	},
};

module.exports = Actions;`);

	done('added flux store and actions');
}

const addServer = ()=>{
fse.outputFileSync(`app.js`,
`const config = require('./config/config.init.js');

const server = require('./server/server.js');

const PORT = config.get('port');
server.listen(PORT, ()=>{
	console.log('_____________________________');
	console.log(\`PROJECT server running on port:\${PORT} 🚀 \`);
});`);

fse.outputFileSync(`./server/server.js`,
`const express = require('express');
const server  = express();
const errors  = require('./error.handler.js');

server.use(errors.prep);
server.use(express.static(__dirname + '/../build'));
server.enable('trust proxy');

server.use(require('./page.router.js'));
server.all('*', (req, res) => res.status(404).send('Oh no.') );

server.use(errors.handle);
module.exports = server;`);

fse.outputFileSync(`./server/page.router.js`,
`const router = require('express').Router();
const mainRenderer = require('../build/main/render.js');

router.get('/', (req, res) => {
	return res.send(mainRenderer({
		url : req.url
	}));
});

module.exports = router;`);
fse.outputFileSync(`./server/error.handler.js`,
`let errListener;
const handle = (err, req, res, next)=>{
	console.error(err);
	return res.status(err.status || 500).send({
		message : err.message ? err.message : err,
		type    : err.name,
		trace   : err.stack
	});
};
module.exports = {
	handle,
	prep : (req, res, next)=>{
		if(errListener) process.removeListener('unhandledRejection', errListener);
		errListener = (err, promise)=>handle(err, req, res, next);
		process.once('unhandledRejection', errListener);
		next();
	}
};`);
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
	pckg.scripts.prod = 'cross-env NODE_ENV=production vitreum';
	pckg.scripts.postinstall = 'npm run build';
	pckg.scripts.start = `node ${pckg.main}`;
	pckg.vitreum = {
		targets : ['client/main/main.jsx']
	};
	pckg.babel = {
		presets: ['@babel/preset-react'],
		plugins: ['@babel/plugin-proposal-object-rest-spread']
	};
	done('configured package.json');

	/** Dot Files **/
	fse.outputFileSync(`./.gitignore`, [`node_modules`,`build`,`config/local.*`,`.DS_Store`].join('\n'));
	fse.outputFileSync(`./.gitattributes`, `package-lock.json binary`);
	done('added dotfiles');

	/** Config **/
	fse.outputFileSync(`./config/default.js`, `module.exports=${JSON.stringify({port:8000, host:'localhost:8000'}, null, '\t')};`);
	fse.outputFileSync(`./config/local.js`, `module.exports={\n\n};`);
	//fse.outputFileSync(`./config/staging.js`, `module.exports={\n\n};`);
	//fse.outputFileSync(`./config/production.js`, `module.exports={\n\n};`);
	fse.outputFileSync(`./config/config.init.js`, `module.exports = require('pico-conf')
	.argv().env()
	.defaults(require('./default.js'))
	.file(\`./\${process.env.NODE_ENV}.js\`);`);

	done('setup config files');

	/** Client Files **/
	fse.outputFileSync(`./client/client.init.js`, `require('pico-conf').add(global.vitreum_props.config);`);
	jsx({component:'main'}, `${process.cwd()}/client`);
	jsx({component:'widget', pure:true, smart:(args.flux || args.all)}, `${process.cwd()}/client/shared`);
	done('created client files');

	addServer();

	if(args.lint  || args.all) addLint();
	if(args.tests || args.all) addTests();
	if(args.flux  || args.all) addFlux();

	fse.outputJsonSync('./package.json', pckg, {spaces:2});

	console.log(chalk.magenta('\n🎉 done! 🎉'));
	console.log('\nInstall the following libs:\n');
	console.log(chalk.cyan(`  npm i ${PEER_LIBS.join(' ')}`));
	console.log(chalk.cyan(`  npm i ${LIBS.join(' ')}`));
	console.log(chalk.yellow(`  npm i --save-dev ${DEV_LIBS.join(' ')}\n`));
}
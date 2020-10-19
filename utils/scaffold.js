// Populates a project file with a vitreum setup




//Create client.jsx /less
//create scripts folder
  //bundle.script
  //build.script
  //simple.server.js

//server
  //server.js + renderpage

// add npm run scripts to package.json

// console out the npm installs you need


//


const fse = require('fs-extra');

const root = process.cwd();


fse.outputFileSync(`${root}/src/main.jsx`, `require('./main.less');
const React = require('react');

const { Title } = require('vitreum/headtags');

function Main({ ...props }){
	return <div className='Main'>
		<Title>Main Page</Title>
		<section>
			<div>Main Ready</div>
		</section>
	</div>
};

module.exports = Main;`);
console.log(`Created: ${root}/src/main.jsx`);

fse.outputFileSync(`${root}/src/main.less`, `.Main {
	font-family: Roboto;
}`);
console.log(`Created: ${root}/src/main.jsx`);





const bundleRecipe = fse.readFileSync(`${__dirname}/../recipes/embed.recipe.js`, 'utf8').replace(/\.\.\/\.\.\/vitreum/g, 'vitreum');
fse.outputFileSync(`${root}/scripts/bundle.script.js`, bundleRecipe);
console.log(`Created: ${root}/scripts/bundle.script.js`);


const buildRecipe = fse.readFileSync(`${__dirname}/../recipes/ssr.recipe.js`, 'utf8').replace(/\.\.\/\.\.\/vitreum/g, 'vitreum');
fse.outputFileSync(`${root}/scripts/build.script.js`, buildRecipe);
console.log(`Created: ${root}/scripts/build.script.js`);


fse.copySync(`${__dirname}/../recipes/server/server.js`, `${root}/server/server.js` )
console.log(`Created: ${root}/server/server.js`);


const pckg = require(`${root}/package.json`);
pckg.scripts.build = 'node scripts/bundle.script.js';
pckg.scripts.dev = 'node scripts/bundle.script.js --dev';
fse.outputJsonSync(`${root}/package.json`, pckg, {spaces : 2});
console.log('Updated package.json scripts');


require('./postinstall.js')
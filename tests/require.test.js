const test = require('pico-check');
const vReq = require('../require.js');



const tempComp = vReq('./test.comp.jsx');
console.log(tempComp());



// test.only()('test test', t=>{
// 	const tempComp = vReq('./test.comp.jsx');

// 	console.log(tempComp.toString());
// 	console.log(tempComp());


// 	t.pass();

// })


module.exports = test;
const path = require('path');
const fse  = require('fs-extra');
const babel = require('@babel/core');
const SVGO = require('svgo');

const camelCase = (text)=>text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, a, b)=>b?b.toUpperCase():a.toLowerCase());

//TODO: Remove lodash completely

const svgo = new (SVGO)({
	plugins: [
		{convertStyleToAttrs: true},
		{removeAttrs: {attrs: 'style'}},
		{removeViewBox: false},
		{removeUselessStrokeAndFill: false},
		{removeStyleElement: true},
		{removePrefixedAttributes: {
			type: 'perItem',
			fn: (item) => {
				item.eachAttr((attr) => { if (attr.prefix && attr.local) item.removeAttr(attr.name); });
			},
		}},
	]
});

const makeSVG = (data)=>{
	return new Promise((resolve)=>svgo.optimize(data, (svg)=>resolve(svg.data)));
};
const correctAttrs = (svg)=>{
	const ATTR_REGEX = /(class|clip-path|fill-opacity|font-family|font-size|marker-end|marker-mid|marker-start|stop-color|stop-opacity|stroke-width|stroke-linecap|stroke-dasharray|stroke-opacity|text-anchor|stroke-miterlimit|stroke-linejoin)=/g;
	return svg.replace(ATTR_REGEX, (line, attr)=>{
		if(attr == 'class') return 'className=';
		return `${camelCase(attr)}=`;
	})
};
const template = (component)=>{
	return `const React = require('react');
	const _extends = Object.assign;
module.exports = (props)=>${component};`
};

module.exports = {
	name : 'svg',
	test  : (filepath)=>['.svg'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		let svg = await makeSVG(contents);
		svg = correctAttrs(svg);
		svg = babel.transform(svg, opts.babel).code;
		svg = svg
			.replace('"svg", {', `"svg", {\n  ...props,`)
			.replace(`"use strict";`,``)
		return template(svg);
	}
};
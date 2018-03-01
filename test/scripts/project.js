module.exports = {
	entryPoints : {
		main : './client/main/main.jsx'
	},
	assetExts : ['*.jpg', '*.png', '*.otf', '*.woff', '*.woff2', '*.ico', '*.ttf', '*.svg'],
	shared    : ['./client'],
	libs      : [
		'react',
		'react-dom',
		'lodash/core',
		'create-react-class',
		'pico-router',
		'classnames',
	]
};
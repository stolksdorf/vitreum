var utils = require('../utils');
var _ = require('underscore');
var gulp = require('gulp');


var cssIconFile = "@font-face {  font-family: 'custom';  src: url('/icon/custom.eot');  src: url('/icon/custom.eot?') format('embedded-opentype'), url('/icon/custom.woff') format('woff'), url('/icon/custom.ttf') format('truetype'), url('/icon/custom.svg') format('svg');  font-weight: normal;  font-style: normal;}\n";
module.exports = function(config){
	if(!config.iconsPath) return;
	var iconfont = require('gulp-iconfont');
	var rename = require('gulp-rename');

	return gulp.src(config.iconsPath + '/*.svg')
		.pipe(iconfont({
			fontName: 'custom',
			log: function () {}
		}))
		.on('codepoints', function (icons) {
			var iconData = _.reduce(icons, function (r, icon_info) {
				r['.fa-' + icon_info.name] = "\\" + icon_info.codepoint.toString(16);
				return r;
			}, {});
			cssIconFile += _.keys(iconData).join(',') + '{font-family: custom;}\n';
			cssIconFile = _.reduce(iconData, function (r, content, className) {
				return r + className + ':before{content:"' + content + '";}\n';
			}, cssIconFile)
			utils.streamify(cssIconFile)
				.pipe(rename('custom.css'))
				.pipe(gulp.dest(config.buildPath + 'icon/'));
		})
		.pipe(gulp.dest(config.buildPath + 'icon/'));
});
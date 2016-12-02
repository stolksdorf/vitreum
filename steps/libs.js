const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const isProd = process.env.NODE_ENV === 'production';

const label = 'libs';

module.exports = (libs=[], addPaths=[]) => {
	console.time(label);
	return new Promise((resolve) => {

		const bundle = browserify({ paths: addPaths })
			.require(libs)
			.bundle()
			.on('error', (err)=>{
				console.log('LIB BUNDLE ERR', err);
				throw err;
				//utils.handleError.call(this, config.DEV, err)
			})
			.pipe(source('libs.js'))
			.pipe(buffer())

		if(isProd) bundle.pipe(uglify());

		bundle
			.pipe(gulp.dest('build'))
			.on('finish', ()=>{
				console.timeEnd(label);
				return resolve();
			});
	});
};

var gutil = require('gulp-util');
var _ = require('underscore');



module.exports = {

	streamify : function (string) {
		var src = require('stream').Readable({
			objectMode: true
		})
		src._read = function () {
			this.push(new gutil.File({
				cwd: "",
				base: "",
				path: 'temp',
				contents: new Buffer(string)
			}))
			this.push(null)
		}
		return src;
	},

	handleError : function(isDev, err) {
		delete err.stream;
		gutil.log(err);
		if(!isDev) process.exit(1);
		gutil.beep();
		this.emit('end');
		this.end();
	},


	//Creates a list of node blobs from a list of paths, and a list of extensions
	makeBlob : function (paths, exts) {
		return _.flatten(_.map(paths, function (path) {
			return _.map(exts, function (ext) {
				return path + ext;
			});
		}));
	}


}
var gulp = require('gulp');

require.uncache = function(filePath){
	var rc = require.cache[filePath];
	if(rc){
		if(rc.parent.id) require.uncache(rc.parent.id);
		delete require.cache[filePath];
	}
}

module.exports = function(blobs){
	gulp.watch(blobs, function(file){
		require.uncache(require.resolve(file.path));
	});
}
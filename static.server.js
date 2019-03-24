const http = require('http');
const url = require('url');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const port = 8000;

const map = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword'
};

module.exports = (opts)=>{
	//console.log(opts);


	http.createServer(function (req, res) {
		console.log(`${req.method} ${req.url}`);

		let pathname = url.parse(req.url).pathname;
		if(pathname === '/' && pathname !== opts.rootPath){
			res.writeHead(302, { "Location": opts.rootPath });
			return res.end();
		}

		pathname = pathname.replace(RegExp(`^(${opts.rootPath})`),'');
		pathname = path.join(process.cwd(), opts.paths.build, pathname);

		fs.exists(pathname, function (exist) {
			if(!exist) {
				// if the file is not found, return 404
				res.statusCode = 404;
				res.end(`File ${pathname} not found!`);
				return;
			}

			// if is a directory search for index file matching the extention
			if (fs.statSync(pathname).isDirectory()) pathname = path.join(pathname, opts.paths.static);

			const ext = path.parse(pathname).ext;

			console.log(pathname);
			console.log(ext);

			// read file from file system
			fs.readFile(pathname, function(err, data){
				if(err){
					res.statusCode = 500;
					res.end(`Error getting the file: ${err}.`);
				} else {
					// if the file is found, set Content-type and send data
					res.setHeader('Content-type', map[ext] || 'text/plain' );
					res.end(data);
				}
			});
		});


	}).listen(parseInt(port));

	console.log(`Vitreum static server listening on port ${port}`);
}

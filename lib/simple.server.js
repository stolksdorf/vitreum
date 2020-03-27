const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

const chalk = require('../utils/chalk.js');

const getMIMEType = (ext)=>{
	const types = {
		'.ico': 'image/x-icon',
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.css': 'text/css',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.wav': 'audio/wav',
		'.mp3': 'audio/mpeg',
		'.svg': 'image/svg+xml',
		'.pdf': 'application/pdf',
		'.gif' : 'image/gif',
		'.mpeg' : 'video/mpeg',
		'.pdf' : 'application/pdf',
		'.tar.gz' : 'application/x-tar',
		'.tgz' : 'application/x-tar',
		'.wav' : 'audio/wav',
		'.zip' : 'application/zip',
	};
	return types[ext] || 'text/plain';
};

const getFile = async (pathname, rootDir)=>{
	const ext = path.extname(pathname);
	if(ext == '') return getFile(pathname + '/index.html', rootDir);
	const loc = path.join(rootDir, pathname);
	try{
		return { ext, contents : await fs.readFile(loc), loc }
	}catch(err){
		console.log(err);
		return { ext : false, contents : false, loc };
	}
};

module.exports = (rootDir=process.cwd(), opts={})=>{
	opts = {port:8000, basepath:false, ...opts};

	return new Promise((resolve, reject)=>{
		http.createServer(async (req, res)=>{
			let pathname = url.parse(req.url).pathname.replace(/\/$/, '');
			if(pathname.startsWith(opts.basepath)) pathname = pathname.replace(opts.basepath, '');
			const { contents, ext, loc } = await getFile(pathname, rootDir);
			if(contents === false){
				res.statusCode = 404;
				res.end(`File ${loc} not found!`);
				return;
			}
			res.setHeader('Content-type', getMIMEType(ext) );
			res.end(contents);
		}).listen(parseInt(opts.port), ()=>{
			console.log(chalk.cyan(`Server listening on port:`), opts.port);
			resolve();
		});
	})
}

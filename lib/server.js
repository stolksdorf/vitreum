const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

const getType = (ext)=>{
	const types = {
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
	};
	return types[ext] || 'text/plain';
};

const getFile = async (pathname, rootDir)=>{
	const ext = path.extname(pathname);
	if(ext == '') return getFile(pathname + '/index.html', rootDir);
	const loc = path.join(rootDir, pathname)
	try{
		return { ext, contents : await fs.readFile(loc), loc }
	}catch(err){
		console.log(err);
		return { ext : false, contents : false, loc };
	}
}

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
			res.setHeader('Content-type', getType(ext) );
			res.end(contents);
		}).listen(parseInt(port), ()=>{
			console.log(`\x1b[36mServer listening on port: \x1b[0m${port} `);
			resolve();
		});
	})
}

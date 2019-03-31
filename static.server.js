const http = require('http');
const url = require('url');
const fse = require('fs-extra');
const path = require('path');

const PORT = 8000;

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
		'.doc': 'application/msword'
	};
	return types[ext] || 'text/plain';
};

/** Returns false if file does not exist **/
const getSystemPath = async (pathname, opts)=>{
	let res = pathname.replace(RegExp(`^(${opts.rootPath})`),'');
	res = path.join(process.cwd(), opts.paths.build, res);
	try{
		let stats = await fse.stat(res);
		if(stats.isDirectory()){
			res = path.join(res, opts.paths.static);
			stats = await fse.stat(res);
		}
		return res;
	}catch(err){
		return false;
	}
}

module.exports = (opts)=>{
	http.createServer(async (req, res)=>{
		let pathname = url.parse(req.url).pathname;
		if(pathname === '/' && pathname !== opts.rootPath){
			res.writeHead(302, { 'Location': opts.rootPath });
			return res.end();
		}
		const systempath = await getSystemPath(pathname, opts);
		if(!systempath){
			res.statusCode = 404;
			res.end(`File ${pathname} not found!`);
			return;
		}
		try{
			const ext = path.parse(systempath).ext;
			const file = await fse.readFile(systempath);
			res.setHeader('Content-type', getType(ext) );
			res.end(file);
		}catch(err){
			res.statusCode = 500;
			res.end(`Error getting the file: ${err}.`);
		}
		return;
	}).listen(parseInt(PORT));

	console.log(`Vitreum static server listening on port ${PORT}`);
}

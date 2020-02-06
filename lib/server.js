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
		//'.doc': 'application/msword'
	};
	return types[ext] || 'text/plain';
};

const getFile = async (pathname, root)=>{
	const ext = path.extname(pathname);
	if(ext == '') return getFile(pathname + '/index.html', root);
	const loc = path.join(root, pathname)
	try{
		return { ext, contents : await fs.readFile(loc), loc }
	}catch(err){
		console.log(err);
		return { ext : false, contents : false, loc };
	}
}

module.exports = ({port=8000, root=process.cwd(), base=false})=>{
	return new Promise((resolve, reject)=>{
		http.createServer(async (req, res)=>{
			const pathname = url.parse(req.url).pathname.replace(/\/$/, '');
			const { contents, ext, loc } = await getFile(pathname, root);
			if(!contents){
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

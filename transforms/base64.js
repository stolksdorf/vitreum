const path = require('path');
const fs = require('fs').promises;

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

module.exports = async (code, fp)=>{
	const base64 = Buffer.from(await fs.readFile(fp)).toString('base64');
	return `module.exports='data:${getMIMEType(path.extname(fp))};base64,${base64}';`;
}
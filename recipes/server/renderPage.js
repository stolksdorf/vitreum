
module.exports = (props)=>{
	return `<!DOCTYPE html>
<!-- Doctype HTML5 -->
<html lang='en'>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
		<link href='/bundle.css' rel='stylesheet'></link>
	</head>
	<body>
		<main>${require('../build/ssr.js')(props)}</main>
	</body>
	<script src='/bundle.js'></script>
	<script>start_app(${JSON.stringify(props)})</script>
</html>`;

}
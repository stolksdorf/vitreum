module.exports = ({head='', body='', tail='', props={}})=>{
	return `<!DOCTYPE html>
<!-- Doctype HTML5 -->
<html lang='en'>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
		${head}
	</head>
	<body><main>${body}</main></body>
	${tail}
	<script>start(${JSON.stringify(props)})</script>
</html>`
};
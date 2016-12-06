module.exports = (label) => {
	const time = Date.now();
	console.log(`${label}...`);
	return () => {
		console.log(`${label}   ✓ ${Date.now() - time}ms`);
	}
}
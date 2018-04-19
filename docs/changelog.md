# changelog

### v4.10.0 - Thursday, 09/11/2017
- Add babel option to libs step

### v4.9.3 - Tuesday, 07/11/2017
- Allow the `silent` option on steps to not produce console output

### v4.9.2 - Friday, 03/11/2017
- Add minify option to libs step

### v4.9.1 - Thursday, 02/11/2017
- Adding ability to pass through options to nodemon

### v4.9.0 - Tuesday, 19/10/2017
- Updated to React v16
- Now using [`reactDom.hydrate` ](https://reactjs.org/docs/react-dom.html#hydrate) in the render step
- `babel-preset-react`, `react`, `react-dom`, `lodash`, `create-react-class` are now listed as peer-deps for faster installs
- Vitreum now uses the project's [babel config](https://babeljs.io/docs/usage/babelrc/) so it must be configured or your project won't build

### v4.7.0 - Friday, 11/08/2017
- Replaced headtags with a generalized `meta` tag

### v4.6.0 - Friday, 11/08/2017
- Adding in custom transforms to babelify

### v4.5.2 - Wednesday, 12/07/2017
- Improved check to allow top-level function component entry points.
- Removing classnames as a dep (unused)
- Updated chalk to v2

### v4.5.1 - Monday, 10/07/2017
- Updated `browserify` to v14
- Updated `fs-extra` to v3
- Added `klaw` (functionality removed from `fs-extra v1`)

### v4.5.0 - Monday, 10/07/2017
**Warning** : This version changes step function signature, so your build scripts will need to be updated

- `libs`, `jsx` and `less` steps (and associated `*Watch` steps) now take a generic `opts` argument, instead of various arguments. This will allow me to add more features and expand functionality in the future without changing step function signature
- `jsx` and `less` steps now resolve file paths instead of constructing them.
- Added option to `libs`, `jsx` and `less` steps to change filename of resulting bundle
- Added option to change the babel presets on the `jsx` step
- Added option to use a project's `.babelrc` file
- Added option to disable the global transform on `babelify` (not recommended)
- Updated examples and readme to reflect the above changes

### v4.4.1
- Fixed err.toString in render.js #21

# vitreum
[![bitHound Overall Score](https://www.bithound.io/github/stolksdorf/vitreum/badges/score.svg)](https://www.bithound.io/github/stolksdorf/vitreum)

`vitreum` is a collection of front-end build tasks using common build tools; React, Browserify, LESS, and LiveReload. `vitreum` focuses on incredibly fast build times and tooling for tightly active development. It's composed of several independant steps that you can configure to meet exactly what your project needs.

## install

```
npm install vitreum
```

Vitreum will use your project's [babel config](https://babeljs.io/docs/usage/babelrc/), so it's a good idea to have at least [`babel-react-preset`](https://babeljs.io/docs/plugins/preset-react/) configured to be able to build react components. 

`package.json`
```json
{
  "babel": {
    "only": [
      "*.jsx"
    ],
    "presets": [
      "react"
    ]
  },
}
```

#### peer deps

`babel-preset-react`, `react`, `react-dom`, `lodash`, `create-react-class` are listed as peer dependacies, so make sure those are installed. 


### quickstart

To really get going quickly, I've made a [separate project for common commandline tools](https://github.com/stolksdorf/vitreum-cli) for vitreum, including a complete project bootstrap.


### folder-based components
One of the core reason why Vitreum exists to to make it easy to use folder-based components. These components are self-contained within a folder with a JSX component and an associated LESS file with it. Any assets or sub-components it needs should be located within it's own folder. If the `.jsx` file is required within your build, it's `.less` file also be automatically included in the LESS compile step.

This method keeps your components incredibly modular and then your file system reflects your component hierarchy.

```
/page
  ├─ page.jsx
  ├─ page.less
  ├─ user.png
  └─ /widget
    ├─ widget.jsx
    └─ widget.less
```

### [docs](docs.md)

Check out the [docs.md](docs.md) to see how each step works.


### [examples](examples.md)

See the [examples.md](examples.md) for some best practices and sample build scripts to get going.


## dev


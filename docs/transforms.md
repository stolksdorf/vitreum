# Transforms
Vitreum supports several custom transforms based on what filetype your require.

## Basic Transforms

### Code
*Exts*: `.js, .jsx, .ts, .tsx`

Runs a [Babel](https://babeljs.io/) transforms on the incoming code. Uses the [configuration](https://babeljs.io/docs/en/babelrc.html#use-via-packagejson) stored within your `package.json`.

### Style
*Exts*: `.less, .css`

Compiles the style code through the [Less](http://lesscss.org/) compiler and caches it. If the style code contains any `require` statements it will first process those; This allows style files to chian into eachother, or for assets to be required into the bundle via `.css` files.

```css
h1{
	background-image: require('../../header-image.png');
}
```

After the bundle has been created, all the cached styles are compiled into a single `bundle.css` in the `/build` folder.

*Note*: This method of style transforming makes it difficult to maintain correct courcemaps for debugging. To aid in debugging, comments within the resulting `css` file are added dynamically to where in the file system that piece of style was compiled from.


### Assets
*Exts*: `all not matched by other transforms`

When you require an asset file, it's copied to `/build/assets/...`, where `...` is it's path relative to the entrypoint folder. The `require` statement resolves to the string path to where the asset was copied to.

This also works within `require`d style files. But instead it will resolve to a css url.

```js
const userImg = require('./img/user.png');

// Compiles to ...

const userImg = '/build/assets/img/user.png';

<img src={userImg} />
```

```css
.component{
	background-image : require('./user.png');
}

/* Compiles to ... */

.component{
	background-image : url('/build/assets/user.png');
}
```


## Exotic Transforms

### YAML
*Exts*: `.yaml, .yml`

Loads the YAML file, compiles it to JSON, and returns the javascript object. This transform is useful if you have copy, paths, dates, or other iterable data you want to keep separate from your components.

This can be used in conjuction with a service like [Prose.io](http://prose.io/#about) and Heroku auto-deploys to make a git tracked pseudo-CMS for your web app.

### Text
*Exts*: `.md`, `.markdown`, `.txt`

Reads in the file and returns a raw string. All backticks `\`` will be escaped.

### ~Markdown~ _(depricated v5.5.0)_
*Exts*: `.md`

~Reads and compiles the markdown file into raw HTML, and returns a functional react component where the HTML is it's contents. Any prop passed to this component will be passed to the containing `div`~

### SVG
*Exts*: `.svg`

Uses [SVGO](https://www.npmjs.com/package/svgo) to optimize and prep the `svg` file to be able to be converted into a React functional component. Beware, Some svg properties do not transfer over well. Some svg programs will use internal style tags and classnames to adjust sizes and colors; These will not be transferred into the react component.

Rendering SVGs as compoennts is useful because you will have fine-grain access to the internal structure of the SVG in HTML for doing animations or events.


### Literate Programming
*Exts*: `.lp, .lp.md`

[Literate Programming](https://en.wikipedia.org/wiki/Literate_programming) is the concept of writing your documentation and code within the same file. Vitreum accomplishes this by using markdown as the base, and [named code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting) to indentify processable code.

This transform iterates over the named code blocks within the file and applies subsequent transforms base don the extension of the named code block.

The most common use case is to write the documentation, logic, and style of a component in one file. You can even divide up a single component into several `.lp` files, focusing on concetps rather than file type.


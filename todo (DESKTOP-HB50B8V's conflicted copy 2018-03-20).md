## V5 Todo

- [] add Checks
  - That they provided a valid entrypoint
- [] Server restarting and decaching the bundle.js is not working
- [] SVG, Markdown, and LP transforms need to work
- [] UX for builds and dev processes
- [] Shared folder options
-


## v5 Ideas
- Experiment with overloading the require statements for other filetypes, assets, style, yaml
- Expose out a commandline feature
- Two main uses, build and watch
    - Build: cleans build folder, builds all entries points, and creates the lib
    - Watch: Watches the entrypoints, use the livereload server, try out hotmodule loading
- Should back onto to just stock babel/.bablerc
- Try out typescript, will it just work onto babelify? (I can build my own babelify, easy peasy)
- Automatically split out `node_modules` into the libs
- each entry point should get a folder in build
    - bundle.js
    - bundle.css
    - render.js - Exports function that when passed props will output HTML to render
    - OR a index.html
- Pass flag to automatically render straight to HTML on build (`static`)
- minify and sourcemaps based on `NODE_ENV`
- Uses the package.json main as the server file to watch
- When requiring in JSX, do a quick check for a local less file? maybe not
- Use entrypoint filename as actual bundle name
- add in an init flag to actually to build out a default vitreum project
- use a `vitreum` config in the package for
    - path to template generator (should have one by default internally)
- Types to handle
  - js,json,jsx,ts
  - css, less
  - yaml, yml
  - md, svgify  (make into react comp)
  - assets
  - LP (literate programming). Code block indicates which transform to use
    - Pull in the transforms list already and use that, no fanciness needed

- Prblem, the require scope of the dev task and the server task are separate. Need to figure out how to invalidate it.

- Setup test cases to run bothstyles of scripts and test for certain files being made

### Questions
- How to compile down sources to be required
- add in a `vitreum.require` to hot transpile sources and return them. Use case for tests.
- How to do a shared directory?
- Require in assets from LESS ? Search for relative url paths, move file and hot replace new pathing



### Saturday, 14/01/2017
* [ ] Add better error handling for bad require calls
- [ ] Update Vitreum CLI with new project setup
    - [] Doulbe check existing scripts
    - Add in a store, actions, and a smart component?
- [ ] Remove dep on `babel-preset-latest` add in dep for `babel-preset-env`
- [ ] Add in files that include all steps and step partials


### Friday, 16/12/2016
* [x] Move external dependacies in each step into the function. This will remove the long "boot-up" time for vitreum.
- [x] Add `flux` to the vitreum-cli
* [ ] Update `pico-flux` to use composition and not mixins, eg. `store.createSmartComponent({ ... })`
- [x] Update the project bootstrap in the `vitreum-cli`
  - Should use `nconf` and make some config files
  - Print out several lines of `npm installs` to run after the bootstrap


### Wednesday, 07/12/2016
- [x] Assets only takes two parameters
- [x] rename `js.js` to `jsx.js`
- [ ] Add optional npm install message to v-cli
- [x] rename `timeLog.js` to `log.js`
- [x] rename log to `time`
- [x] Add a watch log to `log.js`
- [x] Add bundle warnings to `log.js`
- [x] Add messages when file add/remove is detected
- [ ] Add a `examples.md` outlining good examples for each file
- [x] Make sure live reload works on just build folder
- [x] Get headtags working, make sure to merge into template head
- [x] Render should take a fourth parameter to merge with the original config
- [x] Asset should use a glob match for specific file names, `face.tracking.js`;
- [ ] Make an `how_to.md`
  - How to add a client-side config
  - How to add client-only libs/scripts
  - How to statically render a page
  - How to avoid using `render` in prod. Make templates (for handlebars) using the render fn
- [ ] Allow build folder to be set, maybe via storage?
- [x] move logging into the bundler
- [x] Make sure that everything works with `.babelrc` (Can this be set actually within vitreum?)
- [ ] Make sure you can import less directly from node_modules (eg. Palette)


## v4 Ideas
- Remove the need for an acrhitecture.json, keep the style list in memory
  - Rename the less task to be more generic
- Remove `gulp` as a dependacy
  - You should just expose a series of functions to use
  - All tasks should be converted to using promises
- Create some [global tooling](https://docs.npmjs.com/files/package.json#bin)
  - Use [minimist](https://www.npmjs.com/package/minimist)
  - add a `jsx` tool that creates component folders for you.
  - Add a `vitreum` tool that bootstraps a project for you
    - Should create a gulpfile, server, client folder with one component
  - *Move this to it's own project `vitreum-cli`*
- Add in [react hot loading](https://github.com/milankinen/livereactload)
- Remove the dependacy on using a template engine
  - This will be tricky, as right now vitreum is using a double template system (tmpl -> bundle -> render)
  - Focus on using raw functions or strings. No fancy markup
  - Consider using a react component for the main template, can pass the data via props.
  - default to using a base template internal to vitreum

- Switch to using Promises for all tasks
- Name the entry points using objects instead of arrays
- Make the render be able to be used statically during tasks
- Rename 'tasks' in vitreum to 'steps'
- Vitreum Render should have a 'set to dev mode' in the `server.js`. Should default to on, but throw wranings unless explicitly set.

- Remove `headtags` and switch to using [Helmet](https://github.com/nfl/react-helmet) maybe?
  - Maybe not, I could build in my own `rewind` on vitreum render
  - I can easily build my own "helmet', expose the headtags during template gen

- Remove Gulpfile, and use instead a `/tasks` directory
  - There should be a `/tasks/build.js`, `/tasks/prod.js`, `/tasks/watch.js`, etc.
  - Make a central `config.json` that has the project configs within it
  - Each task file should be runnable from node scripts
  -

- Separate vitreum into a prod install and dev install
  - Prod install only installs deps needed for a prod build, no watching or colors or whatnot

- Simplify the `vitreumRender` function. It should take the bare minimum args: Component and args
  - Should be promised based
  - Remove `globals`

- Make `clearRequireCahce` on while in dev mode
- Look into make a full [dashboard](https://formidable.com/blog/2016/08/15/introducing-webpack-dashboard/) oh god [look at this](https://github.com/yaronn/blessed-contrib)

---------------

### Friday, 16/12/2016
- [ ] Move external dependacies in each step into the function. This will remove the long "boot-up" time for vitreum.
- [ ] Add `flux` to the vitreum-cli
- [ ] Update `pico-flux` to use composition and not mixins, eg. `store.createSmartComponent({ ... })`
- [ ] Update the project bootstrap in the `vitreum-cli`
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

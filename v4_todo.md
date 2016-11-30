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

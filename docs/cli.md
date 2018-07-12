# CLI
Vitreum comes with some project bootstrapping built-in.

### install
```
npm i - g vitreum
```


## vitreum
Initiates a project build


```
Usage: vitreum {OPTIONS} <entry points>

Standard Options:

     --dev, -d  Run a dev build of the project

  --static, -s  Create static renders of the entrypoints

```



## jsx
Creates react components with styling at your terminal location.

```
Usage: vitreum jsx {OPTIONS} <component name>

Standard Options:

   --pure, -p  Creates a pure functional component

  --smart, -s  Creates an additional smart varient of the compnent
               that communicates with a store

  --yaml, -y   Creates an associated yaml file with the component for content

  --all, -a   Does all of the above

```





## init project
Bootstraps a full vitreum project based from your `package.json`

```
Usage: vitreum init {OPTIONS}

Standard Options:

   --lint, -l  Add linting npm scripts and an .eslintrc.js

  --tests, -t  Add testing npm scripts and some initial testing files

   --flux, -f  Adds a basic store and actions for flux

    --all, -y  Adds all of the above
```


Example file structure:

```
/project
  ├─ page.jsx
  ├─ page.less
  ├─ user.png
  ├─ /client
    ├─ /shared
    └─ /main
      ├─ main.jsx
      └─ main.less
  ├─ /config
    ├─ default.js
    └─ config.init.js
  ├─ /server
    ├─ error.handler.js
    ├─ page.router.js
    └─ server.js
  ├─ .gitignore
  ├─ .gitattributes
  ├─ app.js
  └─ package.json

```
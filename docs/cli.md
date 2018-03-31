# CLI
Vitreum comes with some project bootstrapping built-in.

### install
```
npm i - g vitreum
```


## jsx
Creates react components with styling at your terminal location

```
Usage: vitreum jsx <component name> {OPTIONS}

Standard Options:

   --pure, -p  Creates a pure functional component

  --smart, -s  Creates an additional smart varient of the compnent
               that communicates with a store
```



## init
Bootstraps a full vitreum project based from your `package.json`

```
Usage: vitreum init {OPTIONS}

Standard Options:

   --lint, -l  Add linting npm scripts and an .eslintrc.js

  --tests, -t  Add testing npm scripts and some initial testing files

   --flux, -f  Adds a basic store and actions for flux

    --all, -y  Adds all of the above
```
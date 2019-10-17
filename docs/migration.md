# Migration from v4

- Vitreum will no longer do file system anaylsis to automatically include style files. Each jsx component must now `require` in its associated `less` file
- Vitreum can now be used as a commandline tool, so you can remove your build scripts and use npm scripts instead.
- Asset files will now not be automatically required, so you must use `require` statements to let vitreum know which asset files it should consider.
- The `dev` process now "builds" a lot less, it's now more focused on iterative code and style development. So make sure to run a `build` step before you `dev`
- Server watching is now done through dependency analysis of your `main` file outlined in the `package.json`, so depending on how your backend is setup, some files might not trigger a automatic server restart during a `dev` step

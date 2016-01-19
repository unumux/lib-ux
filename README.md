# lib-ux

The core library used by ux-cli

## API

### writeUXjson(dir[, config])
- `dir` String, path to project
- `config` Object, contents of ux.json. Follows defaults according to ux.json spec

Creates a ux.json file at `dir`. Contents of file is set to a merge of `config` and defaults

### isSetup(dir)
- `dir` String, path to project

Checks for existence of package.json, bower.json, and ux.json. Also checks package.json to see if `ux-build-tools` are listed inside devDependencies. Returns boolean

### getFolders(dir[, extensions, ignoreFolders])
- `dir` String, path to project
- `extensions` Array of extensions
- `ignoreFolders` Array of folder paths to ignore during search

Returns a list of folders inside `dir`. If `extensions` is specified, returns a list of folders containing files with each extension. Includes `dir` if no extension is provided, or if `dir` contains files with `extension`

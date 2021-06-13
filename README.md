<h1 align="center">
  wrap
</h1>

<p align="center">
  Simple library bundler
</p>

<div align="center">
  <a href="https://npmjs.org/package/@barelyhuman/wrap">
    <img src="https://flat.badgen.net/npm/v/@barelyhuman/wrap" alt="version" />
  </a>
  <a href="https://npmjs.org/package/@barelyhuman/wrap">
    <img src="https://flat.badgen.now.sh/npm/dm/@barelyhuman/wrap" alt="downloads" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=@barelyhuman/wrap">
    <img src="https://flat.badgen.net/packagephobia/install/@barelyhuman/wrap?c=n" alt="install size" />
  </a>
</div>

## Pros

- No setup needed
- Configured via package.json
- Optionally add `.babelrc` to configure babel
- Can use and configure [buble](buble.surge.sh) (in v0.0.6-dev.2)
- Passive Dependency installer - does not install dependencies unless needed and if needed, they are added to your devDeps instead, helps keep wrap small and saves disk space for you (in v0.0.6-dev.2)

**_Cons_**

- Only built for bundling libraries and cli tools , doesn't build for browsers, though you can change `.babelrc` to kind of make something similar
- Doesn't support inline addition of node dependencies (as of now) [ncc](https://github.com/vercel/ncc) would be a better alternative

> Wrap is just a wrapper for the rollup config and setup I have for most node library setups I have and would be easier to have it handled by a single line of `npx` script than doing the same setup again and again, you can literally write this in about 20 mins with testing.

## Install

```sh
$ npm install -g @barelyhuman/wrap # global install
$ npm install @barelyhuman/wrap # local install
```

## Usage

```sh
$ wrap # global install
$ npx wrap # local install
```

Also add the following to your package.json

```json
...
"source":"source/index.js", // entry file
"main":"source", // output file
"scripts":{
  "build":"wrap",
}
...
```

#### ClI

```sh
$ wrap -h

Usage
    $ wrap [options]
  Options
    -f, --fix Run the standard linter and fixer on the current directory
  Examples
    $ wrap
    ℹ Output written to dist/index.js
    ✔ Done
```

## Configuration

While you can use `.babelrc` for handling babel and the `standard` key in the package.json can handle the standard configuration there are certain things you might want to send through to wrap.

**package.json**

```jsonc
"wrap":{
  "buble":true // use buble instead of babel and uses the below mentioned default settings,
  "external":["fs","path"] // add external deps here to avoid the warning logs about external deps
}
```

You can also send through the full buble configuration through

**package.json**

```jsonc
"wrap":{
  "buble":{
    "transforms": {
      "asyncAwait": false,
      "forOf": false
    },
    "objectAssign": "Object.assign"
  }
}
```

### Credits

- [Rollup](https://rollupjs.org/) - Couldn't have done anything without it
- [lukeed](https://github.com/lukeed) - The libraries `kleur`, `mri` are from him
- [standard](https://github.com/standard/standard) - Takes the load of formatting and linting the files
- [buble](https://github.com/bublejs/buble) - the other alternative to babel
  and a lot of other sub dependecies

---

[MIT](LICENSE) © Reaper

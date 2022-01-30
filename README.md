# wrap

> Simple package bundle setup handler

[![](https://img.shields.io/github/issues/barelyhuman/wrap?style=for-the-badge&colorA=18181b&colorB=98C379)](https://www.github.com/barelyhuman/wrap/issues)
[![](https://img.shields.io/bundlephobia/min/@barelyhuman/wrap?label=bundle%20size&style=for-the-badge&colorA=18181b&colorB=98C379)](https://bundlephobia.com/result?p=@barelyhuman/wrap)
[![](https://img.shields.io/npm/v/@barelyhuman/wrap?style=for-the-badge&colorA=18181b&colorB=98C379)](https://www.npmjs.com/package/@barelyhuman/wrap)
[![](https://img.shields.io/npm/dt/@barelyhuman/wrap.svg?style=for-the-badge&colorA=18181b&colorB=98C379)](https://www.npmjs.com/package/@barelyhuman/wrap)

This is more of a wrapper around my opinionated setup for developing packages, people build template repo's I built a tool, that's all.

The tool exists for the following things by being a single package to setup code style and bundling
In detail, it tries to do the following.

- Setup rollup with the needed plugins for package development
- Handle adding a code style to the repo, either with `standard` or `prettier`
- Support configuration with the original configuration options of the tools used (so `.babelrc` for babel, `.prettierrc` for prettier, etc)

## Pros

- Configured via package.json
- Optionally add `.babelrc` to configure babel
- Can use and configure [buble](buble.surge.sh) (added in v0.0.6-dev.2, removed in v1.0.0)
- Passive Dependency installer - does not install dependencies unless needed and if needed, they are added to your devDeps instead, helps keep wrap small and saves disk space for you (added in v0.0.6-dev.2)

**_Cons_**

- Only built for bundling libraries and cli tools , doesn't build for browsers, though you can change `.babelrc` to kind of make something similar
- Doesn't support inline addition of node dependencies (as of now) [ncc](https://github.com/vercel/ncc) would be a better alternative

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
// ...
"source":"source/index.js", // entry file *mandatory
"main":"dist/index.js", // output file *mandatory
"module":"dist/index.mjs", // esm module file
"scripts":{
  "build":"wrap",
}
// ...
```

You can also send the input file using the cli

```json
"main":"dist/index.js", // output file *mandatory
"module":"dist/index.mjs", // esm module file
"scripts":{
  "build":"wrap -i source/index.js",
}
```

#### ClI

```sh
$ wrap -h

Usage
    $ wrap [options]
  Options
    -i, --input
    -f, --fix Run the standard linter and fixer on the current directory
    -w, --watch watch entry file and deps for changes
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
  // added in v1.0.0
  "inferExternal":true // if you set this as true rollup will try to dynamically understand what your external dependencies are
  // or
  "external":["fs","path"] // if you don't want it to dynamically infer,  then provide an array with them instead
}
```

### FAQ

**Why not use `microbundle`?**

I actually didn't know about microbundle, I already built this by then and then felt like an idiot but I still like this. The only thing missing is the modern mode, which I'm fine without for the most part, when needed, I just use microbundle.

**How do I contribute?**

Same way you'd contribute to any other repo, raise an PR and wait for review

**Why no tests!?**

I'm still ideating on modifying things here and there and that means tests that keep changing, so it doesn't make sense in this particular case, also, test what? it's literally just running each tool's API internally, I'm just calling them.

### Credits

There's definitely a lot of deps and things that wrap uses and I might not be able to keep track of work that I'm using so please let me know if your name isn't here

- [Rollup](https://rollupjs.org/) - Couldn't have done anything without it
- [lukeed](https://github.com/lukeed) - The libraries `kleur`, `mri` are from him
- [standard](https://github.com/standard/standard) - Takes the load of formatting and linting the files
- [buble](https://github.com/bublejs/buble) - the other alternative to babel
  and a lot of other sub dependecies

## License

[MIT](LICENSE) © Reaper

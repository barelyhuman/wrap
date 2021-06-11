<h1 align="center">
  wrap
</h1>

<p align="center">
  Simple library bundler
</p>

<div align="center">
  <a href="https://npmjs.org/package/@barelyhuman/wrap">
    <img src="https://badgen.now.sh/npm/v/@barelyhuman/wrap" alt="version" />
  </a>
  <a href="https://npmjs.org/package/@barelyhuman/wrap">
    <img src="https://badgen.now.sh/npm/dm/@barelyhuman/wrap" alt="downloads" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=@barelyhuman/wrap">
    <img src="https://packagephobia.now.sh/badge?p=@barelyhuman/wrap" alt="install size" />
  </a>
</div>

## Pros

- No setup needed
- Configured via package.json
- Optionally add `.babelrc` to configure babel

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

or you can add it in scripts

```json
...
"source":"source/index.js", // entry file
"main":"source", // output file
"scripts":{
  "build":"wrap",
}
...
```

### Credits

- [Rollup](https://rollupjs.org/) - Couldn't have done anything without it
- [lukeed](https://github.com/lukeed) - The libraries `kleur`, `mri` are from him
- [standard](https://github.com/standard/standard) - Takes the load of formatting and linting the files

---

[MIT](LICENSE) © Reaper

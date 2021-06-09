# wrap

Simple library bundler

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

#!/usr/bin/env node

const rollup = require("rollup");
const { babel } = require("@rollup/plugin-babel");
const { resolve } = require("path");
const { white, red, green } = require("kleur");
const logSymbols = require("log-symbols");
const { existsSync } = require("fs");

const important = white().bold;
const success = green().bold;

const inputOptions = {
  plugins: [
    babel({
      babelHelpers: "bundled",
    }),
  ],
};

const outputOptions = {
  format: "cjs",
};

function errorHandler(err) {
  const msg = (err.message || err || "Unknown error").replace(
    /(\r?\n)/g,
    "$1      "
  );
  console.error(red().bold("wrap ") + msg);
  process.exit(1);
}

async function main() {
  try {
    const pkgfile = resolve("package.json");
    const pkg = existsSync(pkgfile) && require(pkgfile);

    if (!pkg) {
      throw new Error(
        `'package' not found, add a ${important(
          "package.json"
        )} to your project`
      );
    }

    const entry = pkg.source;
    const main = pkg.main;
    if (!entry) {
      throw new Error(
        `'package.source' not found, add a ${important(
          "source"
        )} field to your package.json`
      );
    }
    if (!main) {
      throw new Error(
        `'package.main' not found, add a ${important(
          "main"
        )} field to your package.json`
      );
    }

    const _inputOptions = { ...inputOptions, input: entry };

    const _outputOptions = {
      ...outputOptions,
      file: main,
      banner: pkg.bin ? "#!/usr/bin/env node\n" : null,
    };

    const bundle = await rollup.rollup(_inputOptions);
    await bundle.generate(_outputOptions);
    await bundle.write(_outputOptions);
    await bundle.close();
    console.log(
      `${logSymbols.info} Output written to ${important(_outputOptions.file)}`
    );
    console.log(`${logSymbols.success} ${success("Done")}`);
  } catch (err) {
    errorHandler(err);
  }
}

main();

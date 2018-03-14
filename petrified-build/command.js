const path = require("path");


const node = process.versions.node;
const babelOptions = {
    presets: [["@isomorphic/babel-preset", { node, react:true }]],
    plugins: ["babel-plugin-emotion"]
};

module.exports = function (commander, name)
{
    const command = name ?
        commander.command(`${name} [source]`) : commander;

    return command
        .option("-o, --output [output]", "Output destination")
        .option("--cache [cache]", "Cache destination")
        .option("--drafts", "Include drafts")
        .action(function (mSource, options)
        {
            const cwd = process.cwd();
            const resolve = filename => path.resolve(cwd, filename);

            const source = resolve(mSource || ".");
            const destination = resolve(options.output || `${source}/_site`);
            const cache = resolve(options.cache || `${source}/_cache`);
            const drafts = !!options.drafts;
            const site = require(`${source}/petrified.json`);

            require("magic-ws/babel-register")([{ source, options: babelOptions }]);

            const getPackageDescriptions = require("magic-ws/get-package-descriptions");
            const packageDescriptions = getPackageDescriptions([], [__dirname + "/node_modules/emotion"]);

            require("magic-ws/modify-resolve-lookup-paths")(packageDescriptions);

            require("../petrified-build")({ site, drafts, source, destination, cache });
        })
}

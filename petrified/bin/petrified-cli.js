const { resolve } = require("path");
const commands = require("commander");

commands.command("build [source]")
    .option("-o, --output [output]", "Output destination")
    .option("--cache [cache]", "Cache destination") 
    .option("--drafts", "Include drafts")
    .action(function (mSource, options)
    {
        const cwd = process.cwd();
        const source = resolve(cwd, mSource || ".");
        const destination = resolve(cwd, options.output || `${source}/_site`);
        const cache = resolve(cwd, options.cache || `${source}/_cache`);
        const drafts = !!options.drafts;
        const site = require(`${source}/petrified.json`);

        require("./bootstrap")({ dev: true, source });
        require("./build")({ site, drafts, source, destination, cache });
    })

commands.command("watch [source]")
    .option("--drafts", "Include drafts")
    .action(function (mSource, options)
    {
        const cwd = process.cwd();
        const source = resolve(cwd, mSource || ".");
        const destination = resolve(cwd, options.output || `${source}/_site`);
        const cache = resolve(cwd, options.cache || `${source}/_cache`);
        const drafts = !!options.drafts;
        const site = require(`${source}/petrified.json`);

        require("./watch")({ site, drafts, source, destination, cache });
    })

commands.parse(process.argv);

const { resolve } = require("path");
const options = require("commander")
    .usage("[options] <source>")
    .option("-o, --output [output]", "Output destination")
    .option("--cache [cache]", "Cache destination") 
    .option("--drafts", "Include drafts")
    .parse(process.argv);

const cwd = process.cwd();
const source = resolve(cwd, options.args[0] || ".");
const destination = resolve(cwd, options.output || `${source}/_site`);
const cache = resolve(cwd, options.cache || `${source}/_cache`);
const drafts = !!options.drafts;
const site = require(`${source}/petrified.json`);

require("..")({ site, drafts, source, destination, cache });

/*
        const cwd = process.cwd();
        const source = resolve(cwd, mSource || ".");
        const destination = resolve(cwd, options.output || `${source}/_site`);
        const cache = resolve(cwd, options.cache || `${source}/_cache`);
        const drafts = !!options.drafts;
        const site = require(`${source}/petrified.json`);

        require("./bootstrap")({ dev: true, source });
        require("./build")({ site, drafts, source, destination, cache });
    })

const { execSync } = require("child_process");
const { renameSync } = require("fs");
const tmp = require("./get-tmp");
const build = require("../petrified");


module.exports = function ({ site, drafts, source, destination, cache })
{
    const tmpDestination = tmp();
    const swapDestination = tmp();

    try
    {const start = Date.now();
        build({ site, drafts, source, destination: tmpDestination, cache });

        rm(destination, true);
        renameSync(tmpDestination, destination);
        
        console.log("BUILD TOOK: ", Date.now() - start);
    }
    catch (error)
    {
        rm(tmpDestination, true);
    }
}

function rm(path, swallow)
{
    try
    {
        execSync(`rm -rf ${path}`);
    }
    catch (error)
    {console.log(error);
        if (!swallow)
            throw error;
    }
}*/

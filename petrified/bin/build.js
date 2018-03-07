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
}

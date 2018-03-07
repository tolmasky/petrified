const { spawn } = require("child_process");
const { dirname } = require("path");

const executeOnFileChange = require("@isomorphic/execute-on-file-change");

const states = 
{
    "waiting": {
        "execute": "booting"
    },
    "booting": {
        "execution-canceling": "exiting",
        "ready": "serving"
    },
    "exiting": {
        "ready": "exiting",
        "execution-canceled": "waiting"
    },
    "serving": {
        "execution-canceling": "exiting"
    }
};

module.exports = function serveStaticSite({ source, socketPath, fire })
{
    const parent = dirname(source);
    const match = `${source}{/**{/*,},}`;
    const execute = () => executeStaticSite({ socketPath, fire });


    ["execute", "execution-canceling", "execution-complete"]
        .map(event => emitter.on(event => fire(event)));

    return executeOnFileChange({ source: parent, match, execute });
}

function executeStaticSite({ socketPath, source })
{
    rm(socketPath, true);

    announce("• Deploying blog.runkit.com... ");

    const path = require.resolve("../serve");
    const args = [path, "--socket", socketPath, source];
    const process = spawn("node", args, { stdio: [0,1,2] });

    return process.on("message", message => fire("message:" + message));
}

function rm(path, swallow)
{
    try
    {
        require("fs").unlinkSync(path);
    }
    catch (error)
    {
        if (!swallow)
            throw error;
    }
}




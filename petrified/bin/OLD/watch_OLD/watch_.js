
const { dirname } = require("path");

const Process = require("@effects/process");

const program = require("@effects/state/program");

const { state, property } = require("@effects/state");
const update = require("@effects/state/update");
const FileMonitor = require("./file-monitor");
const ProcessLoop = require("./process-loop");
const serveProxySite = require("./serve-proxy-site");

const BUILD_PATH = require.resolve("../petrified-cli");
const SERVER_PATH = require.resolve("../serve");

const Watch = state.machine `Watch`
({
    [property.child `source-monitor`]: "object",
    [property.child `site-monitor`]: "object",
    [property.child `builder`]: "object",
    [property.child `server`]: "object",

    ["init"]: ({ source, destination }) => update
        .prop("source-monitor", FileMonitor({ source, match:`${source}/!(_site|_cache)(*|**)` }))
        .prop("site-monitor", FileMonitor({ source: dirname(destination), match:`${destination}{/**{/*,},}` }))
        .prop("builder", ProcessLoop({ autostart:true, template: Process.Spawn("node", [BUILD_PATH, "--dev", source]) }))
        .prop("server", ProcessLoop({
                    template: Process.Spawn("node", [SERVER_PATH, "--socket", "/tmp/abc.sock", destination])
                })),

    [state `initial`]:
    {
        [state.on `#source-monitor.change`]: update
            .update("builder", "start"),

        [state.on `#site-monitor.change`]: update
            .update("server", "start")
    }
})

module.exports = function ({ source, destination })
{
    serveProxySite({ proxiedSocketPath:"/tmp/abc.sock", port: 8080 });
    
//    const effects = metadata(<effect start = { () => console.log("LOG") } />).effects;
//console.log(state.debug(Watch({ source, destination })));
    console.log(program(Watch({ source, destination }), function (state)
    {
//        console.log(state);
    })
    .catch(e => console.log(e))
    )
}


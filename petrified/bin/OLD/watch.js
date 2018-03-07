
const express = require("express");
const { mkdirp, read, write } = require("sf-fs");
const WebSocketServer = require("ws").Server;


module.exports = function watch({ destination })
{
    return express()
        .use(express.static(destination))
        .listen(4500);

return;
    const version = Date.now();
    const script = read(`${__dirname}/watch/watch-poll.js`, "utf-8")
        .replace("VERSION", version);
    const release = `${destination}/_release`;

    mkdirp(`${release}`);

    write(`${release}/version`, version, "utf-8");
    write(`${release}/reload.js`, script, "utf-8");

    require("./express-ws")()
        .use(express.static(destination))
        .websocket("/", function websocket(info, accept, next)
        {console.log("HERE");
            const allowed = info.req.headers.origin === "http://localhost:4500";
            
            if (!allowedOrigin)
            {
                console.warn("Unauthorized websocket request:", info.req.headers.origin)

                return accept(false);
            }

            accept(function (socket)
            {
                socket.on("open", () => socket.send("yes!"));
            });
        })
        .listen(4500, function listening() {
            console.log('Listening on %d', /*server.address().port*/0);
        });
}

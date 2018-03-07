const express = require("express");
const WebSocketServer = require("ws").Server;

const tmp = require("../get-tmp");
const injectionProxy = require("./injection-proxy");
//const serveStaticSite = require("./serve-static-site");


module.exports = function serveProxySite({ proxiedSocketPath, port })
{
//    const start = { name: "waiting" };
//    const fire = machine(states, start, state =>
//         state.name === "serving" && broadcast({ name: "serving" }));

    const proxyServer = express()
        .use(injectionProxy({ proxiedSocketPath }))
        .listen(port, () => console.log("LISGENING!"));

    const proxy = require("http-proxy")
        .createProxyServer({ target: `unix://${proxiedSocketPath}` });

    proxyServer.on("upgrade", function (req, socket, head) {
        proxy.ws(req, socket, head);
    });

    const webSocketServer = new WebSocketServer({ server: proxyServer });
    const webSockets = new Set();
    const broadcast = message => webSockets.forEach(
        webSocket => webSocket.send(message));

    webSocketServer.on("connection", function (webSocket)
    {
        webSockets.add(webSocket);
        webSocket.on("disconnect", () => webSockets.remove(webSocket));
    });

//    return serveStaticSite({ source, socketPath, fire });
}

